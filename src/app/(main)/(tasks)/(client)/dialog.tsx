"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskType } from "../columns";
import {
  TaskCreateSchemaType,
  TaskFormSchema,
  TaskFormSchemaType,
  TaskUpdateSchemaType,
} from "../(validations)/tasks-validation";
import { createTask, deleteTask, updateTask } from "../(actions)/actions";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactTypes } from "../../contacts/columns";
import { onSaveTypes } from "@/lib/types";

interface EdittaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskType | null;
  contacts: ContactTypes[];
  onSave: (result: onSaveTypes<TaskType>) => void;
  action: "create" | "edit" | "delete";
}

const ACTION_COPY = {
  create: {
    title: "Create Task",
    description: "Add a new task and link it to a contact.",
    submitLabel: "Create",
  },
  edit: {
    title: "Edit Task",
    description: "Update task details or assign a different contact.",
    submitLabel: "Save",
  },
  delete: {
    title: "Delete Task",
    description: "This action cannot be undone.",
    submitLabel: "Delete",
  },
} as const;

const normalizeDueDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

export default function TaskDialog({
  open,
  onOpenChange,
  task,
  contacts,
  onSave,
  action,
}: EdittaskDialogProps) {
  const meta = ACTION_COPY[action];

  const initialValues = useMemo<TaskFormSchemaType>(
    () => ({
      id: task?.id,
      contactId: task?.contactId ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    }),
    [task]
  );

  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: initialValues,
  });

  const [loading, setLoading] = useState(false);
  const [contactQuery, setContactQuery] = useState("");

  const filteredContacts = useMemo(() => {
    const term = contactQuery.trim().toLowerCase();
    if (!term) return contacts;

    return contacts.filter((contact) => {
      const haystack = [
        contact.name ?? "",
        contact.email ?? "",
        contact.phone ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [contactQuery, contacts]);

  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  useEffect(() => {
    if (!open) {
      setContactQuery("");
    }
  }, [open]);

  const handleClose = () => {
    form.reset(initialValues);
    setContactQuery("");
    onOpenChange(false);
  };

  const handleSubmit = async (values: TaskFormSchemaType) => {
    if (action === "delete") return;
    setLoading(true);

    try {
      if (action === "edit" && task) {
        const payload: TaskUpdateSchemaType = {
          ...values,
          id: task.id,
          dueDate: normalizeDueDate(values.dueDate),
        };

        const result = await updateTask(payload);
        onSave({
          success: true,
          message: "Task updated successfully",
          data: result,
        });
        handleClose();
      } else if (action === "create") {
        const { id: _omit, ...rest } = values;
        const payload: TaskCreateSchemaType = {
          ...rest,
          dueDate: normalizeDueDate(rest.dueDate),
        };

        const result = await createTask(payload);
        onSave({
          success: true,
          message: "Task created successfully",
          data: result,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Task dialog submit error:", error);
      onSave({
        success: false,
        message: "Unable to save the task.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setLoading(true);

    try {
      const result = await deleteTask(task.id);
      onSave({
        success: true,
        message: "Task deleted successfully",
        deletedId: result.id,
      });
      handleClose();
    } catch (error) {
      console.error("Task dialog delete error:", error);
      onSave({
        success: false,
        message: "Unable to delete the task.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          onOpenChange(true);
        } else {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          {meta.description ? (
            <DialogDescription>{meta.description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <Separator className="mt-3 mb-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {action !== "delete" ? (
              <div className="space-y-4 md:space-y-8 mb-2 md:mb-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="contactId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value === "" ? undefined : field.value}
                          disabled={loading}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredContacts.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter task title"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter description"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Enter due date"
                            {...field}
                            value={field.value ?? ""}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {task?.title ?? "this task"}
                </span>
                ? This action cannot be undone.
              </p>
            )}

            <Separator className="mt-6 mb-5" />
            <DialogFooter>
              <div className="flex justify-end gap-2 items-center">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type={action === "delete" ? "button" : "submit"}
                  variant={action === "delete" ? "destructive" : "default"}
                  disabled={loading || form.formState.isSubmitting}
                  onClick={action === "delete" ? handleDelete : undefined}
                  className={
                    action === "delete"
                      ? ""
                      : "flex bg-indigo-500 hover:bg-indigo-400"
                  }
                >
                  {loading || form.formState.isSubmitting
                    ? "Please wait..."
                    : meta.submitLabel}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
