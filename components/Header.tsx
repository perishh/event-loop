import Image from "next/image";
import Link from "next/link";

/**
 * @brief Stores the category labels used in the desktop navigation and
 *        in the responsive dropdown menu.
 */
const navigationCategories = [
  "Μουσική",
  "Θέατρο",
  "Αθλητικά",
  "Σινεμά",
  "Festivals",
  "Περισσότερα",
];

/**
 * @brief  Renders the authentication area for a visitor that is not logged in.
 * @return The JSX structure of the guest authentication links.
 */
function GuestAuthenticationLinks() {
  return (
    <div className="eventloop-authentication-links">
      <Link
        href="/login"
        className="eventloop-header-link eventloop-authentication-link"
      >
        Σύνδεση
      </Link>

      <Link
        href="/register"
        className="eventloop-header-link eventloop-authentication-link"
      >
        Εγγραφή
      </Link>
    </div>
  );
}

/**
 * @brief  Renders the authentication area for a temporary logged-in user.
 * @return The JSX structure of the logged-in user links.
 */
function LoggedInUserLinks({ onDummyLogout }: { onDummyLogout: () => void }) {
  return (
    <div className="eventloop-authentication-links">
      <Link
        href="#"
        className="eventloop-header-link eventloop-authentication-link"
      >
        {/*Μηνύματα ({dummyUser.unreadMessagesCount})*/}
      </Link>

      <div className="eventloop-profile-dropdown">
        <button
          type="button"
          className="eventloop-header-link eventloop-authentication-link eventloop-profile-button"
        >
          <span className="eventloop-profile-button-text">Προφίλ</span>

          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="eventloop-profile-icon"
          >
            <circle cx="12" cy="8" r="4" />

            <path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21" />
          </svg>
        </button>

        <div className="eventloop-profile-dropdown-panel">
          {/*<div className="eventloop-profile-username">{dummyUser.username}</div>*/}

          <button
            type="button"
            onClick={onDummyLogout}
            className="eventloop-profile-dropdown-link eventloop-profile-dropdown-button"
          >
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
export default function Header() {
  return (
    <nav className="eventloop-header-bar">
      <Link href="/" className="eventloop-logo-link">
        <Image
          src="/logo/EventLoop_LOGO.png"
          alt="Λογότυπο EventLoop"
          width={2048}
          height={1054}
          priority
          className="eventloop-logo"
        />
      </Link>

      <div className="eventloop-category-dropdown">
        <button type="button" className="eventloop-dropdown-button">
          Κατηγορίες
        </button>

        <div className="eventloop-dropdown-panel">
          {navigationCategories.map((navigationCategory) => (
            <Link
              key={navigationCategory}
              href="#"
              className="eventloop-dropdown-link"
            >
              {navigationCategory}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop navigation area that contains the event categories. */}
      <nav className="eventloop-desktop-navigation">
        {navigationCategories.map((navigationCategory) => (
          <Link
            key={navigationCategory}
            href="#"
            className="eventloop-header-link"
          >
            {navigationCategory}
          </Link>
        ))}
      </nav>

      <div className="eventloop-header-right-section">
        <div className="eventloop-search-box">
          <input
            type="text"
            placeholder="Αναζήτηση"
            className="eventloop-search-input"
          />

          <span className="eventloop-search-icon">⌕</span>
        </div>

        {/*{dummyUserIsLoggedIn ? (
          <Logged_In_User_Links onDummyLogout={handleDummyLogout} />
        ) : (
        )}*/}
        <GuestAuthenticationLinks />
      </div>
    </nav>
  );
}
