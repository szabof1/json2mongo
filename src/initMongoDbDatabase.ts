import * as fs from "fs"
import * as path from "path"
import * as async from "async"
import * as config from "config"
import * as mongoose from "mongoose"
import * as _ from "lodash"
import {models} from "./models/index"


export function initMongoDbDatabase (path2json: string, mapModel2Json: Object) {
  if (!mapModel2Json) mapModel2Json = {}

  let conf: any = config
  mongoose.connect(conf.mongoConnection)

  let nModelDocs:number = 0
  let nAllDocs:number = 0

  async.eachSeries(Object.keys(models), processJsonFile, cleanUp)


  function processJsonFile (modelName:string, cbJson:Function) {
    let model:any = models[modelName]

    let jsonFileName: string
    if (modelName in mapModel2Json) {
      jsonFileName = mapModel2Json[modelName]
    }
    if (!jsonFileName) jsonFileName = 'get' + modelName + '.json'

    let filePath = path.join(path2json, modelName.toLowerCase(), jsonFileName)

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
      if (err) {
        console.error(`ERROR opening JSON '${filePath}': `, err)
        return cbJson(err)
      }

      console.error(`Opening JSON '${filePath}'`)

      let obj: any = JSON.parse(data)
      let docs: any[] = _.get(obj, "value",[])

      nModelDocs = 0
      let processDocForModel = _.curry(processDoc)(model)
      let summaryForModel = _.curryRight(summary)(modelName)
      async.eachSeries(docs, processDocForModel, summaryForModel)
    })


    function processDoc(model:any, doc:any, cbDoc:Function) {
      // Create Model instance,
      // this way Mongoose converts data from simple types (eg. strings to ObjectIds or Dates)
      let docToAdd = new model(doc)

      // The method for doing upsert comes from Clint Harris' answer
      // on Stackoverflow.com
      // http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose

      // Convert the Model instance to a simple object using Model's 'toObject' function
      // to prevent weirdness like infinite looping...
      var upsertDoc = docToAdd.toObject()

      // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
      delete upsertDoc._id

      // Do the upsert, which works like this: If no Contact document exists with
      // _id = contact.id, then create a new doc using upsertData.
      // Otherwise, update the existing doc with upsertData
      model.update({_id: docToAdd._id}, upsertDoc, {upsert: true}, function(err:any, result:any) {
        if(err) {
          console.error("    ERROR saving doc: ", err)
          return cbDoc(err)
        }
        console.log(`    Item upserted {_id: '${docToAdd._id}'}`)
        //console.log('      ', result, result.nModified)
        if (_.has(result, 'upserted')) nModelDocs += result.upserted.length
        return cbDoc(null)
      })

    }


    function summary(err:any, modelName:string) {
      if (err) {
        console.error(`  ERROR after processing model '${modelName}':`, err)
      }
      console.log(`  Number of '${modelName}' documents upserted: ${nModelDocs}`)

      nAllDocs += nModelDocs

      return cbJson(null)
    }

  }


  function cleanUp() {
    console.log(`Number of documents upserted: ${nAllDocs}`)
    console.log("FINISHED")
    mongoose.disconnect
    process.exit(0)
  }
}
