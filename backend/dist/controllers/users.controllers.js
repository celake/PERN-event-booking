const getUserDashboard = (req, res) => {
    res.send("This if the dashboard for user");
};
const updateUserProfile = (req, res) => {
    res.send("This page is for updating the user's profile");
};
const deleteUserProfile = (req, res) => {
    res.send("This is a button that will log the user out and delete the user's profile and then send you to the main page");
};
const getUserFavorites = (req, res) => {
    res.send("This is a list of the favorites for the logged in user");
};
const addEventToFavorites = (req, res) => {
    res.send("This button will add the current event to the user's favorites");
};
const removeEventFromFavorites = (req, res) => {
    res.send("This route will remove the favorite from the user's favorites list");
};
export { getUserDashboard, updateUserProfile, deleteUserProfile, getUserFavorites, addEventToFavorites, removeEventFromFavorites };
