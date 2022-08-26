import { ssvStatus } from './../models/ssvStatus.js'
import { bot } from './../bot.js'
import dot from 'dotenv'
import { sendRequest } from './../check.js'
import * as message from './messages.js'
import { menu } from './bottoms.js'


dot.config()
export const start = (curentChatId, username) => {
    return bot.sendMessage(
        curentChatId, 
        `Hi, @${username}\n
Here you can track status of SSV operator
If status of your node will change so bot will send a message for you\n
If you need any help or find any bug please write @ofsorely🙃`,
        {parse_mode:'HTML', reply_markup: menu.main}
    )
}

export const add = (curentChatId, text) => {
    if (text === '/add') { 
        return bot.sendMessage(
            curentChatId,
            message.writeId, 
            {parse_mode:'HTML', reply_markup: menu.helpId}
        )
    }

    if (text.startsWith('/add ')){
        let idFromMessage = text.replace('/add ','')

        sendRequest(process.env.SSV_URL+idFromMessage).then(res => {
            ssvStatus.findOne({id: idFromMessage}).then(response => {
                if (response === null) {
                    ssvStatus.create({
                        chatId:  curentChatId, 
                        id:      idFromMessage, 
                        name:    res['name'] }, 
                        (err, res) => { if(err) throw err }
                    )
                    return bot.sendMessage(
                        curentChatId,
                        message.nodeAdded, 
                        {parse_mode:'HTML', reply_markup: menu.main}
                    )
                }

                if (response.chatId.indexOf(curentChatId) !== -1) { 
                    return bot.sendMessage(
                        curentChatId,
                        message.alreadyAdded, 
                        {parse_mode:'HTML', reply_markup: menu.main}
                    )
                } 

                let newChaitIdArray = response.chatId
                newChaitIdArray.push(curentChatId)
                ssvStatus.findOneAndUpdate(
                    {id: idFromMessage},
                    {chatId:  newChaitIdArray }, 
                    (err, res) => { if(err) throw err }
                )
                return bot.sendMessage(
                    curentChatId,
                    message.nodeAdded, 
                    {parse_mode:'HTML', reply_markup: menu.main}
                )
            })
        }).catch(err => { return bot.sendMessage(curentChatId, message.wrongId), {parse_mode:'HTML'} })
    }
}

export const nodes = (curentChatId) => {
    ssvStatus.find({chatId: curentChatId}, (err, nodes) => {
        console.log(nodes)
        var str = ``
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i]['status'] === 'Active') {
                str += `<b>${nodes[i]['name']} node is ${nodes[i]['status']}</b>\u2705\n\n`
            } else { 
                str += `<b>${nodes[i]['name']} node is ${nodes[i]['status']}</b>\u274c\n\n` 
            }
        }
        if(str === ``) {
            return bot.sendMessage(
                curentChatId, 
                message.noNodes, 
                {parse_mode:'HTML', reply_markup: menu.main}
            )
        }
        return bot.sendMessage(
            curentChatId, 
            str, 
            {parse_mode:'HTML', reply_markup: menu.main}
        )
    })
}

export const rm = async (curentChatId, text) => {
    if (text === '/rm') {
        let nodes = []
        let dbNodes = await ssvStatus.find({chatId: curentChatId})
        if (dbNodes.length === 0) {
            return bot.sendMessage(
                curentChatId, 
                `You dont have any added node`, 
                {parse_mode:'HTML', reply_markup: menu.main}
            )
        }
        for (let i = 0; i < dbNodes.length; i++){
            let text = `🗑remove ${dbNodes[i].name}`
            let rem = `/rm !${dbNodes[i].name}`
            nodes.push([{text: text, callback_data: rem}])
        }
        let toDelete = {
            inline_keyboard: nodes
        }
        return bot.sendMessage(
            curentChatId, 
            `Select node to delete:`, 
            {parse_mode:'HTML', reply_markup: toDelete}
        )
    }
    if(text.startsWith('/rm !')){
        let nameOfNode = text.replace('/rm !','')
        let node = await ssvStatus.find({name: nameOfNode})
        if (node[0].id === undefined) { return }

        let newChaitIdArray = node[0].chatId
        if (newChaitIdArray.indexOf(curentChatId) === -1) { return }

        newChaitIdArray.splice(newChaitIdArray.indexOf(curentChatId), 1)
        
        ssvStatus.findOneAndUpdate(
            {name: nameOfNode}, 
            {chatId: newChaitIdArray}, 
            (err, res) => { if(err) throw err }
        )
        return bot.sendMessage(
            curentChatId, 
            message.nodeDeleted, 
            {parse_mode:'HTML', reply_markup: menu.main}
        )
    }
}

export const helpWithAddr = (chatId) => {
    return bot.sendPhoto(
        chatId, 
        './pictures/Address.png'
    )
}

