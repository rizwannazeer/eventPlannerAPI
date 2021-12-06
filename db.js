const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://eventPlanner:YMSkzNip2Bxh1ys3@cluster0.awu7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

class Database {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  initDb= async() => {
    await this.client.connect().catch(err => console.log(err));
  }

  writeDB = async (collectionName, object) => {
    try {  
      const collection = this.client.db('eventPlanner').collection(collectionName);
      const addedObject = await collection.insertOne(object)

      console.log('object added ', addedObject.insertedId.toHexString());
      return {addedObject, id: addedObject.insertedId.toHexString()};
    } catch (error) {
      console.log(error);
    }
  }

  readDB = async (collectionName, obj) => {
    try {
      const collection = await this.client.db('eventPlanner').collection(collectionName);
      const cursor = collection.find(obj);
      const allValues = await cursor.toArray();
      return allValues;
    } catch (error) {
      console.log(error);
    }
  }

  update = async (collectionName,id, obj) => {
    try {
      const collection = await this.client.db('eventPlanner').collection(collectionName);
      const res = await collection.updateOne({_id: ObjectId(id)},{$set: obj})
      if(res.modifiedCount !==1){
        console.log('modified count', res.modifiedCount);
      }
      return res.modifiedCount ===1;
    
    } catch (error) {
      console.log(error);
    }
  }

  delete = async (collectionName, id) => {
    try {
      const collection = await this.client.db('eventPlanner').collection(collectionName);
      const result = await collection.deleteOne({_id: ObjectId(id)});
      console.log(id, result);
      return result.deletedCount === 1;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Database();
