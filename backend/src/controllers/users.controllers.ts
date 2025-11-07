export { getUserDashboard, updateUserProfile, deleteUserProfile, getUserFavorites, addEventToFavorites, removeEventFromFavorites }import { Request, Response, RequestHandler } from 'express';
import { getUser, updateUserProfile, deleteUser, getFavorites, addFavorite, removeFavorite } from '../services/users.services.js';


const getUserDashboard: RequestHandler = async(req: Request, res: Response) => {
    const userId: number = req.userId!
    
    try {
        const user = await getUser(userId);
        if (!user) {
            res.status(400).json({message: "Error loading user dashboard"})
        } else {
            res.status(201).json({ 
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
           })
        } 
    } catch (error) {
        console.log("Error in dashboard controller", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
    const userId: number = req.userId!;
    try {
        const data = req.body;
        if (!data) {
            res.status(400).json({message: "Form data is empty"})
        }
        const result = await updateUserProfile(data, userId)
        res.status(200).json({ 
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email
        })
    } catch (error) {
        console.log("Error updating user: ", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const deleteUserProfile: RequestHandler = async (req: Request, res: Response) => {
    const userId: number = req.userId!;
    console.log({userId})
    try {
        const success = await deleteUser(userId);

        if (success) {
            res.cookie("jwt", "", {
                maxAge:0,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV != "development"
            });

            res.status(204).send();
        } else {
            res.status(400).json({message: "Error deleting users, services returned false"});
        }
    } catch (error) {
        console.log("Error deleting user: ", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const getUserFavorites: RequestHandler = async (req: Request, res: Response) => {
    const userId: number = req.userId!;
    try {
        const result = await getFavorites(userId);
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        console.log("Controller error getting favorites: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const addEventToFavorites: RequestHandler = async(req: Request, res: Response) => {
    const userId: number = req.userId!;
    const { eventId } = req.body;
    console.log({eventId})
    try {
        const success = await addFavorite(userId, eventId);
        if (success) {
            res.status(204).send();
        }

    } catch (error) {
        console.log("Controller error adding favorite: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const removeEventFromFavorites: RequestHandler =  async(req: Request, res: Response) => {
    const userId: number = req.userId!;
    const { eventId } = req.body;
    try {
        const success = await removeFavorite(userId, eventId);
        if (success) {
            res.status(204).send();
        }
    } catch (error) {
        console.log("Controller error removing favorite: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export { getUserDashboard, 
         updateUser, 
         deleteUserProfile, 
         getUserFavorites, 
         addEventToFavorites, 
         removeEventFromFavorites 
        }