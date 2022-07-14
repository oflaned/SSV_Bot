import { checkAllNodes } from './check.js'
import mongoose from 'mongoose'
import dbURL from './config/config.js'

var time = Date.now()
await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })  
    .then( res => console.log('Connected to DB'))
    .catch( error => console.log(error))
console.log(`Time to connect with DB: ${(Date.now() - time)/1000} sec.`)

setInterval(checkAllNodes, 10000)
