"use strict";
const fs = require("fs");
const path = require("path");
const async = require("async");
const config = require("config");
const mongoose = require("mongoose");
const _ = require("lodash");
const index_1 = require("./models/index");
function initMongoDbDatabase(path2json, mapModel2Json) {
    let conf = config;
    mongoose.connect(conf.mongoConnection);
    let n = 0;
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
            n = 0;
            let processDocForModel = _.curry(processDoc)(model);
            let summaryForModel = _.curryRight(summary)(modelName);
            async.eachSeries(docs, processDocForModel, summaryForModel);
        });
        function processDoc(model, doc, cbDoc) {
            // TODO: check if the document exist, if yes then replace it (do an upsert)
            let docToAdd = new model(doc);
            docToAdd.save(function (err) {
                if (err) {
                    console.error("ERROR saving doc: ", err);
                    return cbDoc(err);
                }
                console.log(`Item added {_id: '${docToAdd._id}'}`);
                n++;
                return cbDoc(null);
            });
        }
        function summary(err, modelName) {
            if (err) {
                console.error(`ERROR after processing model '${modelName}':`, err);
            }
            console.log(`Number of '${modelName}' documents inserted: ${n}`);
            return cbJson(null);
        }
    }
    function cleanUp() {
        console.log("FINISHED");
        mongoose.disconnect;
        process.exit(0);
    }
}
exports.initMongoDbDatabase = initMongoDbDatabase;
//# sourceMappingURL=initMongoDbDatabase.js.map