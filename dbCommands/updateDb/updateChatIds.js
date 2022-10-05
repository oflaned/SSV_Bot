import fetch from 'node-fetch'

import { ssvChatIds, ssvFaucet, ssvStatus } from '../../models/ssvStatus.js'

export const allChatIds = async () => {
    let db
    let ids = []
    try {
        db = await ssvStatus.find()
        db.forEach(async (node) => {
            node.chatId.forEach((id) => {
                if (ids.indexOf(id) === -1) ids.push(id)
            })
        })
    } catch (err) {
        console.error(err)
        err.msg = 'Error while reading db'
        throw err
    }

    try {
        db = await ssvFaucet.find()
        db.forEach(async (chatId) => {
            if (ids.indexOf(chatId.id) === -1) ids.push(chatId.id)
        })
    } catch (err) {
        console.error(err)
        err.msg = 'Error while reading db'
        throw err
    }
    ids.forEach(async (id) => {
        if ((await ssvChatIds.find({ chatId: id })).length === 0) {
            ssvChatIds.create({ chatId: id }, (err, res) => {
                if (err) throw err
            })
        }
    })
}
