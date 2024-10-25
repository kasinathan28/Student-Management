export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const saveUserToLocalStorage = (email, password, branch) => {
  const userId = `user_${new Date().getTime()}`;
  const newUser = { id: userId, email, password, branch };

  const userData = {
    isUserLoggedIn: true,
    branch: branch,
  };
  const users = JSON.parse(localStorage.getItem("users")) || {};

  users[email] = newUser;

  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("isUserLoggedIn", userData);
};

export const authenticateUser = (email, password, branch) => {
  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[email]) {
    return { success: false, message: "User not found" };
  }

  const user = users[email];

  if (user.password !== password) {
    return { success: false, message: "Invalid password" };
  }

  if (user.branch !== branch) {
    console.log("Invalid branch:", branch);
    return { success: false, message: "Invalid branch" };
  }

  const userData = {
    userId: user.id,
    isUserLoggedIn: true,
    branch: branch,
  };

  localStorage.setItem("isUserLoggedIn", JSON.stringify(userData));

  return { success: true, user };
};
