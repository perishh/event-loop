import { getSession } from "@/lib/auth/session";
import LoginForm from "./components/LoginForm";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <LoginForm />
    </main>
  );
}
