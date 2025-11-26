import { Request, Response, RequestHandler } from 'express';
import { getActiveLocationsFromDB,
         setLocationToArchived,
         addLocationToDb,
         searchLocationsInDb
 } from '../services/location.services.js';
import { LocationSearchQuery, NewLocation } from '../types/location.types.js';
import { DatabaseError, NotFoundError, ValidationError } from "../lib/errors.js";

const getActiveLocations: RequestHandler = async (req: Request, res: Response) => {
    try {
        const locations = await getActiveLocationsFromDB();
        res.status(200).json({locations });
    } catch (error) {
        console.error("Error fetching active locations", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const createLocation: RequestHandler = async (req: Request, res: Response) => {
    try {
        const data = req.body as NewLocation;
        const newLocationId = await addLocationToDb(data);
        res.status(201).json({newLocationId});
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Unexpected error in createLocation:", error)
        res.status(500).json({message: "Internal server error"});
    }
}

const searchLocations: RequestHandler = async (req: Request, res: Response) => {
    try {
        const data = req.query as LocationSearchQuery;
        const searchResults = await searchLocationsInDb(data);
        res.status(200).json({searchResults});
    } catch (error) {
        console.error("Error fetch searched locations", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const archiveLocationById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        if (isNaN(locationId)) throw new ValidationError("Invalid location ID");
        await setLocationToArchived(locationId);

        res.status(204).send();
    } catch (error) {
        if (error instanceof DatabaseError) return res.status(500).json({ message: error.message });
        console.error("Unexpected error in archiveLocationById:", error)
        res.status(500).json({message: "Internal server error"});
    }
}

export { getActiveLocations,
         createLocation,
         searchLocations,
         archiveLocationById
}