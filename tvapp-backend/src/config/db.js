const pgp = require('pg-promise')();
require('dotenv').config();

const cn = process.env.DATABASE_URL; 
const db = pgp(cn);

module.exports = db; 