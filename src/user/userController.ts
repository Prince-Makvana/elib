import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from 'bcrypt';
import { config } from "../config/config.ts";
import pkg from "jsonwebtoken";
const { sign } = pkg;

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400, "All fields are required...");
        return next(error);
    }

    
    const user = await userModel.findOne({email});

    if(user){
        const error = createHttpError(400, "User already exists with this email...");
        return next(error);
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword
    });

    const token = sign( {sub: newUser._id},config.jwtSecret as string, {
        expiresIn: '7d',
        algorithm: 'HS256',
    });


    res.json({accessToken: token});
};


export { createUser };