import fs from 'fs';
import { checkAllNodes, checkCurrentNode } from './functions.js';

const start = Date.now();

const PATH = './data/db.json';
const db = JSON.parse(fs.readFileSync(PATH));
console.log('Successful database load');
while(true)
    setInterval(checkAllNodes, 100, db)
