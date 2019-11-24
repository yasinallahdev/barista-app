function databaseInfo() {
    this.databaseName = "barista";
    this.databasePassword = "aIlxbYyRDgAmhO39";
    this.databaseCluster = "cluster0";
    this.databaseURL = () => { return `mongodb+srv://HouseCassAdmin:${this.databasePassword}@${this.databaseCluster}-osz3s.azure.mongodb.net/${this.databaseName}?retryWrites=true&w=majority`; }
}

module.exports = new databaseInfo();
