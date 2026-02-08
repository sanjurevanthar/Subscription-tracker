import { Router } from 'express';
import authorize from "../middlewares/authorize.middleware.js";
import {
    cancelSubscription,
    createSubscription,
    deleteSubscription,
    getAllSubscriptions, getSubscriptionById, getUpcomingRenewals,
    getUserSubscriptions, updateSubscriptionLimited
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

subscriptionRouter.get('/:id', authorize, getSubscriptionById);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscriptionLimited);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);



export default subscriptionRouter;