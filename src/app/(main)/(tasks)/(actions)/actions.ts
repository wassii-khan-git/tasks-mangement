"use server";

import fs from "node:fs/promises";
import { TaskType } from "../columns";
import {
  TaskCreateSchema,
  TaskUpdateSchema,
} from "../(validations)/tasks-validation";
import z from "zod";
import { revalidatePath } from "next/cache";

// File directory
const FILE_DIR = "./src/data/tasks.json";

// ---------- Utils ----------
async function readJSON(): Promise<TaskType[]> {
  try {
    const data = await fs.readFile(FILE_DIR, "utf8");
    return JSON.parse(data) as TaskType[];
  } catch (e: any) {
    if (e?.code === "ENOENT") return [];
    throw e;
  }
}

async function writeJSON(tasks: TaskType[]): Promise<void> {
  const payload = JSON.stringify(tasks, null, 2);
  await fs.writeFile(FILE_DIR, payload, "utf8");
}

type PaginationTypes = {
  limit: number;
  page: number;
};

const normalizeDueDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

// ---------- Pagination / Listing ----------
// Get contacts
export async function getTasks({ limit, page }: PaginationTypes) {
  try {
    // read data from the file
    const data = await fs.readFile(FILE_DIR, "utf8");

    // parse the JSON data
    const jsonData = JSON.parse(data) as TaskType[];

    const skip = (page - 1) * limit;
    const total = jsonData.length;

    // pagination logic
    const tasks = jsonData?.slice(skip, skip + limit);

    // Return both tasks and pagination info
    return {
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      console.error("File not found:", FILE_DIR);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    } else {
      console.error("Error reading file:", error);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    }
  }
}

// ---------- Create ----------
export async function createTask(input: z.infer<typeof TaskCreateSchema>) {
  const data = TaskCreateSchema.parse(input);
  const tasks = await readJSON();

  const id = (
    tasks.length ? Math.max(...tasks.map((t) => +t.id)) + 1 : 1
  ).toString();

  const dueDate =
    data.dueDate && data.dueDate.trim() !== ""
      ? normalizeDueDate(data.dueDate)
      : new Date().toISOString();

  const newTask: TaskType = {
    id,
    contactId: data.contactId,
    title: data.title,
    description: data.description as string,
    dueDate,
  };

  await writeJSON([newTask, ...tasks]);
  revalidatePath("/tasks");
  return newTask;
}

// ---------- Update ----------
export async function updateTask(input: z.infer<typeof TaskUpdateSchema>) {
  const data = TaskUpdateSchema.parse(input);
  const tasks = await readJSON();

  const idx = tasks.findIndex((task) => task.id === data.id);
  if (idx === -1) throw new Error("Task not found");

  const updatedTask: TaskType = {
    ...tasks[idx],
    ...data,
    dueDate: normalizeDueDate(data.dueDate ?? tasks[idx].dueDate),
  };

  tasks[idx] = updatedTask;
  await writeJSON(tasks);
  revalidatePath("/tasks");
  return updatedTask;
}

// ---------- Delete ----------
export async function deleteTask(id: string) {
  const tasks = await readJSON();
  const next = tasks.filter((task) => task.id !== id);
  if (next.length === tasks.length) throw new Error("Task not found");
  await writeJSON(next);
  revalidatePath("/tasks");
  return { id };
}
