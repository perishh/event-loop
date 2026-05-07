/*
 * =========================================================================
 * FILE         :   app/api/pending-email/route.ts
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Temporary API route used only to keep the latest pending
 *                  register email in server memory.
 * =========================================================================
 */


/* Imports the Next.js request type. */
import { NextRequest, NextResponse } from "next/server";

/* Imports the temporary pending email helpers. */
import { getTemporaryPendingEmail, setTemporaryPendingEmail } from "../../../lib/pending_email";


/* Forces this temporary route to always read fresh server memory. */
export const dynamic = "force-dynamic";


/**
 * @brief Defines the expected body of the temporary pending email request.
 */
type Pending_Email_Request_Body = {
    /* Stores the submitted email. */
    email?: string;
};


/**
 * @brief Stores the submitted pending email in temporary server memory.
 * @param pendingEmailRequest the incoming POST request.
 * @return A JSON response with the stored email.
 */
export async function POST(pendingEmailRequest: NextRequest) {
    /* Reads the JSON body from the request. */
    const pendingEmailRequestBody = await pendingEmailRequest.json() as Pending_Email_Request_Body;

    /* Stores the submitted email as clean text. */
    const submittedPendingEmail = String(pendingEmailRequestBody.email ?? "").trim();

    /* Checks that the submitted email is not empty. */
    if (submittedPendingEmail === "") {
        /* Returns an error response for an empty email. */
        return NextResponse.json(
            { message: "Το email δεν μπορεί να είναι κενό." },
            { status: 400 }
        );
    }

    /* Stores the submitted email in temporary server memory. */
    setTemporaryPendingEmail(submittedPendingEmail);

    /* Returns the stored email. */
    return NextResponse.json({ email: submittedPendingEmail });
}


/**
 * @brief Returns the current temporary pending email.
 * @return A JSON response with the current pending email.
 */
export function GET() {
    /* Returns the latest pending email from temporary server memory. */
    return NextResponse.json({ email: getTemporaryPendingEmail() });
}


