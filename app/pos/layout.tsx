import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";

export default async function PosLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session.user} />
      <main className="flex-1 flex">{children}</main>
    </div>
  );
}
