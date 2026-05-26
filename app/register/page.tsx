import { getSession } from "@/lib/auth/session";
import RegisterForm from "./components/RegisterForm";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <RegisterForm />
    </main>
  );
}
