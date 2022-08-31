import dot from 'dotenv'

import { ssvFaucet, ssvStatus } from './../models/ssvStatus.js'
import { bot } from './../bot.js'
import { sendRequest } from './../check.js'
import * as message from './messages.js'
import { menu } from './bottoms.js'
import { balance } from '../checkFaucet.js'

dot.config()
export const start = (curentChatId, username) => {
    return bot.sendMessage(
        curentChatId,
        `Hi, @${username}\n
Here you can track status of SSV operator
If status of your node will change so bot will send a message for you\n
If you need any help or find any bug please write @ofsorely🙃`,
        { parse_mode: 'HTML', reply_markup: menu.main }
    )
}

export const add = (curentChatId, text) => {
    if (text === '/add') {
        return bot.sendMessage(curentChatId, message.writeId, {
            parse_mode: 'HTML',
            reply_markup: menu.helpAndMenu,
        })
    }

    if (text.startsWith('/add ')) {
        let idFromMessage = text.replace('/add ', '')

        sendRequest(process.env.SSV_URL + idFromMessage)
            .then((res) => {
                ssvStatus.findOne({ id: idFromMessage }).then((response) => {
                    if (response === null) {
                        ssvStatus.create(
                            {
                                chatId: curentChatId,
                                id: idFromMessage,
                                name: res['name'],
                            },
                            (err, res) => {
                                if (err) throw err
                            }
                        )
                        return bot.sendMessage(
                            curentChatId,
                            message.nodeAdded,
                            {
                                parse_mode: 'HTML',
                                reply_markup: menu.goMain,
                            }
                        )
                    }

                    if (response.chatId.indexOf(curentChatId) !== -1) {
                        return bot.sendMessage(
                            curentChatId,
                            message.alreadyAdded,
                            {
                                parse_mode: 'HTML',
                                reply_markup: menu.goMain,
                            }
                        )
                    }

                    let newChatIdArray = response.chatId
                    newChatIdArray.push(curentChatId)
                    ssvStatus.findOneAndUpdate(
                        { id: idFromMessage },
                        { chatId: newChatIdArray },
                        (err, res) => {
                            if (err) throw err
                        }
                    )
                    return bot.sendMessage(curentChatId, message.nodeAdded, {
                        parse_mode: 'HTML',
                        reply_markup: menu.main,
                    })
                })
            })
            .catch((err) => {
                return (
                    bot.sendMessage(curentChatId, message.wrongId),
                    { parse_mode: 'HTML' }
                )
            })
    }
}

export const nodes = (curentChatId) => {
    ssvStatus.find({ chatId: curentChatId }, (err, nodes) => {
        if (nodes.length === 0) {
            return bot.sendMessage(curentChatId, message.noNodes, {
                parse_mode: 'HTML',
                reply_markup: menu.addMain,
            })
        }
        var str = `Status of your nodes:\n\n`
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i]['status'] === 'Active') {
                str += `    <b>id: ${nodes[i]['id']} | ${nodes[i]['name']} node is ${nodes[i]['status']}</b>\u2705\n\n`
            } else {
                str += `    <b>id: ${nodes[i]['id']} | ${nodes[i]['name']} node is ${nodes[i]['status']}</b>\u274c\n\n`
            }
        }
        return bot.sendMessage(curentChatId, str, {
            parse_mode: 'HTML',
            reply_markup: menu.addRmMain,
        })
    })
}

export const rm = async (curentChatId, text) => {
    if (text === '/rm') {
        let nodes = []
        let dbNodes = await ssvStatus.find({ chatId: curentChatId })
        if (dbNodes.length === 0) {
            return bot.sendMessage(
                curentChatId,
                `You dont have any added node`,
                {
                    parse_mode: 'HTML',
                    reply_markup: menu.goMain,
                }
            )
        }
        for (let i = 0; i < dbNodes.length; i++) {
            let text = `🗑remove ${dbNodes[i].name}`
            let rem = `/rm !${dbNodes[i].name}`
            nodes.push([{ text: text, callback_data: rem }])
        }
        let toDelete = {
            inline_keyboard: nodes,
        }
        return bot.sendMessage(curentChatId, `Select node to delete:`, {
            parse_mode: 'HTML',
            reply_markup: toDelete,
        })
    }
    if (text.startsWith('/rm !')) {
        let nameOfNode = text.replace('/rm !', '')
        let node = await ssvStatus.find({ name: nameOfNode })
        if (node[0].id === undefined) {
            return
        }

        let newChaitIdArray = node[0].chatId
        if (newChaitIdArray.indexOf(curentChatId) === -1) {
            return
        }

        newChaitIdArray.splice(newChaitIdArray.indexOf(curentChatId), 1)

        ssvStatus.findOneAndUpdate(
            { name: nameOfNode },
            { chatId: newChaitIdArray },
            (err, res) => {
                if (err) throw err
            }
        )
        return bot.sendMessage(curentChatId, message.nodeDeleted, {
            parse_mode: 'HTML',
            reply_markup: menu.goMain,
        })
    }
}

export const helpWithAddr = (chatId) => {
    return bot.sendPhoto(chatId, './pictures/Address.png')
}

export const disableNotification = async (chatId) => {
    ssvFaucet
        .findOneAndUpdate({ id: chatId }, { ping: false })
        .then(() => faucetMenu(chatId))
        .catch((err) => {
            console.error(err)
        })
}

export const enableNotification = async (chatId) => {
    ssvFaucet
        .findOneAndUpdate({ id: chatId }, { ping: true })
        .then(() => faucetMenu(chatId))
        .catch((err) => {
            console.error(err)
        })
}

export const faucetMenu = async (chatId) => {
    let id = await ssvFaucet.find({ id: chatId })
    let str = ``
    if (balance > 32) {
        str += `SSV Testnet Goerli Bot: \n \nFaucet Balance: ${balance.toFixed(
            4
        )} GoerliEth (Active)\n`
    } else {
        str += `SSV Testnet Goerli Bot: \n \nFaucet Balance: ${balance.toFixed(
            4
        )} GoerliEth (Inactive)\n`
    }
    let notification = [[{ text: '🔙Menu', callback_data: '/start' }]]

    if (id.length === 0) {
        ssvFaucet.create({ id: chatId }, (err, res) => {
            if (err) throw err
        })
        str += `Notification: <b>disable</b>❌`
        let text = `Enable Notification✅`
        let callback = `/enableNotification`
        notification.push([{ text: text, callback_data: callback }])

        let notification_keyboard = {
            inline_keyboard: notification,
        }
        return bot.sendMessage(chatId, str, {
            parse_mode: 'HTML',
            reply_markup: notification_keyboard,
        })
    }

    if (id.length !== 0) {
        if (id[0].ping === true) {
            str += `Notification: <b>enable</b>✅`
            let text = `Disable Notification❌`
            let callback = `/disableNotification`
            notification.push([{ text: text, callback_data: callback }])
        } else {
            str += `Notification: <b>disable</b>❌`
            let text = `Enable Notification✅`
            let callback = `/enableNotification`
            notification.push([{ text: text, callback_data: callback }])
        }
        let notification_keyboard = {
            inline_keyboard: notification,
        }
        return bot.sendMessage(chatId, str, {
            parse_mode: 'HTML',
            reply_markup: notification_keyboard,
        })
    }
}
