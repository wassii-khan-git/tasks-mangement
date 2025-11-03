import z from "zod";

// ---------- Validation ----------
export const TaskCreateSchema = z.object({
  contactId: z.string().min(1, "Contact is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
});

export const TaskUpdateSchema = z.object({
  id: z.string().min(1),
  contactId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  completed: z.boolean(),
  dueDate: z.string().datetime().optional(),
});
