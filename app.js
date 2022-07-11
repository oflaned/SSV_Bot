
var hamsterNode = '234ee9a8c9dadd2c2603d64f3a0f5119ebff2bec16550a76ba9f74b0c04f9054'


const URL = 'https://ssv-api.ssv.network/api/v1/operators/prater/';
    fetch(URL+hamsterNode)
    .then(res => res.json())
    .then(text => {
        console.log(text['status'])
    })

