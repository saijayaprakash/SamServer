const pg = require('pg');
var config = {
    user: 'root',
    host: 'localhost',
    database: 'tickets',
    port: 26257
};

// Create a pool.
var pool = new pg.Pool(config);

module.exports = pool;