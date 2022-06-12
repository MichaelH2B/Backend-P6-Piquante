// on importe le model schema
const Sauce = require('../models/sauce'); 

const fs = require('fs');
const sauce = require('../models/sauce');

// creer un produit dans ma base de donnée
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    console.log(req.body.sauce);
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};

// recupere les sauces de la base de données et nous renvoie les sauces (affichage de toute les sauces)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// renvoie la sauce avec l'id selectionné (affichage de la sauce selectionée)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body.sauce };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};

// supprimer un sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

// like & dislike une sauce
exports.likeSauce = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId;
    const sauceId = req.params.id;
    console.log(like);
    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            switch (like) {
                case 1 :
                    if (!sauce.usersLiked.includes(userId) && like === 1) {
                        Sauce.updateOne({ _id: sauceId },
                            {   $inc: { likes: 1 },
                                $push: { usersLiked: userId }})
                            .then(() => res.status(201).json({ message: '1'}))
                            .catch((error) => res.status(404).json({ message: "error" }));
                    } break;

                case 0 :
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId },
                            {   $inc: { likes: -1 },
                                $pull: { usersLiked: userId }})
                            .then(() => res.status(201).json({ message: '0'}))
                            .catch((error) => res.status(404).json({ message: "error" }));
                    } 

                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId },
                            {   $inc: { dislikes: -1 },
                                $pull: { usersDisliked: userId }})
                            .then(() => res.status(201).json({ message: '0'}))
                            .catch((error) => res.status(404).json({ message: "error" }));
                    } break;
                
                case -1 :
                    if (!sauce.usersLiked.includes(userId) && like === -1) {
                        Sauce.updateOne({ _id: sauceId },
                            {   $inc: { dislikes: 1 },
                                $push: { usersDisliked: userId }})
                            .then(() => res.status(201).json({ message: '-1'}))
                            .catch((error) => res.status(404).json({ message: "error" }));
                    } break;
            }
        })
        .catch((error) => res.status(404).json({ error }));
};