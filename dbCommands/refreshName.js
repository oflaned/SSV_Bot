import fetch from 'node-fetch'

import { ssvStatus } from './../models/ssvStatus.js'


export const refreshName = async () => {
    let db
    try {
        db = await ssvStatus.find()
    } catch(err) {
        console.error(err)
        err.msg = 'Error while reading db'
        throw err
    }

    db.forEach(async node => {
        let currentURL = process.env.SSV_URL + node['id']
        let res
        try {
            res = await fetch(currentURL)
            if (res.ok){
                res = await res.json()
            }
            else {
                throw 'Error while get data from ssv API'
            }
        } catch(err) {
            console.error(err)
            return err
        }

        if (node['name'] === "SSV node") { 
            ssvStatus.updateOne({id: node['id'] }, {name: res['name']}, (err, response) => { if(err) throw err })
        }
    })
}

export const allChatIds = async () => {
    let db
    try {
        db = await ssvStatus.find()
    } catch(err) {
        console.error(err)
        err.msg = 'Error while reading db'
        throw err
    }
    let ids = []
    db.forEach(async node => {
        node.chatId.forEach(id => {
            if (ids.indexOf(id) === -1)
            ids.push(id)
        })
    })
    console.log(ids)
}