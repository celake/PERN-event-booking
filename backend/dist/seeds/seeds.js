var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { query } from "../db/postgres.js";
export const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield query(`
            -- Users
            INSERT INTO users (first_name, last_name, email, password_hash, role)
            VALUES
            ('Alice', 'Smith', 'alice@example.com', 'hash1', 'user'),
            ('Bob', 'Johnson', 'bob@example.com', 'hash2', 'organizer'),
            ('Charlie', 'Lee', 'charlie@example.com', 'hash3', 'user'),
            ('Dana', 'Kumar', 'dana@example.com', 'hash4', 'organizer');


            -- Locations
            INSERT INTO locations (street_address, city, postcode, country)
            VALUES
            ('123 Main St', 'London', 'SW1A1AA', 'UK'),
            ('456 Elm St', 'Manchester', 'M1 2AB', 'UK'),
            ('789 Oak Ave', 'Bristol', 'BS1 5XY', 'UK');


            -- Events
            INSERT INTO events (event, start_date, end_date, attendee_count, status, description)
            VALUES
            ('Photography Workshop', '2025-11-10 10:00:00+00', '2025-11-10 16:00:00+00', 0, 'open', 'Beginner photography class'),
            ('Art Exhibition', '2025-11-15 09:00:00+00', '2025-11-15 18:00:00+00', 0, 'open', 'Local artists showcase'),
            ('Dog Training Session', '2025-11-20 14:00:00+00', '2025-11-20 17:00:00+00', 0, 'open', 'Learn basic obedience with your dog');


            -- Event-Locations (join table)
            INSERT INTO event_location (event_id, location_id)
            VALUES
            (1, 1),
            (2, 2),
            (3, 3);


            -- Event-Users (RSVPs)
            INSERT INTO event_users (event_id, user_id)
            VALUES
            (1, 1), -- Alice RSVPed to Photography Workshop
            (1, 3), -- Charlie RSVPed to Photography Workshop
            (2, 2), -- Bob RSVPed to Art Exhibition
            (3, 4); -- Dana RSVPed to Dog Training


            -- User-Favorite-Event
            INSERT INTO user_favorite_event (user_id, event_id)
            VALUES
            (1, 2), -- Alice favorited Art Exhibition
            (3, 1), -- Charlie favorited Photography Workshop
            (4, 3); -- Dana favorited Dog Training


            -- Notifications
            INSERT INTO notifications (sender_id, event_id, message)
            VALUES
            (2, 2, 'Art Exhibition starts in 1 hour!'),
            (4, 3, 'Dog Training Session updated time to 14:00.'),
            (1, 1, 'Photography Workshop RSVP confirmed!');
        `);
    }
    catch (error) {
        console.error('PostgreSQL error:', error);
        throw error;
    }
});
