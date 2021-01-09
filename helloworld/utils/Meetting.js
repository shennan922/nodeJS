var https = require('https');
var crypto = require('crypto');

module.exports = function (secret_id, secret_key, app_id, sdk_id = null, server_conf = {host : 'api.meeting.qq.com', port : 443}) {

    const signature = function(method, path, headers, req_body) {
        var toSign = method + "\n" +
            "X-TC-Key=" + secret_id + "&X-TC-Nonce=" + headers['X-TC-Nonce'] + "&X-TC-Timestamp=" + headers['X-TC-Timestamp'] + "\n" + 
            path + "\n" + 
            (typeof req_body === 'object' ? JSON.stringify(req_body) : '');

        //console.log(toSign);
        var sig_hex = crypto.createHmac('sha256', secret_key).update(toSign).digest('hex')
        //console.log(Buffer.from(sig_hex).toString('base64'));

        return Buffer.from(sig_hex).toString('base64');
    };

    const set_common_headers = function(headers) {
        headers['Content-Type'] = 'application/json';
        headers['X-TC-Key'] = secret_id;
        headers['X-TC-Timestamp'] = Math.floor(Date.now()/1000);
        headers['X-TC-Nonce'] = Math.floor(Math.random() * 100000);
        headers['AppId'] = app_id;
	if (!!sdk_id) {
        	headers['SdkId'] = sdk_id;
	}
    };

    const getUrl = function(path, query_params) {
        var params_str = '?';
        Object.keys(query_params).map((k) => { 
            let kv = k + '=' + query_params[k];
            params_str += (params_str !== '?') ? '&' + kv : kv;
        });
        return encodeURI(params_str === '?' ? path : path + params_str);
    };

    const request_api = function (method, path, query_params = null, body='') {
        return new Promise((resolve, reject) => {
            var options = {host : server_conf.host, port : server_conf.port, method: method, headers:{}};
            set_common_headers(options.headers);
            options.headers['Content-Length'] = (typeof body === 'object') ? Buffer.byteLength(JSON.stringify(body)) : 0;
            options.path = getUrl(path, query_params || {});
            options.headers['X-TC-Signature'] = signature(options.method, options.path, options.headers, body);

            //console.log(method, options.path, options.headers['X-TC-Signature']);

            const req = https.request(options, (res) => {
                let resData = '';

                res.on('data', (chunk) => {
                    resData += chunk;
                });

                res.on('end', () => {
                    // console.log(resData);
                    if (res.statusCode === 200) {
                        resolve(resData !== '' ? JSON.parse(resData) : '');
                    } else {
                        reject(JSON.parse(resData));
                    }
                });
            });

            req.on('error', (e) => {
                console.error(e);
                reject(e);
            });

            req.write(body && typeof body === 'object' ? JSON.stringify(body) : '');

            req.end();
        });
    };

    
    const create_meeting = function (req_body) {
        return new Promise((resolve, reject) => {
            request_api('POST', '/v1/meetings', null, req_body)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    console.log('create_meeting failed, reason:', e);
                    reject(e);
                })
        });
    };

    const query_meeting_by_id = function(meeting_id, userid, instanceid) {
        var query_params = {userid : userid, instanceid : instanceid};
        return new Promise((resolve, reject) => {
            request_api('GET', '/v1/meetings/' + meeting_id, query_params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    console.log('query_meeting_by_id failed, reason:', e);
                    reject(e);
                })
        });
    };

    const query_meeting_by_code = function(meeting_code, userid, instanceid) {
        var query_params = {meeting_code : meeting_code, userid : userid, instanceid : instanceid};
        return new Promise((resolve, reject) => {
            request_api('GET', '/v1/meetings', query_params)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    console.log('query_meeting_by_code failed, reason:', e);
                    reject(e);
                })
        });
    };

    const cancel_meeting = function(meeting_id, userid, instanceid, reason_code = 1, reason_detail = "取消会议") {
        const req_body = {instanceid : instanceid, userid : userid, reason_code: reason_code, reason_detail : reason_detail};
        return new Promise((resolve, reject) => {
            request_api('POST', '/v1/meetings/'+meeting_id+'/cancel', null, req_body)
                .then((res) => {
                    resolve(meeting_id)
                })
                .catch((e) => {
                    console.log('cancel meeting', meeting_id, 'failed, reason:', e);
                    reject(e);
                })
        });
    };

    const modify_meeting = function(meeting_id, req_body) {
        return new Promise((resolve, reject) => {
            request_api('PUT', '/v1/meetings/'+meeting_id, null, req_body)
                .then((res) => {
                    //console.log('modify meeting ok', meeting_id);
                    resolve(res)
                })
                .catch((e) => {
                    console.log('modify meeting', meeting_id, 'failed, reason:', e);
                    reject(e);
                })
        });
    };


    return {
        //会议管理相关api
        create_meeting : create_meeting,
        query_meeting_by_id : query_meeting_by_id,
        query_meeting_by_code : query_meeting_by_code,
        cancel_meeting : cancel_meeting,
        modify_meeting : modify_meeting,
    };
};
