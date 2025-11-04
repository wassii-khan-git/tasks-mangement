"use server";

import fs from "node:fs/promises";
import { ContactTypes } from "../columns";
import { revalidatePath } from "next/cache";

// contacts.json file directory
const FILE_DIR = "./src/data/contacts.json"; // Use relative path (no leading slash)

type PaginationTypes = {
  limit?: number;
  page?: number;
};

// Get contacts
export async function getContacts({ limit, page }: PaginationTypes) {
  try {
    // read data from the file
    const data = await fs.readFile(FILE_DIR, "utf8");
    // parse the JSON data
    const jsonData = JSON.parse(data) as ContactTypes[];

    if (limit !== undefined && page !== undefined) {
      const skip = (page - 1) * limit;
      const total = jsonData.length;

      // pagination logic
      const contacts = jsonData?.slice(skip, skip + limit);

      // Return both contacts and pagination info
      return {
        contacts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }
    return {
      contacts: jsonData,
      total: jsonData.length,
    };
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      console.error("File not found:", FILE_DIR);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    } else {
      console.error("Error reading file:", error);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    }
  }
}

// Ascending sort
export async function sortAscending(contacts: ContactTypes[]) {
  return contacts.slice().sort((a, b) => {
    const left = (a.name ?? "").toString().toLowerCase();
    const right = (b.name ?? "").toString().toLowerCase();
    if (left === right) return 0;
    return left > right ? -1 : 1;
  });
}

// Descending sort
export async function sortDescending(contacts: ContactTypes[]) {
  return contacts.slice().sort((a, b) => {
    const left = (a.name ?? "").toString().toLowerCase();
    const right = (b.name ?? "").toString().toLowerCase();
    if (left === right) return 0;
    return left > right ? 1 : -1;
  });
}

// Search contactrs
export async function searchContacts(value: string) {
  try {
    // read data from the file
    const data = await fs.readFile(FILE_DIR, "utf8");
    // parse the JSON data
    const jsonData: ContactTypes[] = JSON.parse(data);
    // filter the data
    const filtered = jsonData.filter(
      (contact) =>
        contact.name.includes(value) ||
        contact.email.includes(value) ||
        contact.phone.includes(value)
    );
    return filtered;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      console.error("File not found:", FILE_DIR);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    } else {
      console.error("Error reading file:", error);
      return { contacts: [], total: 0, page: 1, totalPages: 0 };
    }
  }
}
