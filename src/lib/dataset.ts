import { writeToFile } from "./actions";

// generate dataset for contact
export async function generateContactDataset(count: number) {
  const dataset = [];
  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const name = `Contact ${id}`;
    const email = `contact${id}@example.com`;
    const phone = `123-456-78${id}`;
    dataset.push({
      id: id.toString(),
      name,
      email,
      phone,
    });
    // WRITE TO THE FILE CONTACTS
    await writeToFile("contacts.json", dataset);
  }
  return dataset;
}

// generate dataset for tasks
export async function generateTaskDataset(count: number) {
  const dataset = [];
  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const contactId = ((i % 10) + 1).toString(); // assuming 10 contacts
    const title = `Task ${id}`;
    const description = `This is the description for task ${id}.`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (i % 30));
    dataset.push({
      id: id.toString(),
      contactId,
      title,
      description,
      dueDate: dueDate.toISOString(),
    });
    // WRITE TO THE FILE TASKS
    await writeToFile("tasks.json", dataset);
  }
  return dataset;
}
