const mongoose = require('mongoose');

function connectDatabase() {
    mongoose.Promise = global.Promise;
    mongoose.connect(
        process.env.DATABASE_URL, 
        {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
    );

    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.info('Connected to the database.'));
    db.on('reconnected', () => {console.info('Reconnected to the database.')});
};

module.exports = connectDatabase;