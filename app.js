import fs from 'fs';

const PATH = './db.json';
const db = JSON.parse(fs.readFileSync(PATH));


//Out status of all nodes
db.forEach(element => {
    const URL = 'https://ssv-api.ssv.network/api/v1/operators/prater/'+element['nodeAddres'];
    fetch(URL)
    .then(res => res.json())
    .then(nodeData => {
        console.log(`Status of ${element['id']} node is ${nodeData['status']}`)
    });
});
