import TelegramApi from "node-telegram-bot-api"
import dot from 'dotenv'
import * as botCommands from './bot/commands.js'

await dot.config()
export const bot = await new TelegramApi(process.env.BOT_TOKEN, {polling:true})


export const start = () => {

    bot.setMyCommands([
        {
            command: '/start',
            description: 'start the bot'
        }
    ])

    bot.on('message', async msg=>{
        let text = msg.text
        if (text === undefined) { return }
        text = text.toLocaleLowerCase()
        const curentChatId = msg.chat.id

        if (text === '/start') {
            return botCommands.start(curentChatId, msg.chat.username)
        }

        if (text.length === 64) {
            return botCommands.add(curentChatId, '/add ' + text )
        }

    })

    bot.on('callback_query', msg => {
        if (msg.data === '/nodes') {
            return botCommands.nodes(msg.message.chat.id, '/nodes')
        }
        if (msg.data.startsWith('/add')){
            return botCommands.add(msg.message.chat.id, '/add')
        }
        if (msg.data === '/rm'){
            return botCommands.rm(msg.message.chat.id, '/rm')
        }
        if(msg.data.startsWith('/rm !')){
            return botCommands.rm(msg.message.chat.id, msg.data)
        }
        if(msg.data === '/HowToFindAddress'){
            return bot.sendPhoto(
                msg.message.chat.id, 
                './pictures/Address.png',
                {caption: 'Firstly you need open: https://explorer.ssv.network/\nThen paste name of operator into search bar\nAnd After that copy address and paste it here'}
            )
        }
    })
}

export function alertNode(chatIds, status, address, name){
    chatIds.forEach(id => {
        if (status === 'Active') {
            bot.sendMessage(
                id, 
                `<b>Status of ${name} node: </b> <code>${address}</code> <b>    is ${status}</b>\u2705`, 
                {parse_mode:'HTML'}
            )
        }
        else
            bot.sendMessage(
                id, 
                `<b>Status of ${name} node: </b> <code>${address}</code> <b>    is ${status}</b>\u274c`, 
                {parse_mode:'HTML'}
            )
    })
}
