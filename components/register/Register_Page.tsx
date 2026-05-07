"use client";

/*
 * =========================================================================
 * FILE         :   components/register/Register_Page.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Register page content component.
 *                  Displays the Greek registration form used by visitors.
 * =========================================================================
 */


/* Imports the router hook used for temporary redirect after register validation. */
import { useRouter } from "next/navigation";

/* Imports the form event type used by the register form submit handler. */
import type { FormEvent } from "react";

/* Imports the state hook used for the temporary register error message. */
import { useState } from "react";

/* Imports the shared breadcrumb component. */
import EventLoop_Breadcrumb from "../breadcrumb/EventLoop_Breadcrumb";


/**
 * @brief Defines the structure of each temporary register form field.
 */
type Register_Field = {
    /* Stores the unique HTML id of the field. */
    id: string;

    /* Stores the submitted name of the field. */
    name: string;

    /* Stores the visible Greek label of the field. */
    label: string;

    /* Stores the HTML input type of the field. */
    type: string;
};


/**
 * @brief Stores the left column fields of the register form.
 */
const leftRegisterFields: Register_Field[] = [
    /* Stores the username field. */
    { id: "register-username", name: "username", label: "Όνομα χρήστη", type: "text" },

    /* Stores the password field. */
    { id: "register-password", name: "password", label: "Κωδικός χρήστη", type: "password" },

    /* Stores the password confirmation field. */
    { id: "register-confirm-password", name: "confirmPassword", label: "Επιβεβαίωση κωδικού χρήστη", type: "password" },

    /* Stores the first name field. */
    { id: "register-first-name", name: "firstName", label: "Όνομα", type: "text" },

    /* Stores the last name field. */
    { id: "register-last-name", name: "lastName", label: "Επώνυμο", type: "text" },

    /* Stores the tax identification number field. */
    { id: "register-tax-number", name: "taxNumber", label: "ΑΦΜ", type: "text" },
];


/**
 * @brief Stores the right column fields of the register form.
 */
const rightRegisterFields: Register_Field[] = [
    /* Stores the email field. */
    { id: "register-email", name: "email", label: "Email", type: "email" },

    /* Stores the phone field. */
    { id: "register-phone", name: "phone", label: "Τηλέφωνο", type: "tel" },

    /* Stores the country field. */
    { id: "register-country", name: "country", label: "Χώρα", type: "text" },

    /* Stores the city field. */
    { id: "register-city", name: "city", label: "Πόλη", type: "text" },

    /* Stores the address field. */
    { id: "register-address", name: "address", label: "Διεύθυνση", type: "text" },

    /* Stores the postal code field. */
    { id: "register-postal-code", name: "postalCode", label: "Ταχυδρομικός Κώδικας", type: "text" },
];


/**
 * @brief Stores all register fields for validation.
 */
const allRegisterFields = [...leftRegisterFields, ...rightRegisterFields];


/**
 * @brief Returns a trimmed form field value.
 * @param registerFormData the submitted register form data.
 * @param fieldName the name of the requested form field.
 * @return The cleaned text value of the field.
 */
function getRegisterFieldValue(registerFormData: FormData, fieldName: string) {
    /* Reads the requested field value and converts it to clean text. */
    return String(registerFormData.get(fieldName) ?? "").trim();
}


/**
 * @brief  Renders one register input field.
 * @param  registerField  the field data that defines the input.
 * @return The JSX structure of one register field.
 */
function Register_Input_Field({ registerField }: { registerField: Register_Field }) {
    /* Returns one register input field. */
    return (
        /* Register field wrapper that reuses the login field interaction style. */
        <div className="eventloop-login-field eventloop-register-field">
            {/* Register field label. */}
            <label htmlFor={registerField.id} className="eventloop-login-label">
                {/* Prints the field label. */}
                {registerField.label}
            </label>

            {/* Register input field. */}
            <input
                id={registerField.id}
                name={registerField.name}
                type={registerField.type}
                placeholder=" "
                className="eventloop-login-input"
            />
        </div>
    );
}


/**
 * @brief  Renders the register form content.
 * @return The JSX structure of the register page content.
 */
