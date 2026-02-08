import express from 'express';

import {PORT} from "./config/env.js";
import cookieParser from "cookie-parser";

import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

//BuiltIn
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter );
app.use('/api/v1/subscriptions' , subscriptionRouter);
app.use('/api/v1/workflows' , workflowRouter);


app.use(errorMiddleware);


app.get('/', (req, res) => {
    res.send("Welcome to Subscription Tracker API! ")
})

app.listen(PORT, async () => {

    console.log(`Listening on port 3000!, running on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;