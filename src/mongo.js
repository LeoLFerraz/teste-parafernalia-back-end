const MongoClient = require("mongodb").MongoClient;

const flightsConnection = "mongodb+srv://admin:admin@parafernaliateste.cmbjw.mongodb.net/flights?retryWrites=true&w=majority";

function initialize(
        dbName,
        dbCollectionName,
        successCallback,
        failureCallback
) {
    MongoClient.connect(flightsConnection, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err);
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

module.exports = {
    initialize
};
