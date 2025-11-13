import express, { type NextFunction, type Request, type Response } from "express"
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";
import userRouter from "./user/userRouter.ts";
import bookRouter from "./book/bookRouter.ts";
const app = express();
app.use(express.json());

app.get("/",(req, res, next) =>{
    res.json({message:"Hello World!"});
});

app.use('/api/users',userRouter);
app.use('/api/books',bookRouter);

app.use(globalErrorHandler);

export default app;