/*
 * =========================================================================
 * FILE         :   components/welcome/Welcome_Page_Not_Logged.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Welcome page content for visitors that are not logged in.
 * =========================================================================
 */


/* Imports the shared breadcrumb component. */
import EventLoop_Breadcrumb from "../breadcrumb/EventLoop_Breadcrumb";

/* Imports the shared welcome hero component. */
import Welcome_Hero from "./Welcome_Hero";

/* Imports the popular events welcome section. */
import Welcome_Popular_Events from "./Welcome_Popular_Events";


/**
 * @brief  Renders the welcome page content for not logged in users.
 * @return The JSX structure of the not logged in welcome page.
 */
export default function Welcome_Page_Not_Logged() {
    /* Returns the visible not logged in welcome page content. */
    return (
        /* Main welcome page content wrapper. */
        <section className="eventloop-welcome-page-content">
            {/* Renders the shared welcome hero. */}
            <Welcome_Hero />


            {/* Renders the popular upcoming events section. */}
            <Welcome_Popular_Events />
        </section>
    );
}


