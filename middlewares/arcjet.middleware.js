import aj from "../config/arcjet.js";


const arcjetMiddleware = async (req, res, next) => {

    try{
        // Deduct 1 token from the bucket
        const decision = await aj.protect(req, { requested: 1 });

        //if decision Denied
        if (decision.isDenied()) {
            //Reasons:
            //1. RateLimit:
            if(decision.reason.isRateLimit){
                return res.status(429).json({
                    error: "Rate limit Exceeded",
                })
            }
            //2. If Bot
            if(decision.reason.isBot()){
                return res.status(403).json({
                    error: "Bot Detected",
                })
            }

            //Now Return Access Denied for other reasons
            return res.status(403).json({
                error: "Access Denied",
            })
        }
        next();
    }
    catch(error){
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;