/*
 * =========================================================================
 * FILE         :   components/header/EventLoop_Header.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Header component of the EventLoop application.
 *                  Contains the logo, category navigation, search box,
 *                  guest authentication links and temporary logged-in
 *                  user links.
 * =========================================================================
 */


"use client";


/* Imports the Next.js Image component for optimized image rendering. */
import Image from "next/image";

/* Imports the Next.js Link component for internal navigation. */
import Link from "next/link";

/* Imports the state hook used for the temporary login state. */
import { useEffect, useState } from "react";

/* Imports the temporary dummy user data. */
import { dummyUser, dummyUserLoginStorageKey } from "../../lib/dummy_user";


/**
 * @brief Stores the category labels used in the desktop navigation and
 *        in the responsive dropdown menu.
 */
const navigationCategories = [
    /* Stores the music category label. */
    "Μουσική",

    /* Stores the theater category label. */
    "Θέατρο",

    /* Stores the sports category label. */
    "Αθλητικά",

    /* Stores the cinema category label. */
    "Σινεμά",

    /* Stores the festivals category label. */
    "Festivals",

    /* Stores the extra categories label. */
    "Περισσότερα",
];


/**
 * @brief  Renders the authentication area for a visitor that is not logged in.
 * @return The JSX structure of the guest authentication links.
 */
function Guest_Authentication_Links() {
    /* Returns the visible guest authentication links. */
    return (
        /* Authentication links container for visitors. */
        <div className="eventloop-authentication-links">
            {/* Login link that leads to the login page. */}
            <Link
                /* Points to the login route. */
                href="/login"
                /* Applies the shared header link style and auth font size. */
                className="eventloop-header-link eventloop-authentication-link"
            >
                {/* Prints the login label. */}
                Σύνδεση
            </Link>

            {/* Register link that leads to the register page. */}
            <Link
                /* Points to the register route. */
                href="/register"
                /* Applies the shared header link style and auth font size. */
                className="eventloop-header-link eventloop-authentication-link"
            >
                {/* Prints the register label. */}
                Εγγραφή
            </Link>
        </div>
    );
}


/**
 * @brief Defines the props used by the logged-in user links.
 */
type Logged_In_User_Links_Props = {
    /* Stores the temporary logout handler. */
    onDummyLogout: () => void;
};


/**
 * @brief  Renders the authentication area for a temporary logged-in user.
 * @return The JSX structure of the logged-in user links.
 */
function Logged_In_User_Links({ onDummyLogout }: Logged_In_User_Links_Props) {
    /* Returns the visible logged-in user links. */
    return (
        /* Authentication links container for logged-in users. */
        <div className="eventloop-authentication-links">
            {/* Messages link placeholder for the logged-in user. */}
            <Link
                /* Points to the future messages route. */
                href="#"
                /* Applies the shared header link style and auth font size. */
                className="eventloop-header-link eventloop-authentication-link"
            >
                {/* Prints the messages label with the dummy unread count. */}
                Μηνύματα ({dummyUser.unreadMessagesCount})
            </Link>

            {/* Profile dropdown wrapper for the logged-in user. */}
            <div className="eventloop-profile-dropdown">
                {/* Profile dropdown trigger. */}
                <button
                    /* Defines the element as a simple button without form behavior. */
                    type="button"
                    /* Applies the same header link styles plus the profile dropdown button style. */
                    className="eventloop-header-link eventloop-authentication-link eventloop-profile-button"
                >
                    {/* Prints the profile label. */}
                    <span className="eventloop-profile-button-text">Προφίλ</span>

                    {/* Shows the profile icon next to the profile label. */}
                    <svg
                        /* Hides the decorative icon from screen readers. */
                        aria-hidden="true"
                        /* Defines the visible width of the icon. */
                        width="24"
                        /* Defines the visible height of the icon. */
                        height="24"
                        /* Defines the SVG coordinate system. */
                        viewBox="0 0 24 24"
                        /* Applies the profile icon style. */
                        className="eventloop-profile-icon"
                    >
                        {/* Draws the user head outline. */}
                        <circle
                            /* Defines the horizontal center of the circle. */
                            cx="12"
                            /* Defines the vertical center of the circle. */
                            cy="8"
                            /* Defines the radius of the circle. */
                            r="4"
                        />

                        {/* Draws the user body outline. */}
                        <path
                            /* Defines the user body path. */
                            d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21"
                        />
                    </svg>
                </button>

                {/* Profile dropdown panel shown on hover. */}
                <div className="eventloop-profile-dropdown-panel">
                    {/* Shows the dummy username. */}
                    <div className="eventloop-profile-username">
                        {/* Prints the dummy username. */}
                        {dummyUser.username}
                    </div>

                    {/* Logout button that clears the temporary dummy login state. */}
                    <button
                        /* Defines the element as a simple button without form behavior. */
                        type="button"
                        /* Calls the temporary dummy logout handler. */
                        onClick={onDummyLogout}
                        /* Applies the profile dropdown button style. */
                        className="eventloop-profile-dropdown-link eventloop-profile-dropdown-button"
                    >
                        {/* Prints the logout label. */}
                        Αποσύνδεση
                    </button>
                </div>
            </div>
        </div>
    );
}


