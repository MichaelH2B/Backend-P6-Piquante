const passwordValidate = require('password-validator');

const passwordSchema = new passwordValidate();

passwordSchema
    .is().min(8)                                    
    .is().max(64)                                  
    .has().uppercase()                              
    .has().lowercase()                             
    .has().digits(2)                                
    .has().not().spaces()                    

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ error : "le mot de passe n'est pas assez fort : " + passwordSchema.validate('req.body.password', { list: true })});
    } else {
        next();
    }
};