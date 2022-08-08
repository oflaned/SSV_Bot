import { ssvStatus } from './../models/ssvStatus.js'
import { bot } from './../bot.js'
import dot from 'dotenv'
import { sendRequest } from './../check.js'

dot.config()

export const add = (curentChatId, text) => {
    if (text === '/add') { return bot.sendMessage(curentChatId,`Please write address of node  after command <code>/add</code> `, {parse_mode:'HTML'}) }

    if (text.startsWith('/add ')){
        let addressFromMessage = text.replace('/add ','')
        if(addressFromMessage.length !== 64) { return bot.sendMessage(curentChatId,`You are write a wrong address`) }
        sendRequest(process.env.SSV_URL+addressFromMessage).then(res => {
            ssvStatus.findOne({address: addressFromMessage}).then(response => {
                console.log(res['name'])
                if (response === null) {
                    ssvStatus.create({chatId:curentChatId, address: addressFromMessage, name: res['name']}, (err, res) => { if(err) throw err })
                    return bot.sendMessage(curentChatId,`Node was successfully added`)
                }

                if (response.chatId.indexOf(curentChatId) !== -1) { 
                    return bot.sendMessage(curentChatId,`Node was already added`) 
                } 

                let newChaitIdArray = response.chatId
                newChaitIdArray.push(curentChatId)
                ssvStatus.findOneAndUpdate({address: addressFromMessage},{chatId: newChaitIdArray }, (err, res) => { if(err) throw err })
                return bot.sendMessage(curentChatId,`Node was successfully added`)
            })
        }).catch(err => { return bot.sendMessage(curentChatId,`You are write a wrong address`) })
    }
}

export const nodes = (curentChatId, text) => {
    if(text === '/nodes') {
        ssvStatus.find({chatId: curentChatId}, (err, nodes) => {
            var str = ``
            for(let i = 0; i < nodes.length;i++){
                if(nodes[i]['status'] === 'Active') {
                    str += `<b>${nodes[i]['name']}:</b> <code>${nodes[i]['address']}</code>   <b>${nodes[i]['status']}</b>\u2705\n\n`
                } else { 
                    str += `<b>${nodes[i]['name']}:</b> <code>${nodes[i]['address']}</code>   <b>${nodes[i]['status']}</b>\u274c\n\n` 
                }
            }
            if( str === ``) {
                return bot.sendMessage(curentChatId, `You dont have any added node`)
            }
            return bot.sendMessage(curentChatId, str, {parse_mode:'HTML'})
        })
    }
}

export const rm = (curentChatId, text) => {
    if (text === '/rm') { return bot.sendMessage(curentChatId,`Please write  <b>address of node</b>  after <code>/rm</code> `, {parse_mode:'HTML'}) }

    if(text.startsWith('/rm ')) {
        let addressFromMessage = text.replace('/rm ','')
        if(addressFromMessage.length !== 64) { return bot.sendMessage(curentChatId,`You are wrote a wrong address`) }
        ssvStatus.findOne({address: addressFromMessage}).then (res => {
            if (res === null) {
                return bot.sendMessage(curentChatId,`You are wrote a wrong address`)
            }
            let newChaitIdArray = res.chatId
            if (newChaitIdArray.indexOf(curentChatId) === -1) {
                return bot.sendMessage(curentChatId,`You are wrote a wrong address`)
            }
            newChaitIdArray.splice(newChaitIdArray.indexOf(curentChatId), 1)
            ssvStatus.findOneAndUpdate({address: addressFromMessage}, {chatId: newChaitIdArray}, (err, res) => { if(err) throw err })
            return bot.sendMessage(curentChatId,`<b>Node successfully deleted</b>`, {parse_mode:'HTML'})
            
        }).catch(err => { console.log(err) }) 
    }
}