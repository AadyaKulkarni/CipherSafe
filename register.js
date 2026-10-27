const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    const errorMessage =
        document.getElementById("errorMessage");


    // Clear previous error

    errorMessage.textContent = "";


    // Check empty fields

    if (
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        errorMessage.textContent =
            "Please fill in all fields.";

        return;
    }


    // Check username length

    if (username.length < 3) {

        errorMessage.textContent =
            "Username must contain at least 3 characters.";

        return;
    }


    // Check password length

    if (password.length < 6) {

        errorMessage.textContent =
            "Password must contain at least 6 characters.";

        return;
    }


    // Check password confirmation

    if (password !== confirmPassword) {

        errorMessage.textContent =
            "Passwords do not match.";

        return;
    }


    // Check if an account already exists

    const existingUser =
        localStorage.getItem("cipherSafeUser");


    if (existingUser) {

        const user = JSON.parse(existingUser);


        if (user.username === username) {

            errorMessage.textContent =
                "Username already exists.";

            return;
        }


        if (user.email === email) {

            errorMessage.textContent =
                "Email is already registered.";

            return;
        }

    }


    // Create user object

    const user = {

        username: username,

        email: email,

        password: password

    };


    // TEMPORARY FRONTEND STORAGE
    // This will later be replaced by backend/database

    localStorage.setItem(
        "cipherSafeUser",
        JSON.stringify(user)
    );


    alert("Registration successful!");


    // Go to login page

    window.location.href = "index.html";

});