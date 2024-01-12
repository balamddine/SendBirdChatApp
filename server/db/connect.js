const mongoose = require("mongoose");
const config = require("./config.json")
module.exports = {
    connect: async () => {
        try {
            // Replace the uri string with your connection string.
            let client = await mongoose.connect(config.dbURI, {
                useNewUrlParser: true,                
                useUnifiedTopology: true,                
            });
            if(client){
                return client;
            }
            else{
                return null;
            }            
        }
        catch (ex) {
            console.log(ex)
        }
    }
}
