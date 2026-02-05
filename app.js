import express from 'express';

import {PORT} from "./config/env.js";

import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter );
app.use('/api/v1/subscriptions' , subscriptionRouter);


app.get('/', (req, res) => {
    res.send("Welcome to Subscription Tracker API! ")
})

app.listen(PORT, async () => {

    console.log(`Listening on port 3000!, running on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app;