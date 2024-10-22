const { response } = require("express");
// PRISMA
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// crea el seed de datos
const seed = async ( req , res = response ) => {

   /* const anuncio = await prisma.anuncio.create({
        data: { 
            title: 'Vendo coche',
            description: "Fiat Marea año 2003, impecable"
        }
    });

    console.log(anuncio);

    res.json({
    ok: true,
    msg: 'anuncios insertados'
    });*/

    // borra todos los registros de la DDBB
    // await prisma.anuncio.deleteMany() // se puede poner un where ({ where {complete : false} })
    // crea varios registros en la DDBB
    const seedData = await prisma.anuncio.createMany({
        data: [
            {id:"1", title: 'Vendo coche', description: "Fiat Marea año 2003, impecable", user_id: "1"},
            {id:"2", title: 'Vendo casa', description: "500 m2, centrica y gran jardín", user_id: "2"},
            {id:"3", title: 'Busco trabajo', description: "De cuidado de niños y limpieza", user_id: "1"},
            {id:"4", title: 'Vendo ropa', description: "Vendo ropa para niños de 5 años", user_id: "2"},
        
        ]
    });

    //console.log(seedData);
   
    res.json({
        ok: true,
        msg: 'anuncios insertados',
        seed: seedData,
        msg: 'está funcion está desabilitada'
    });
}

// lista todos los anuncios
const allAnuncios = async ( req , res = response ) => {

    try {

        const anuncios = await prisma.anuncio.findMany();
        //console.log(anuncios);
    
        if(anuncios.length > 0){
            res.status(201).json({
                ok: true,
                anuncios: anuncios,
            });
        
        }else{
            res.status(404).json({
                ok: false,
                msg: 'Lo sentimos, pero no hay anuncios que mostrar',
            });
        }
            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error no indentificado al listar todos los anuncios',
        });
    }
}

// crear anuncio
const createAnuncio = async ( req , res = response ) => {

    // verificar que tengo el anuncio
    const data = req.body;
    // para tener el uid del usuario logeado es fundamental revalidar el token (middewares/validar-jwt.js) en routes/anuncios.js !!!!
    const { uid } = req;
    //console.log(uid);
    // añadimos el uid del usuario logeado a través del token a la data (title & description del anuncio)
    data.user_id = uid;

    try {

        const anuncioGuardado = await prisma.anuncio.create({ data });
        //console.log(anuncioGuardado);

        res.status(200).json({
            ok: true,
            msg: 'anuncio guardado',
            anuncio: anuncioGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error no identificado al crear el anuncio',
        });
    }
}
// listar anuncios por usuario
const userAnuncios = async( req, res = response ) => {

    const userId = req.params.id;
    //const { name } = req;
    //console.log(name);


    try {

        const anunciosUser = await prisma.anuncio.findMany({
            where: {
                user_id: userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                usuario: true
            }
        });
        //console.log(anunciosUser);
    
        if(anunciosUser.length > 0){
            res.status(201).json({
                ok: true,
                anuncios: anunciosUser,
            });
        
        }else{
            res.status(404).json({
                ok: false,
                msg: 'Lo sentimos, pero no hay anuncios que mostrar',
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error indeterminado al listar los anuncios de este usuario',
        });
    }
}
// editar anuncio
// crear anuncio
const updateAnuncio = async( req , res = response ) => {

    const data = req.body;
    const anuncioId = req.params.id;
    //console.log(anuncioId);
    const { uid } = req;

    try {
        // se saca el anuncio por su id
        const findAnuncio = await prisma.anuncio.findUnique({
            where: {
                id: anuncioId,
            },
            select: {
                id: true,
                user_id: true,
            }
        });

        //console.log(findAnuncio);
        // se valida que exista el id del anuncio
        if(!findAnuncio){
            res.status(404).json({
                ok: false,
                msg: 'El anuncio no existe por ese ID',
            });
        };

        // se valida que el anuncio lo esta editando el usurio logeado con el token
        if( findAnuncio.user_id !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el provilegio para editar este anuncio',
            });
        }
        // modificamos el objeto de la data
        delete data.usuario;

        const newData = {
           ...data,
           user_id: uid,
        }
        //console.log(newData);

        // actualizamos datos en DDBB
        const updateAnuncio = await prisma.anuncio.update({
            where: { 
                id: anuncioId, 
            },
            data: newData,
        });
        //console.log(updateAnuncio)

        res.json({
            ok: true,
            updateAnuncio,
            msg: 'anuncio editado',
        });
        
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: false,
            msg: 'la actualización del anuncio fallo',
        });
    }
}

// borrar anuncio
// crear anuncio
const deleteAnuncio = async ( req , res = response ) => {

    const anuncioId = req.params.id;
    //console.log(anuncioId);
    const {uid} = req;

    try {

        const findAnuncio = await prisma.anuncio.findUnique({
            where: {
                id: anuncioId,
            },
            select: {
                id: true,
                user_id: true
            }
        });
        //console.log(findAnuncio);

        // se valida que exista el id del anuncio
        if(!findAnuncio){
            res.status(404).json({
                ok: false,
                msg: 'El anuncio no existe por ese ID',
            });
        };
        
        // se valida que el anuncio lo esta editando el usurio logeado con el token
        if(findAnuncio.user_id !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el provilegio para borrar este anuncio',
            });
        }

        // actualizamos datos en DDBB
        const deleteAnuncio = await prisma.anuncio.delete({
            where: { id: anuncioId },
        });

        res.json({
            ok: true,
            deleteAnuncio,
            msg: 'anuncio borrado',
        });
        
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: false,
            msg: 'la eliminación del anuncio fallo',
        });
    }
}

module.exports = {
    seed,
    allAnuncios,
    createAnuncio,
    userAnuncios,
    updateAnuncio,
    deleteAnuncio
}

