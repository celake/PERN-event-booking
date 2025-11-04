import { Request, Response, RequestHandler } from 'express';
import { CreateUserInput, UserWithPassword } from '../types/auth.types.js';
import { createUser, checkUserExists, userForValidation } from '../services/auth.services.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/utils.js';


const userLogin: RequestHandler = async (req: Request, res: Response)  => {
    const { email, password } = req.body;

    try {
        const user: UserWithPassword = await userForValidation(email);

        if (!user) {
            return res.status(400).json({message: "Invalid login credentials."})
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordCorrect) {
                return res.status(400).json({message: "Invalid login credentials"})
        }

        generateToken(user.id, res);
      

        res.status(200).json({
        id:user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
       })     

    } catch(error) {
        console.log("Error in login controller", error);
        res.status(500).json({message: "Enternal Server Error"})
    }
        
}



const userSignup: RequestHandler<{}, {}, CreateUserInput> = async (req: Request, res: Response)  => {
    try {
        const { first_name, last_name, email, password} = req.body;

        if (!password || password.trim().length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters"})
        }

        const userExists = await checkUserExists(email);

        if (userExists) {
            return res.status(400).json({message: "User already exists with this email."})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await createUser({ first_name: first_name, last_name: last_name, email: email, password_hash: hashedPassword})

        if (newUser) {
           // generate jwt token 
           generateToken(newUser.id, res);

           res.status(201).json({ 
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email
           })
        } else {
            res.status(400).json({message: "Error creating token/cookie"})
        }
    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const userLogout: RequestHandler = async (req: Request, res: Response)  => {
        try {
        res.cookie("jwt", "", {
            maxAge:0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development"
        })
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({message: "Enternal Server Error"})
    }
}

export {userLogin, userSignup, userLogout}