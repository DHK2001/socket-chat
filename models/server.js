const express = require('express')
const cors = require('express')
const {dbConnection} = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath='/api/usuarios';

        //conectar base de datos
        this.conectarDB();

        //Mddlewares funciones que siemre se estaran ejecutando
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //cors
        this.app.use(cors()); //los middlewares utilizan use.

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en puerto', this.port);
        })
    }

}

module.exports = Server;