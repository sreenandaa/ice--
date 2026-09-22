async function loadEvent() {

    const params =
        new URLSearchParams(window.location.search);

    const eventId =
        params.get("id");


    if (!eventId) {

        document.getElementById("eventDetails")
            .innerHTML =
            "<p>Event not found.</p>";

        return;
    }


    try {

        // ==============================
        // LOAD LOGGED-IN USER
        // ==============================

        const profileResponse =
            await fetch("/api/auth/profile");


        if (!profileResponse.ok) {

            window.location.href =
                "login.html";

            return;
        }


        const currentUser =
            await profileResponse.json();
        const backButton =
    document.getElementById("backToDashboard");

if (currentUser.role === "STUDENT") {

    backButton.href =
        "student-dashboard.html";

} else if (currentUser.role === "COORDINATOR") {

    backButton.href =
        "coordinator-dashboard.html";
}


        // ==============================
        // LOAD EVENT
        // ==============================

        const response =
            await fetch(`/api/events/${eventId}`);


        if (!response.ok) {

            throw new Error(
                "Event not found"
            );
        }


        const event =
            await response.json();


        // ==============================
        // REGISTER BUTTON
        // ONLY FOR STUDENTS
        // ==============================

        let registrationButton = "";


        if (
            currentUser.role === "STUDENT" &&
            event.registrationLink
        ) {

            registrationButton = `

                <a
                    href="${event.registrationLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn registration-button"
                >
                    Register for Event
                </a>

            `;
        }


        // ==============================
        // DISPLAY EVENT
        // ==============================

        document.getElementById("eventDetails")
            .innerHTML = `

            <div class="event-detail-card card">

                <span class="event-category">
                    ${event.category}
                </span>

                <h1>
                    ${event.name}
                </h1>

                <p class="detail">
                    🏫 ${event.college}
                </p>

                <p class="detail">
                    📅 ${event.date}
                </p>

                <p class="detail">
                    ⏰ ${event.startTime}
                    -
                    ${event.endTime}
                </p>

                <p class="detail">
                    📍 ${event.venue},
                    ${event.city}
                </p>

                <p class="description">
                    ${event.description}
                </p>

                <p class="detail">
                    Organized by:
                    ${event.organizer}
                </p>

                <p class="detail">
                    Contact:
                    ${event.contact}
                </p>

                ${registrationButton}

            </div>

        `;

    } catch (error) {

        console.error(error);

        document.getElementById("eventDetails")
            .innerHTML =
            "<p>Unable to load event.</p>";
    }
}


loadEvent();