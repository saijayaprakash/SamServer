const Joi = require('joi');
const Boom = require('boom');

var queryConstructor = {};

queryConstructor.getAddQuery = function(payload){
    let totalData  = {};
    totalData = payload;
    totalData.created_date = new Date().toString();
    totalData.modified_date = new Date().toString();
    
    let schema  = Joi.object({
        data : Joi.string().min(5).max(200).required(),
        assignee : Joi.string(),
        status : Joi.number().min(0).max(3),
        created_date : Joi.date().required(),
        modified_date : Joi.date().required()
    });

    let validity = Joi.validate(totalData, schema);
    if(!validity.error){
        let params = [];
        let dataObj = {"data": totalData.data,"assignee": totalData.assignee, "status": totalData.status};

        params.push(JSON.stringify(dataObj));
        params.push(totalData.created_date);
        params.push(totalData.modified_date);
        padData(params);

        let query = 'INSERT INTO tickets (data, created_date, modified_date) VALUES ('+params.join(",").toString()+') RETURNING id, data, created_date, modified_date ;'
        return query;
    }
}

queryConstructor.getupdateQuery = function(payload){
    let totalData = {};
    totalData = payload;
    totalData.modified_date = new Date().toString();

    let schema  = Joi.object({
        id : Joi.string().alphanum().required(),
        status : Joi.number().min(0).max(3),
        data : Joi.string().min(5).max(200).required(),
        assignee : Joi.string().required(),
        modified_date : Joi.date().required()
    });

    let validity = Joi.validate(totalData, schema);

    if(!validity.error){
        let params = [];
        params.push(JSON.stringify({"data":totalData.data, "assignee": totalData.assignee , "status": totalData.status}));
        params.push(totalData.modified_date);
        padData(params);
        let query = 'UPDATE tickets SET (data, modified_date) = ('+params.join(",").toString()+') where id=\''+totalData.id+'\' RETURNING id, data, created_date, modified_date ;';
        return query;
    }
}

function padData(params){
    for(let i=0;i<params.length;i++){
        let x = params[i];
        params[i] = '\''+params[i]+'\'';
    }
}

module.exports = queryConstructor;