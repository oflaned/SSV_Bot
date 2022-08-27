import fetch from 'node-fetch'
import { alertFaucet } from './bot.js'

const ApiGoerli = "https://api-goerli.etherscan.io/api?module=account&action=balance&address=0x5bbd9ec2ade6deccc162fed2e743c2c86eed033e&tag=latest&apikey=YourApiKeyToken"
let isActiveFaucet = false
export let balance = 0

export const checkFaucet = async () => {
    if (balance > 32 && isActiveFaucet === false) {
        isActiveFaucet = true
        return alertFaucet(true)
    }
    if (balance <= 32 && isActiveFaucet === true) {
        isActiveFaucet = false
        return alertFaucet(false)
    }
}

export const getBalanceFaucet = async () => {
    let res
    try {
        res = await fetch(ApiGoerli)
        if (res.ok){
            res = await res.json()
            let checkbalance = res.result / 1000000000000000000
            if (checkbalance) {
                balance = checkbalance
            }
            return
        }
        else {
            throw 'Error while get data from ssv API-Goerli'
        }
    } catch(err){
        console.error(err)
        return err
    }
}