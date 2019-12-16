const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //.get gets our password / login string for mongoDb atlas

const connectDB = async () => {
    try {        // in most cases when you use async / await you wrap it in a try / catch block
      await mongoose.connect(db, {
         useUnifiedTopology: true ,  //suggested options by mongodb response to be passed in
          useNewUrlParser: true,
          useCreateIndex: true
      });

      console.log('MongoDB connected...')
    } catch(err) {
      console.error(err.message);
      // Exit process with failure
      process.exit(1)
    }
}

module.exports = connectDB;