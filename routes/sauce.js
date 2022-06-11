const express = require('express');
// cela permet de créer des routeurs séparés pour chaque route principale de l'application 
// on y enregistre ensuite les routes individuelles.
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
// on recupere notre logique CRUD
const ctrlSauce = require('../controllers/sauce');

const ctrl1InputSauce = require('../middlewares/validatePostSauce')
const ctrl2InputSauce = require('../middlewares/validatePutSauce'); 

router.post('/', auth, multer, ctrl1InputSauce, ctrlSauce.createSauce);
router.get('/', auth, ctrlSauce.getAllSauces);
router.get('/:id', auth, ctrlSauce.getOneSauce);
router.put('/:id', auth, multer, ctrl2InputSauce, ctrlSauce.modifySauce);
router.delete('/:id', auth, ctrlSauce.deleteSauce);
router.post('/:id/like', auth, ctrlSauce.likeSauce);

module.exports = router;