let currentUser = null;


// ==============================
// LOAD USER
// ==============================

async function loadUser() {

    const response =
        await fetch("/api/auth/profile");


    if (!response.ok) {

        window.location.href =
            "login.html";

        return null;
    }


    const user =
        await response.json();


    // Only coordinators allowed

    if (user.role !== "COORDINATOR") {

        window.location.href =
            "student-dashboard.html";

        return null;
    }


    return user;
}


// ==============================
// CREATE EVENT
// ==============================

async function createEvent(event) {

    event.preventDefault();


    const eventData = {

        name:
            document.getElementById(
                "eventName"
            ).value.trim(),

        description:
            document.getElementById(
                "description"
            ).value.trim(),

        college:
            document.getElementById(
                "college"
            ).value.trim(),

        category:
            document.getElementById(
                "category"
            ).value,

        date:
            document.getElementById(
                "date"
            ).value,

        startTime:
            document.getElementById(
                "startTime"
            ).value,

        endTime:
            document.getElementById(
                "endTime"
            ).value,

        venue:
            document.getElementById(
                "venue"
            ).value.trim(),

        city:
            document.getElementById(
                "city"
            ).value.trim(),

        latitude:
            Number(
                document.getElementById(
                    "latitude"
                ).value
            ) || 0,

        longitude:
            Number(
                document.getElementById(
                    "longitude"
                ).value
            ) || 0,

        registrationLink:
            document.getElementById(
                "registrationLink"
            ).value.trim(),

        organizer:
            document.getElementById(
                "organizer"
            ).value.trim(),

        contact:
            document.getElementById(
                "contact"
            ).value.trim(),

        imageUrl:
            document.getElementById(
                "imageUrl"
            ).value.trim(),

        maxParticipants:
            document.getElementById(
                "maxParticipants"
            ).value
                ? Number(
                    document.getElementById(
                        "maxParticipants"
                    ).value
                )
                : null

    };


    try {

        const response =
            await fetch(
                "/api/events",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            eventData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not create event"
            );
        }


        document.getElementById(
            "eventMessage"
        ).textContent =
            "Event created successfully!";


        document.getElementById(
            "eventForm"
        ).reset();


        await loadEvents();


    } catch (error) {

        console.error(error);

        document.getElementById(
            "eventMessage"
        ).textContent =
            "Failed to create event.";

    }

}


// ==============================
// LOAD EVENTS
// ==============================

async function loadEvents() {

    try {

        const response =
            await fetch(
                "/api/events"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load events"
            );
        }


        const events =
            await response.json();


        const container =
            document.getElementById(
                "eventsContainer"
            );


        container.innerHTML = "";


        events.forEach(event => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <h3>
                    ${event.name}
                </h3>

                <p>
                    <strong>
                        Category:
                    </strong>

                    ${event.category}
                </p>

                <p>
                    <strong>
                        Date:
                    </strong>

                    ${event.date}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>

                    ${event.city}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>

                    ${event.status}
                </p>

                <a
                    href="event.html?id=${event.id}"
                    class="btn"
                >
                    View Event
                </a>

            `;


            container.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(error);

    }

}


// ==============================
// INITIALIZE
// ==============================

async function initialize() {

    currentUser =
        await loadUser();


    if (!currentUser) {
        return;
    }


    document.getElementById(
        "coordinatorWelcome"
    ).textContent =
        `Welcome, ${currentUser.name}!`;


    document.getElementById(
        "eventForm"
    ).addEventListener(
        "submit",
        createEvent
    );


    await loadEvents();

}


document.addEventListener(
    "DOMContentLoaded",
    initialize
);