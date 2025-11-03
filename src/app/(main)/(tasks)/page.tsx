import { getTasks } from "./(actions)/actions";
import MainTasks from "./(client)/main";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page = Number(searchParams.page ?? 1);
  const limit = Number(searchParams.limit ?? 10);
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sortBy = (searchParams.sortBy as any) ?? "createdAt";
  const sortDir = (searchParams.sortDir as any) === "asc" ? "asc" : "desc";

  const { tasks, total, totalPages } = await getTasks({
    limit,
    page,
    q,
    sortBy,
    sortDir,
  });

  return (
    <MainTasks
      tasks={tasks}
      total={total}
      page={Math.min(page, totalPages)}
      limit={limit}
    />
  );
}
