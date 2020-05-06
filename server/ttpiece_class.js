class TTPieceClass {
    constructor(data) {
        this.name = data.name;
        this.alias = this.name;
        this.icon = data.icon;
        this.type = data.type;

        this.claimed_by = null;
    }
    getData() {
        return {
            name: this.name,
            alias: this.alias,
            icon: this.icon,
            type: this.type
        }
    }
    unclaim(player) {
        if (this.claimed_by == player) {
            this.claimed_by = null;
            this.alias = this.name;
        }
    }
    claim(player) {
        this.claimed_by = player;
        this.alias = player.name;
    }
}

module.exports = TTPieceClass;