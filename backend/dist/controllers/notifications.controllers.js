var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const allNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("All notifications here. ");
});
const notificationDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("One notification here. ");
});
const markNotificationReadState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("This notification has been read or maybe unread.  Who knows. ");
});
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("This notification has been deleted. ");
});
export { allNotifications, notificationDetails, markNotificationReadState, deleteNotification };
