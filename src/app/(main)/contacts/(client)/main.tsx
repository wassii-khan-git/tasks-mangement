"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { ContactTypes, getColumns } from "../columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchContacts } from "../(actions)/actions";
import { useDebounce } from "@/hooks/use-debounce";

interface MainContactProps {
  contacts: ContactTypes[];
  page: number;
  limit: number;
  total: number;
}

const MainContacts = ({ contacts, page, limit, total }: MainContactProps) => {
  // search
  const [search, setSearch] = useState<string>("");

  // contacts data
  const [contactsData, setContactsData] = useState<ContactTypes[]>(contacts);

  // columns
  const columns = getColumns();

  // debounce search
  const debouceValue = useDebounce(search, 500);

  // handle search
  const handleSearch = async (query: string) => {
    const value = query.trim();
    // value
    if (!value) {
      setContactsData([]);
      return;
    }
    const result = await searchContacts(value);
    console.log("result: ", result);
    const contactTypes = result as ContactTypes[];
    if (contactTypes.length > 0) {
      setContactsData(result as ContactTypes[]);
    }
    setContactsData(contactTypes);
  };

  // handle clear
  const handleClear = () => {
    setSearch("");
    setContactsData(contacts);
  };

  // Side effect for debounce
  useEffect(() => {
    if (debouceValue) {
      handleSearch(debouceValue);
    }
  }, [debouceValue]);

  // For Refresh data
  useEffect(() => {
    setContactsData(contacts);
  }, [contacts]);

  return (
    <>
      <div className="my-24">
        {/* Search */}
        <div className="max-w-3xs flex justify-center items-center gap-3 mx-6">
          <Input
            value={search}
            placeholder="Search contacts"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {/* Clear Search button + Search button */}
          {search && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
        {/* Datatable */}
        <DataTable
          columns={columns}
          data={contactsData}
          page={page}
          limit={limit}
          total={total}
        />
      </div>
    </>
  );
};

export default MainContacts;
