'use strict'
const _ = require('lodash');
const { Types } = require('mongoose');


const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 0]))
}

const removeUndefindedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k];
        }
    })
    return obj
}

const updateNestedObject = obj => {
    const final = {};
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObject(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            })
        } else {
            final[k] = obj[k];
        }
    })
    return final;
}

const convertToObjectMongoDb = id => {
    return new Types.ObjectId(id);
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefindedObject,
    updateNestedObject,
    convertToObjectMongoDb,
}
