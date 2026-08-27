export const getCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser !== null || currentUser !== undefined) {
    return currentUser;
  }
};
