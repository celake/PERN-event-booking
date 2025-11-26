import { Request, Response, RequestHandler } from 'express';
import { getUserFromDb, updateUserProfile, deleteUser, getFavoritesFromDb, addFavoriteInDb, removeFavoriteInDb } from '../services/users.services.js';
import { DatabaseError } from '../lib/errors.js';
import { isValidObject } from '../lib/utils.js';
const getUserDashboard: RequestHandler = async(req: Request, res: Response) => {
    const userId: number = req.userId!
    
    try {
        const user = await getUserFromDb(userId);
        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUserDashboard controller", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const data = req.body;
        if (!isValidObject(data)) {
            res.status(400).json({message: "Form data is empty"})
        }
        const user = await updateUserProfile(data, userId)
        res.status(200).json( user)
    } catch (error) {
        console.error("Error in updateUser controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const deleteUserProfile: RequestHandler = async (req: Request, res: Response) => {
    const userId: number = req.userId!;
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
        console.log("Error in deletUserProfile controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    } 
};

const getUserFavorites: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const result = await getFavoritesFromDb(userId);
        res.status(200).json(result)
    } catch (error) {
        console.log("Error in getUserFavorites controller: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const addEventToFavorites: RequestHandler = async(req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const { eventId } = req.body;
        await addFavoriteInDb(userId, eventId);
        res.status(204).send();
  
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Controller error adding favorite: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const removeEventFromFavorites: RequestHandler =  async(req: Request, res: Response) => {
    try {
        const userId: number = req.userId!;
        const { eventId } = req.body;
        await removeFavoriteInDb(userId, eventId);
        res.status(204).send();
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Error in removeEventFromFavorites controller: ", error);
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