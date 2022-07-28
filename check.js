import ssvStatus from './models/ssvStatus.js'
import { alertNode } from './bot.js'


function sendRequest(url) {

    return fetch(url).then(response => {
        if (response.ok) {
            return response.json()
        }

        return response.json().then(error => {
            const e = new Error('something went wrong')
            e.data = error
            throw e
            })
    })
}


function checkAllNodes() {

    ssvStatus.find(function(err, arrayOfNodes) {
        if(err) throw err;

        arrayOfNodes.forEach(async node => {
            let currentURL = process.env.SSV_URL + node['address']
            sendRequest(currentURL).then(actulNodeInfo => {
                console.log(`Status of ${node['chatId']} node is ${actulNodeInfo['status']}`)
                if (node['status'] != actulNodeInfo['status']) { 
                    ssvStatus.updateOne({address: node['address'] }, {status: actulNodeInfo['status']}, (err, res) => { if(err) throw err })
                    alertNode(node['chatId'], actulNodeInfo['status'], node['address'])
                }
            }).catch(err => console.log(err))
        })
    
    })
}

export { checkAllNodes, sendRequest };
