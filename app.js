import { checkAllNodes } from './check.js'
import mongoose from 'mongoose'
import dot from 'dotenv'
import { start } from './bot.js'
import { refreshName } from './dbCommands/refreshName.js'

dot.config()
var time = Date.now()

await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })  
    .then( res => console.log('Connected to DB'))
    .catch( error => console.log(error))
console.log(`Time to connect with DB: ${(Date.now() - time)/1000} sec.`)

await refreshName()
start()

try{
    setInterval(checkAllNodes, 5000)
} catch(err){
    console.error(err.msg)
}