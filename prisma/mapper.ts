import {
  BookingStatus,
  EventCategory,
  EventType,
  UserRole,
} from "../app/generated/prisma/enums";

type EventTypeValue = (typeof EventType)[keyof typeof EventType];
type EventCategoryValue = (typeof EventCategory)[keyof typeof EventCategory];

export const USER_ROLE_LABELS = {
  [UserRole.ADMIN]: "ΔΙΑΧΕΙΡΙΣΤΗΣ",
  [UserRole.ORGANIZER]: "ΔΙΟΡΓΑΝΩΤΗΣ",
  [UserRole.ATTENDEE]: "ΣΥΜΜΕΤΕΧΩΝ",
} as const satisfies Record<UserRole, string>;

export const EVENT_TYPE_LABELS = {
  [EventType.CONFERENCE]: "Συνέδριο",
  [EventType.WORKSHOP]: "Εργαστήριο",
  [EventType.SEMINAR]: "Σεμινάριο",
  [EventType.NETWORKING]: "Δικτύωση",
  [EventType.CONCERT]: "Συναυλία",
  [EventType.EXHIBITION]: "Έκθεση",
  [EventType.FESTIVAL]: "Φεστιβάλ",
  [EventType.GALA]: "Γκαλά",
  [EventType.PARTY]: "Πάρτι",
  [EventType.MEETUP]: "Συνάντηση",
  [EventType.WEBINAR]: "Διαδικτυακό σεμινάριο",
  [EventType.SPORTS]: "Αθλητικά",
  [EventType.THEATER]: "Θέατρο",
  [EventType.COMMUNITY]: "Κοινότητα",
  [EventType.FUNDRAISER]: "Φιλανθρωπική εκδήλωση",
  [EventType.OTHER]: "Άλλο",
} as const satisfies Record<EventType, string>;

export const EVENT_CATEGORY_LABELS = {
  [EventCategory.ACADEMIC]: "Ακαδημαϊκό",
  [EventCategory.TECH_IT]: "Τεχνολογία & Πληροφορική",
  [EventCategory.SKILL_BUILDING]: "Ανάπτυξη δεξιοτήτων",
  [EventCategory.PROFESSIONAL_DEVELOPMENT]: "Επαγγελματική ανάπτυξη",
  [EventCategory.PANEL_DISCUSSION]: "Συζήτηση πάνελ",
  [EventCategory.LIVE_MUSIC]: "Ζωντανή μουσική",
  [EventCategory.STAND_UP_COMEDY]: "Stand-up κωμωδία",
  [EventCategory.FILM_FESTIVAL]: "Φεστιβάλ κινηματογράφου",
  [EventCategory.FOOD_DRINK]: "Φαγητό & ποτό",
  [EventCategory.BUSINESS_MIXER]: "Επιχειρηματικό μίξ",
  [EventCategory.VOLUNTEER_FAIR]: "Έκθεση εθελοντισμού",
  [EventCategory.CHARITY_AUCTION]: "Φιλανθρωπική δημοπρασία",
  [EventCategory.TOURNAMENT]: "Τουρνουά",
  [EventCategory.FITNESS_CLASS]: "Μάθημα γυμναστικής",
  [EventCategory.ESPORTS]: "Esports",
  [EventCategory.GENERAL]: "Γενικά",
  [EventCategory.PRIVATE_EVENT]: "Ιδιωτική εκδήλωση",
} as const satisfies Record<EventCategoryValue, string>;

export const EVENT_TYPE_CATEGORIES = {
  [EventType.CONFERENCE]: [
    EventCategory.ACADEMIC,
    EventCategory.TECH_IT,
    EventCategory.SKILL_BUILDING,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.PANEL_DISCUSSION,
  ],
  [EventType.WORKSHOP]: [
    EventCategory.TECH_IT,
    EventCategory.SKILL_BUILDING,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.ACADEMIC,
  ],
  [EventType.SEMINAR]: [
    EventCategory.ACADEMIC,
    EventCategory.TECH_IT,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.PANEL_DISCUSSION,
  ],
  [EventType.NETWORKING]: [
    EventCategory.BUSINESS_MIXER,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.GENERAL,
  ],
  [EventType.CONCERT]: [EventCategory.LIVE_MUSIC, EventCategory.GENERAL],
  [EventType.EXHIBITION]: [
    EventCategory.ACADEMIC,
    EventCategory.TECH_IT,
    EventCategory.GENERAL,
    EventCategory.PRIVATE_EVENT,
  ],
  [EventType.FESTIVAL]: [
    EventCategory.LIVE_MUSIC,
    EventCategory.FILM_FESTIVAL,
    EventCategory.FOOD_DRINK,
    EventCategory.STAND_UP_COMEDY,
    EventCategory.GENERAL,
  ],
  [EventType.GALA]: [
    EventCategory.BUSINESS_MIXER,
    EventCategory.CHARITY_AUCTION,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.GENERAL,
  ],
  [EventType.PARTY]: [
    EventCategory.LIVE_MUSIC,
    EventCategory.FOOD_DRINK,
    EventCategory.PRIVATE_EVENT,
    EventCategory.GENERAL,
  ],
  [EventType.MEETUP]: [
    EventCategory.BUSINESS_MIXER,
    EventCategory.TECH_IT,
    EventCategory.STAND_UP_COMEDY,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.GENERAL,
  ],
  [EventType.WEBINAR]: [
    EventCategory.ACADEMIC,
    EventCategory.TECH_IT,
    EventCategory.SKILL_BUILDING,
    EventCategory.PROFESSIONAL_DEVELOPMENT,
    EventCategory.PANEL_DISCUSSION,
  ],
  [EventType.SPORTS]: [
    EventCategory.TOURNAMENT,
    EventCategory.FITNESS_CLASS,
    EventCategory.ESPORTS,
    EventCategory.GENERAL,
  ],
  [EventType.THEATER]: [EventCategory.GENERAL, EventCategory.PRIVATE_EVENT],
  [EventType.COMMUNITY]: [
    EventCategory.VOLUNTEER_FAIR,
    EventCategory.CHARITY_AUCTION,
    EventCategory.BUSINESS_MIXER,
    EventCategory.GENERAL,
  ],
  [EventType.FUNDRAISER]: [
    EventCategory.CHARITY_AUCTION,
    EventCategory.VOLUNTEER_FAIR,
    EventCategory.BUSINESS_MIXER,
    EventCategory.GENERAL,
  ],
  [EventType.OTHER]: [EventCategory.GENERAL, EventCategory.PRIVATE_EVENT],
} as const satisfies Record<EventTypeValue, readonly EventCategoryValue[]>;

export const STATUS_LABELS = {
  [BookingStatus.PENDING]: "Σε εκκρεμότητα",
  [BookingStatus.CONFIRMED]: "Επιβεβαιωμένη",
  [BookingStatus.CANCELLED]: "Ακυρωμένη",
} as const satisfies Record<BookingStatus, string>;
