"use server";

import fs from "node:fs/promises";
import { TaskType } from "../columns";
import {
  TaskCreateSchema,
  TaskUpdateSchema,
} from "../(validations)/tasks-validation";
import z from "zod";

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

function simulateFailure(rate = 0.15) {
  if (Math.random() < rate) {
    const err = new Error("Simulated API failure");
    // Attach a lightweight code so UI can branch on it if needed
    (err as any).code = "SIM_FAIL";
    throw err;
  }
}

type PaginationTypes = {
  limit: number;
  page: number;
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
  simulateFailure(0.1);
  const data = TaskCreateSchema.parse(input);
  const tasks = await readJSON();

  const id = (
    tasks.length ? Math.max(...tasks.map((t) => +t.id)) + 1 : 1
  ).toString();
  const now = new Date().toISOString();

  const newTask: TaskType = {
    id,
    contactId: data.contactId,
    title: data.title,
    description: data.description as string,
    dueDate: data.dueDate || new Date().toISOString() || "",
  };

  await writeJSON([newTask, ...tasks]); // prepend for snappier UX
  return newTask;
}

// ---------- Update ----------
export async function updateTask(input: z.infer<typeof TaskUpdateSchema>) {
  simulateFailure(0.1);
  const data = TaskUpdateSchema.parse(input);
  const tasks = await readJSON();

  const idx = tasks.findIndex((t) => t.id === data.id);
  if (idx === -1) throw new Error("Task not found");

  tasks[idx] = { ...tasks[idx], ...data };
  await writeJSON(tasks);
  return tasks[idx];
}

// ---------- Toggle ----------
export async function toggleTask(id: string) {
  simulateFailure(0.1);
  const tasks = await readJSON();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");

  tasks[idx] = { ...tasks[idx] };
  await writeJSON(tasks);
  return tasks[idx];
}

// ---------- Delete ----------
export async function deleteTask(id: string) {
  simulateFailure(0.1);
  const tasks = await readJSON();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) throw new Error("Task not found");
  await writeJSON(next);
  return { id };
}
