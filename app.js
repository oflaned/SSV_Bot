// Нужно вынести данные подключений в конфиг
import { checkAllNodes, checkCurrentNode } from './functions.js';
import mongoose from 'mongoose'


mongoose.connect("mongodb+srv://oflaned:ILUzus62@cluster0.uf7isx9.mongodb.net/First?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })  
    .then((res) => console.log('connected to monga DB'))
    .catch((error) => console.log(error))

const PATH = './data/db.json';
const db = JSON.parse(fs.readFileSync(PATH));
console.log('Successful database load');

await setInterval(checkAllNodes, 30000, db)
