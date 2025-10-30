# Event Booking App — Page & API Structure

This document maps the app’s **frontend pages**, **navigation links**, and **backend API endpoints**.
It serves as a working overview and will evolve as features are added.


### Public Pages

1. **Home (/)**

    - **Purpose**: Landing page with Featured Events, categories an quick search.
    - **Navigation Links**: /login, /register, /events, /profile
    - **APIs**:
        - GET /api/events?public=true - list of pubic events

2. **Event Details (/events/:id)**

	- **Purpose**: View event information and RSVP options.
	- **Navigation Links**: /, /login, /register
	- **APIs**:
	    - GET /api/events/:id – Fetch event details
        - POST /api/events/:id/rsvp - RSVP to event
        - DELETE /api/events/:id/rsvp - Cancel RSVP

3. **Login (/login)**

	- **Purpose**: User authentication
	- **Navigation Links**: /, /register
	- **APIs**:
	    - POST /api/auth/login – Authenticate user credentials

4. **Register (/register)**
	- **Purpose**: Create a new user account.
	- **Navigation Links**: /, /login
	- **APIs**:
	    - POST /api/auth/register – Register a new user


### Authenticated User Pages

5. **Dashboard (/dashboard)**
	- **Purpose**: Central hub for all user activity.
	- **Navigation Links**: /, /bookings, /favorites, /settings, /organizer/events
	- **APIs**:
	    - GET /api/users/me – Fetch user profile
	    - GET /api/events?attending=true – Get user RSVPs
	    - GET /api/events?hosted=true – Get events the user is hosting

6. **Browse Events (/events)**
	- **Purpose**: Search, filter, and explore RSVPed events.
	- **Navigation Links**: /, /events/:id, /dashboard
	- **APIs**:
	    - GET /api/events – Fetch all events
	    - POST /api/events/:id/rsvp – RSVP to event
	    - DELETE /api/events/:id/rsvp – Cancel RSVP

7. **Favorites (/favorites)**
	- **Purpose**: Manage favorite events.
	- **Navigation Links**: /, /events/:id, /dashboard
	- **API**s:
	    - GET /api/users/me/favorites – Fetch favorites list
	    - POST /api/users/me/favorites/:eventId – Add favorite
	    - DELETE /api/users/me/favorites/:eventId – Remove favorite

8. **Notifications (/notifications)**
	- **Purpose**: Display all notifications for the current user. Allows users to click a notification to mark it as read or view details.
	- **Navigation Links**: /dashboard, /settings
	- **APIs**:
	    - GET /api/notifications/:userId – Fetch all notifications for the user
        - GET /api/notifications/:id - Fetch details of single notification
	    - PATCH /api/notifications/:id/read – Mark a notification as read
        - DELETE /api/notifications/:id - Delete notification


9. **Profile / Settings (/settings)**
	- **Purpose**: Edit profile, preferences, and integrations.
	- **Navigation Links**: /, /dashboard, /logout
	- **APIs**:
	    - GET /api/users/me – Load user profile
	    - PATCH /api/users/me – Update profile info
	    - POST /api/google/auth-url – Start Google Calendar integration

### Organizer Pages

10. **My Hosted Events (/organizer/events)**
	- **Purpose**: Manage and view hosted events.
	- **Navigation Links**: /, /organizer/events/new, /dashboard, /organizer/events/:id/attendees
	- **APIs**:
	    - GET /api/events?hosted=true – List hosted events

11. **Create Event (/organizer/events/new)**
	- **Purpose**: Create new event.
	- **Navigation Links**: /, /organizer/events, /dashboard
	- **APIs**:
	    - POST /api/events – Create event

12. **Edit Event (/organizer/events/:id/edit)**
	- **Purpose**: Edit event details.
	- **Navigation Links**: /, /organizer/events
	- **APIs**:
	    - GET /api/events/:id – Fetch event data
	    - PATCH /api/events/:id – Update event data


13. **Attendee List (/organizer/events/:id/attendees)**
	- **Purpose**: View and manage event RSVPs.
	- **Navigation Links**: /, /organizer/events, /dashboard
	- **APIs**:
	    - GET /api/events/:id/attendees – Get attendee list
	    - POST /api/events/:id/notify – Send notifications to attendees


### System Pages

14. **Password Reset (/reset-password)**
	- **Purpose**: Reset forgotten password.
    - **Navigation Links**: /
	- **APIs**:
	    - POST /api/auth/request-reset – Request password reset email
	    - POST /api/auth/reset-password – Update password with new credentials

14. **Not Found (/404)**
	- **Purpose**: Display when route is invalid.
    - **Navigation Links**: /
	- **APIs**: None – static page

### Global Auth & User Actions

**Logout (Button)**
- **Purpose**: Log out the current user.
- **Navigation Links**: Appears on all authenticated pages (Dashboard, My Bookings, Organizer pages, etc.)
- **APIs**:
    - DELETE /api/auth/logout – Deletes the JWT cookie / invalidates session

**Google Calendar Sync (Button)**
- **Purpose**: Connect or sync events with Google Calendar.
- **Navigation Links**: Appears on Dashboard or Profile Settings.
- **APIs**:
    - POST /api/google-calendar/sync – Initiates calendar sync for current user