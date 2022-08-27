import TelegramApi from "node-telegram-bot-api"
import dot from 'dotenv'

import * as botCommands from './bot/commands.js'
import { menu } from './bot/bottoms.js'
import { ssvFaucet } from "./models/ssvStatus.js"


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
        if (msg.data === '/start') {
            return bot.sendMessage(
                msg.message.chat.id,
                `If status of your node will change so bot will send a message for you\n
If you need any help or find any bug please write @ofsorely🙃`,
                {parse_mode:'HTML', reply_markup: menu.main}
                )
        }
        if (msg.data === '/nodes') {
            return botCommands.nodes(msg.message.chat.id, '/nodes')
        }
        if (msg.data.startsWith('/add')) {
            return botCommands.add(msg.message.chat.id, '/add')
        }
        if (msg.data === '/rm') {
            return botCommands.rm(msg.message.chat.id, '/rm')
        }
        if (msg.data.startsWith('/rm !')) {
            return botCommands.rm(msg.message.chat.id, msg.data)
        }
        if (msg.data === '/HowToFindAddress') {
            return bot.sendPhoto(
                msg.message.chat.id, 
                './pictures/Address.png',
                {caption: 'Firstly you need open: https://explorer.ssv.network/\nThen paste name of operator into search bar\nAnd After that copy id and paste it here after /add'}
            )
        }
        if (msg.data === '/faucetMenu') {
            return botCommands.faucetMenu(msg.message.chat.id)
        }

        if (msg.data === '/disableNotification') {
            return botCommands.disableNotification(msg.message.chat.id)
        }

        if (msg.data === '/enableNotification') {
            return botCommands.enableNotification(msg.message.chat.id)
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

export const alertFaucet = (isActive) => {
    try {
        ssvFaucet.find({ping: true})
        .then(res => {
            if(res.length === 0) { return }
            if(isActive){
                res.forEach(ping => {
                    bot.sendMessage(
                        ping.id,
                        `🤖<b>Faucet is Active!</b>✅`,
                        {parse_mode:'HTML'}
                    )
                })
            }
            else {
                res.forEach(ping => {
                    bot.sendMessage(
                        ping.id,
                        `🤖<b>Faucet is Inactive!</b>❌`,
                        {parse_mode:'HTML'}
                    )
                })  
            }
            
        })
    } catch(err) {
        console.error(err)
    }
}
