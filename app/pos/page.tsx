import { prisma } from "@/lib/prisma";
import { PosClient } from "./PosClient";

export default async function PosPage() {
  const menuItems = await prisma.menuItem.findMany({ where: { isActive: true }, orderBy: { category: "asc" } });
  return <PosClient items={menuItems} />;
}
