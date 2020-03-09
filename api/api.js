const db = require('../datasource/db');
const queries = require('./query_constructor');
const amqp = require('amqplib/callback_api');
const esOps = require('../elastic/ops');
const redisOps = require('../redis/ops');

var addTicket = async function(req, h){
    return new Promise(function(resolve, reject){
        db.connect(function (err, client, done) {
            var finish = function () {
                done();
            };
        
            if (err) {
                console.error('could not connect to cockroachdb', err);
                finish();
            }
            client.query(queries.getAddQuery(req.payload), function(err,data){
                if(err){
                    resolve("Unable to Insert");
                }
                else{
                    esOps.insertOrUpdate(data.rows[0]).then(() => {
                        resolve(data.rows[0].id);
                        finish();
                    });
                }
            });
        });
    });
}

var getTickets = function(req, h){
    return new Promise(function(resolve, reject){
        db.connect(function (err, client, done) {
            var finish = function () {
                done();
            };
        
            if (err) {
                console.error('could not connect to cockroachdb', err);
                finish();
            }
            let query = 'select * from tickets';
            if(req.params.id){
                query += ' where id='+req.params.id+';';
            }
            client.query(query, function(err,data){
                if(err){
                    console.log(err);
                    resolve("Unable to Fetch");
                }
                else{
                    resolve(data.rows);
                    done();
                }
            });
        
        });
    });
}

var updateTicket = function(req, h){
    return new Promise(function(resolve, reject){
        db.connect(function (err, client, done) {
            var finish = function () {
                done();
            };
        
            if (err) {
                console.error('could not connect to cockroachdb', err);
                finish();
            }

            client.query(queries.getupdateQuery(req.payload), function(err,data){
                if(err){
                    console.log(err);
                    resolve("Unable to Update");
                }
                else{
                    esOps.insertOrUpdate(data.rows[0]).then(() => {
                        redisOps.set(data.rows).then(function(){
                            resolve("Updated");
                            done();
                        });
                    });
                }
            });

        });
    });
}

var deleteTicket = function(req, h){
    return new Promise(function(resolve, reject){
        db.connect(function (err, client, done) {
            var finish = function () {
                done();
            };
        
            if (err) {
                console.error('could not connect to cockroachdb', err);
                finish();
            }
            client.query('delete from tickets where id = \''+req.payload.id+'\';', function(err,data){
                if(err){
                    console.log(err);
                    resolve("Unable to Delete");
                }
                else{
                    esOps.deleteObj(req.payload).then(() => {
                        redisOps.delete(req.payload.id).then(function(){
                            resolve("Deleted");
                            done();
                        })
                    });
                }
            });

        });
    });
}

var closeTicket = function(req, h){
    return new Promise(function(resolve, reject){
        amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'status_que';
            var msg = req.payload.id;
            
            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            console.log(" [x] Sent to Status Que '%s'", msg);
            resolve("Will Update Shortly");
        });
            setTimeout(function() {
                connection.close();
            }, 500);
        });
    });
}

var searchText = function(req, h){
    return new Promise(function(resolve, reject){
        esOps.search(req.payload).then( (data) => {
            resolve(data);
        });
    });
}

module.exports.addTicket = addTicket;
module.exports.getTickets = getTickets;
module.exports.updateTicket = updateTicket;
module.exports.deleteTicket = deleteTicket;
module.exports.closeTicket = closeTicket;
module.exports.searchText = searchText;