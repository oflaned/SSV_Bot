import ssvStatus from './models/ssvStatus.js'

const URL = 'https://ssv-api.ssv.network/api/v1/operators/prater/'

//Thats need to be with bot
var sendMsg = function(chatId, address){

}

function sendRequest( url) {
          
    return fetch(url, {
    }).then(response => {
        if (response.ok) {
            return response.json()
        }

        return response.json().then(error => {
            const e = new Error('Что-то пошло не так')
            e.data = error
            throw e
            })
    })
}

var checkAllNodes =  function() {

    ssvStatus.find(function(err, arrayOfNodes) {
        if(err) throw err;

        arrayOfNodes.forEach( node => {
            let currentURL = URL + node['address']
            
            sendRequest(currentURL)
            .then(actulNodeInfo => {
                console.log(`Status of ${node['chatId']} node is ${actulNodeInfo['status']}`)
                if (node['status'] != actulNodeInfo['status']) { 
                    ssvStatus.updateOne({address: node['address'] }, {status: actulNodeInfo['status']}, function(err, res){ if(err) throw err })
                    //sendMsg(node['chatId'], node['address']);
                }
                
            }).catch(err => console.log(err)) 
        })
    })
}

export { checkAllNodes };
