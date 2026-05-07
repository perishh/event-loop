/*
 * =========================================================================
 * FILE         :   components/breadcrumb/EventLoop_Breadcrumb.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Shared breadcrumb component for EventLoop pages.
 * =========================================================================
 */


/* Imports the Next.js Link component for internal navigation. */
import Link from "next/link";


/**
 * @brief Defines one breadcrumb item.
 */
type EventLoop_Breadcrumb_Item = {
    /* Stores the visible breadcrumb label. */
    label: string;

    /* Stores the link target. */
    href: string;
};


/**
 * @brief Defines the properties of the breadcrumb component.
 */
type EventLoop_Breadcrumb_Props = {
    /* Stores the breadcrumb items in display order. */
    breadcrumbItems: EventLoop_Breadcrumb_Item[];

    /* Stores an optional extra CSS class. */
    className?: string;
};


/**
 * @brief  Renders the breadcrumb chevron separator.
 * @return The JSX structure of the breadcrumb separator icon.
 */
function EventLoop_Breadcrumb_Separator() {
    /* Returns the breadcrumb separator icon. */
    return (
        /* Chevron icon used between breadcrumb links. */
        <svg
            /* Hides the separator from screen readers. */
            aria-hidden="true"
            /* Applies the breadcrumb separator icon style. */
            className="eventloop-breadcrumb-separator-icon"
            /* Defines the SVG coordinate system. */
            viewBox="0 0 24 24"
        >
            {/* Draws the chevron line. */}
            <path
                /* Defines the chevron shape. */
                d="M9 6L15 12L9 18"
            />
        </svg>
    );
}


/**
 * @brief  Renders a shared breadcrumb navigation row.
 * @param  breadcrumbItems  the breadcrumb items shown on the page.
 * @param  className        the optional extra CSS class.
 * @return The JSX structure of the breadcrumb navigation row.
 */
export default function EventLoop_Breadcrumb({
    breadcrumbItems,
    className = "",
}: EventLoop_Breadcrumb_Props) {
    /* Returns the breadcrumb navigation structure. */
    return (
        /* Breadcrumb navigation wrapper. */
        <nav
            /* Adds an accessible label for the breadcrumb navigation. */
            aria-label="Διαδρομή σελίδας"
            /* Applies the breadcrumb style and any extra class. */
            className={`eventloop-breadcrumb ${className}`}
        >
            {/* Breadcrumb ordered list. */}
            <ol className="eventloop-breadcrumb-list">
                {/* Creates one breadcrumb row item for each breadcrumb item. */}
                {breadcrumbItems.map((breadcrumbItem, breadcrumbItemIndex) => {
                    /* Stores whether this breadcrumb item is the last item. */
                    const breadcrumbItemIsLast =
                        breadcrumbItemIndex === breadcrumbItems.length - 1;

                    /* Returns one breadcrumb item. */
                    return (
                        /* Breadcrumb list item. */
                        <li
                            /* Uses the breadcrumb label as the list key. */
                            key={breadcrumbItem.label}
                            /* Applies the breadcrumb item style. */
                            className="eventloop-breadcrumb-item"
                        >
                            {/* Shows every breadcrumb item as a link. */}
                            <Link
                                /* Sends the user to the breadcrumb target page. */
                                href={breadcrumbItem.href}
                                /* Marks the current page link for accessibility. */
                                aria-current={breadcrumbItemIsLast ? "page" : undefined}
                                /* Applies the correct breadcrumb link style. */
                                className={
                                    breadcrumbItemIsLast
                                        ? "eventloop-breadcrumb-link eventloop-breadcrumb-current-link"
                                        : "eventloop-breadcrumb-link"
                                }
                            >
                                {/* Prints the breadcrumb label. */}
                                {breadcrumbItem.label}
                            </Link>

                            {/* Shows a separator after every item except the last one. */}
                            {!breadcrumbItemIsLast && <EventLoop_Breadcrumb_Separator />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}


