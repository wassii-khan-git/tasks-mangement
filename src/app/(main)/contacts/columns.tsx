"use client";

import { type ColumnDef } from "@tanstack/react-table";

// Define the shape of your contact data
export type ContactTypes = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export const getColumns = (): ColumnDef<ContactTypes>[] => [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  // Column for Title
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original?.name}</div>,
  },
  // Column for Slug
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="font-mono">{row.original.email}</div>,
  },
  // Column for Slug
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="font-mono">{row.original.phone}</div>,
  },
];
