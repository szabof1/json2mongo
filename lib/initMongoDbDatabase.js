"use strict";
const fs = require("fs");
const path = require("path");
const async = require("async");
const config = require("config");
const mongoose = require("mongoose");
const _ = require("lodash");
const index_1 = require("./models/index");
function initMongoDbDatabase(path2json, mapModel2Json) {
    if (!mapModel2Json)
        mapModel2Json = {};
    let conf = config;
    mongoose.connect(conf.mongoConnection);
    let nModelDocs = 0;
    let nAllDocs = 0;
    async.eachSeries(Object.keys(index_1.models), processJsonFile, cleanUp);
    function processJsonFile(modelName, cbJson) {
        let model = index_1.models[modelName];
        let jsonFileName;
        if (modelName in mapModel2Json) {
            jsonFileName = mapModel2Json[modelName];
        }
        if (!jsonFileName)
            jsonFileName = 'get' + modelName + '.json';
        let filePath = path.join(path2json, modelName.toLowerCase(), jsonFileName);
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.error(`ERROR opening JSON '${filePath}': `, err);
                return cbJson(err);
            }
            console.error(`Opening JSON '${filePath}'`);
            let obj = JSON.parse(data);
            let docs = _.get(obj, "value", []);
            nModelDocs = 0;
            let processDocForModel = _.curry(processDoc)(model);
            let summaryForModel = _.curryRight(summary)(modelName);
            async.eachSeries(docs, processDocForModel, summaryForModel);
        });
        function processDoc(model, doc, cbDoc) {
            // Create Model instance,
            // this way Mongoose converts data from simple types (eg. strings to ObjectIds or Dates)
            let docToAdd = new model(doc);
            // The method for doing upsert comes from Clint Harris' answer
            // on Stackoverflow.com
            // http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
            // Convert the Model instance to a simple object using Model's 'toObject' function
            // to prevent weirdness like infinite looping...
            var upsertDoc = docToAdd.toObject();
            // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
            delete upsertDoc._id;
            // Do the upsert, which works like this: If no Contact document exists with
            // _id = contact.id, then create a new doc using upsertData.
            // Otherwise, update the existing doc with upsertData
            model.update({ _id: docToAdd._id }, upsertDoc, { upsert: true }, function (err, result) {
                if (err) {
                    console.error("    ERROR saving doc: ", err);
                    return cbDoc(err);
                }
                console.log(`    Item upserted {_id: '${docToAdd._id}'}`);
                //console.log('      ', result, result.nModified)
                if (_.has(result, 'upserted'))
                    nModelDocs += result.upserted.length;
                return cbDoc(null);
            });
        }
        function summary(err, modelName) {
            if (err) {
                console.error(`  ERROR after processing model '${modelName}':`, err);
            }
            console.log(`  Number of '${modelName}' documents upserted: ${nModelDocs}`);
            nAllDocs += nModelDocs;
            return cbJson(null);
        }
    }
    function cleanUp() {
        console.log(`Number of documents upserted: ${nAllDocs}`);
        console.log("FINISHED");
        mongoose.disconnect;
        process.exit(0);
    }
}
exports.initMongoDbDatabase = initMongoDbDatabase;
//# sourceMappingURL=initMongoDbDatabase.js.map