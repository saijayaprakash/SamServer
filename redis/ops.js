const redis = require('../datasource/redis');
const api = require('../api/api');

var redisOps = {};

redisOps.set = async function(obj){
    await redis.set(obj[0].id, JSON.stringify(obj),'EX', 60*15);
    return;
}

redisOps.get = async function(req, h){
    return new Promise(function(resolve, reject){
        redis.get(req.params.id, function(err, res){
            if(res != null){
                console.log("Redis Hit for "+req.params.id);
                return resolve(JSON.parse(res));
            }
            else{
                api.getTickets(req, h).then(function(data){
                    redisOps.set(data).then(function(){
                        resolve(data);
                    }).catch(function(err){
                        console.log(err);
                    })
                });
            }
        });
    });
}


module.exports = redisOps;