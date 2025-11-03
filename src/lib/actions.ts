import fs from "node:fs/promises";

// Write to file
export async function writeToFile(fileName: string, data: any) {
  try {
    await fs.writeFile(`./src/data/${fileName}`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}
