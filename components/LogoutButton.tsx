"use client";

import { signOut } from "@/app/logout/actions";

/**
 * @brief Renders the logout button used inside the profile dropdown.
 */
export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="eventloop-profile-dropdown-link eventloop-profile-dropdown-button"
    >
      Αποσύνδεση
    </button>
  );
}
