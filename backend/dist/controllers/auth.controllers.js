var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createUser, checkUserExists, userForValidation } from '../services/auth.services.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/utils.js';
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userForValidation(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid login credentials." });
        }
        const isPasswordCorrect = yield bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Enternal Server Error" });
    }
});
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!password || password.trim().length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const userExists = yield checkUserExists(email);
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email." });
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const newUser = yield createUser({ first_name: first_name, last_name: last_name, email: email, password_hash: hashedPassword });
        if (newUser) {
            // generate jwt token 
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email
            });
        }
        else {
            res.status(400).json({ message: "Error creating token/cookie" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development"
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Enternal Server Error" });
    }
});
export { userLogin, userSignup, userLogout };
