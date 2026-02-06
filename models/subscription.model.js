import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price:{
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency:{
        type: String,
        enum: ['EUR', 'USD', 'INR'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    },
    category: {
        type: String,
        enum: ['SPORTS','NEWS', 'ENTERTAINMENT', 'LIFESTYLE', 'TECHNOLOGY', 'FINANCE', 'POLITICS', 'OTHER' ],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'CANCELLED', 'EXPIRED'],
        default: 'ACTIVE',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be a PAST DATE ',
        },
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal Date must be after start date',
        },
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });

//Auto-calculate renewal date if missing

subscriptionSchema.pre('save', function (next) {

    if(!this.renewalDate){
        const renewalPeriods = {
            DAILY: 1,
            WEEKLY: 7,
            MONTHLY: 30,
            YEARLY: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    //Auto-Update the status if the renewal date passed
    if(this.renewalDate < new Date()){
        this.status = 'EXPIRED';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;