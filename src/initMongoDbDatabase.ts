import * as fs from "fs"
import * as path from "path"
import * as async from "async"
import * as config from "config"
import * as mongoose from "mongoose"
import * as _ from "lodash"
import {models} from "./models/index"


export function initMongoDbDatabase (path2json: string, mapModel2Json: Object) {
  let conf: any = config
  mongoose.connect(conf.mongoConnection)

  let n:number = 0

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

      n = 0
      let processDocForModel = _.curry(processDoc)(model)
      let summaryForModel = _.curryRight(summary)(modelName)
      async.eachSeries(docs, processDocForModel, summaryForModel)
    })


    function processDoc(model:any, doc:any, cbDoc:Function) {
      // TODO: check if the document exist, if yes then replace it (do an upsert)
      let docToAdd = new model(doc)
      docToAdd.save(function(err:any){
        if(err) {
          console.error("ERROR saving doc: ", err)
          return cbDoc(err)
        }
        console.log(`Item added {_id: '${docToAdd._id}'}`)
        n++
        return cbDoc(null)
      })

    }


    function summary(err:any, modelName:string) {
      if (err) {
        console.error(`ERROR after processing model '${modelName}':`, err)
      }
      console.log(`Number of '${modelName}' documents inserted: ${n}`)

      return cbJson(null)
    }

  }


  function cleanUp() {
    console.log("FINISHED")
    mongoose.disconnect
    process.exit(0)
  }
}
