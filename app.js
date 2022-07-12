import fs from 'fs';
import { checkAllNodes } from './functions.js';

const PATH = './data/db.json';
const db = JSON.parse(fs.readFileSync(PATH));
console.log('Successful database load');

checkAllNodes(db)
