"use client";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";

// Define the shape of your contact data
export type TaskType = {
  id: string;
  title: string;
  description: string;
  contactId: string;
  dueDate: string;
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
      id: "select",
      enableSorting: false,
      enableHiding: false,
    },
    // Column for Title
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original?.title}</div>
      ),
    },
    // Column for Slug
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="font-mono">{row.original?.description}</div>
      ),
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
