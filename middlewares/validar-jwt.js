const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {

    // x-token headers
    const token = req.header('x-token');
    //console.log(token);

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'no hay token en la petición',
        });
    }

    try {

        //const payload = jwt.verify(
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_KEY_TOKEN
        );

        //console.log(payload);
        //req.uid = payload.uid;
        //req.name = payload.name;

        req.uid = uid;
        req.name = name;
        //console.log(req.uid,req.name);

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token no valido',
        });
    }

    next();
}

module.exports = {
    validarJWT
}