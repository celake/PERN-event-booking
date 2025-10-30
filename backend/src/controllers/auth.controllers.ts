import { Request, Response, RequestHandler } from 'express';



const userLogin: RequestHandler = async (req: Request, res: Response)  => {
    res.send("user has logged in")
}


const userSignup: RequestHandler = async (req: Request, res: Response)  => {
    res.send("user has signed up in")
}

const userLogout: RequestHandler = async (req: Request, res: Response)  => {
    res.send("user has logged out")
}

export {userLogin, userSignup, userLogout}