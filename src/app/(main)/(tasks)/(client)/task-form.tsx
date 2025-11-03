"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskType } from "../columns";

const Schema = z.object({
  contactId: z.string().min(1, "Contact ID required"),
  title: z.string().min(1, "Title required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export function TaskForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Partial<TaskType>;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      contactId: initial?.contactId ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      dueDate: new Date(initial?.dueDate ?? "").toISOString(),
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-3 p-3 md:p-4"
      role="form"
    >
      <div>
        <label className="text-sm">Contact ID</label>
        <Input {...register("contactId")} placeholder="e.g. 1" />
        {errors.contactId && (
          <p className="text-xs text-destructive">{errors.contactId.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Title</label>
        <Input {...register("title")} placeholder="Task title" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Description</label>
        <Textarea {...register("description")} placeholder="Optional" />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm">Due date</label>
        <Input type="date" {...register("dueDate")} />
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
