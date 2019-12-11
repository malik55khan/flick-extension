// Database connectivity
var mongoose = require('mongoose');
const config = require('../config');
exports.connect = function () {
    mongoose.connect(config.mongoUrl,{ useNewUrlParser: true });
    const db = mongoose.connection;
    db.once(`open`, function () {
      // we`re connected!
      console.log(`MongoDB connected on "  ${config.mongoUrl}`);
      console.log(`###########################################################################`);
    });
    db.on('connected', function () {
        console.log('info','Mongoose default connection open');
    });
    
    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('info','Mongoose default connection disconnected');
    });
    
    // If the connection throws an error
    db.on('error', function (err) {
        console.log('error', 'Mongoose default connection error: %s', err);
    });
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('info', 'Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
  };
// If the Node process ends, close the Mongoose connection

