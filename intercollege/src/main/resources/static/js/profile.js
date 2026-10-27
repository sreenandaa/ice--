// ========================================
// LOAD PROFILE
// ========================================

async function loadProfile() {

    const message =
        document.getElementById(
            "profileMessage"
        );


    try {

        const response =
            await fetch(
                "/api/auth/profile"
            );


        if (!response.ok) {

            window.location.href =
                "login.html";

            return;
        }


        const user =
            await response.json();


        // Fill profile information

        document.getElementById(
            "profileName"
        ).textContent =
            user.name || "-";


        document.getElementById(
            "profileUsername"
        ).textContent =
            user.username || "-";


        document.getElementById(
            "profileRole"
        ).textContent =
            user.role || "-";


        document.getElementById(
            "profileCollege"
        ).textContent =
            user.college || "-";


        document.getElementById(
            "profileLocation"
        ).textContent =
            user.location || "-";


        const interests =
            document.getElementById(
                "profileInterests"
            );


        if (
            Array.isArray(user.interests) &&
            user.interests.length > 0
        ) {

            interests.textContent =
                user.interests.join(", ");

        } else {

            interests.textContent =
                "No interests added";
        }


        // Change dashboard link according to role

        const backLink =
            document.getElementById(
                "backToDashboard"
            );


        if (
            user.role === "COORDINATOR"
        ) {

            backLink.href =
                "coordinator-dashboard.html";

        } else {

            backLink.href =
                "student-dashboard.html";
        }


        message.style.display =
            "none";


        document.getElementById(
            "profileInfo"
        ).style.display =
            "block";


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        message.textContent =
            "Unable to load profile.";

        message.className =
            "profile-message error";
    }
}


// ========================================
// LOGOUT
// ========================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/api/auth/logout",
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Logout failed"
                    );
                }


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to logout. Please try again."
                );
            }
        }
    );
}


// ========================================
// START
// ========================================

loadProfile();

setupLogout();