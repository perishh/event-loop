"use client";

import { signOut } from "@/app/logout/actions";
import { useRouter } from "next/navigation";

/**
 * @brief Renders the logout button used inside the profile dropdown.
 */
export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
    //router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
    >
      Αποσύνδεση
    </button>
  );
}
