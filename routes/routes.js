const api = require('../api/api');
const Joi = require('@hapi/joi');
const redis = require('../redis/ops');

const routes = [{
    method: 'POST',
    path: '/ticket',
    handler: (request, h) => {
            return api.addTicket(request, h);
        },
    options : {
        validate : {
            payload : Joi.object({
                data : Joi.string().alphanum().min(3).max(200).required(),
                assignee : Joi.string().required(),
                status : Joi.number().min(0).max(3)
            }).options({stripUnknown:true})
        }
    }
    },{
    method: 'GET',
    path : '/tickets/{id?}',
    handler : (request, h) => {
            return api.getTickets(request, h);
        },
    options : {
            validate : {
                params : Joi.object({
                    id : Joi.string().alphanum().min(5)
                }).options({stripUnknown:true, allowUnknown : false})
            },
            response : {
                sample : 50,
                schema : Joi.array().items(Joi.object({
                    id : Joi.string().alphanum().min(5).required(),
                    data : Joi.string().min(3).max(200).required(),
                    created_date : Joi.date().required(),
                    modified_date : Joi.date().required()
                }))
            }
        }
    },{
    method: 'PUT',
    path : '/ticket',
    handler : (request, h) => {
            return api.updateTicket(request, h);
        },
    options : {
        validate : {
            payload : Joi.object({
                id : Joi.string().alphanum().min(5).required(),
                data : Joi.string().alphanum().min(3).max(200).required(),
                assignee : Joi.string().required(),
                status : Joi.number().min(0).max(3)
            })
        }
    }
    },{
    method: 'DELETE',
    path : '/ticket',
    handler : (request, h) => {
            return api.deleteTicket(request, h);
        },
    options : {
        validate : {
            payload : Joi.object({
                id : Joi.string().alphanum().min(5).required()
            })
        }
    }
    },{
        method: 'PUT',
        path : '/close_ticket',
        handler : (request, h) => {
                return api.closeTicket(request, h);
            },
            options : {
                validate : {
                    payload : Joi.object({
                        id : Joi.string().alphanum().min(5).required()
                    })
                }
            }
    },{
        method: 'PUT',
        path : '/search',
        handler : (request, h) => {
                return api.searchText(request, h);
            },
            options : {
                validate : {
                    payload : Joi.object({
                        search_text : Joi.string().required(),
                        option : Joi.number().min(0).max(10)
                    })
                }
            }
        },{
            method: 'GET',
            path : '/ticket/{id?}',
            handler : (request, h) => {
                    return redis.get(request, h);
                },
            options : {
                    validate : {
                        params : Joi.object({
                            id : Joi.string().alphanum().min(5)
                        }).options({stripUnknown:true, allowUnknown : false})
                    }
                }
            },
];
module.exports = routes;