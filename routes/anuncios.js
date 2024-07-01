/**
 * rutas de anuncios - anuncios
 * host + /api/anuncios
 */
const { Router } = require("express");
const router = Router();
// controladores de los anuncios a ddbb
// middleware - validate-jwt
const { validarJWT } = require('../middlewares/validar-jwt');

// middlewares para validaciones de campos de formulario
const { check } = require("express-validator");
const { fieldsValitation } = require('../middlewares/fields-validation');
// validación de fechas con express-validator
//const { isDate } = require("../helpers/isDate");
const { seed, allAnuncios, createAnuncio, userAnuncios, updateAnuncio, deleteAnuncio } = require("../controllers/anuncios");

// validar token - todas las rutas tienen que validar el token
router.use( validarJWT );

// crear el seed de datos
router.get('/seed', seed );

// listar anuncios
router.get('/list', allAnuncios);

// crear anuncio
router.post(
    '/', 
    [
        check('title','El título es obligatorio').not().isEmpty(),
        check('description','La descripción es obligatoria').not().isEmpty(),
        //check('start','La fecha de inicio es obligatoria').custom( isDate ),
        fieldsValitation
    ],
    createAnuncio,
);

// listar anuncios por usuario
router.get('/:id',userAnuncios);

// editar anuncio
router.put('/:id', updateAnuncio);

// eliminar anuncio
router.delete('/:id', deleteAnuncio);

module.exports = router;