const { io } = require('../server');
const {Usuarios}= require('../classes/usuarios')
const {crearMensaje}= require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat',(data, callback)=>{

        if (!data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje:'El nombre/sala es necesario',
            });
        }
        client.join(data.sala);//funcion join para unirse a una sala grupal o privada.

        usuarios.agregarPersona(client.id,data.nombre, data.sala);

        client.to(data.sala).broadcast.emit('listaPersona', usuarios.getersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio.`));

        callback(usuarios.getersonasPorSala(data.sala));
    });

    client.on('crearMensaje',(data, callback)=>{

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('disconnect',()=>{

        let personaBorrada=usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio.`))//este mensaje se le transmitira a todos los clientes.
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getersonasPorSala(personaBorrada.sala))
    });

    //mensajes privados
    client.on('mensajePrivado', data=>{

        let persona=usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona, data.mensaje))

    })


});

