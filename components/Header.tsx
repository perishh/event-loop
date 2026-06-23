import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/logout/actions";

import Logo from "../assets/logo.png";
import {
  CircleUserRound,
  Cog,
  LayoutList,
  LogOut,
  MessagesSquare,
  Search,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import EventsDropdown from "@/components/EventsDropdown";
import { BookingStatus, UserRole } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

/**
 * @brief Renders the logout button used inside the profile dropdown.
 */
export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={signOut}
      className="bg-white p-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
    >
      <LogOut size={20} />
    </button>
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

  const unreadMessageCount = !session
    ? 0
    : await prisma.message.count({
        where: {
          conversation: {
            OR: [
              { attendeeId: session.sub },
              {
                event: {
                  organizerId: session.sub,
                },
              },
            ],
          },
          senderId: {
            not: session.sub,
          },
          read: false,
        },
      });

  const pendingTicketConfirmations =
    session?.role !== UserRole.ORGANIZER
      ? 0
      : await prisma.booking.count({
          where: {
            ticketType: {
              event: {
                organizerId: session.sub,
              },
            },
            status: BookingStatus.PENDING,
          },
        });

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
        {session?.role === UserRole.ATTENDEE && (
          <Link
            href="/bookings"
            className="flex items-center text-white text-sm font-semibold space-x-4"
          >
            <div className="relative">
              <LayoutList size={20} />
              {pendingTicketConfirmations > 0 && (
                <div className="absolute -top-2 -right-3 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingTicketConfirmations}
                </div>
              )}
            </div>
            <span>Κρατήσεις</span>
          </Link>
        )}
        {session?.role === UserRole.ORGANIZER && (
          <Link
            href="/manage"
            className="flex items-center text-white text-sm font-semibold space-x-4"
          >
            <LayoutList size={20} />
            <span>Οι διοργανώσεις μου</span>
          </Link>
        )}
        {session?.role === UserRole.ADMIN && (
          <Link
            href="/admin"
            className="flex items-center text-white text-sm font-semibold space-x-4"
          >
            <Cog size={20} />
            <span>Διαχείριση</span>
          </Link>
        )}
        {session && (
          <Link
            href="/messages"
            className="flex items-center text-white text-sm font-semibold space-x-4"
          >
            <div className="relative">
              <MessagesSquare size={20} />

              {unreadMessageCount > 0 && (
                <div className="absolute -top-2 -right-3 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessageCount}
                </div>
              )}
            </div>
            <span>Μηνύματα</span>
          </Link>
        )}
      </div>

      <form action="/events" method="GET" className="flex items-center">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3 text-violet-200 pointer-events-none"
          />
          <input
            type="text"
            name="query"
            placeholder="Αναζήτηση εκδηλώσεων"
            className="bg-violet-600 text-white placeholder-violet-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-400 w-48 lg:w-64 transition-all font-semibold"
          />
        </div>
      </form>

      <div className="flex items-center space-x-2">
        {session ? (
          <>
            <div className="flex items-center space-x-2 mr-4 select-none">
              <CircleUserRound className="text-white" />
              <span className="text-white text-sm font-bold">
                {session.username}
              </span>
            </div>
            <LogoutButton />
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
}
