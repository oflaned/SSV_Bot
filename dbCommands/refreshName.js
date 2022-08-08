import { ssvStatus } from './../models/ssvStatus.js'
import fetch from 'node-fetch'

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
        let currentURL = process.env.SSV_URL + node['address']
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
            ssvStatus.updateOne({address: node['address'] }, {name: res['name']}, (err, response) => { if(err) throw err })
        }
    })
}