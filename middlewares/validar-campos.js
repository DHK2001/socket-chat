const {validationResult} = require('express-validator');//npm i express-validator - paquete para encriptar.

const validarCampos=(req, res, next)=>{ //middlewares tienen un terce argumento llamado next.
    //next se llama cuando el middleware pasa. Si no hay error y continua el next hace que siga con los siguientes middleware.

    //valida si los datos se ingresaron correctamente.
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
} 

module.exports={
    validarCampos
}
    
