const {response, request} = require('express');
const Usuario = require('../models/usuarios')
const bcrypt = require('bcryptjs'); //npm i bcryptjs - paquete para encriptar.


const usuaiosGet = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}),//no cuenta al que tiene estado false
        Usuario.find({estado: true})//condicion para que no tome en cuenta al que tiene el estado en false.
            .skip(parseInt(desde))
            .limit(parseInt(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuaiosPut =async(req, res) => { 

    const id = req.params.id;
    const {_id, password, google,correo, ...resto} = req.body;

    //to do validar contra base de datos
    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password=bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario)
}

const usuaiosPost = async(req, res) => {

    const {nombre, correo, password, rol}=req.body;// solo se sacan los datos necesesarios.
    //const {google, ... body}= req.body; PCon esto se sacan todos los datos menos el dato google para no estar llamando uno por uno.
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();//numero de vueltas para hacer mas comlicado la encriptacion. Entre mas vueltas mas seguro pero lleva mastiempo. El 10 es el valor por defecto.
    usuario.password=bcrypt.hashSync(password, salt);//El hash es para encriptarlo. El salt es el numero de vueltas en la encriptacion.
    
    //Guardar en BD
    await usuario.save();

    res.json({
        
        usuario
    })
}

const usuaiosDelete = async(req, res) => {

    const id = req.params.id;

    //borrarlo fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    //desactivarlo con estado
    const usuario= await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    })
}

const usuaiosPatch = (req, res) => {
    res.json({
        
    })
}

module.exports={
    usuaiosGet,
    usuaiosPut,
    usuaiosPost,
    usuaiosDelete,
    usuaiosPatch
}