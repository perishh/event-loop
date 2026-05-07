/*
 * =========================================================================
 * FILE         :   app/login/page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Login route page of the EventLoop application.
 * =========================================================================
 */


/* Imports the shared EventLoop header component. */
import EventLoop_Header from "../../components/header/EventLoop_Header";

/* Imports the login page content component. */
import Login_Page from "../../components/login/Login_Page";


/**
 * @brief  Renders the login route with the shared header and login content.
 * @return The JSX structure of the login route.
 */
export default function Page() {
    /* Returns the login route structure. */
    return (
        /* Main page container for the login route. */
        <main className="eventloop-main-page">
            {/* Renders the shared EventLoop header. */}
            <EventLoop_Header />

            {/* Renders the login page content. */}
            <Login_Page />
        </main>
    );
}


