import {JWT_SECRET} from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const authorize = async (req, res, next) => {

    try{
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            //seperate the token
            token = req.headers.authorization.split(' ')[1];
        }

        //If token not found return Unauthorized
        if(!token){
            return res.status(401).send({
                message: 'Unauthorized',
            })
        }

        const decode = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decode.userId);

        if (!user) {
            return res.status(401).send({
                message: 'Unauthorized',
            })
        }

        req.user = user;

        next();
    }
    catch(error){
        res.status(401).send({
            message: 'Unauthorized',
            error: error.message,
        })
    }
}

export default authorize;