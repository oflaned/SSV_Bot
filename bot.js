import TelegramApi from "node-telegram-bot-api"
import dot from 'dotenv'
import ssvStatus from './models/ssvStatus.js'
import { sendRequest } from './check.js'


dot.config()
const bot = new TelegramApi(process.env.BOT_TOKEN, {polling:true})


const start = () => {

    bot.setMyCommands([
        {
            command:'/add',
            description: 'add your node by address'
        },
        {
            command: '/help',
            description: 'list of commands'
        },
        {
            command: '/start',
            description: 'start the bot'
        }
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const curentChatId = msg.chat.id;

        if (text === '/start') { bot.sendMessage(curentChatId, `Hi, @${msg.chat.username}\n\n Here you can add your ssv node to track status\n Please write /add addressOfNode`) }

        if (text === '/add') { return bot.sendMessage(curentChatId,`Please write address of your node after /add `) }

        if (text.startsWith('/add ')){
            let addressFromMessage = msg.text.replace('/add ','')
            if(addressFromMessage.length != 64) { return bot.sendMessage(curentChatId,`You are write a wrong address`) }
            sendRequest(process.env.SSV_URL+addressFromMessage).then(res => {
                ssvStatus.findOne({address: addressFromMessage}).then(response => {
                    if (response === null) {
                        ssvStatus.create({chatId:curentChatId, address: addressFromMessage}, (err, res) => { if(err) throw err })
                        return bot.sendMessage(curentChatId,`Node was successfully added`)
                    }
                    if (response.chatId.indexOf(curentChatId) != -1) { return bot.sendMessage(curentChatId,`Node was already added`) } 

                    let newChaitIdArray = response.chatId
                    newChaitIdArray.push(curentChatId)
                    ssvStatus.findOneAndUpdate({address: addressFromMessage},{chatId: newChaitIdArray }, (err, res) => { if(err) throw err })
                    return bot.sendMessage(curentChatId,`Node was successfully added`)
                })
            }).catch(err => { return bot.sendMessage(curentChatId,`You are write a wrong address`) })
        }

    })
}

function alertNode(chatIds, status, address){
    console.log(chatIds)
    chatIds.forEach(element => {
        bot.sendMessage(element, `Status of node: ${address} ${status}`)
    });
}

export {start, alertNode}