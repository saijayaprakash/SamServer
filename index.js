const Hapi = require('@hapi/hapi');
const routes = require('./routes/routes');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: { "cors": true }
    });

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};
init();

// const redis = require("redis");
// const client = redis.createClient();
 
// client.on("error", function(error) {
//     console.log("dsadjsaj");
//   console.log(error);
// });
// async function jai(){
//     // await client.set("jai", "kignmaker", 'EX', 60*15);
//     // await client.set("jai", "kignmaker143", 'EX', 60*15);
//     // await client.del("jai");
    
//     let x = client.get("jai", function(err, res){
//         console.log(res);
//     });
// }
// jai()