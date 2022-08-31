import fetch from 'node-fetch'

import { ssvStatus } from './models/ssvStatus.js'
import { alertNode } from './bot.js'

export function sendRequest(url) {
    return fetch(url).then((response) => {
        if (response.ok) return response.json()

        return response.json().then((error) => {
            const e = new Error('something went wrong')
            e.data = error
            throw e
        })
    })
}

export async function checkAllNodes() {
    let db
    try {
        db = await ssvStatus.find()
    } catch (err) {
        console.error(err)
        err.msg = 'Error while reading db'
        throw err
    }

    db.forEach(async (node) => {
        let currentURL = process.env.SSV_URL + node['id']
        let res
        try {
            res = await fetch(currentURL)
            if (res.ok) {
                res = await res.json()
            } else {
                throw 'Error while get data from ssv API'
            }
        } catch (err) {
            console.error(err)
            return err
        }

        console.log(`Status of ${node['id']} node is ${res['status']}`)

        if (node['status'] !== res['status']) {
            ssvStatus.updateOne(
                { id: node['id'] },
                { status: res['status'] },
                (err, response) => {
                    if (err) throw err
                }
            )
            alertNode(node['chatId'], res['status'], node['name'])
        }
    })
}
