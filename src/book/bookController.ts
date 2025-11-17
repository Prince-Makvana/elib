import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import createHttpError from "http-errors";
import bookModel from "./bookModel.ts";
import fs from "node:fs";
import type { AuthRequest } from "../middlewares/authenticate.ts";

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

        const _req = req as AuthRequest;
        
        const newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction)=>{

    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({_id: bookId});

    if(!book){
        return next(createHttpError(404, "Book not found..."));
    }

    const _req = req as AuthRequest;
    if(book.author.toString() != _req.userId){
        return next(createHttpError(403, "You can not uadate others book..."));
    }

    const files: any = req.files as { [fieldname: string]: Express.Multer.File[]};
    let completeCoverImage = "";
    if(files.coverImage){
        const filename = files.coverImage[0].filename;
        const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);

        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads/"+ filename
        );

        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: converMimeType,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
    }


    let completeFileName = "";
    if(files.file){
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + files.file[0].filename
        );

        const bookFileName = files.file[0].filename;
        completeFileName = bookFileName;

        const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath,{
            resource_type: "raw",
            filename_override: completeFileName,
            folder: "book-covers",
            format: "pdf",
        });

        completeFileName = uploadResultPdf.secure_url;
        await fs.promises.unlink(bookFilePath);

    }

    const updateBook = await bookModel.findByIdAndUpdate(
        {
            _id: bookId,
        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: completeFileName ? completeFileName : book.file,
        },
        {new: true}
    );

    res.json(updateBook);

}

export { createBook, updateBook };