export default function Register_Page() {
    /* Stores the Next.js router instance used for navigation. */
    const router = useRouter();

    /* Stores the temporary register error message. */
    const [registerErrorMessage, setRegisterErrorMessage] = useState("");

    /**
     * @brief Handles temporary register validation before going to pending page.
     * @param registerFormEvent the submitted register form event.
     */
    async function handleTemporaryRegister(registerFormEvent: FormEvent<HTMLFormElement>) {
        /* Prevents the browser from reloading the page after form submission. */
        registerFormEvent.preventDefault();

        /* Clears any previous register error message. */
        setRegisterErrorMessage("");

        /* Stores the submitted register form data. */
        const registerFormData = new FormData(registerFormEvent.currentTarget);

        /* Checks every register field for an empty value. */
        for (const registerField of allRegisterFields) {
            /* Stores the current field value. */
            const currentRegisterFieldValue = getRegisterFieldValue(registerFormData, registerField.name);

            /* Checks if the current field is empty. */
            if (currentRegisterFieldValue === "") {
                /* Shows an error message for missing fields. */
                setRegisterErrorMessage("Συμπληρώστε όλα τα πεδία.");

                /* Stops the temporary register process. */
                return;
            }
        }

        /* Stores the submitted password. */
        const submittedPassword = getRegisterFieldValue(registerFormData, "password");

        /* Stores the submitted password confirmation. */
        const submittedConfirmPassword = getRegisterFieldValue(registerFormData, "confirmPassword");

        /* Checks that the two password fields match. */
        if (submittedPassword !== submittedConfirmPassword) {
            /* Shows an error message for mismatched passwords. */
            setRegisterErrorMessage("Οι δύο κωδικοί χρήστη δεν ταιριάζουν.");

            /* Stops the temporary register process. */
            return;
        }

        /* Stores the submitted email. */
        const submittedEmail = getRegisterFieldValue(registerFormData, "email");

        /* Checks that the email has a simple valid format. */
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submittedEmail)) {
            /* Shows an error message for invalid email format. */
            setRegisterErrorMessage("Το email δεν έχει σωστή μορφή.");

            /* Stops the temporary register process. */
            return;
        }

        /* Stores the submitted tax number. */
        const submittedTaxNumber = getRegisterFieldValue(registerFormData, "taxNumber");

        /* Checks that the tax number has exactly nine digits. */
        if (!/^\d{9}$/.test(submittedTaxNumber)) {
            /* Shows an error message for invalid tax number format. */
            setRegisterErrorMessage("Το ΑΦΜ πρέπει να έχει 9 ψηφία.");

            /* Stops the temporary register process. */
            return;
        }

        /* Stores the submitted postal code. */
        const submittedPostalCode = getRegisterFieldValue(registerFormData, "postalCode");

        /* Checks that the postal code has exactly five digits. */
        if (!/^\d{5}$/.test(submittedPostalCode)) {
            /* Shows an error message for invalid postal code format. */
            setRegisterErrorMessage("Ο ταχυδρομικός κώδικας πρέπει να έχει 5 ψηφία.");

            /* Stops the temporary register process. */
            return;
        }

        /* Sends the submitted email to temporary server memory. */
        const pendingEmailResponse = await fetch("/api/pending-email", {
            /* Uses POST because the email value is updated. */
            method: "POST",

            /* Sends JSON data to the temporary API route. */
            headers: { "Content-Type": "application/json" },

            /* Sends only the email, not the whole user. */
            body: JSON.stringify({ email: submittedEmail }),
        });

        /* Checks if the temporary email storage failed. */
        if (!pendingEmailResponse.ok) {
            /* Shows a generic temporary error message. */
            setRegisterErrorMessage("Η προσωρινή αποστολή του email απέτυχε.");

            /* Stops the temporary register process. */
            return;
        }

        /* Sends the user to the pending approval page. */
        router.push("/register/pending");
    }

    /* Returns the visible register page content. */
    return (
        /* Page content area below the shared header. */
        <section className="eventloop-register-page-content">
            {/* Renders the register page breadcrumb. */}
            <EventLoop_Breadcrumb
                /* Shows the current register page location. */
                breadcrumbItems={[
                    { label: "Αρχική", href: "/" },
                    { label: "Εγγραφή", href: "/register" },
                ]}
            />
            
            {/* Greek register page title. */}
            <h1 className="eventloop-register-page-title">
                Δημιουργήστε νέο λογαριασμό:
            </h1>

            {/* Register form and action button wrapper. */}
            <div className="eventloop-register-form-wrapper">
                {/* Register card that contains the two-column input layout. */}
                <form
                    id="eventloop-register-form"
                    className="eventloop-register-card"
                    onSubmit={handleTemporaryRegister}
                    noValidate
                >
                    {/* Left column of the register form. */}
                    <div className="eventloop-register-column">
                        {/* Creates one input field for each left column field. */}
                        {leftRegisterFields.map((registerField) => (
                            <Register_Input_Field key={registerField.id} registerField={registerField} />
                        ))}
                    </div>

                    {/* Right column of the register form. */}
                    <div className="eventloop-register-column">
                        {/* Creates one input field for each right column field. */}
                        {rightRegisterFields.map((registerField) => (
                            <Register_Input_Field key={registerField.id} registerField={registerField} />
                        ))}
                    </div>
                </form>

                {/* Shows the temporary register error message when needed. */}
                {registerErrorMessage !== "" && (
                    <p className="eventloop-register-error-message">
                        {registerErrorMessage}
                    </p>
                )}

                {/* Continue button that submits the register form. */}
                <button
                    form="eventloop-register-form"
                    type="submit"
                    className="eventloop-register-submit-button"
                >
                    {/* Prints the button label. */}
                    Συνέχεια
                </button>
            </div>
        </section>
    );
}



