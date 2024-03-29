import mongoose from 'mongoose'
import dot from 'dotenv'

import { checkAllNodes } from './check.js'
import { start } from './bot.js'
import { checkFaucet, getBalanceFaucet } from './checkFaucet.js'
import { checkPerf } from './dbCommands/updateDb/updatePerf.js'
import { allChatIds } from './dbCommands/updateDb/updateChatIds.js'

dot.config()
var time = Date.now()

await mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error))
console.log(`Time to connect with DB: ${(Date.now() - time) / 1000} sec.`)

start()

try {
    setInterval(allChatIds, 120000)
} catch (err) {
    console.error(err.msg)
}

try {
} catch (err) {
    setInterval(checkPerf, 60000)
    console.error(err.msg)
}

try {
    setInterval(checkFaucet, 16000)
} catch (err) {
    console.error(err.msg)
}

try {
    setInterval(getBalanceFaucet, 15000)
} catch (err) {
    console.error(err.msg)
}

try {
    setInterval(checkAllNodes, 30000)
} catch (err) {
    console.error(err.msg)
}
