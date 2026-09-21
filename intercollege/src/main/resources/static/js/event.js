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

        const response =
            await fetch(`/api/events/${eventId}`);


        if (!response.ok) {
            throw new Error("Event not found");
        }


        const event =
            await response.json();


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

                <a
                    href="${event.registrationLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn registration-button"
                >
                    Register for Event
                </a>

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