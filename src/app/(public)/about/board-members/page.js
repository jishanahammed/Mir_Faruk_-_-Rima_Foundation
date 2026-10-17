import { connection } from "next/server";
import { BoardMembersPage } from "@/components/public/board-members/board-members-page";
import { getPublicBoardMembers } from "@/lib/api/public-board-member-service";

export const metadata = {
  title: "Board Members | Mir Faruk & Rima Foundation",
  description:
    "Meet the board members who guide the vision and operations of Mir Faruk & Rima Foundation.",
};

export default async function BoardMembersPublicPage() {
  await connection();
  const { members, loadError } = await getPublicBoardMembers();
  return <BoardMembersPage members={members} loadError={loadError} />;
}
