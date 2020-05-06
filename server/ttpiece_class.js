class TTPieceClass {
    constructor(data) {
        this.name = data.name;
        this.alias = this.name;
        this.icon = data.icon;
        this.type = data.type;
    }
    getData() {
        return {
            name: this.name,
            alias: this.alias,
            icon: this.icon,
            type: this.type
        }
    }
}

module.exports = TTPieceClass;