export const logoutUser = () => {
  localStorage.removeItem("isUserLoggedIn");
};
