import ContactList from "./(client)/main";
import { getContacts } from "./(actions)/actions";
import { PaginationUrlProps } from "@/lib/types";

// data is is data.json file
export default async function ContactsPage({
  searchParams,
}: PaginationUrlProps) {
  // get search params
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 5;

  // get contacts
  const { contacts, total } = await getContacts({ page, limit });

  return (
    <ContactList contacts={contacts} total={total} page={page} limit={limit} />
  );
}
