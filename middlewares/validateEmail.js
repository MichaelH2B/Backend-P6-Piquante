const emailValidate = require('validator');

module.exports = (req, res, next) => {
    const {email} = req.body;

    if(emailValidate.isEmail(email)){
        next();
    } else {
        return res.status(400).json({error : `l'email ${email} n'est pas valide`})
    }
};
