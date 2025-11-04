import { PaginationUrlProps } from "@/lib/types";
import { getContacts } from "../contacts/(actions)/actions";
import MainTasks from "./(client)/main";
import { getTasks } from "./(actions)/actions";
import { TaskType } from "./columns";

export default async function TasksPage({ searchParams }: PaginationUrlProps) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const limit = Number(params?.limit ?? 5);

  // fetch tasks
  const { tasks, total, totalPages } = await getTasks({
    limit,
    page,
  });

  // fetch contacts
  const { contacts } = await getContacts({ limit, page });

  return (
    <MainTasks
      contacts={contacts}
      tasks={tasks as TaskType[]}
      total={total}
      page={page}
      limit={limit}
    />
  );
}
