var db = require('../database/db');

var Signin = {
    findUser: function (username, callback) {
        // var cond = '';
        // if(id > 0){
        //     cond = ' and account_id !='+id;
        // }
        return db.query('SELECT * from tf_account_table where account_name = ? and current_status=0 and is_deleted="no"', [username], callback);
    },
    getUserRole: function (id, callback) {
        return db.query('SELECT created_by,account_type,login_token,is_loggedin,account_role from tf_account_table where account_id=?', [id], callback);
    },
    getUserRoleAccess: function (id, callback) {
        return db.query('SELECT account_type,services from tf_account_table where account_id=?', [id], callback);
    },
    UpdateUser: function (data,id, callback) {
        return db.query('Update tf_account_table  set ? where account_id=?', [data,id], callback);
    },
    insertactivitylog: function (data, callback) {
        return db.query('Insert INTO tf_loginactivity SET ?', data, callback);
    },
    updateactivitylog:function (data,id, callback) {
        return db.query('SELECT * FROM tf_loginactivity where uid=? order by date desc limit 1', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if(results.length>0){
                    var row = results[0]
                    var dt1 = new Date(row.date);
                    var dt2 = new Date(data.logout_time);
                    const timediff = (dt2.getTime() - dt1.getTime()) / 1000;
                    data.dif_time = timediff
                    return db.query('Update tf_loginactivity set ? where id=?', [data,row.id], callback);    
                }else{
                    return db.query('SELECT * FROM tf_loginactivity where uid=? order by date desc limit 1', [id], callback);
                }
            }
        })
    },
    findUserByEmail: function (username, callback) {
        return db.query('SELECT * from tf_account_table where email = ? ', [username], callback);
    },
    updateAgentQueueTime:function (data,id, callback) {
        return db.query('SELECT * FROM tf_tmp_agent where aid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if(results.length>0){
                    row = results[0]
                    return db.query('Update tf_tmp_agent set ? where tid=?', [data,row.tid], callback);    
                }else{
                    return db.query('Insert INTO tf_tmp_agent set ?', [data], callback);
                }
            }
        })
    },
    deleteAgentQueueTime:function (id, callback) {
        return db.query('delete from tf_tmp_agent where aid=?', [id], callback);
    },
    checkactivitylog:function (id, callback) {
        return db.query('SELECT * FROM tf_loginactivity where uid=? order by date desc limit 1', [id], callback);
    },
    agent_expire_date:function(id,callback){
        return db.query("select * from tf_account_table where account_id ="+id,callback)
    },
    check_user_name(data,callback){
        var username = data.check;
        var where ='';
        if(data.editid){
            where = " and account_id!="+data.editid;
        }
        return db.query('SELECT * from tf_account_table where account_name = ? '+where, [username], callback);

    }
}

module.exports = Signin;