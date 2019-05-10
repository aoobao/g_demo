import axios from 'axios';
import qs from 'qs';

var baseAxios = axios.create({
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 30000
});

baseAxios.getAsync = function(commit, URL, params) {
    return new Promise(function(resolve, reject) {
        baseAxios
            .get(URL, {
                params: params
            })
            .then(
                response => {
                    var retData = response.data;
                    // var orginalData = retData.Data
                    // commit(URL, retData);
                    resolve(retData);
                },
                error => {
                    console.log(error);
                    reject(error);
                }
            );
    });
};

baseAxios.deleteAsync = function(commit, URL, params) {
    return new Promise(function(resolve, reject) {
        baseAxios
            .delete(URL, {
                params: params
            })
            .then(
                response => {
                    var retData = response.data;
                    var orginalData = retData.Data;
                    commit(URL, orginalData);
                    resolve(retData);
                },
                error => {
                    console.log(error);
                    reject(error);
                }
            );
    });
};

// baseAxios.getAsyncWithConcat = function (commit, URL, params) {
//   return new Promise(function (resolve, reject) {
//     baseAxios.get(Utils.concatGetRequestParam(URL, params)).then((response) => {
//       var retData = response.data
//       var orginalData = retData.Data
//       commit(URL, orginalData)
//       resolve(retData)
//     }, (error) => {
//       console.log(error)
//       reject(error)
//     })
//   })
// }

baseAxios.postAsync = function(commit, URL, params, headers = {}) {
    return new Promise(function(resolve, reject) {
        baseAxios.post(URL, params, {headers}).then(
            response => {
                var retData = response.data;
                // var orginalData = retData.Data;
                // commit(URL, data);
                resolve(retData);
            },
            error => {
                console.log(error);
                reject(error);
            }
        );
    });
};

baseAxios.postFormDataAsync = function(commit, URL, params, headers = {}) {
    params = objectToFormData(params);
    return new Promise(function(resolve, reject) {
        baseAxios.post(URL, params, headers).then(
            response => {
                var retData = response.data;
                // var orginalData = retData.Data;
                // commit(URL, data);
                resolve(retData);
            },
            error => {
                console.log(error);
                reject(error);
            }
        );
    });
};

function objectToFormData(object) {
    const formData = new FormData();
    if (Object.prototype.toString.call(object) === '[object Array]') {
        Object.keys(object).forEach(key => {
            Object.keys(object[key]).forEach(key1 => {
                formData.append(key1, object[key][key1]);
            });
        });
    } else {
        Object.keys(object).forEach(key => {
            if (Object.prototype.toString.call(object[key]) === '[object Array]') {
                Object.keys(object[key]).forEach(key1 => {
                    formData.append(key, object[key][key1]);
                });
            } else {
                formData.append(key, object[key]);
            }
        });
    }
    return formData;
}

export default baseAxios;
