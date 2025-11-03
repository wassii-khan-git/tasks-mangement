"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskForm } from "./task-form";

import { useDebounce } from "@/hooks/use-debounce";
import { getTaskColumns, TaskType } from "../columns";
import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from "../(actions)/actions";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";

type Props = {
  tasks: TaskType[];
  total: number;
  page: number; // 1-based
  limit: number;
};

export default function MainTasks({ tasks, total, page, limit }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [data, setData] = React.useState<TaskType[]>(tasks);
  const [search, setSearch] = React.useState(sp.get("q") ?? "");
  const debounced = useDebounce(search, 600);

  // Create/Edit modal state
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<TaskType | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => setData(tasks), [tasks]);

  // When search changes, update URL (server filters)
  React.useEffect(() => {
    const params = new URLSearchParams(sp);
    if (debounced) params.set("q", debounced);
    else params.delete("q");
    params.set("page", "1"); // reset to first page on new search
    router.push(`/tasks?${params.toString()}`);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = getTaskColumns({
    onToggle: async (row) => {
      // optimistic
      setData((cur) =>
        cur.map((t) =>
          t.id === row.id ? { ...t, completed: !t.completed } : t
        )
      );
      try {
        await toggleTask(row.id);
      } catch (e: any) {
        // revert and toast
        setData((cur) =>
          cur.map((t) =>
            t.id === row.id ? { ...t, completed: !t.completed } : t
          )
        );
        toast.error("Failed to toggle task");
      }
    },
    onEdit: (row) => {
      setEditing(row);
      setShowForm(true);
    },
    onDelete: async (row) => {
      // optimistic remove
      const prev = data;
      setData((cur) => cur.filter((t) => t.id !== row.id));
      try {
        await deleteTask(row.id);
      } catch (e: any) {
        setData(prev);
        toast.error("Delete failed");
      }
    },
  });

  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onSubmitForm = async (values: any) => {
    setSaving(true);
    try {
      if (editing) {
        const payload = {
          ...editing,
          ...values,
          completed: editing.completed,
        };
        const updated = await updateTask(payload);
        setData((cur) => cur.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Task updated");
      } else {
        const created = await createTask(values);
        setData((cur) => [created, ...cur]);
        toast("Task created");
      }
      setShowForm(false);
    } catch (e: any) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="my-6 space-y-4">
      {/* Header + Search + New */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks (title, description, contactId)"
            className="h-8 w-72"
          />
          <Button onClick={onCreate} size="sm">
            New Task
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable<TaskType, any>
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={limit}
      />

      {/* Modal/Drawer (simple inline panel for brevity) */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
        >
          <div className="w-full max-w-lg rounded-md bg-background shadow-lg">
            <div className="flex items-center justify-between border-b p-3">
              <h2 className="text-base font-semibold">
                {editing ? "Edit Task" : "New Task"}
              </h2>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Close
              </Button>
            </div>
            <TaskForm
              initial={editing ?? undefined}
              onSubmit={onSubmitForm}
              onCancel={() => setShowForm(false)}
              submitting={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
}
