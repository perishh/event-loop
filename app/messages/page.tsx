import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import { formatTime } from "@/lib/utils";
import MessagesSidebar from "./components/MessagesSidebar";
import MessageComposer from "./components/MessageComposer";
import MessageActions from "./components/MessageActions";
import ConversationActions from "./components/ConversationActions";
import MessagesEffects from "./components/MessagesEffects";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; m?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/messages");

  const isAttendee = session.role === UserRole.ATTENDEE;
  const isOrganizer = session.role === UserRole.ORGANIZER;
  // Messaging is organizer <-> attendee only.
  if (!isAttendee && !isOrganizer) redirect("/");

  const viewerId = session.sub;
  const params = await searchParams;
  const activeId = params.c ?? null;
  const highlightId = params.m ?? null;

  const conversations = await prisma.conversation.findMany({
    where: isAttendee
      ? { attendeeId: viewerId }
      : { event: { organizerId: viewerId } },
    include: {
      event: { select: { id: true, title: true } },
      attendee: { select: { firstName: true, lastName: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          read: true,
          senderId: true,
          createdAt: true,
          hiddenByAttendee: true,
          hiddenByOrganizer: true,
        },
      },
    },
  });

  // A message is "deleted for me" when the viewer has hidden it.
  const isHidden = (m: {
    hiddenByAttendee: boolean;
    hiddenByOrganizer: boolean;
  }) => (isAttendee ? m.hiddenByAttendee : m.hiddenByOrganizer);

  const items = conversations
    .map((conv) => {
      // threadMsgs: every message (deleted ones show a placeholder in the thread).
      // visibleMsgs: messages the viewer has not deleted (drive previews/counts).
      const threadMsgs = conv.messages;
      const visibleMsgs = conv.messages.filter((m) => !isHidden(m));
      const last = visibleMsgs.at(-1) ?? null;
      const unread = visibleMsgs.filter(
        (m) => !m.read && m.senderId !== viewerId,
      ).length;
      const title = isAttendee
        ? conv.event.title
        : `${conv.attendee.firstName} ${conv.attendee.lastName}`;
      const subtitle = isAttendee ? "Διοργανωτής" : conv.event.title;
      const initials = (
        conv.attendee.firstName.charAt(0) + conv.attendee.lastName.charAt(0)
      ).toUpperCase();
      return {
        conv,
        threadMsgs,
        visibleMsgs,
        last,
        unread,
        title,
        subtitle,
        initials,
      };
    })
    .sort(
      (a, b) =>
        (b.last?.createdAt.getTime() ?? 0) - (a.last?.createdAt.getTime() ?? 0),
    );

  // Flattened, non-deleted messages for the Inbox / Sent lists.
  const allFlat = items.flatMap((it) =>
    it.visibleMsgs.map((m) => ({
      id: m.id,
      body: m.body,
      read: m.read,
      senderId: m.senderId,
      createdAt: m.createdAt,
      convId: it.conv.id,
      title: it.title,
      initials: it.initials,
    })),
  );
  const byNewest = (a: { createdAt: Date }, b: { createdAt: Date }) =>
    b.createdAt.getTime() - a.createdAt.getTime();
  const inboxItems = allFlat
    .filter((f) => f.senderId !== viewerId)
    .sort(byNewest);
  const sentItems = allFlat
    .filter((f) => f.senderId === viewerId)
    .sort(byNewest);
  const inboxUnread = inboxItems.filter((f) => !f.read).length;

  const active = activeId
    ? (items.find((it) => it.conv.id === activeId) ?? null)
    : null;

  const unreadLabel = (n: number) =>
    n === 1 ? "1 αδιάβαστο" : `${n} αδιάβαστα`;

  const shortDate = (d: Date) =>
    new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);

  const Avatar = ({ initials }: { initials: string }) => (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-medium text-white">
      {isAttendee ? <CalendarDays className="h-4 w-4" /> : initials}
    </div>
  );

  // One row per flat message (Inbox / Sent). The link navigates; the dots menu
  // sits outside it so they don't nest.
  const messageRow = (
    f: (typeof allFlat)[number],
    options: { highlightUnread: boolean },
  ) => {
    const unread = options.highlightUnread && !f.read;
    return (
      <div
        key={f.id}
        className={`flex items-center transition ${
          unread ? "bg-violet-200 hover:bg-violet-300" : "hover:bg-violet-100"
        }`}
      >
        <Link
          href={`/messages?c=${f.convId}&m=${f.id}`}
          className="flex min-w-0 flex-1 gap-3 py-2.5 pl-3"
        >
          <Avatar initials={f.initials} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {f.title}
            </p>
            <p
              className={`truncate text-sm ${unread ? "font-semibold text-gray-800" : "text-gray-500"}`}
            >
              {f.body}
            </p>
          </div>
          <span className="shrink-0 self-start text-[11px] text-gray-400">
            {formatTime(f.createdAt)}
          </span>
        </Link>
        <div className="px-2">
          <MessageActions messageId={f.id} align="right" />
        </div>
      </div>
    );
  };

  const inboxList =
    inboxItems.length === 0 ? (
      <p className="px-4 py-3 text-sm text-gray-500">
        Δεν υπάρχουν εισερχόμενα.
      </p>
    ) : (
      inboxItems.map((f) => messageRow(f, { highlightUnread: true }))
    );

  const sentList =
    sentItems.length === 0 ? (
      <p className="px-4 py-3 text-sm text-gray-500">
        Δεν υπάρχουν απεσταλμένα.
      </p>
    ) : (
      sentItems.map((f) => messageRow(f, { highlightUnread: false }))
    );

  // Conversations list: grouped. Conversations fully deleted by the viewer
  // (no visible messages) are hidden. The dots menu deletes the whole thread.
  const convItems = items.filter((it) => it.visibleMsgs.length > 0);
  const convList =
    convItems.length === 0 ? (
      <p className="px-4 py-3 text-sm text-gray-500">
        Δεν υπάρχουν συνομιλίες.
      </p>
    ) : (
      convItems.map((it) => {
        const isActive = it.conv.id === active?.conv.id;
        const hasUnread = it.unread > 0;
        const bg = isActive
          ? "bg-violet-300"
          : hasUnread
            ? "bg-violet-200 hover:bg-violet-300"
            : "hover:bg-violet-100";
        return (
          <div
            key={it.conv.id}
            className={`flex items-center transition ${bg}`}
          >
            <Link
              href={`/messages?c=${it.conv.id}`}
              className="flex min-w-0 flex-1 gap-3 py-2.5 pl-3"
            >
              <Avatar initials={it.initials} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {it.title}
                </p>
                <p className="truncate text-xs text-violet-600">
                  {it.subtitle}
                </p>
                <p
                  className={`truncate text-sm ${hasUnread ? "font-semibold text-gray-800" : "text-gray-500"}`}
                >
                  {it.last?.body ?? "—"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {it.last && (
                  <span className="text-[11px] text-gray-400">
                    {formatTime(it.last.createdAt)}
                  </span>
                )}
                {hasUnread && (
                  <span className="text-[10px] font-medium text-violet-700">
                    {unreadLabel(it.unread)}
                  </span>
                )}
              </div>
            </Link>
            <div className="px-2">
              <ConversationActions conversationId={it.conv.id} />
            </div>
          </div>
        );
      })
    );

  return (
    <main className="flex flex-1">
      <MessagesSidebar
        inboxBadge={inboxUnread}
        inbox={inboxList}
        sent={sentList}
        conv={convList}
      />

      <section className="flex min-w-0 flex-1 flex-col bg-white">
        {!active ? (
          <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-gray-500">
            Διαλέξτε μια συνομιλία για να δείτε τα μηνύματα.
          </div>
        ) : (
          <>
            <div className="shrink-0 border-y border-violet-100 px-5 py-3">
              <p className="text-sm font-medium text-gray-900">
                {active.title}
              </p>
              <p className="text-xs text-violet-600">{active.subtitle}</p>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {active.threadMsgs.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Κανένα μήνυμα.
                </p>
              ) : (
                active.threadMsgs.map((m) => {
                  const mine = m.senderId === viewerId;
                  const deleted = isHidden(m);
                  const highlighted = m.id === highlightId;
                  const stamp = `${shortDate(m.createdAt)} · ${formatTime(m.createdAt)}`;
                  return (
                    <div
                      key={m.id}
                      id={`msg-${m.id}`}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[82%] items-center gap-1">
                        {!mine &&
                          (deleted ? (
                            <span className="h-6 w-6 shrink-0" />
                          ) : (
                            <MessageActions messageId={m.id} align="left" />
                          ))}
                        <div
                          className={`flex min-w-0 flex-col gap-1 ${mine ? "items-end" : "items-start"}`}
                        >
                          {deleted ? (
                            <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm italic text-gray-400">
                              [Έχετε διαγράψει αυτό το μήνυμα]
                            </div>
                          ) : (
                            <div
                              className={`rounded-2xl px-3 py-2 text-sm transition-colors ${
                                highlighted
                                  ? "bg-orange-400 text-white"
                                  : mine
                                    ? "bg-violet-500 text-white"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {m.body}
                              </p>
                            </div>
                          )}
                          <span className="px-1 text-[10px] text-gray-400">
                            {stamp}
                          </span>
                        </div>
                        {mine &&
                          (deleted ? (
                            <span className="h-6 w-6 shrink-0" />
                          ) : (
                            <MessageActions messageId={m.id} align="right" />
                          ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <MessageComposer
              key={active.conv.id}
              conversationId={active.conv.id}
            />
          </>
        )}
      </section>

      <MessagesEffects
        conversationId={active?.conv.id ?? null}
        highlightMessageId={highlightId}
      />
    </main>
  );
}
