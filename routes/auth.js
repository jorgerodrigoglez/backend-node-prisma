/**
 * rutas de usuarios - auth
 * host + /api/auth
 */

//const express = require("express");
//const router = express.Router();

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
// controladores de las rutas
const { newUser, loginUser, revalidateToken } = require('../controllers/auth')
// middleware para validaciones de campos de formulario
const { fieldsValitation } = require('../middlewares/fields-validation');
// middleware para revalidar el token
const { validarJWT } = require('../middlewares/validar-jwt')

// nuevo usuario
router.post(
    '/new', 
    [
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','La contraseña tiene que tener al menos 6 caracteres').isLength({ min: 6 }),
        fieldsValitation
    ], 
    newUser 
);

// login
router.post(
    '/', 
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','La contraseña tiene que tener al menos 6 caracteres').isLength({ min: 6 }),
        fieldsValitation
    ], 
    loginUser 
);

// token
router.get('/renew', validarJWT, revalidateToken);

module.exports = router;