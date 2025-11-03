"use server";

import fs from "node:fs/promises";
import { TaskType } from "../columns";
import {
  TaskCreateSchema,
  TaskUpdateSchema,
} from "../(validations)/tasks-validation";
import z from "zod";
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

// ---------- Pagination / Listing ----------
export async function getTasks({
  limit,
  page,
  q,
  sortBy = "createdAt",
  sortDir = "desc",
}: {
  limit: number;
  page: number; // 1-based
  q?: string; // search
  sortBy?: keyof TaskType;
  sortDir?: "asc" | "desc";
}): Promise<{
  tasks: TaskType[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const all = await readJSON();

  // search (title + description + contactId)
  const query = (q ?? "").trim().toLowerCase();
  const filtered = query
    ? all.filter((t) => {
        return (
          t.title.toLowerCase().includes(query) ||
          (t.description ?? "").toLowerCase().includes(query) ||
          t.contactId.toLowerCase().includes(query)
        );
      })
    : all;

  // sort
  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortBy];
    const vb = b[sortBy];
    // handle dates and strings uniformly
    const A = typeof va === "string" ? va : JSON.stringify(va);
    const B = typeof vb === "string" ? vb : JSON.stringify(vb);
    if (A < B) return sortDir === "asc" ? -1 : 1;
    if (A > B) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // paginate
  const total = sorted.length;
  const totalPages = Math.max(Math.ceil(total / Math.max(limit, 1)), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;
  const tasks = sorted.slice(start, start + limit);

  return { tasks, total, page: currentPage, totalPages };
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
    description: data.description,
    completed: false,
    createdAt: now,
    dueDate: data.dueDate,
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

  tasks[idx] = { ...tasks[idx], completed: !tasks[idx].completed };
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
