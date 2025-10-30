var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Getting all events api route ");
});
const getEventDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    res.send(`Getting details for event with id: ${eventId}`);
});
const addNewEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, date, description } = req.body;
    res.send(`New event: ${name} - ${description} on ${date}`);
});
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`Changing Event to: ${req.body}`);
});
const RsvpForEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { userId } = req.body;
    res.send(`RSVP for event with id: ${eventId} and user id: ${userId}`);
});
const cancelRsvpForEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    res.send(`Deleting the RSVP for event ${eventId}`);
});
const sendEventNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    res.send(`Sending a notification to all attendees for event ${eventId}`);
});
const getEventAttendees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    res.send(`get all the attendees for event ${eventId}`);
});
export { getAllEvents, getEventDetails, RsvpForEvent, addNewEvent, updateEvent, cancelRsvpForEvent, getEventAttendees, sendEventNotification };
