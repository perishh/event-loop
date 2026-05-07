/*
 * =========================================================================
 * FILE         :   lib/pending_email.ts
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Temporary server-memory storage for the last email used
 *                  in the register flow before real backend storage exists.
 * =========================================================================
 */


/* Stores the last pending registration email while the server is running. */
let temporaryPendingEmail = "";


/**
 * @brief Updates the temporary pending email.
 * @param newTemporaryPendingEmail the email submitted from the register form.
 */
export function setTemporaryPendingEmail(newTemporaryPendingEmail: string) {
    /* Stores the latest submitted email in server memory. */
    temporaryPendingEmail = newTemporaryPendingEmail;
}


/**
 * @brief Returns the current temporary pending email.
 * @return The latest submitted pending email.
 */
export function getTemporaryPendingEmail() {
    /* Returns the current temporary email value. */
    return temporaryPendingEmail;
}

