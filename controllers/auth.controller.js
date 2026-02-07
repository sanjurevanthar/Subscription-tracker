import mongoose from 'mongoose';
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";


export const signUp = async (req, res, next) =>{

    //Implement Logic
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        //req body -> email, name, pass for creation a new user
        const { name, email, password } = req.body;

        //Check if the user exist already:
        const existingUser = await User.findOne({ email });

        if(existingUser){
            const error = new Error('User already exists');
            error.status = 409;
            throw error;
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create([{name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User successfully created!',
            data:{
                token,
                user: newUser[0],
            }
        })

    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) =>{

    //Implement Logic
    try{
        const { email, password } = req.body;

        //get the user in a variable
        const user = await User.findOne({ email });

        //Check if present
        if(!user){
            const error = new Error('User Not Found');
            error.statusCode = 404;
            throw error;

        }

        //Now u have found the user, validate the password
        const isPassword = await bcrypt.compare(password, user.password);

        //If invalid throw error
        if(!isPassword){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

        //token
        const token = jwt.sign({ userId : user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        //set the res
        res.status(200).json({
            success: true,
            message: 'User successfully signed in!',
            data: {
                token,
                user
            }
        })

    }
    catch(error){
        next(error);
    }
}

export const signOut = async (req, res, next) =>{

    //Implement Logic
}