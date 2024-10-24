export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const saveUserToLocalStorage = (email, password, branch) => {
  const userId = `user_${new Date().getTime()}`;
  const newUser = { id: userId, email, password, branch };

  const users = JSON.parse(localStorage.getItem("users")) || {};

  users[email] = newUser;

  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
};

export const authenticateUser = (email, password, branch) => {
  // Retrieve users from local storage
  console.log(branch);

  const users = JSON.parse(localStorage.getItem("users")) || {};

  // Check if user exists
  if (!users[email]) {
    console.log("User not found:", email); // Debugging log
    return { success: false, message: "User not found" };
  }

  const user = users[email];

  // Validate password and branch
  if (user.password === password) {
    if (user.branch === branch) {
      localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
      console.log("Authentication successful for user:", user); // Debugging log
      return { success: true, user };
    } else {
      console.log("Invalid branch:", branch); // Debugging log
      return { success: false, message: "Invalid branch" };
    }
  } else {
    console.log("Invalid password for user:", email); // Debugging log
    return { success: false, message: "Invalid password" };
  }
};
