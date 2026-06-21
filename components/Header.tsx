import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/logout/actions";

import Logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import EventsDropdown from "@/components/EventsDropdown";
import { UserRole } from "@/app/generated/prisma/enums";

/**
 * @brief Renders the logout button used inside the profile dropdown.
 */
export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={signOut}
      className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
    >
      Αποσύνδεση
    </button>
  );
}

/**
 * @brief  Renders the authentication area for a visitor that is not logged in.
 * @return The JSX structure of the guest authentication links.
 */
function GuestAuthenticationLinks() {
  return (
    <>
      <Link
        href="/login"
        className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
      >
        Σύνδεση
      </Link>

      <Link
        href="/register"
        className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
      >
        Εγγραφή
      </Link>
    </>
  );
}

/**
 * @brief  Renders the authentication area for a logged-in user.
 * @param  username the username shown inside the profile dropdown.
 * @return The JSX structure of the logged-in user links.
 */
function LoggedInUserLinks({
  username,
  role,
}: {
  username: string;
  role: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      {role === UserRole.ADMIN && (
        <Link
          href="/admin"
          className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
        >
          Διαχείριση
        </Link>
      )}
      <span className="bg-white px-3 py-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold">
        {username}
      </span>
      <LogoutButton />
    </div>
  );
}

/**
 * @brief  Renders the main EventLoop header.
 *         Reads the current better-auth session on the server to decide
 *         whether to show guest links or logged-in user links.
 * @return The JSX structure of the header.
 */
export default async function Header() {
  // Read the current session on the server. Returns null if the visitor is
  // not signed in.
  const session = await getSession();

  return (
    <nav className="bg-violet-700 px-4 py-2 md:px-6 lg:px-10 2xl:px-32 flex justify-between items-center sticky top-0 left-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Image
            src={Logo}
            alt="Λογότυπο EventLoop"
            priority
            className="w-28"
          />
        </Link>
        <EventsDropdown />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-end mr-4">
          <input
            type="text"
            placeholder="Αναζήτηση"
            className="bg-white px-3 py-2 rounded-full focus:outline-2 focus:outline-violet-800 transition-all outline-0 outline-violet-500 text-sm shadow-md shadow-violet-800 focus:shadow-lg"
          />
          <Search className="absolute right-2 pointer-events-none" />
        </div>

        {session ? (
          <LoggedInUserLinks
            role={session!.role}
            username={session!.username}
          />
        ) : (
          <GuestAuthenticationLinks />
        )}
      </div>
    </nav>
  );
}
