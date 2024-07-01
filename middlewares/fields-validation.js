const { response } = require("express");
const { validationResult } = require("express-validator");


const fieldsValitation = ( req, res = response, next) => {

    const errors = validationResult( req );
    //console.log( errors );
    // si hay errores - lleno
    if( !errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped(),
        });
    }

    next();
}

module.exports = {
    fieldsValitation,
}