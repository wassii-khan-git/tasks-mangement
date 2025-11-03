import { writeToFile } from "./actions";

// generate dataset
export async function generateDataset(count: number) {
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
