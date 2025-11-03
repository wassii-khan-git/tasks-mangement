"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";

export type TaskType = {
  id: string; // unique task id
  contactId: string; // FK -> contacts.id (string to match your dataset)
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO string
  dueDate?: string; // ISO string
};

export function getTaskColumns({
  onEdit,
  onDelete,
  onToggle,
}: {
  onEdit: (row: TaskType) => void;
  onDelete: (row: TaskType) => void;
  onToggle: (row: TaskType) => void;
}): ColumnDef<TaskType, any>[] {
  return [
    {
      id: "drag",
      header: "",
      cell: ({ row }) => <DragHandle id={row.id} />,
      enableSorting: false,
      enableHiding: false,
      size: 44,
    },
    {
      accessorKey: "completed",
      header: "Done",
      enableSorting: true,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <Checkbox
            checked={t.completed}
            onCheckedChange={() => onToggle(t)}
            aria-label={`Mark ${t.title} as ${
              t.completed ? "incomplete" : "complete"
            }`}
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "contactId",
      header: "Contact ID",
      enableSorting: true,
    },
    {
      accessorKey: "dueDate",
      header: "Due",
      enableSorting: true,
      cell: ({ row }) => row.original.dueDate,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(t)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(t)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}
