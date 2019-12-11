var errorMessages = [];
var loadsh = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
exports.bindQuery = function bindQuery(queryObject,defultSortBy='_id'){
    let aggregateQuery = [];
    let query = queryObject.query || {};
    if(!loadsh.isUndefined(query._id)){
        query._id = ObjectId(query._id);
    }
    aggregateQuery.push({ $match: query });
    if (queryObject.sortField) {
        let sortField = "$" + queryObject.sortField;
        aggregateQuery.push({ $addFields: { sortField: { $toLower: sortField } } });
        let sortOrder = queryObject.sortOrder ? Number(queryObject.sortOrder) : -1;
        aggregateQuery.push({ $sort: { sortField: sortOrder } });
    }
    else {
        let sort = {};
        sort[defultSortBy] = 1;
        aggregateQuery.push({ $sort: sort });
    }
    if (queryObject.offSet && queryObject.limit) {
        let offSet = Number(queryObject.offSet);
        let limit = Number(queryObject.limit);
        let skip = (Number(offSet) - 1) * queryObject.limit;
        aggregateQuery.push({ $skip: skip });
        aggregateQuery.push({ $limit: limit });
    }
    
    return aggregateQuery;
}
exports.setError = (field,message) =>{
    errorMessages.push({
        field:field,message:message
    });
}
exports.getErrors = ()=>{
    return errorMessages;
}
exports.resetErrors = ()=>{
    errorMessages = [];
}