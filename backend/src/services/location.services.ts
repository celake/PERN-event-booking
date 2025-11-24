import { query } from "../db/postgres.js";
import { Locations, NewLocation, LocationSearchQuery } from '../types/location.types.js';
import { ConflictError,
         DatabaseError,
         ValidationError,
         NotFoundError
 } from "../lib/errors.js";

 export const getActiveLocationsFromDB = async (): Promise<Locations[]> => {
    try {
        const sql = `
            SELECT name, street_address, city, postcode, country, additional_locator 
                FROM locations
                WHERE archived = false;
        `
        const result = await query(sql);
        if (!result) {
            throw new DatabaseError("No locations found")
        }

        return result.rows;
    } catch (error) {
        console.error('Db error fetching locations:', error);
        throw error;
    }
 };

export const addLocationToDb = async (data: NewLocation): Promise<number> => {
    try {
        const keys = Object.keys(data);
        const setColumns = keys.join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const sql =`
            INSERT INTO locations (${setColumns})
                VALUES (${placeholders})
                RETURNING id
        `;
        const result = await query(sql, values);

        if (!result.rows || result.rows.length === 0) {
            throw new DatabaseError("Could not save new location.");
        }

        return result.rows[0].id;

    } catch (error) {
        console.error('Failed to create new location:', error);
        throw error;
    }
}

export const searchLocationsInDb = async (serchTerms: LocationSearchQuery): Promise<Locations[]> => {
    try {
        const validKeys = ['name', 'street_address', 'city', 'postcode', 'country'];
        const keys = Object.keys(serchTerms).filter(k => validKeys.includes(k));
        if (keys.length === 0) return [];
        const values = Object.values(serchTerms);
        const conditions = keys.map((key, index) => `LOWER (${key}) = LOWER ($${index + 1})`).join(' AND ');
        console.log(conditions)
        const sql =`
            SELECT name, street_address, city, postcode, country, additional_locator
                FROM locations
                WHERE archived = false AND ${conditions};
        `
        const result = await query(sql, values);
        console.log(result.rows)
        if (!result.rows || result.rows.length === 0) {
            throw new DatabaseError("No results found.");
        }
        return result.rows;
    } catch (error) {
        console.error('Failed to search locations:', error);
        throw error;
    }
}


 export const setLocationToArchived = async (locationId: number): Promise<number> => {
    try {   
        const sql =`
            UPDATE locations
                SET archived = true
                WHERE id = $1
                RETURNING id;
        `
        const result = await query(sql, [locationId]);

        if (!result.rows || result.rows.length === 0) {
            throw new DatabaseError("Failed to archive location")
        }
        
        return result.rows[0].id;
    } catch (error) {
        console.error('Db error setting location to archived:', error);
        throw error;
    }
 }