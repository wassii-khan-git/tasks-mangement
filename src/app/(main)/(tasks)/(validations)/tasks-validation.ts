import z from "zod";

// ---------- Validation ----------
export const TaskCreateSchema = z.object({
  contactId: z.string().min(1, "Contact is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
});

export const TaskUpdateSchema = z.object({
  id: z.string().min(1),
  contactId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
});

export const TaskFormSchema = TaskCreateSchema.extend({
  id: z.string().optional(),
});

export type TaskCreateSchemaType = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateSchemaType = z.infer<typeof TaskUpdateSchema>;
export type TaskFormSchemaType = z.infer<typeof TaskFormSchema>;
