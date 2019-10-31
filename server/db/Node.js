class Node {
    constructor(node) {
        this.id = node.identity.low
        this.label = node.labels[0]
        for (let key in node.properties) {
            if (key !== 'password'){
                this[key]=node.properties[key]
            }
        }
    }
}

module.exports = Node