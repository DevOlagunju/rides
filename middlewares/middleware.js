const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next)=>{
    const token = req.param.token ||
        req.headers['x-access-token'] || req.headers.authorization || req.body.token;
    if (token) {
        jwt.verify(token,process.env.SECKRET_KEY , (error, decoded) => {
            if (error) {
                res.status(401).send({
                    status: 'error',
                    message: 'invalid token!'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Token required for this route'
        });
    }
}
