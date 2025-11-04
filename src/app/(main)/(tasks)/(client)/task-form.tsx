"use client";

import * as React from "react";
import { z } from "zod";
// Import Controller and Control
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskType } from "../columns"; // Assuming this is your Task type
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactTypes } from "../../contacts/columns"; // Assuming this is your Contact type

// Schema is correct
const Schema = z.object({
  contactId: z.string().min(1, "Please select a contact."),
  title: z.string().min(1, "Title required").max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export function TaskForm({
  initial,
  contacts,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Partial<TaskType>;
  contacts: ContactTypes[];
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    // Destructure 'control' to use with the Controller
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      contactId: initial?.contactId ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      // Ensure dueDate is a string in 'YYYY-MM-DD' format if it exists
      dueDate: initial?.dueDate
        ? new Date(initial.dueDate).toISOString().split("T")[0]
        : "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-3 p-3 md:p-4"
      role="form"
    >
      {/* --- CORRECTED SELECT FIELD --- */}
      <div>
        <label className="text-sm font-medium" htmlFor="contactId">
          Contact
        </label>
        {/* Use Controller to wrap the Select component */}
        <Controller
          name="contactId"
          control={control}
          render={({ field }) => (
            <Select
              // Pass field.onChange and field.value
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger id="contactId">
                <SelectValue placeholder="Select a contact..." />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {/* We removed the old text Input for contactId */}
        {errors.contactId && (
          <p className="text-xs text-destructive">{errors.contactId.message}</p>
        )}
      </div>
      {/* --- END OF CORRECTION --- */}

      <div>
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <Input id="title" {...register("title")} placeholder="Task title" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Optional"
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="dueDate">
          Due date
        </label>
        <Input id="dueDate" type="date" {...register("dueDate")} />
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
