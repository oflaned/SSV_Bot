import TelegramApi from "node-telegram-bot-api"
import dot from 'dotenv'
import { ssvStatus } from './models/ssvStatus.js'
import { sendRequest } from './check.js'

dot.config()
const bot = new TelegramApi(process.env.BOT_TOKEN, {polling:true})


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
        const text = msg.text;
        const curentChatId = msg.chat.id;
        if (!text) return

        if (text === '/start') { bot.sendMessage(curentChatId, `Hi, @${msg.chat.username}\n\n Here you can add your ssv node to track status\n by command <code>/add addressOfNode</code>`, {parse_mode:'HTML'}) }

        if (text === '/add') { return bot.sendMessage(curentChatId,`Please write  <b>address of node</b>  after <code>/add</code> `, {parse_mode:'HTML'}) }

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

        if(text === '/nodes') {
            ssvStatus.find({chatId: curentChatId}, (err, nodes) => {
                var str = ``
                for(let i = 0; i < nodes.length;i++){
                    if(nodes[i]['status']=='Active') {
                        str += `<b>SSV Node ${i+1}:</b> <code>${nodes[i]['address']}</code>    <b>${nodes[i]['status']}</b>\u2705\n\n`
                    } else { str += `<b>SSV Node ${i+1}:</b> <code>${nodes[i]['address']}</code>    <b>${nodes[i]['status']}</b>\u274c\n\n` }
                }
                return bot.sendMessage(curentChatId, str, {parse_mode:'HTML'})
            })
        }

        if (text === '/rm') { return bot.sendMessage(curentChatId,`Please write  <b>address of node</b>  after <code>/rm</code> `, {parse_mode:'HTML'}) }

        if(text.startsWith('/rm ')) {
            let addressFromMessage = msg.text.replace('/rm ','')
            if(addressFromMessage.length != 64) { return bot.sendMessage(curentChatId,`You are wrote a wrong address`) }
            ssvStatus.findOne({address: addressFromMessage}).then (res => {
                if (res === null) {
                    return bot.sendMessage(curentChatId,`You are wrote a wrong address`)
                }
                let newChaitIdArray = res.chatId
                delete newChaitIdArray[newChaitIdArray.indexOf(curentChatId)]
                ssvStatus.findOneAndUpdate({address: addressFromMessage}, {chatId: newChaitIdArray}, (err, res) => { if(err) throw err })
                return bot.sendMessage(curentChatId,`<b>Node successfully deleted</b>`, {parse_mode:'HTML'})
                
            }).catch(err => { console.log(err) }) 
        }

    })
}

export function alertNode(chatIds, status, address){
    console.log(chatIds)
    chatIds.forEach(id => {
        if (status === 'Active')
            bot.sendMessage(id, `<b>Status of node:</b> <code>${address}</code> <b>    is ${status}</b>\u2705`, {parse_mode:'HTML'})
        else
            bot.sendMessage(id, `<b>Status of node:</b> <code>${address}</code> <b>    is ${status}</b>\u274c`, {parse_mode:'HTML'})
    });
}
