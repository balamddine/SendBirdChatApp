const mongoose = require("mongoose");
const config = require("./config.json")
const { MongoClient, ServerApiVersion } = require('mongodb');
module.exports = {
    connect: async () => {
        const connStrng = "mongodb+srv://balamddine:Ayxq3Xz1bvhIZzqJ@cluster0.ot6f11x.mongodb.net/?retryWrites=true&w=majority" //"mongodb://127.0.0.1:27017/chat" 
        const client = new MongoClient(connStrng, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        try {

            // Replace the uri string with your connection string.
            // let client = await mongoose.connect(connStrng, {
            //     useNewUrlParser: true,                
            //     useUnifiedTopology: true,                
            // });
            // if(client){
            //     return client;
            // }
            // else{
            //     return null;
            // }            

          

            await client.connect();
            // Send a ping to confirm a successful connection
           let connected = await client.db("chat").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return connected;
        }
        catch (ex) {
            console.log(ex)
        }
        finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}
