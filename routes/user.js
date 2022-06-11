// on importe express pour creer le router
const express = require('express');
// on creer le router 
const router = express.Router();
// il nous faut le controleur pour associer les fonctions au differentes routes
const userCtrl = require('../controllers/user');

const validatePassword = require("../middlewares/validatePassword");
const validateEmail = require("../middlewares/validateEmail");

router.post('/signup', validatePassword, validateEmail, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;