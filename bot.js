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
        if (text.startsWith('/add')) {
            return botCommands.add(curentChatId, text)
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
                {caption: 'Firstly you need open: https://explorer.ssv.network/\nThen paste name of operator into search bar\nAnd After that copy id and paste it here after /add'}
            )
        }
    })
}

export function alertNode(chatIds, status, name){
    chatIds.forEach(id => {
        if (status === 'Active') {
            bot.sendMessage(
                id, 
                `<b>Status of ${name} node is ${status}</b>\u2705`, 
                {parse_mode:'HTML'}
            )
        }
        else
            bot.sendMessage(
                id, 
                `<b>Status of ${name} node: is ${status}</b>\u274c`, 
                {parse_mode:'HTML'}
            )
    })
}

export function alertUpdate() {
    let ids = [
        '703743978',  '417194626',  '416646558',
        '603122970',  '700688372',  '5201951089',
        '1849448384', '1605819557', '5061122895',
        '5352629829', '402363340',  '5297217755',
        '1384145708', '409831755',  '1913943',
        '5424190480', '540690418',  '418543388',
        '6722095',    '309573569',  '2093898765',
        '5038085326', '1879436489', '5062397121',
        '509326639',  '374242025',  '270156696'
    ]
    ids.forEach(id => {
        bot.sendMessage(
            id,
            `<b>Bot was updated to the Shifu Testnet\n\n You need to add your node again</b>\u2705`, 
            {parse_mode:'HTML'}
        )
    })
}
