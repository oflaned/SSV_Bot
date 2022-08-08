import TelegramApi from "node-telegram-bot-api"
import dot from 'dotenv'
import * as botCommands from './bot/commands.js'

await dot.config()
let token = process.env.BOT_TOKEN
export const bot = await new TelegramApi(process.env.BOT_TOKEN, {polling:true})


export const start = () => {

    bot.setMyCommands([
        {
            command: '/start',
            description: 'start the bot'
        },
        {
            command:'/add',
            description: 'add node by address'
        },
        {
            command: '/nodes',
            description: 'list of nodes'
        },
        {
            command: '/rm',
            description: 'delete node'
        }
    ])

    bot.on('message', async msg=>{
        let text = msg.text
        if (text === undefined) { return }
        text = text.toLocaleLowerCase()
        const curentChatId = msg.chat.id


        if ( text === '/start' ) { 
            bot.sendMessage(curentChatId, `Hi, @${msg.chat.username}\n\n Here you can add your ssv node to track status\n by command <code>/add addressOfNode</code>`, {parse_mode:'HTML'}) 
        }

        if ( text.startsWith('/add') ) {
            botCommands.add(curentChatId, text)
        }

        if ( text.startsWith('/nodes') ) {
            botCommands.nodes(curentChatId, text)
        }

        if ( text.startsWith('/rm') ) {
            botCommands.rm(curentChatId, text)
        }

    })
}

export function alertNode(chatIds, status, address, name){
    console.log(`msg to ${chatIds}`)
    console.log(name)
    chatIds.forEach(id => {
        if (status === 'Active')
            bot.sendMessage(id, `<b>Status of ${name} node: </b> <code>${address}</code> <b>    is ${status}</b>\u2705`, {parse_mode:'HTML'})
        else
            bot.sendMessage(id, `<b>Status of ${name} node: </b> <code>${address}</code> <b>    is ${status}</b>\u274c`, {parse_mode:'HTML'})
    });
}
