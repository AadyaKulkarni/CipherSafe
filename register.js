
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (!username || !email || !password || !confirmPassword) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }

    if (username.length < 3) {
        errorMessage.textContent = "Username must contain at least 3 characters.";
        return;
    }

    if (password.length < 8) {
        errorMessage.textContent = "Password must contain at least 8 characters.";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            errorMessage.textContent =
                typeof result.detail === "string"
                    ? result.detail
                    : "Registration failed. Check your details and try again.";
            return;
        }

        alert("Registration successful! Please log in.");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Registration request failed:", error);
        errorMessage.textContent =
            "Cannot connect to the server. Make sure the CipherSafe backend is running.";
    }
});
