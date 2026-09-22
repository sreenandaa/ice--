const eventForm = document.getElementById("eventForm");

eventForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const eventData = {

        name: document.getElementById("name").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        college:
            document.getElementById("college").value.trim(),

        category:
            document.getElementById("category").value,

        date:
            document.getElementById("date").value,

        startTime:
            document.getElementById("startTime").value,

        endTime:
            document.getElementById("endTime").value,

        venue:
            document.getElementById("venue").value.trim(),

        city:
            document.getElementById("city").value.trim(),

        registrationLink:
            document.getElementById("registrationLink").value.trim(),

        organizer:
            document.getElementById("organizer").value.trim(),

        contact:
            document.getElementById("contact").value.trim()
    };

    try {

        const response = await fetch("/api/events", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(eventData)

        });

        if (!response.ok) {

            const message = await response.text();

            throw new Error(
                message || "Could not create event"
            );
        }

        const createdEvent = await response.json();

        document.getElementById("eventMessage").textContent =
            "Event added successfully!";

        eventForm.reset();

        console.log("Created event:", createdEvent);

    } catch (error) {

        console.error(error);

        document.getElementById("eventMessage").textContent =
            "Unable to add event: " + error.message;
    }

});


/* Logout */

const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "/api/auth/logout",
            {
                method: "POST"
            }
        );

        if (response.ok) {
            window.location.href = "login.html";
        }

    } catch (error) {

        console.error(error);

    }

});