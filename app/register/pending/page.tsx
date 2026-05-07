/*
 * =========================================================================
 * FILE         :   app/register/pending/page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Pending approval route page of the EventLoop application.
 * =========================================================================
 */


/* Imports the shared EventLoop header component. */
import EventLoop_Header from "../../../components/header/EventLoop_Header";

/* Imports the pending approval page content component. */
import Pending_Page from "../../../components/register/pending/Pending_Page";


/**
 * @brief  Renders the pending approval route with the shared header.
 * @return The JSX structure of the pending approval route.
 */
export default function Page() {
    /* Returns the pending approval route structure. */
    return (
        /* Main page container for the pending approval route. */
        <main className="eventloop-main-page">
            {/* Renders the shared EventLoop header. */}
            <EventLoop_Header />

            {/* Renders the pending approval page content. */}
            <Pending_Page />
        </main>
    );
}


