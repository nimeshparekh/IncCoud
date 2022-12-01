var db = require('../database/db');
const { filter } = require('async');

var Zoho = {
    savecode: function (data, callback) {
        return db.query('SELECT * FROM tf_zoho_code where accountid=?', [data.accountid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            }else{
                if(results.length>0){
                    return db.query("update tf_zoho_code set ? where accountid=?",[data,data.accountid],callback);
                }else{
                    return db.query("insert into tf_zoho_code set ?",[data],callback);
                }
            }
        })
        //return db.query("insert into tf_zoho_code set ?",[data],callback);
    },
    saveaccesscode: function (data, callback) {
        return db.query("insert into tf_zoho_access_code set ?",[data],callback);
    },
    getaccesscode: function (id, callback) {
        return db.query("select A.*,C.accountsserver from tf_zoho_access_code A INNER JOIN tf_zoho_code C ON A.accountid=C.accountid WHERE A.accountid = ? ORDER BY A.date DESC",[id],callback);
        //return db.query("select * from tf_zoho_access_code where accountid = ? order by date desc limit 1",[id],callback);
    },
    updateaccesstoken: function (data,id, callback) {
        return db.query("update tf_zoho_access_code set ? where accountid = ?",[data,id],callback);
    },
    findcdr:function (id, callback) {
        return db.query('SELECT * FROM tf_cdr where id=?', [id], callback);
    },
    insertcdr:function (data, callback) {
        return db.query('INSERT INTO tf_cdr SET ?', [data], callback);
    },
    saveuser:function (data, callback) {
        return db.query('SELECT * FROM tf_zoho_user where account_id=? and zohouserid=?', [data.account_id,data.zohouserid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            }else{
                if(results.length>0){
                    return db.query("update tf_zoho_user set ? where account_id=? and zohouserid=?",[data,data.account_id,data.zohouserid],callback);
                }else{
                    return db.query('INSERT INTO tf_zoho_user SET ?', [data], callback);
                }
            }
        })
        //return db.query('INSERT INTO tf_zoho_user SET ?', [data], callback);
    },
    updatemanager: function (data,id, callback) {
        return db.query('update tf_account_table set ? WHERE account_id = ?', [data,id], callback);
    },
    getzohousers:function (id, callback) {
        return db.query('SELECT z.*,a.account_name FROM tf_zoho_user z LEFT JOIN tf_account_table a ON z.mapuser_id=a.account_id where z.account_id=?', [id], callback);
    },
    updatezohouser: function (data,id, callback) {
        return db.query('update tf_zoho_user set ? WHERE uid = ?', [data,id], callback);
    },
    getzohouserbyid:function (id, callback) {
        return db.query('SELECT * FROM tf_zoho_user where uid=?', [id], callback);
    },
    getzohoaccessmanager:function (id, callback) {
        return db.query('SELECT z.api_domain,z.accountid,z.zoho_integration,a.account_name FROM `tf_zoho_access_code` z INNER JOIN tf_account_table a ON a.account_id=z.accountid where z.accountid= ?', [id], callback);
    },
    updatezohoaccessmanager: function (data,id, callback) {
        return db.query('update tf_zoho_access_code set ? WHERE accountid = ?', [data,id], callback);
    },
    getagentbyid:function (id, callback) {
        return db.query('SELECT * FROM tf_account_table where account_id=?', [id], callback);
    },
    findZohoAgentById:function (id, callback) {
        return db.query('SELECT a.account_id,a.did_alloted,a.account_name,a.mobile,z.zohouserid FROM tf_account_table a inner join tf_zoho_user z on a.account_id=z.mapuser_id where a.account_type=1 and a.account_id=?', [id], callback);
    },
    updatecdr:function (data,id, callback) {
        return db.query('UPDATE tf_cdr SET ? where id=?', [data,id], callback);
    },
    getaccesscode: function (id, callback) {
        return db.query("select A.*,C.accountsserver from tf_zoho_access_code A INNER JOIN tf_zoho_code C ON A.accountid=C.accountid WHERE A.accountid = ? ORDER BY A.date DESC",[id],callback);
    },
    updateaccesstoken: function (data,id, callback) {
        return db.query("update tf_zoho_access_code set ? where accountid = ?",[data,id],callback);
    },
    checkagentmaptozoho: function (id, callback) {
        return db.query("select * from tf_zoho_user where mapuser_id = ?",[id],callback);
    },
    deletezohoaccount:function (id, callback) {
        return db.query('DELETE FROM tf_zoho_access_code where accountid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            }else{
                return db.query('DELETE FROM tf_zoho_code where accountid=?', [id], function (err, results) {
                    return db.query('DELETE FROM tf_zoho_user where account_id=?', [id],callback);
                })
            }
        })
    },
    savetransferagent: function (data, callback) {
        return db.query("insert into tf_transfer_agent_log set ?",[data],callback);
    },
}

module.exports = Zoho;