/**
 * @brief  Renders the main EventLoop header.
 * @return The JSX structure of the header.
 */
export default function EventLoop_Header() {
    /* Stores whether the temporary dummy user is currently logged in. */
    const [dummyUserIsLoggedIn, setDummyUserIsLoggedIn] = useState(false);

    /* Reads the temporary login state when the header loads in the browser. */
    useEffect(() => {
        /* Stores the saved dummy login state from localStorage. */
        const savedDummyLoginState = localStorage.getItem(dummyUserLoginStorageKey);

        /* Updates the header according to the saved dummy login state. */
        setDummyUserIsLoggedIn(savedDummyLoginState === "true");
    }, []);


    /**
     * @brief Clears the temporary dummy login state and returns the user
     *        to the visitor version of the application.
     */
    function handleDummyLogout() {
        /* Removes the temporary dummy login state from localStorage. */
        localStorage.removeItem(dummyUserLoginStorageKey);

        /* Updates the header immediately after logout. */
        setDummyUserIsLoggedIn(false);

        /* Sends the user back to the welcome page. */
        window.location.href = "/";
    }


    /* Returns the visible header structure. */
    return (
        /* Header bar that contains the logo, categories, search bar and auth links. */
        <header className="eventloop-header-bar">
            {/* Logo link that sends the user back to the welcome page. */}
            <Link href="/" className="eventloop-logo-link">
                {/* EventLoop logo image loaded from the public/logo folder. */}
                <Image
                    /* Uses the logo image stored inside public/logo. */
                    src="/logo/EventLoop_LOGO.png"
                    /* Describes the logo for accessibility tools. */
                    alt="Λογότυπο EventLoop"
                    /* Defines the real intrinsic image width. */
                    width={2048}
                    /* Defines the real intrinsic image height. */
                    height={1054}
                    /* Loads the logo with priority because it appears in the header. */
                    priority
                    /* Applies the custom logo style from globals.css. */
                    className="eventloop-logo"
                />
            </Link>

            {/* Responsive dropdown that appears when the full category list does not fit. */}
            <div className="eventloop-category-dropdown">
                {/* Dropdown trigger for the hidden category list. */}
                <button
                    /* Defines the element as a simple button without form behavior. */
                    type="button"
                    /* Applies the custom dropdown button style from globals.css. */
                    className="eventloop-dropdown-button"
                >
                    {/* Prints the dropdown label. */}
                    Κατηγορίες
                </button>

                {/* Dropdown panel that contains all category links. */}
                <div className="eventloop-dropdown-panel">
                    {/* Creates one dropdown link for each category label. */}
                    {navigationCategories.map((navigationCategory) => (
                        /* Category dropdown link placeholder until real category routes are added. */
                        <Link
                            /* Uses the category text as the unique key for this temporary list. */
                            key={navigationCategory}
                            /* Keeps the link inactive until the real route is decided. */
                            href="#"
                            /* Applies the custom dropdown link style from globals.css. */
                            className="eventloop-dropdown-link"
                        >
                            {/* Prints the current category label inside the dropdown link. */}
                            {navigationCategory}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Desktop navigation area that contains the event categories. */}
            <nav className="eventloop-desktop-navigation">
                {/* Creates one desktop navigation link for each category label. */}
                {navigationCategories.map((navigationCategory) => (
                    /* Category link placeholder until real category routes are added. */
                    <Link
                        /* Uses the category text as the unique key for this temporary list. */
                        key={navigationCategory}
                        /* Keeps the link inactive until the real route is decided. */
                        href="#"
                        /* Applies the shared header link style from globals.css. */
                        className="eventloop-header-link"
                    >
                        {/* Prints the current category label inside the desktop link. */}
                        {navigationCategory}
                    </Link>
                ))}
            </nav>

            {/* Right side of the header with search and authentication links. */}
            <div className="eventloop-header-right-section">
                {/* Search box container with rounded white background. */}
                <div className="eventloop-search-box">
                    {/* Search input for the welcome screen mockup. */}
                    <input
                        /* Defines this field as a text input. */
                        type="text"
                        /* Shows placeholder text before the user types. */
                        placeholder="Αναζήτηση"
                        /* Applies the custom search input style from globals.css. */
                        className="eventloop-search-input"
                    />

                    {/* Temporary search icon until a proper icon is added. */}
                    <span className="eventloop-search-icon">⌕</span>
                </div>

                {/* Renders the correct authentication links based on the dummy login state. */}
                {dummyUserIsLoggedIn ? (
                    <Logged_In_User_Links onDummyLogout={handleDummyLogout} />
                ) : (
                    <Guest_Authentication_Links />
                )}
            </div>
        </header>
    );
}



