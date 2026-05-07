/*
 * =========================================================================
 * FILE         :   app/register/page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Register route page of the EventLoop application.
 * =========================================================================
 */


/* Imports the shared EventLoop header component. */
import EventLoop_Header from "../../components/header/EventLoop_Header";

/* Imports the register page content component. */
import Register_Page from "../../components/register/Register_Page";


/**
 * @brief  Renders the register route with the shared header and register content.
 * @return The JSX structure of the register route.
 */
export default function Page() {
    /* Returns the register route structure. */
    return (
        /* Main page container for the register route. */
        <main className="eventloop-main-page">
            {/* Renders the shared EventLoop header. */}
            <EventLoop_Header />

            {/* Renders the register page content. */}
            <Register_Page />
        </main>
    );
}


