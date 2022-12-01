var db = require('../database/db');
var Automodel = {
    getChannel: function (id,customerid,callback) {
        return db.query('SELECT did,outgoing_channel as channels,(SELECT COUNT(channel) as cnt FROM `tf_cdr` WHERE CdrStatus IN (1,2,3) AND accountid =? AND (CallTypeID=0 OR CallTypeID=1)) as rchannel FROM `tf_campaigns_did` D INNER JOIN tf_account_table A ON D.account_id=A.account_id WHERE D.cam_id=? AND D.account_id=? ORDER BY RAND() LIMIT 1',[customerid,id,customerid], callback);
    },
    getAgentbyid: function (id,callback) {
        return db.query('SELECT * from tf_account_table WHERE account_id = ? and account_type=1',[id], callback);
    },
    insertcdr:function (data, callback) {
        return db.query('INSERT INTO tf_cdr SET ?', [data], callback);
    },
    insertcdrrequest:function (data, callback) {
        return db.query('INSERT INTO tf_cdr_request SET ?', [data], callback);
    },
    insertlivecdrrequest:function (data, callback) {
        return db.query('INSERT INTO tf_cdr_live_request SET ?', [data], callback);
    },
    updatecdr:function (data,id, callback) {
        return db.query('UPDATE tf_cdr SET ? where id=?', [data,id], callback);
    },
}

module.exports = Automodel;