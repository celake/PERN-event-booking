import { Request, Response, RequestHandler } from 'express';

const getUserDashboard: RequestHandler = (req: Request, res: Response) => {
    res.send("This if the dashboard for user")
};

const updateUserProfile: RequestHandler = (req: Request, res: Response) => {
    // send data to database
    // get id from body passed in from checkAuth
    // get data from form
    // call updateUser Profile with data
    res.send("This page is for updating the user's profile")
};

const deleteUserProfile: RequestHandler = (req: Request, res: Response) => {
    res.send("This is a button that will log the user out and delete the user's profile and then send you to the main page")
};

const getUserFavorites: RequestHandler = (req: Request, res: Response) => {
    res.send("This is a list of the favorites for the logged in user")
};

const addEventToFavorites: RequestHandler = (req: Request, res: Response) => {
    res.send("This button will add the current event to the user's favorites")
};

const removeEventFromFavorites: RequestHandler = (req: Request, res: Response) => {
    res.send("This route will remove the favorite from the user's favorites list")
};



export { getUserDashboard, 
         updateUserProfile, 
         deleteUserProfile, 
         getUserFavorites, 
         addEventToFavorites, 
         removeEventFromFavorites 
        }