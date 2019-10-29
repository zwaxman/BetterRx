class Patient {
    constructor(node) {
        this.id = node.identity.low
        for (let key in node.properties) {
            this[key]=node.properties[key]
        }
    }
}

module.exports = Patient