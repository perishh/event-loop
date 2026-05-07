"use client";

/*
 * =========================================================================
 * FILE         :   app/page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Welcome route page of the EventLoop application.
 * =========================================================================
 */


/* Imports the state hook used for the temporary welcome page state. */
import { useEffect, useState } from "react";

/* Imports the shared EventLoop header component. */
import EventLoop_Header from "../components/header/EventLoop_Header";

/* Imports the temporary dummy user data. */
import { dummyUserLoginStorageKey } from "../lib/dummy_user";

/* Imports the welcome page content for visitors. */
import Welcome_Page_Not_Logged from "../components/welcome/Welcome_Page_Not_Logged";

/* Imports the welcome page content for logged-in users. */
import Welcome_Page_Logged from "../components/welcome/Welcome_Page_Logged";


/**
 * @brief  Renders the welcome route with temporary logged-in detection.
 * @return The JSX structure of the welcome route.
 */
export default function Page() {
    /* Stores whether the temporary dummy user is currently logged in. */
    const [dummyUserIsLoggedIn, setDummyUserIsLoggedIn] = useState(false);

    /* Reads the temporary login state when the welcome page loads. */
    useEffect(() => {
        /* Stores the saved dummy login state from localStorage. */
        const savedDummyLoginState = localStorage.getItem(dummyUserLoginStorageKey);

        /* Updates the welcome page according to the saved dummy login state. */
        setDummyUserIsLoggedIn(savedDummyLoginState === "true");
    }, []);

    /* Returns the welcome page structure. */
    return (
        /* Main page container for the welcome route. */
        <main className="eventloop-main-page">
            {/* Renders the shared EventLoop header. */}
            <EventLoop_Header />

            {/* Renders the correct welcome page version based on the temporary login state. */}
            {dummyUserIsLoggedIn ? <Welcome_Page_Logged /> : <Welcome_Page_Not_Logged />}
        </main>
    );
}


