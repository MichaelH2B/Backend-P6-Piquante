// on importe express
const express = require('express');
// base de données mongoDB
const mongoose = require('mongoose');
// path de notre serveur
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

const userRoutes = require('./routes/user'); 
const sauceRoutes = require('./routes/sauce');

// connexion a la base de données mongoDB
mongoose.connect(process.env.MONGO_DB_2, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((error) => console.log({ error }));

// lancement de express
const app = express();

// express rate limit
// Intergiciel de limitation de débit de base pour Express. À utiliser pour limiter les demandes répétées aux API publiques et/ou aux points de terminaison
const rateLimit = require("express-rate-limit");
const Limiteur = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par `window` (ici, par 15 minutes)
  standardHeaders: true, // Limite de taux de retour info dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

app.use('/api', Limiteur);

app.use(express.json()); // cela parse le body des requetes en json

// configuration CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.AUTHORIZED_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

helmet({ crossOriginResourcePolicy: false, });

app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;