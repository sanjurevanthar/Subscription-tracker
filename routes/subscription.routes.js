import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req,res) =>
    res.send({title : 'GET all Subscriptions'}));

subscriptionRouter.get('/:id', (req,res) =>
    res.send({title : 'GET Subscription details'}));

subscriptionRouter.post('/', (req,res) =>
    res.send({title : 'CREATE Subscriptions'}));

subscriptionRouter.put('/:id', (req,res) =>
    res.send({title : 'UPDATE Subscriptions'}));

subscriptionRouter.delete('/:id', (req,res) =>
    res.send({title : 'Delete Subscriptions'}));

subscriptionRouter.get('/user/:id', (req,res) =>
    res.send({title : 'GET all User Subscriptions'}));

subscriptionRouter.put('/:id/cancel', (req,res) =>
    res.send({title : 'CANCEL Subscription'}));

subscriptionRouter.get('/upcoming-renewals', (req,res) =>
    res.send({title : 'GET Upcoming Renewals'}));









export default subscriptionRouter;