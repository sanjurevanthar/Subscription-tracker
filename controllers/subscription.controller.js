import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/upstash.js";
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {

    try{

        //Check if the user is as same as the on in the token
        if(req.user._id != req.params.id){

            const error = new Error('You are not the owner of this account ');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    }
    catch (error){
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {

    try{
        const allSubscriptions = await Subscription.find();

        res.status(200).json({
            success: true,
            data: allSubscriptions,
        })
    }
    catch (error){
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            return next(error);
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to delete this subscription");
            error.statusCode = 403;
            return next(error);
        }

        await subscription.deleteOne();

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const updateSubscriptionLimited = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            return next(error);
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to update this subscription");
            error.statusCode = 403;
            return next(error);
        }

        // Whitelist allowed fields
        const allowedUpdates = [
            "name",
            "price",
            "frequency",
            "category",
            "currency",
            "paymentMethod"
        ];

        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        // Normalize enums
        if (updates.frequency) updates.frequency = updates.frequency.toLowerCase();
        if (updates.category) updates.category = updates.category.toLowerCase();
        if (updates.currency) updates.currency = updates.currency.toLowerCase();

        const updated = await Subscription.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};


export const getSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            return next(error);
        }

        // Ownership check (important)
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to view this subscription");
            error.statusCode = 403;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};


export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            return next(error);
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to cancel this subscription");
            error.statusCode = 403;
            return next(error);
        }

        // Update only status
        subscription.status = "cancelled"; // use 'CANCELLED' if your schema enums are ALL CAPS

        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const now = new Date();
        const in7Days = new Date();
        in7Days.setDate(now.getDate() + 7);

        const subscriptions = await Subscription.find({
            user: userId,
            status: { $ne: "cancelled" },   // or "CANCELLED" based on your enums
            renewalDate: { $gte: now, $lte: in7Days },
        }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};


