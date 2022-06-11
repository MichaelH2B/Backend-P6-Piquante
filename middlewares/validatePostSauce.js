module.exports = (req, res, next) => {
    const validateSauce = (sauce) => {
        const regexp = new RegExp ("^[-a-zA-Z0-9_:,.' ']{1,100}$");

        if ( regexp.test(sauce.name) &&
             regexp.test(sauce.manufacturer) && 
             regexp.test(sauce.description) &&
             regexp.test(sauce.mainPepper) ) {
            next();

        } else {
            res.status(400).json({
                message: "Un ou plusieurs champs contient un caractère invalide !"
            });
        }
    };

    // POST
    console.log(req.body.sauce);
    console.log(JSON.parse(req.body.sauce));  
    validateSauce(JSON.parse(req.body.sauce)); 
};
