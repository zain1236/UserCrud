const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({error : "No token Provided"})
    jwt.verify(token, process.env.SECRET_TOKEN , (err,user ) => {
        console.log(err)
    
        if (err) return res.status(403).send({error:"Invalid Token"});
        // console.log("User data :" , user);
        console.log(user);
        req.user = user;
        next();
        })
}

module.exports = authenticateToken;