document.addEventListener("DOMContentLoaded", function () {
  const userInfoContainer = document.getElementById("dynamic-user-info");
  const userIcon = document.createElement("img"); // Create the image element dynamically
  userIcon.id = "user-icon"; // Set the ID for the image

  // Function to handle user information display
  function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // For anonymous users
      userIcon.src = "assets/images/user.png"; // Set the anonymous image
      userIcon.alt = "Anonymous User";
      userIcon.title = "You are browsing as Anonymous";
      userInfoContainer.innerHTML = ` 
        <div class="user-dropdown">
          <div class="dropdown-menu" id="dropdown-menu">
            <a href="login.html" class="dropdown-item">Login</a>
            <a href="register.html" class="dropdown-item">Register</a>
          </div>
        </div>
      `;
    } else {
      // For logged-in users
      userIcon.src = user.profileImage || "assets/images/user.png"; // Set profile image
      userIcon.alt = "User Image";
      userIcon.title = "Welcome, " + user.name;
      userInfoContainer.innerHTML = `
        <div class="user-dropdown">
          <div class="dropdown-menu" id="dropdown-menu">
            <span class="dropdown-item" id="username">Welcome, <strong>${user.name}</strong></span>
            <a href="profile.html" class="dropdown-item">Profile</a>
            <a href="#" id="logout" class="dropdown-item">Logout</a>
          </div>
        </div>
      `;
    }

    // Append the user icon to the userInfoContainer
    userInfoContainer.insertBefore(userIcon, userInfoContainer.firstChild);

    // Add toggle functionality for the dropdown
    const dropdownMenu = document.getElementById("dropdown-menu");
    userIcon.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!userInfoContainer.contains(event.target)) {
        dropdownMenu.classList.remove("show");
      }
    });

    // Logout functionality
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        updateUserInfo(); // Refresh the navbar after logout
      });
    }
  }

  // Initialize the user info
  updateUserInfo();
});
