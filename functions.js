/*
    print status of all nodes in console
    arrayOfNodes - array that stores user id and node addresses
*/
var checkAllNodes = function(arrayOfNodes) {
    arrayOfNodes.forEach(element => {
        let URL = 'https://ssv-api.ssv.network/api/v1/operators/prater/'+element['nodeAddres'];
        fetch(URL)
        .then(res => res.json())
        .then(nodeData => console.log( `Status of ${element['id']} node is ${nodeData['status']}`) );
    }
)};

var checkCurrentNode = function(addressNode) {
    let URL = 'https://ssv-api.ssv.network/api/v1/operators/prater/'+addressNode;
    fetch(URL)
    .then(res => res.json())
    .then(nodeData => console.log( `Status node is ${nodeData['status']}`) );
};

export {checkAllNodes, checkCurrentNode};
