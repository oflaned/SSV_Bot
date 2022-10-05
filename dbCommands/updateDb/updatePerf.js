import fetch from 'node-fetch'

import { ssvStatus } from './../../models/ssvStatus.js'

export const checkPerf = async () => {
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
            if (node['performance'] !== res['performance']) {
                ssvStatus.updateOne(
                    { id: node['id'] },
                    { performance: res['performance'] },
                    (err, response) => {
                        if (err) throw err
                    }
                )
            }
            if (node['validators_count'] !== res['validators_count']) {
                ssvStatus.updateOne(
                    { id: node['id'] },
                    { validators_count: res['validators_count'] },
                    (err, response) => {
                        if (err) throw err
                    }
                )
            }
        } catch (err) {
            console.error(err)
            return err
        }
    })
}
