const es = require('../datasource/es');
var esOps = {};
const esIndex = "tickets";

esOps.insertOrUpdate = async function(obj){
    await es.index({
                index: esIndex,
                id : obj.id,
                body: obj
            });
    await es.indices.refresh({ index: esIndex });
    return;
}

esOps.deleteObj = async function(obj){
    await es.delete({
        index : esIndex,
        id: obj.id
    });
    return;
}

esOps.search = async function(obj){
    const { body } = await es.search({
        index: esIndex,
        body: {
          query: {
            match: { data: obj.search_text }
          }
        }
    });
    return body.hits.hits;
}

module.exports = esOps;