// ==============================
// REGISTER
// ==============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        const college = document.getElementById("college").value.trim();
        const location = document.getElementById("location").value.trim();

        // Convert "AI, Web Development, Robotics"
        // into ["AI", "Web Development", "Robotics"]
        const interestsText =
            document.getElementById("interests").value;

        const interests = interestsText
            .split(",")
            .map(interest => interest.trim())
            .filter(interest => interest.length > 0);

        try {

            const response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    role: role,
                    college: college,
                    location: location,
                    interests: interests
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            document.getElementById("registerMessage").textContent =
                "Registration successful! Redirecting to login...";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {

            console.error(error);

            document.getElementById("registerMessage").textContent =
                error.message;
        }

    });
}


// ==============================
// LOGIN
// ==============================

// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const loginMessage =
            document.getElementById("loginMessage");

        try {

            const loginResponse = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })

            });

            if (!loginResponse.ok) {

                const errorData =
                    await loginResponse.json()
                        .catch(() => ({}));

                throw new Error(
                    errorData.message ||
                    "Invalid username or password"
                );
            }


            // Get the logged-in user's details
            const profileResponse =
                await fetch("/api/auth/profile");


            if (!profileResponse.ok) {

                throw new Error(
                    "Could not load user profile"
                );
            }


            const user =
                await profileResponse.json();


            loginMessage.textContent =
                "Login successful! Redirecting...";


            // Redirect according to role

            if (user.role === "COORDINATOR") {

                window.location.href =
                    "coordinator-dashboard.html";

            } else {

                window.location.href =
                    "student-dashboard.html";
            }


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                error.message;
        }

    });

}