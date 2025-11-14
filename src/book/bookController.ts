import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import createHttpError from "http-errors";
import bookModel from "./bookModel.ts";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction)=>{

    const {title,genre } = req.body;

    console.log("files", req.files); 

    const files: any = req.files as { [fieldname: string]: Express.Multer.File[]};
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

    const fileName = files.coverImage[0]?.filename;

    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)

    

    try{
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMimeType,
        })


        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: 'bookFileName',
            folder: 'book-pdfs',
            format: 'pdf',
        });
        console.log("bookFileUploadResult", bookFileUploadResult);
        console.log("uploadResult", uploadResult);
        // @ts-ignore
        console.log("userId", req.userId);
        const newBook = await bookModel.create({
            title,
            genre,
            author: "691435d3a744154b4453514d",
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,
        });

 
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({id: newBook._id});

    } catch(err){
        console.log(err);
        return next(createHttpError(500, "Error while uploading the files."));
    }

};

export { createBook };