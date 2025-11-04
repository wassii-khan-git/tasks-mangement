"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTaskColumns, TaskType } from "../columns";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { ContactTypes } from "../../contacts/columns";
import TaskDialog from "./dialog";
import { onSaveTypes } from "@/lib/types";

type Props = {
  tasks: TaskType[];
  contacts: ContactTypes[];
  total: number;
  page: number;
  limit: number;
};

export default function MainTasks({
  tasks,
  contacts,
  total,
  page,
  limit,
}: Props) {
  const [data, setData] = useState<TaskType[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [action, setAction] = useState<"create" | "edit" | "delete">("create");

  const handleEdit = (row: TaskType) => {
    setIsDialogOpen(true);
    setSelectedTask(row);
    setAction("edit");
  };

  const handleDelete = async (row: TaskType) => {
    setIsDialogOpen(true);
    setSelectedTask(row);
    setAction("delete");
  };

  // handle on save
  const handleCreate = () => {
    setSelectedTask(null);
    setAction("create");
    setIsDialogOpen(true);
  };

  const onSave = (result: onSaveTypes<TaskType>) => {
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    if (action === "edit" && result.data) {
      setData((prev) =>
        prev.map((task) => (task.id === result.data!.id ? result.data! : task))
      );
    } else if (action === "delete" && result.deletedId) {
      setData((prev) => prev.filter((task) => task.id !== result.deletedId));
    } else if (action === "create" && result.data) {
      setData((prev) => [result.data!, ...prev]);
    }
    toast.success(result.message);
  };

  const columns = getTaskColumns({
    onEdit: (row) => handleEdit(row),
    onDelete: (row) => handleDelete(row),
  });

  useEffect(() => {
    setData(tasks);
  }, [tasks]);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTask(null);
      setAction("create");
    }
  };

  return (
    <div className="my-10 space-y-4">
      {/* Header + Search + New */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreate} size="sm" variant={"outline"}>
            New Task
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={limit}
      />

      {/* TaskDialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
        task={selectedTask}
        contacts={contacts}
        onSave={onSave}
        action={action}
      />
    </div>
  );
}
