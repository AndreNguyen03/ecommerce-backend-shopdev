"use strict";

import lodash from "lodash";

const getInfoData = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields);
};

// ['a','b'] = {a: 1, b: 1};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el,1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el,0]))
}

const removeNullAndUndefined = obj => {
  Object.keys(obj).forEach( k => {
    if(obj[k] == null) delete obj[k];
  })
  return obj;
}

const updateNestedObjectParser = obj => {
  const final = {};
  Object.keys(obj).forEach(k => {
    if(typeof obj[k] === 'Object' && !Array.isArray[obj[k]]) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = obj[k];
    }
  })
  return final;
}


export { getInfoData, getSelectData, unGetSelectData, removeNullAndUndefined, updateNestedObjectParser };
