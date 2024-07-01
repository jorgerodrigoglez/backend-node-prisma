const { response } = require("express");
const bcrypt = require('bcryptjs');
// PRISMA
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// JWT
const { generateToken } = require('../helpers/jwt');

const newUser = async ( req , res = response ) => {

    const data = req.body;
    const { name, email, password } = req.body;
    //console.log( req.body );

    try {
        
        const usuarioExiste = await prisma.usuario.findUnique({ 
            where:{
                email: email 
            },
            select:{
                email: true
            }
        });
        
        //console.log(usuario);
        
        if(usuarioExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
               
        }else{
            // encriptar contraseña
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync( password, salt );

            // crear usuario
            const usuarioRegister = await prisma.usuario.create({data});
            //console.log(usuarioRegister);

            // generar JWT
            const token = await generateToken( usuarioRegister.id, name );

            return res.status(201).json({
                ok: true,
                msg: 'Usuario registrado correctamente',
                //user: req.body
                uid: usuarioRegister.id,
                name,
                email,
                password,
                token,
            });

        }

    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: false,
            msg: 'no se pudo registrar el usuario',
        });
    }
    
    // validación sencilla
    /*if(name.length < 5) {
        return res.status(400).json({
            ok:false,
            msg: "El nombre tiene que tener más de 5 caracteres",
        });
    }*/

    // express validator errors
    // este codigo se ejecuta en middlewares - fields-validation
}

const loginUser = async( req , res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioSearch = await prisma.usuario.findUnique({ 
            where:{
                email: email,
            },
            select:{
                name: true,
                email: true,
                password: true,
                id: true,
            }
        });
        
        //console.log(usuarioSearch);
        // 1ª validación
        if(!usuarioSearch){
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            });
        }

        // 2ª validación - confirmar los passwods
        // console.log( password, usuarioSearch.password );
        const validPassword = await bcrypt.compare(password,usuarioSearch.password);
        //console.log(validPassword);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
            
        // generar JWT
        const token = await generateToken( usuarioSearch.id, usuarioSearch.name );
          
        // mostrar mensaje si todo fue bien
        return res.status(201).json({
            ok: true,
            msg: 'El login fue exitoso',
            uid: usuarioSearch.id,
            name: usuarioSearch.name,
            email,
            //password,
            token
        });
        

    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: false,
            msg: 'no se pudo logear el usuario',
        });
    }
   
}

const revalidateToken = async( req , res = response ) => {

    //const uid = req.uid;
    //const name = req.name;

    const { uid, name } = req;
    //console.log(uid,name);

    // generar un nueco JWT
    const token = await generateToken( uid, name );

   
    res.json({
        ok: true,
        //uid,
        //name,
        token
    });
}

module.exports = {
    newUser,
    loginUser,
    revalidateToken
}