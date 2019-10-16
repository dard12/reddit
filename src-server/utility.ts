import crypto from 'crypto';
import bigint from 'big-integer';

// const crypto = ('crypto');
// var biformat = require('biguint-format');

// // Adjust # bytes as needed
const seed = bigint(crypto.randomBytes(8), 'dec');
console.log(bigInt(seed));
