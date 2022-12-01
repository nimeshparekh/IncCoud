var db = require('../database/db');

var OBDCampaign = {
    getallobdcampaign: function (id, callback) {
        var where = 'account_id = ' + id + ' and cam_method=1 and cam_type=0 and is_deleted ="no"';
        console.log('Select * from tf_campaigns where ' + where + ' ORDER BY camid desc');
        return db.query('Select * from tf_campaigns where ' + where + ' ORDER BY camid desc', [], callback);
    },    
    getobdcampaign: function (data, callback) {
        var where = 'account_id = ' + data.customer_id + ' and cam_status ="' + data.cam_status + '" and cam_method=1 and cam_type=0 and is_deleted ="no"';

        if (data.startdate != '1970-01-01' && data.startdate != null && data.startdate != '') {
            where += " and create_date>='" + data.startdate + " 00:00:00'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != null && data.enddate != '') {
            where += " and create_date<='" + data.enddate + " 23:59:59'";
        }

        //console.log('Select * from tf_campaigns where ' + where + ' ORDER BY camid desc');
        return db.query('Select * from tf_campaigns where ' + where + ' ORDER BY camid desc', [], callback);
    },
    createcampaign: function (data, callback) {
        return db.query('Insert INTO tf_campaigns SET ?', data, callback);
    },
    getContactbySegment: function (data, callback) {
        return db.query('Select * from tf_contacts where customer_id=? and category = ? ORDER BY created_date DESC', [data.id, data.category], callback);
    },
    searchcampaigncalllog: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and C.CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        //console.log('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE ' + where + ' order by C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '')
        return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE ' + where + ' order by C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    searchcampaigncallloglength: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and C.CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        
        // console.log(SELECT count(name) as total FROM `tf_master_data)
        // return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE '+where+' order by C.CallStartTime desc' , [], callback);
        return db.query('SELECT count(numid) as total from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE ' + where + ' order by C.CallStartTime desc', [], callback);
    },
    deleteobdcampaingn: function (id, callback) {
        return db.query('UPDATE tf_campaigns set is_deleted="yes" where camid=?', [id], callback);
    },
    updatecampaign: function (data, callback) {
        return db.query('UPDATE tf_campaigns SET ? WHERE camid=?', [data, data.camid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    obdcampaigncalloglength: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and C.CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        // console.log(SELECT count(name) as total FROM `tf_master_data)
        // return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE '+where+' order by C.CallStartTime desc' , [], callback);
        return db.query('SELECT count(numid) as total from tf_campaigns_numbers AS N inner join tf_cdr AS C on C.auto_numid=N.numid WHERE ' + where + ' order by C.CallStartTime desc', [], callback);
    },
    obdcampaigncalllogexcel: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and C.CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        return db.query('SELECT *,DATE_FORMAT(C.CallStartTime,"%d-%m-%Y %H:%i:%s") as CallStartTime from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE ' + where + ' order by C.CallStartTime desc', [], callback);
    },    
    searchcampaigncallogdata: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and C.CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        //console.log(where)
        return db.query('SELECT N.* from tf_campaigns_numbers AS N inner join tf_cdr AS C  on C.auto_numid=N.numid WHERE ' + where + ' order by C.' + data.sortcolumn + ' ' + data.sortdirection + '', [], callback);
    },
    insertbulkcamnumber: function (data, callback) {
        db.query('Insert INTO tf_campaigns_numbers (cam_id,account_id,cont_id,agent_id,segment_id) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getobdcampaigncallsummary: function (id, callback) {
        return db.query('SELECT C.*,count(id) as total from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ? GROUP BY C.CallStatus', [id], callback);
    },
    getcampaigndetail: function (id, callback) {
        return db.query('SELECT *,(SELECT GroupName FROM HuntGroup WHERE GroupID=cam_agentgroup ) AS groupname from tf_campaigns WHERE camid = ?', [id], callback);
    },
    getobdcampaignratedate: function (id, callback) {
        return db.query("SELECT SUM(C.CallPluse) as total,DATE(C.CallStartTime) as date FROM `tf_campaigns_numbers` N INNER JOIN tf_cdr C ON N.numid=C.auto_numid WHERE N.cam_id=? GROUP BY date", [id], callback);
        //  return db.query("SELECT C.*,count(id) as total , A.pules,A.pulesrate from tf_cdr AS C inner join tf_campaigns As A inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ? and C.`accountid`= A.account_id and C.CallStatus ='CUSTOMERHANGPUP'  GROUP BY C.CallStatus",[id],callback)
        // return db.query("SELECT C.*,count(id) as total from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ?  and  C.CallStatus ='CUSTOMERHANGPUP' GROUP BY C.CallStatus", [id], callback);
    },
    getobdcampaignagent: function (id, callback) {
        return db.query('SELECT * from tf_campaigns_agent as C inner join tf_account_table as A on A.account_id=C.agent_id  WHERE  A.is_deleted="no" and C.cam_id = ? ', [id], callback);
    },

}


module.exports = OBDCampaign;
