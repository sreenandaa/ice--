const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        try {

            const response = await fetch("/api/auth/logout", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert("Unable to logout. Please try again.");

        }

    });

}