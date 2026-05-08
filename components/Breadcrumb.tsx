import { ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * @brief Defines one breadcrumb item.
 */
type BreadcrumbItem = {
  /* Stores the visible breadcrumb label. */
  label: string;

  /* Stores the link target. */
  href: string;
};

/**
 * @brief Defines the properties of the breadcrumb component.
 */
type BreadcrumbProps = {
  /* Stores the breadcrumb items in display order. */
  breadcrumbItems: BreadcrumbItem[];

  /* Stores an optional extra CSS class. */
  className?: string;
};

/**
 * @brief  Renders a shared breadcrumb navigation row.
 * @param  breadcrumbItems  the breadcrumb items shown on the page.
 * @param  className        the optional extra CSS class.
 * @return The JSX structure of the breadcrumb navigation row.
 */
export default function Breadcrumb({
  breadcrumbItems,
  className = "",
}: BreadcrumbProps) {
  /* Returns the breadcrumb navigation structure. */
  return (
    /* Breadcrumb navigation wrapper. */
    <nav
      /* Adds an accessible label for the breadcrumb navigation. */
      aria-label="Διαδρομή σελίδας"
      /* Applies the breadcrumb style and any extra class. */
      className={`flex items-center ${className}`}
    >
      {/* Creates one breadcrumb row item for each breadcrumb item. */}
      {breadcrumbItems.map((breadcrumbItem, breadcrumbItemIndex) => {
        /* Stores whether this breadcrumb item is the last item. */
        const breadcrumbItemIsLast =
          breadcrumbItemIndex === breadcrumbItems.length - 1;

        /* Returns one breadcrumb item. */
        return (
          /* Breadcrumb list item. */
          <div
            key={`breadcrumb-${breadcrumbItem.href}`}
            className="flex items-center"
          >
            <Link
              /* Sends the user to the breadcrumb target page. */
              href={breadcrumbItem.href}
              /* Marks the current page link for accessibility. */
              aria-current={breadcrumbItemIsLast ? "page" : undefined}
              /* Applies the correct breadcrumb link style. */
              className="text-violet-900 last:text-violet-950 hover:underline text-xs"
            >
              {/* Prints the breadcrumb label. */}
              {breadcrumbItem.label}
            </Link>

            {/* Shows a separator after every item except the last one. */}
            {!breadcrumbItemIsLast && <ChevronRight size={16} />}
          </div>
        );
      })}
    </nav>
  );
}
