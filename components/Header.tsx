import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/logout/actions";

import Logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { getSession } from "@/lib/auth/session";

/**
 * @brief Stores the category labels used in the desktop navigation and
 *        in the responsive dropdown menu.
 */
const navigationCategories = [
  "Μουσική",
  "Θέατρο",
  "Αθλητικά",
  "Σινεμά",
  "Φεστιβάλ",
];

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
function LoggedInUserLinks({ username }: { username: string }) {
  return (
    <div className="flex items-center space-x-2">
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
    <nav className="bg-violet-700 px-4 py-2 md:px-6 lg:px-10 2xl:px-32 flex justify-between items-center">
      <Link href="/">
        <Image src={Logo} alt="Λογότυπο EventLoop" priority className="w-28" />
      </Link>

      <div className="block lg:hidden relative group text-white text-sm">
        <button className="border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800 block">
          Κατηγορίες
        </button>

        <div className="absolute bg-violet-600 rounded-xl z-10 shadow-xl p-1 group-hover:block hidden space-y-2 min-w-24 font-semibold">
          {navigationCategories.map((navigationCategory) => (
            <Link
              key={navigationCategory}
              className="block w-full hover: hover:bg-violet-700 px-3 py-1 rounded-md transition-colors"
              href="#"
            >
              {navigationCategory}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop navigation area that contains the event categories. */}
      <div className="hidden lg:flex space-x-2 items-center text-white font-medium tracking-wide text-sm">
        <Link
          href="#"
          className="border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800 block"
        >
          Μουσική
        </Link>
        <Link
          href="#"
          className="border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800 block"
        >
          Θέατρο
        </Link>
        <Link
          href="#"
          className="border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800 block"
        >
          Αθλητικά
        </Link>
        <Link
          href="#"
          className="hidden xl:block border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800"
        >
          Σινεμά
        </Link>
        <Link
          href="#"
          className="hidden xl:block border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800"
        >
          Φεστιβάλ
        </Link>
        <Link
          href="#"
          className="block border border-violet-800 rounded-xl px-3 py-2 transition-colors bg-violet-700 hover:bg-violet-800"
        >
          Περισσότερα
        </Link>
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
          <LoggedInUserLinks username={session?.username} />
        ) : (
          <GuestAuthenticationLinks />
        )}
      </div>
    </nav>
  );
}
