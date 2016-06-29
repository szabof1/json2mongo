var initMongo = require('./lib/initMongoDbDatabase')

var path2json = './testData/json'

process.on('uncaughtException', function (err) {
    console.error((new Date).toISOString() + '  FORCED EXIT - CAUGHT EXCEPTION: ' + err);
    console.error(err.stack)
    process.exit(1);
});


initMongo.initMongoDbDatabase(path2json)