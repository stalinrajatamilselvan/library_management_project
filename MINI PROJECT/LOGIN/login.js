// =====================================
// STATIC ADMIN USER
// =====================================

const adminUser = {

    email: "stalin@gmail.com",

    password: "stalin@123",

    role: "Admin"

};


// =====================================
// LOGIN FORM
// =====================================

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get email
        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        // Get password
        const password =
            document
                .getElementById("loginPassword")
                .value;


        // Get registered user
        const registeredUser =
            JSON.parse(
                localStorage.getItem("registeredUser")
            ) || null;


        // Check Admin
        const isAdmin =
            email === adminUser.email &&
            password === adminUser.password;


        // Check Registered User
        const isRegisteredUser =
            registeredUser &&
            email === registeredUser.email &&
            password === registeredUser.password;


        // =====================================
        // LOGIN SUCCESS
        // =====================================

        if (isAdmin || isRegisteredUser) {

            const currentUser =
                isAdmin
                    ? adminUser
                    : registeredUser;


            // Save currently logged-in user
            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );


            alert(
                "Login successful! Welcome " +
                (currentUser.name || "Admin") +
                "."
            );


            // Open Dashboard
            window.location.href = "../DASHBOARD/dashboard.html";

        }


        // =====================================
        // LOGIN FAILED
        // =====================================

        else {

            alert(
                "Invalid email or password!"
            );

        }

    });


// =====================================
// BACK TO HOME
// =====================================

document
    .getElementById("backHomeBtn")
    .addEventListener("click", function () {

        window.location.href = "../index.html";

    });