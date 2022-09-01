const {Router} = require('express');
const { check } = require('express-validator');
const { usuaiosGet, 
        usuaiosPut, 
        usuaiosPost, 
        usuaiosDelete, 
        usuaiosPatch,} = require('../controllers/user.controller');
        
const {validarCampos} = require('../middlewares/validar-campos');
const {esRolValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators');

const router = Router();

router.get('/', usuaiosGet);

router.put('/:id', [
        check('id', 'No es un id valido').isMongoId(), 
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido),
        validarCampos,
],usuaiosPut);

router.post('/', [

        check('nombre','El nombre es obligstorio').not().isEmpty(),// not.isempty valida si no esta vacio
        check('password','El password es obligatorio y debe de ser mas de 6 letras').isLength({min : 6}), //valida si es un correo
        check('correo','El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        //check('rol','No es un roll permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),//valida si es un correo
        check('rol').custom(esRolValido),
        validarCampos

],usuaiosPost);

router.delete('/:id', [
        check('id', 'No es un id valido').isMongoId(), 
        check('id').custom(existeUsuarioPorId),
        validarCampos
],usuaiosDelete);

router.patch('/', usuaiosPatch);

module.exports= router;