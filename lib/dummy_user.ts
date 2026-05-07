/*
 * =========================================================================
 * FILE         :   lib/dummy_user.ts
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Temporary dummy user data used before real
 *                  authentication and backend session handling are added.
 * =========================================================================
 */


/**
 * @brief Defines the available dummy user roles for the temporary frontend state.
 */
export type Dummy_User_Role =
    /* Represents an application administrator. */
    | "ADMIN"

    /* Represents an event organizer. */
    | "ORGANIZER"

    /* Represents an event attendee. */
    | "ATTENDEE"

    /* Represents a visitor without booking rights. */
    | "GUEST";


/**
 * @brief Defines the structure of the temporary dummy user object.
 */
export type Dummy_User = {
    /* Stores the unique username of the dummy user. */
    username: string;

    /* Stores the dummy password used only for temporary frontend testing. */
    password: string;

    /* Stores the first name of the dummy user. */
    firstName: string;

    /* Stores the last name of the dummy user. */
    lastName: string;

    /* Stores the role of the dummy user. */
    role: Dummy_User_Role;

    /* Stores the number of unread messages for the dummy user. */
    unreadMessagesCount: number;
};


/**
 * @brief Stores the localStorage key used for the temporary dummy login state.
 */
export const dummyUserLoginStorageKey = "eventloop_dummy_user_is_logged_in";


/**
 * @brief Stores the temporary dummy user data used for frontend testing.
 */
export const dummyUser: Dummy_User = {
    /* Stores the dummy username. */
    username: "tassos",

    /* Stores the dummy password. */
    password: "1234",

    /* Stores the dummy first name. */
    firstName: "Τάσος",

    /* Stores the dummy last name. */
    lastName: "Κωνσταντίνου",

    /* Stores the dummy role. */
    role: "ATTENDEE",

    /* Stores the dummy unread message count. */
    unreadMessagesCount: 0,
};


