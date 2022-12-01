var db = require('../database/db');
//const admz = require('adm-zip')
//const download = require('download');

var Call = {
    getcalllog: function (id, callback) {
        return db.query('SELECT * FROM `tf_cdr` where accountid=? ORDER BY CallStartTime DESC', [id], callback);
    },
    getlivestatus: function (id, callback) {
        return db.query('SELECT is_loggedin,(SELECT break_status FROM `tf_breaktime` WHERE account_id = ' + id + ' and break_status=0 ORDER BY break_id DESC LIMIT 0,1) AS break,(SELECT status FROM `tf_callingpausetime` WHERE account_id = ' + id + ' and status = 0 ORDER BY pause_id DESC LIMIT 0,1) AS callhold,(SELECT CdrStatus FROM `tf_cdr` WHERE AgentID = ' + id + ' and CdrStatus > 0 ORDER BY id DESC LIMIT 0,1) AS oncall FROM `tf_account_table` where account_id=? LIMIT 0,1', [id], callback);
    },
    getoncall: function (id, callback) {
        return db.query('SELECT CallerNumber,CallerName FROM `tf_cdr` WHERE AgentID = ? AND CdrStatus = 2', [id], callback);
    },
    getagentcalllog: function (id, type, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (row.show_no_id == 0) {
                    return db.query("SELECT C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id FROM `tf_cdr` C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID WHERE C.AgentID=? AND C.CallTypeID = ? ORDER BY C.CallStartTime DESC", [id, type], callback)
                    //old return db.query('SELECT C.*,A.whatsup_access,A.show_no_id FROM `tf_cdr` C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where C.AgentID=? AND C.CallTypeID = ? ORDER BY C.CallStartTime DESC', [id, type], callback);
                } else {
                    return db.query('SELECT C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id,CONCAT("TF",SUBSTR(C.CallerNumber,4,3), "3", SUBSTR(C.CallerNumber,1,3), "2", SUBSTR(C.CallerNumber,7,3), "1", SUBSTR(C.CallerNumber,10,3)) AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",C.CallerName) AS CallerName FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m ON m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID WHERE C.AgentID=? AND C.CallTypeID = ? ORDER BY C.CallStartTime DESC', [id, type], callback);
                    //old return db.query('SELECT C.*,A.whatsup_access,,A.show_no_id,CONCAT("TF",SUBSTR(C.CallerNumber,4,3), "3", SUBSTR(C.CallerNumber,1,3), "2", SUBSTR(C.CallerNumber,7,3), "1", SUBSTR(C.CallerNumber,10,3)) AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",C.CallerName) as CallerName FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m on m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where C.AgentID=? AND C.CallTypeID = ? ORDER BY C.CallStartTime DESC', [id, type], callback);
                }
            }
        })
    },
    getagentmissedcalllog: function (id, type, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (row.show_no_id == 0) {
                    return db.query("SELECT C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id,(SELECT COUNT(id) FROM `tf_cdr` WHERE RIGHT(CallerNumber,10) = RIGHT(C.CallerNumber,10) AND CallStartTime>m.calldate AND accountid=C.accountid) AS callbackcount FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m ON m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID WHERE C.AgentID=2141 AND C.CallTypeID = 1 AND DATE(C.CallStartTime)=CURRENT_DATE ORDER BY C.CallStartTime DESC", [id, type], callback)
                    //old  return db.query('SELECT C.*,A.whatsup_access,A.show_no_id,(SELECT COUNT(id) FROM `tf_cdr` WHERE RIGHT(CallerNumber,10) = RIGHT(C.CallerNumber,10) and CallStartTime>m.calldate and accountid=C.accountid) AS callbackcount FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m on m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where C.AgentID=? AND C.CallTypeID = ? AND DATE(C.CallStartTime)=CURRENT_DATE  ORDER BY C.CallStartTime DESC', [id, type], callback);
                } else {
                    return db.query('SELECT C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id,CONCAT("TF",SUBSTR(C.CallerNumber,4,3), "3", SUBSTR(C.CallerNumber,1,3), "2", SUBSTR(C.CallerNumber,7,3), "1", SUBSTR(C.CallerNumber,10,3)) AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",C.CallerName) as CallerName,(SELECT COUNT(id) FROM `tf_cdr` WHERE RIGHT(CallerNumber,10) = RIGHT(C.CallerNumber,10) and CallStartTime>m.calldate and accountid=C.accountid) AS callbackcount FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m on m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where C.AgentID=? AND C.CallTypeID = ? AND DATE(C.CallStartTime)=CURRENT_DATE  ORDER BY C.CallStartTime DESC', [id, type], callback);
                    //return db.query('SELECT C.*,A.whatsup_access,A.show_no_id,CONCAT("TF",SUBSTR(C.CallerNumber,4,3), "3", SUBSTR(C.CallerNumber,1,3), "2", SUBSTR(C.CallerNumber,7,3), "1", SUBSTR(C.CallerNumber,10,3)) AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",C.CallerName) as CallerName,(SELECT COUNT(id) FROM `tf_cdr` WHERE RIGHT(CallerNumber,10) = RIGHT(C.CallerNumber,10) and CallStartTime>m.calldate and accountid=C.accountid) AS callbackcount FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m on m.cdrid=C.id LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where C.AgentID=? AND C.CallTypeID = ? AND DATE(C.CallStartTime)=CURRENT_DATE  ORDER BY C.CallStartTime DESC', [id, type], callback);
                }
            }
        })
    },
    getagentcurrentcall: function (id, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                var row = results[0]
                if (row.show_no_id == 0) {
                    return db.query("SELECT * FROM tf_cdr WHERE AgentID=? AND CdrStatus IN (1,2,3) AND CallStartTime >= CONCAT(DATE(NOW()),' 00:00:00') AND CallStartTime <= CONCAT(DATE(NOW()),' 23:59:59') ORDER BY CallStartTime DESC limit 0,1", [id], callback);
                } else {
                    return db.query('SELECT *,id AS CallerNumber,IF(CallerName REGEXP ("^[0-9]+$"),"",CallerName) as CallerName FROM `tf_cdr` WHERE AgentID=? AND (CdrStatus=2 || CdrStatus=1) AND CallStartTime >= CONCAT(DATE(NOW())," 00:00:00") AND CallStartTime <= CONCAT(DATE(NOW())," 23:59:59") ORDER BY CallStartTime DESC LIMIT 0,1', [id], callback);
                }
            }
        })

    },
    getagentrecentcall: function (id, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                const row = results[0]
                if (row.show_no_id == 0) {
                    return db.query('SELECT *,id AS callernumber FROM `tf_cdr` WHERE AgentID=? order by id desc LIMIT 20', [id], callback);
                } else {
                    return db.query('SELECT *,id AS callernumber,IF(CallerName REGEXP ("^[0-9]+$"),"",CallerName) as CallerName FROM `tf_cdr` WHERE AgentID=? order by id desc LIMIT 20', [id], callback);
                }
            }
        })

    },

    searchcalllog: function (data, callback) {
        //console.log(JSON.stringify(data));
        var where = 'accountid=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentstatus) {
            where += " and AgentStatus='" + data.agentstatus + "'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            if (data.customer_id == 909) {
                where += " and CallerNumber  LIKE '" + data.callerno + "'";
            } else {
                where += " and CallerNumber LIKE  '%" + data.callerno + "'";
            }
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '%" + data.agentno + "'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and serviceid='" + data.service + "'";
        }
        console.log('SELECT * FROM `tf_cdr` where ' + where + ' ORDER BY ' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' ORDER BY ' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },

    searchfeedback: function (data, callback) {
        console.log(JSON.stringify(data));
        var where = 'accountid=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00') "
            //  where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += "and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.feedback) {
            return db.query('SELECT * FROM `tf_cdr` where ' + where + ' and id IN (select cdrid FROM `tf_feedbackform_data` where fid =' + data.feedback + ') ORDER BY id DESC', [], callback);

        } else {
            return db.query('SELECT * FROM `tf_cdr` where ' + where + ' and id IN (select cdrid FROM `tf_feedbackform_data`) ORDER BY id DESC', [], callback);

        }
    },



    searchcalllogtotal: function (data, callback) {
        //console.log(data);

        var where = 'accountid=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentstatus) {
            where += " and AgentStatus='" + data.agentstatus + "'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            if (data.customer_id == 909) {
                where += " and CallerNumber  LIKE '" + data.callerno + "'";
            } else {
                where += " and CallerNumber LIKE  '%" + data.callerno + "'";
            }
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '%" + data.agentno + "'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and serviceid='" + data.service + "'";
        }

        console.log('SELECT count(id) as total FROM `tf_cdr` where ' + where + '');
        return db.query('SELECT count(id) as total FROM `tf_cdr` where ' + where + '', [], callback);
    },
    calllogexcel: function (data, callback) {
        //console.log(data);
        var where = 'accountid=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            if (data.customer_id == 909) {
                where += " and CallerNumber  LIKE '" + data.callerno + "%'";
            } else {
                where += " and CallerNumber LIKE  '" + data.callerno + "%'";
            }
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and serviceid='" + data.service + "'";
        }

        if (data.customer_id == 1556) {
            //console.log('SELECT *,CONVERT_TZ (CallStartTime, "+05:30","-04:00") as CallStartTime FROM `tf_cdr` where ' + where + ' order by CallStartTime DESC');
            return db.query('SELECT *,CONVERT_TZ (CallStartTime, "+05:30","-04:00") as CallStartTime FROM `tf_cdr` where ' + where + ' order by CallStartTime DESC', [], callback);
        } else {
            if (data.customer_id == 2307) {
                return db.query('SELECT *,ABS(calltalktime-agenttalktime) AS queue_time,DATE_FORMAT(CallStartTime,"%d-%m-%Y %H:%i:%s") AS CallStartTime FROM tf_cdr WHERE ' + where + ' order by CallStartTime DESC', [], callback);

            } else {
                return db.query('SELECT *,DATE_FORMAT(CallStartTime,"%d-%m-%Y %H:%i:%s") as CallStartTime FROM `tf_cdr` where ' + where + ' order by CallStartTime DESC', [], callback);

            }
        }
    },
    getcallstatus: function (id, callback) {
        return db.query('SELECT DISTINCT(CallStatus) as callstatus FROM tf_cdr WHERE CallStatus!=""', [], callback);
    },
    getagentstatus: function (id, callback) {
        return db.query('SELECT DISTINCT (AgentStatus) FROM tf_cdr WHERE AgentStatus!=""', [], callback);
    },
    getcalldid: function (id, callback) {
        return db.query('SELECT D.did_number,N.* FROM `tf_did_numbers` N INNER JOIN tf_did D ON N.did=D.did WHERE N.account_id=? order by N.assginDate desc', [id], callback);

        //return db.query('SELECT distinct DID as did FROM `tf_cdr` where accountid=?  ORDER BY id ASC', [id], callback);
    },
    getcallername: function (id, callback) {
        return db.query('SELECT distinct CallerName FROM `tf_cdr` where accountid=? ', [id], callback);
    },
    getcalltype: function (id, callback) {
        return db.query('SELECT DISTINCT (CallType)  FROM tf_cdr', [], callback);
    },
    getdisconnectedby: function (id, callback) {
        return db.query('SELECT DISTINCT (DisconnectedBy) FROM `tf_cdr` WHERE DisconnectedBy != ""', [], callback);
    },
    getlastdestination: function (id, callback) {
        return db.query("SELECT dest_name as LastDestination FROM tf_destination", callback);
        //return db.query('SELECT distinct LastDestination FROM `tf_cdr` where accountid=? ', [id], callback);
    },
    getcallextension: function (id, callback) {
        return db.query("SELECT ext_id,ext_id as LastExtension FROM tf_last_extension", callback);
        // return db.query('SELECT distinct LastExtension FROM `tf_cdr` where accountid=? and LastExtension is not null', [id], callback);
    },
    getuserdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id= ?', [id], callback);
    },
    checkactiveamanageraccount: function (id, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ? and current_status=0 and expiry_date >=CURDATE()', [id], callback);
    },
    findoutgoingdid: function (id, callback) {
        return db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1 AND Type=9', [id], callback);
    },
    updateagentcallfeedback: function (data, callback) {
        return db.query('update tf_cdr set ? WHERE id = ?', [data, data.id], callback);
    },
    updatemeetingid: function (data, callback) {
        return db.query('update tf_schedule_meeting set ? WHERE meetingid = ?', [data, data.meetingid], callback);
    },
    getagentcallfeedback: function (id, callback) {
        return db.query('SELECT id,note,scheduledate,feedback,accountid,AgentID,CallerNumber,CallerName,cont_id FROM `tf_cdr` WHERE id = ? ', [id], callback);
    },
    getaudiofile: function (id, callback) {
        return db.query('SELECT RecPath FROM `tf_cdr` WHERE id = ? ', [id], callback);
    },
    searchlivecall: function (data, callback) {
        //console.log(data);
        var where = 'accountid=' + data.userid;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' and CdrStatus = 2 ORDER BY CallStartTime DESC ', [], callback);
    },
    searchsupervisorlivecall: function (data, callback) {
        var where = 'S.supervisor_account_id=' + data.userid;
        if (data.startdate != '1970-01-01') {
            where += " and C.CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.did) {
            where += " and C.DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and C.AgentNumber = '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }

        return db.query('SELECT * FROM `tf_cdr` C LEFT JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID where ' + where + ' and C.CdrStatus = 2 ORDER BY C.CallStartTime DESC ', [], callback);
    },

    findcdrbyuid: function (id, callback) {
        return db.query('SELECT * FROM tf_cdr where uniqueid=?', [id], callback);
    },
    getconferencecall: function (id, callback) {
        return db.query('SELECT * from tf_conference where account_id= ?  ORDER by conf_date DESC', [id], callback);
    },
    getconferencestatus: function (id, callback) {
        return db.query('SELECT (select count(conf_id) from tf_conference where account_id = ? and conf_date >= NOW() GROUP by account_id) as active,(select count(cmr.cdrid) from tf_conference c left join tf_conference_member cm ON c.conf_id = cm.conference_id left join tf_conference_member_record cmr ON cm.member_id=cmr.memberid where c.account_id = ? and conf_date BETWEEN date_add(NOW(),interval -1 hour) AND date_add(NOW(),interval +1 hour) and cmr.cdrid > 0 GROUP by c.conf_id) as live,(select count(conf_id) from tf_conference where account_id = ? and conf_date < NOW() GROUP by account_id) as completed from tf_conference where account_id=? group by account_id', [id, id, id, id], callback);
    },
    saveconferencecall: function (data, callback) {
        return db.query('Insert INTO tf_conference SET ?', data, callback);
    },
    getconferencecalldetail: function (id, callback) {
        return db.query('SELECT * from tf_conference where conf_id= ?', [id], callback);
    },
    updateconferencecall: function (data, callback) {
        return db.query('update tf_conference set ? WHERE conf_id = ?', [data, data.conf_id], callback);
    },
    deleteconferencecall: function (id, callback) {
        return db.query('DELETE FROM tf_conference where conf_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM tf_conference_member where conference_id=?', [id], callback);
            }
        })
    },
    totallivecall: function (id, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND CdrStatus=2', [id], callback);
    },
    totalivrcall: function (id, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND serviceid=3', [id], callback);
    },
    totalmisscall: function (id, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND serviceid=6', [id], callback);
    },
    totaldidnumber: function (id, callback) {
        return db.query('SELECT count(id) as total FROM `tf_did_numbers` WHERE account_id=?', [id], callback);
    },
    totaltodaycall: function (data, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND CallStartTime>=?', [data.id, data.date], callback);
    },
    totaltodayincomingcall: function (data, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND CallStartTime>=? AND CallTypeID=2', [data.id, data.date], callback);
    },
    totaltodayoutgoingcall: function (data, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND CallStartTime>=? AND CallTypeID=0', [data.id, data.date], callback);
    },
    totaltodaymissedcall: function (data, callback) {
        return db.query('SELECT count(id) as total FROM `tf_cdr` WHERE accountid=? AND CallStartTime>=? AND CallTypeID=2 AND CallTalkTime=0', [data.id, data.date], callback);
    },
    getagentlead: function (id, callback) {
        return db.query('SELECT C.name,C.mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY cam_id ASC LIMIT 100', [id], callback);
    },
    getagentleadbyid: function (id, callback) {
        return db.query('SELECT C.name,C.mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.numid=?', [id], callback);
    },
    updatecamnumber: function (data, id, callback) {
        return db.query('update tf_campaigns_numbers set ? WHERE numid = ?', [data, id], callback);
    },
    checkclicktocalltag: function (id, callback) {
        return db.query('SELECT * FROM `tf_clicktocall` WHERE tag_id = ?', [id], callback);
    },
    insertcdr: function (data, callback) {
        return db.query('INSERT INTO tf_cdr SET ?', [data], callback);
    },
    getmanagerlead: function (id, feedback, callback) {
        return db.query('SELECT * FROM `tf_cdr` where accountid=? AND feedback = ? ORDER BY CallStartTime DESC', [id, feedback], callback);

    },
    getfeedbacklist: function (id, callback) {
        return db.query('SELECT feedback_vales FROM `tf_account_table` WHERE account_id = ?', [id], callback);

    },
    getcallfeedback: function (id, uid, callback) {
        //console.log('SELECT DISTINCT(feedback) AS feedback FROM `tf_cdr` WHERE feedback!="" and accountid = ?');
        // return db.query('SELECT feedback FROM `tf_cdr` WHERE feedback!="" and accountid = ? GROUP BY feedback ORDER BY feedback ASC', [id], callback);
        //return db.query('SELECT GROUP_CONCAT(feedback) AS feedback FROM(SELECT DISTINCT(feedback_vales) AS feedback FROM tf_account_table WHERE created_by='+uid+' AND feedback_vales!="" UNION SELECT feedback_vales AS feedback FROM tf_account_table WHERE account_id='+id+')U',callback)
        return db.query('SELECT DISTINCT(feedback) FROM `tf_cdr` WHERE feedback!="" AND accountid =?', [id], callback);
    },
    getmanagerleadfilter: function (data, callback) {
        var where;

        where = 'feedback!="" and accountid=' + data.userid;
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.feedback) {
            where += " and feedback='" + data.feedback + "'";
        }
        if (data.callerno != '') {
            where += " and CallerNumber like '" + data.callerno + "%'";
        }
        if (data.startdate != '1970-01-01' && data.startdate != '') {

            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"

        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {

            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "

        }
        console.log("dsdsd" + 'SELECT * FROM `tf_cdr` where  ' + where + ' ORDER BY CallStartTime DESC');
        return db.query('SELECT * FROM `tf_cdr` where  ' + where + ' ORDER BY CallStartTime DESC', [], callback);
    },
    // searchcall: function (data, callback) {
    //     //console.log(data);
    //     var where = 'accountid=' + data.customer_id;
    //     if (data.startdate != '1970-01-01') {
    //         where += " and DATE(CallStartTime)>='" + data.startdate + "'";
    //     }
    //     if (data.enddate != '1970-01-01') {
    //         where += " and DATE(CallStartTime)<='" + data.enddate + "'";
    //     }
    //     if (data.status) {
    //         where += " and CallStatus='" + data.status + "'";
    //     }
    //     if (data.did) {
    //         where += " and DID='" + data.did + "'";
    //     }
    //     if (data.agentid) {
    //         where += " and AgentID='" + data.agentid + "'";
    //     }
    //     if (data.callerno) {
    //         where += " and RIGHT(CallerNumber,10) =  '" + data.callerno + "'";
    //     }
    //     if (data.agentno) {
    //         where += " and RIGHT(AgentNumber,10) = '" + data.agentno + "'";
    //     }
    //     if (data.calltype) {
    //         where += " and CallType='" + data.calltype + "'";
    //     }
    //     if (data.lastdestination) {
    //         where += " and LastDestination='" + data.lastdestination + "'";
    //     }
    //     if (data.service) {
    //         where += " and serviceid='" + data.service + "'";
    //     }
    //     return db.query('SELECT * FROM `tf_cdr` where ' + where + ' ORDER BY CallStartTime DESC', [], callback);
    // },
    getmultipleuserdetail: function (userid, members, type, callback) {
        if (type == 0) {
            var members = members.join(',')
            return db.query('SELECT account_id,account_name,mobile FROM `tf_account_table` WHERE account_type=1 AND created_by = ? AND account_id IN (' + members + ')', [userid], callback);
        } else if (type == 2) {
            return db.query('SELECT contact_no as mobile FROM `tf_conference_member` where account_id = ? and conference_id = ?', [userid, members], callback);
        } else {

        }
    },
    getagentliveallcalllog: function (id, callback) {
        return db.query('SELECT * FROM `tf_cdr` where CdrStatus = 2', callback);
    },
    getliveagentcalllog: function (data, callback) {
        var where = 'AgentID=' + data.agent;

        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' AND CdrStatus = 2 ORDER BY CallStartTime DESC', [], callback);
    },
    searchmisscalllog: function (data, callback) {
        var where = 'serviceid=6 and accountid=' + data.userid;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
            //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
            // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber LIKE '" + data.callerno + "%'";
        }
        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' ORDER BY CallStartTime DESC ', [], callback);
    },
    todaycallstatus: function (userid, todaydate, callback) {
        where = ' accountid=' + userid + ' and CallStartTime>="' + todaydate + '"';
        //console.log('SELECT CallStatus,count(id) as totalcnt FROM `tf_cdr` where '+where+' GROUP BY CallStatus');
        return db.query('SELECT CallStatus,count(id) as totalcnt FROM `tf_cdr` where ' + where + ' GROUP BY CallStatus', [], callback);
    },
    todaycallstatusummary: function (data, callback) {
        where = ' C.accountid=' + data.userid + ' and DATE(C.CallStartTime)>="' + data.startdate + '" and DATE(C.CallStartTime)<="' + data.enddate + '"';
        //console.log('SELECT CallStatus,(SELECT count(id)  FROM `tf_cdr` where accountid=C.accountid and DATE(C.CallStartTime)>="' + data.startdate + '" and DATE(C.CallStartTime)<="' + data.enddate + '"  and CallTalkTime>0) AS answercnt,(SELECT count(id)  FROM `tf_cdr` where accountid=C.accountid and DATE(C.CallStartTime)>="' + data.startdate + '" and DATE(C.CallStartTime)<="' + data.enddate + '"  AND CallTalkTime=0) AS noanswercnt FROM `tf_cdr` C where ' + where + ' GROUP BY C.CallStatus');
        return db.query('SELECT CallStatus,(SELECT count(id)  FROM `tf_cdr` where accountid=C.accountid and DATE(CallStartTime)>="' + data.startdate + '" and DATE(CallStartTime)<="' + data.enddate + '"  and CallTalkTime>0) AS answercnt,(SELECT count(id)  FROM `tf_cdr` where accountid=C.accountid and DATE(CallStartTime)>="' + data.startdate + '" and DATE(CallStartTime)<="' + data.enddate + '"  AND CallTalkTime=0) AS noanswercnt FROM `tf_cdr` C where ' + where + ' GROUP BY C.CallStatus', [], callback);
    },
    todaycalltype: function (userid, todaydate, callback) {
        where = ' accountid=' + userid + ' and CallStartTime>="' + todaydate + '"';
        //console.log('SELECT CallStatus,count(id) as totalcnt FROM `tf_cdr` where '+where+' GROUP BY CallStatus');
        return db.query('SELECT CallType,count(id) as totalcnt FROM `tf_cdr` where ' + where + ' GROUP BY CallType', [], callback);
    },
    //insert bulk conference member data
    insertbulkconfmember: function (data, callback) {
        db.query("Insert INTO tf_conference_member SET ?", [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    insertintocalender: function (data, callback) {
        db.query("Insert INTO tf_scheduler SET ?", [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    searchmaster: function (data, callback) {

        return db.query('SELECT * FROM `tf_master_data` LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
        // return db.query('SELECT * FROM `tf_master_data` where city='+data.city+'  LIMIT '+data.position+','+data.pageSize+'' , [], callback);
    },
    searchmasterall: function (id, callback) {
        return db.query('SELECT count(name) as name FROM `tf_master_data`', callback);
    },
    getconferencemembers: function (id, callback) {
        //console.log('SELECT *,(SELECT C.CdrStatus FROM tf_conference_member_record R LEFT JOIN tf_cdr C ON R.cdrid=C.id WHERE R.confid=? AND R.memberid = M.member_id ORDER BY cdrid DESC LIMIT 1) as callstatus FROM `tf_conference_member` M WHERE conference_id='+id);
        return db.query('SELECT *,(SELECT C.CdrStatus FROM tf_conference_member_record R LEFT JOIN tf_cdr C ON R.cdrid=C.id WHERE R.confid=? AND R.memberid = M.member_id ORDER BY cdrid DESC LIMIT 1) as callstatus FROM `tf_conference_member` M WHERE conference_id=?', [id, id], callback);
    },
    getagentdatalead: function (data, callback) {
        var where;
        //console.log(data)
        where = 'AgentID=' + data.userid;
        if (data.feedback) {
            where += " and feedback='" + data.feedback + "'";
        } else {
            where += " and feedback !=''";
        }
        if (data.callerno) {
            where += " and CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.startdate != '1970-01-01' && data.startdate != '') {
            var startdateObj = new Date(data.startdate);
            var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
            data.startdate = startdate;
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {
            var enddateObj = new Date(data.enddate);
            var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
            data.enddate = enddate;
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (results.length > 0) {
                    if (row.show_no_id == 0) {
                        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' ORDER BY CallStartTime DESC', [], callback);
                    } else {
                        return db.query("SELECT *,CONCAT('TF',SUBSTR(CallerNumber,4,3), '3', SUBSTR(CallerNumber,1,3), '2', SUBSTR(CallerNumber,7,3), '1', SUBSTR(CallerNumber,10,3)) AS CallerNumber,IF(CallerName REGEXP ('^[0-9]+$'),'',CallerName) as CallerName FROM `tf_cdr` where " + where + " ORDER BY CallStartTime DESC", [], callback);
                    }
                } else {
                    callback(err, results);
                }
            }
        })
    },
    getAgentleadFeedback: function (id, callback) {
        return db.query('SELECT id,note,scheduledate,feedback FROM `tf_cdr` WHERE id = ? ', [id], callback);
    },
    updateAgentleadFeedback: function (data, callback) {
        return db.query('update tf_cdr set ? WHERE id = ?', [data, data.id], callback);
    },
    searchreqdata: function (data, callback) {
        var where;
        where = 'AgentID=' + data.userid;


        if (data.callerno) {
            where += " and CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        //  console.log('SELECT * FROM `tf_cdr` where '+where+'' );
        return db.query('SELECT * FROM `tf_cdr` where ' + where + '', [], callback);
    },
    getAgentcallSchedule: function (data, callback) {
        var where;
        where = 'AgentID=' + data.userid;


        if (data.feedback) {
            where += " and (scheduledate!='' and scheduledate!='0000-00-00 00:00:00' and DATE(scheduledate)!='1970-01-01')";
        }
        if (data.callerno) {
            where += " and CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.startdate != '1970-01-01' && data.startdate != '') {
            var startdateObj = new Date(data.startdate);
            var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
            data.startdate = startdate;
            where += " and DATE(scheduledate)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {
            var enddateObj = new Date(data.enddate);
            var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
            data.enddate = enddate;
            where += " and DATE(scheduledate)<='" + data.enddate + "'";
        }
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
                callback(err, results);
            } else {
                const row = results[0]
                if (results.length > 0) {
                    if (row.show_no_id == 0) {
                        //console.log('SELECT *,CallerNumber AS callernumber,IF((scheduledate>NOW()),true,false) AS is_schedule FROM `tf_cdr` where ' + where + ' ORDER BY scheduledate DESC');
                        return db.query('SELECT *,CallerNumber AS callernumber,IF((scheduledate>NOW()),true,false) AS is_schedule FROM `tf_cdr` where ' + where + ' ORDER BY scheduledate DESC', [], callback);
                    } else {
                        //console.log("SELECT *,CallerNumber AS callernumber,id AS CallerNumber,IF(CallerName REGEXP ('^[0-9]+$'),'',CallerName) as CallerName,IF((scheduledate>NOW()),true,false) AS is_schedule FROM `tf_cdr` where " + where + " ORDER BY scheduledate DESC");
                        return db.query("SELECT *,CallerNumber AS callernumber,id AS CallerNumber,IF(CallerName REGEXP ('^[0-9]+$'),'',CallerName) as CallerName,IF((scheduledate>NOW()),true,false) AS is_schedule FROM `tf_cdr` where " + where + " ORDER BY scheduledate DESC", [], callback);
                    }
                } else {
                    callback(err, results);
                }
            }
        })



    },
    getCalldetailhistory: function (id, callback) {
        return db.query("SELECT accountid,CallerNumber,AgentID FROM `tf_cdr` WHERE id=" + id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
                callback(err, results);
            } else {
                var account_id = results[0].accountid
                var agentid = results[0].AgentID
                var number = results[0].CallerNumber
                //console.log("[numbers]", number);
                return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [agentid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        const row = results[0]
                        if (results.length > 0) {
                            if (row.show_no_id == 0) {
                                return db.query("SELECT * FROM `tf_cdr` WHERE CallerNumber like '" + number + "' and accountid=" + account_id + " and AgentID=" + agentid + " ORDER BY CallStartTime DESC", [], callback);
                            } else {
                                return db.query("SELECT *,id AS CallerNumber,IF(CallerName REGEXP ('^[0-9]+$'),'',CallerName) as CallerName FROM `tf_cdr` WHERE CallerNumber like '" + number + "' and accountid=" + account_id + " and AgentID=" + agentid + " ORDER BY CallStartTime DESC", [], callback);
                            }
                        } else {
                            callback(err, results);
                        }
                    }
                })
            }
        });
    },
    getCallloghistory: function (id, callback) {
        return db.query("SELECT * FROM `tf_cdr` WHERE id=" + id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                account_id = results[0].accountid
                number = results[0].CallerNumber
                numbers = (number.length == 10) ? number : number.substring(2);
                return db.query("SELECT * FROM `tf_cdr` WHERE CallerNumber like '%" + numbers + "%' and accountid=" + account_id + " ORDER BY CallStartTime DESC", [], callback);
            }
        });
    },

    get_Call_feedback_data: function (id, callback) {
        return db.query('SELECT * FROM `tf_feedbackform_data` where cdrid = ' + id, [], callback);
    },

    getCalllogaudio: function (id, callback) {
        return db.query("SELECT * FROM `tf_cdr` WHERE id=" + id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                account_id = results[0].accountid
                number = results[0].CallerNumber
                numbers = (number.length == 10) ? number : number.substring(2);
                return db.query("SELECT RecPath FROM `tf_cdr` WHERE RecPath is not NULL and CallerNumber like '%" + numbers + "%' and accountid=" + account_id + " ORDER BY CallStartTime DESC", [], callback);
            }
        });
    },

    getNextcallSchedule: function (data, callback) {
        //console.log(data.userid)
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (results.length > 0) {
                    if (row.show_no_id == 0) {
                        return db.query("SELECT * FROM `tf_cdr` WHERE feedback like '%" + data.feedback + "%' and AgentID=" + data.userid + " and scheduledate>= DATE_SUB(now(),INTERVAL 1 HOUR) ", [], callback);
                    } else {
                        return db.query("SELECT *,CONCAT('TF',SUBSTR(CallerNumber,4,3), '3', SUBSTR(CallerNumber,1,3), '2', SUBSTR(CallerNumber,7,3), '1', SUBSTR(CallerNumber,10,3)) AS CallerNumber,IF(CallerName REGEXP ('^[0-9]+$'),'',CallerName) as CallerName FROM `tf_cdr` WHERE feedback like '%" + data.feedback + "%' and AgentID=" + data.userid + " and scheduledate>= DATE_SUB(now(),INTERVAL 1 HOUR) ", [], callback);
                    }
                } else {
                    callback(err, results);
                }
            }
        })
    },
    getagentcalllogdata: function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (results.length > 0) {
                    if (row.show_no_id == 0) {
                        return db.query('SELECT * FROM `tf_cdr` where AgentID=' + data.userid + ' AND CallTypeID = ' + data.type + ' ORDER BY CallStartTime DESC LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
                    } else {
                        return db.query('SELECT *,CONCAT("TF",SUBSTR(CallerNumber,4,3), "3", SUBSTR(CallerNumber,1,3), "2", SUBSTR(CallerNumber,7,3), "1", SUBSTR(CallerNumber,10,3)) AS CallerNumber,IF(CallerName REGEXP ("^[0-9]+$"),"",CallerName) as CallerName FROM `tf_cdr` where AgentID=' + data.userid + ' AND CallTypeID = ' + data.type + ' ORDER BY CallStartTime DESC LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
                    }
                } else {
                    callback(err, results);
                }
            }
        })
    },
    getagentleaddata: function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                if (row.show_no_id == 0) {
                    return db.query('SELECT C.name,C.mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY numid ASC LIMIT ' + data.position + ',' + data.pageSize + '', [data.id], callback);
                } else {
                    return db.query('SELECT C.name,CONCAT("TF",SUBSTR(C.mobile,4,3), "3", SUBSTR(C.mobile,1,3), "2", SUBSTR(C.mobile,7,3), "1", SUBSTR(C.mobile,10,3)) AS mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY numid ASC LIMIT ' + data.position + ',' + data.pageSize + '', [data.id], callback);
                }
            }
        })
        //return db.query('SELECT C.name,C.mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY numid ASC LIMIT '+data.position+','+data.pageSize+'', [data.id], callback);
    },
    getLiveChannel: function (customerid, callback) {
        return db.query('SELECT outgoing_channel - (SELECT COUNT(channel) as cnt FROM `tf_cdr` WHERE CdrStatus IN (1,2,3) AND accountid =? AND (CallTypeID=0 OR CallTypeID=1)) as rchannel FROM tf_account_table A  WHERE  A.account_id=? ORDER BY RAND() LIMIT 1', [customerid, customerid], callback);
    },
    updateCallResult: function (data, id, callback) {
        return db.query('update tf_cdr set ? WHERE id = ?', [data, id], callback);
    },
    getagentcallanalytics: function (id, callback) {
        return db.query('SELECT COUNT(id) as dialcall,(SELECT COUNT(id) FROM `tf_cdr` WHERE `CallTypeID` = 2 AND CallTalkTime > 0 AND AgentID = ? AND CallStartTime>=CURDATE()) as receivecall,(SELECT COUNT(id) FROM `tf_cdr` WHERE `CallTypeID` = 2 AND CallTalkTime <= 0 AND AgentID = ? AND CallStartTime>=CURDATE()) as missedcall FROM `tf_cdr` WHERE (`CallTypeID` = 1 or `CallTypeID` = 0) AND AgentID = ? AND CallStartTime>=CURDATE()', [id, id, id], callback);
    },
    getsinglecallhistory: function (mobile, contid, managerid, callback) {
        mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2);
        mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
        //console.log(mobile)
        if (contid != '' && contid === null) {
            //console.log(contid)
            return db.query("SELECT *,DATE_FORMAT(CallStartTime,'%d-%m-%Y') as calldate FROM `tf_cdr` WHERE cont_id= ? and accountid=?  ORDER BY CallStartTime DESC limit 50", [contid, managerid], callback);
        } else {
            return db.query("SELECT *,DATE_FORMAT(CallStartTime,'%d-%m-%Y') as calldate FROM `tf_cdr` WHERE CallerNumber like '" + mobile + "' and accountid=?  ORDER BY CallStartTime DESC", [managerid], callback);
        }
    },
    getcallhistorybymobile: function (mobile,  managerid, callback) {
       // mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2);
       // mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
        //console.log("SELECT *,DATE_FORMAT(CallStartTime,'%d-%m-%Y') as calldate FROM `tf_cdr` WHERE CallerNumber like '" + mobile + "' and accountid="+managerid+" and AgentID="+agentid+"  ORDER BY CallStartTime DESC limit 10");
        return db.query("SELECT *,DATE_FORMAT(CallStartTime,'%d-%m-%Y') as calldate FROM `tf_cdr` WHERE CallerNumber like '%" + mobile + "%' and accountid=? ORDER BY CallStartTime DESC limit 10", [managerid], callback);

    },
    getagentqueuecall: function (agentid, callback) {
        return db.query("SELECT c.CallerName,c.CallerNumber,q.* FROM `tf_queuecall` q INNER JOIN tf_cdr c ON q.cdrid=c.id WHERE q.agentid = ? and status ='0' ORDER BY `qid` asc", [agentid], callback);
    },
    updatequeuecall: function (data, id, callback) {
        return db.query('update tf_queuecall set ? WHERE cdrid = ? and agentid = ?', [data, data.cdrid, id], callback);
    },
    findcdr: function (id, callback) {
        return db.query('SELECT * FROM tf_cdr where id=?', [id], callback);
    },
    savefeedbackformmeta: function (data, callback) {
        return db.query('Insert INTO tf_feedbackform_data SET ?', data, callback);
    },
    searchagentcalllog: function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.agent_id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = 'C.AgentID=' + data.agent_id + ' and C.CallTypeID=' + data.calltypeid;
                if (data.startdate != '1970-01-01') {
                    where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"
                    //where += " and DATE(CallStartTime) >='" + data.startdate + "',' 00:00:00'";
                }
                if (data.enddate != '1970-01-01') {
                    where += " and CONCAT('" + data.enddate + "',' 23:59:59') "
                    // where += " and DATE(CallStartTime) <='" + data.enddate + "',' 23:59:59'";
                }
                if (data.name != null) {
                    where += " and C.CallerName LIKE '" + data.name + "'";
                }
                if (data.mobile != null) {
                    where += " and C.CallerNumber LIKE '" + data.mobile + "%'";
                }
                if (data.feedback != null) {
                    where += " and C.feedback='" + data.feedback + "'";

                }

                if (row.show_no_id == 0) {
                    return db.query('SELECT C.id,C.AgentID,C.RecPath,C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id,C.CallerNumber AS callernumber FROM `tf_cdr` C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where ' + where + ' ORDER BY C.CallStartTime DESC', [], callback);

                } else {
                    return db.query('SELECT C.id,C.AgentID,C.RecPath,C.CallStartTime, C.DID, C.CallerName, C.CallerNumber, C.CallTalkTime, C.CallStatus, C.feedback,A.whatsup_access,A.show_no_id,C.CallerNumber AS callernumber,C.id AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",CallerName) as CallerName FROM `tf_cdr` C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID where ' + where + ' ORDER BY C.CallStartTime DESC', [], callback);
                }
            }
        })
    },
    searchagentmissedcalllog: function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.agent_id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = 'C.AgentID=' + data.agent_id + ' and C.CallTalkTime=0 and C.CallTypeID=' + data.calltypeid;
                if (data.startdate != '') {
                    where += " and  C.CallStartTime BETWEEN '" + data.startdate + "  00:00:00'";
                }
                if (data.enddate != '') {
                    where += " and '" + data.enddate + " 23:59:59'";
                }
                if (data.name != null) {
                    where += " and C.CallerName LIKE '" + data.name + "'";
                }
                if (data.mobile != null) {
                    where += " and C.CallerNumber='" + data.mobile + "'";
                }
                if (data.feedback != null) {
                    where += " and C.feedback='" + data.feedback + "'";

                }
                if (row.show_no_id == 0) {
                    return db.query('SELECT C.CallStartTime AS callstarttime, C.DID AS did, C.CallerName AS callername, C.CallerNumber AS caller_number, C.CallTalkTime AS calltalktime, C.CallStatus AS callstatus, C.feedback AS feedback,A.whatsup_access AS whatsup_access,A.show_no_id AS show_no_id,C.CallerNumber AS callernumber,C.CallStartTime AS misscalldate FROM tf_cdr C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID WHERE ' + where + ' ORDER BY C.CallStartTime DESC', [], callback);
                } else {
                    return db.query(' SELECT C.CallStartTime AS callstarttime, C.DID AS did, C.CallerName AS callername, C.CallerNumber AS caller_number, C.CallTalkTime AS calltalktime, C.CallStatus AS callstatus, C.feedback AS feedback,A.whatsup_access AS whatsup_access,A.show_no_id AS show_no_id,C.CallerNumber AS callernumber,C.CallStartTime AS misscalldate,C.id AS CallerNumber,IF(C.CallerName REGEXP ("^[0-9]+$"),"",CallerName) AS CallerName FROM tf_cdr C LEFT JOIN tf_account_table A ON A.account_id=C.AgentID WHERE ' + where + ' ORDER BY C.CallStartTime DESC', [], callback);

                }
            }
        })
    },
    schedulemeeting: function (data, callback) {
        return db.query('Insert INTO tf_schedule_meeting SET ?', data, callback);
    },
    smsreport: function (data, callback) {
        return db.query('Insert INTO tf_sms_report SET ?', data, callback);
    },
    insertscheduledata: function (data, callback) {
        return db.query('INSERT INTO tf_scheduler SET ?', [data], callback);
    },
    getschedulemeeting: function (data, callback) {
        //console.log("data :" + data);
        return db.query('SELECT server_id FROM tf_assign_sms_server where account_id=?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    row = results[0];
                    return db.query('SELECT SMS_Pr_Balance FROM tf_account_balance where Account_ID=?', [data], function (err, results1) {
                        if (err) {
                            console.log("[mysql error]", err);
                        } else {
                            if (results1.length > 0) {
                                row1 = results1[0];
                                if (row1['SMS_Pr_Balance'] > 0) {
                                    //send link 
                                    return db.query('SELECT server_url FROM `tf_sms_server`  WHERE sid=? ', [row.server_id], callback);
                                }
                            } else {
                                callback(err, results1);
                            }
                        }
                    });
                } else {
                    callback(err, results);
                }
                // row = results[0]
                // if (row.show_no_id == 0) {
                //     return db.query('SELECT C.name,C.mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY numid ASC LIMIT ' + data.position + ',' + data.pageSize + '', [data.id], callback);
                // } else {
                //     return db.query('SELECT C.name,CONCAT("TF",SUBSTR(C.mobile,4,3), "3", SUBSTR(C.mobile,1,3), "2", SUBSTR(C.mobile,7,3), "1", SUBSTR(C.mobile,10,3)) AS mobile,CN.numid,CN.cam_id FROM `tf_campaigns_numbers` CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.agent_id=? and CN.status=0 ORDER BY numid ASC LIMIT ' + data.position + ',' + data.pageSize + '', [data.id], callback);
                // }
            }
        })
    },
    findconferencedid: function (id, callback) {
        return db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1 AND Type=7', [id], callback);
    },
    getaudiofileinarray: function (array, callback) {

        return db.query('SELECT GROUP_CONCAT(RecPath) as RecPath FROM `tf_cdr` WHERE id IN (' + array + ') ', callback);
    },
    searchmissedcalldata: function (data, callback) {
        // console.log("test");
        // console.log(JSON.stringify(data));
        var timezone = data.timezone;
        var where = 'c.accountid=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += ' and DATE(m.calldate) >="' + data.startdate + '"';
        }
        if (data.enddate != '1970-01-01') {
            where += ' and DATE(m.calldate) <="' + data.enddate + '"';
        }
        if (data.agentid) {
            where += " and c.AgentID='" + data.agentid + "'";
        }
        return db.query('SELECT c.DID,c.AgentName,m.calldate as missedtime,c.CallerNumber,c.CallerName,(SELECT COUNT(id) FROM `tf_cdr` WHERE CallerNumber =c.CallerNumber AND  CallStartTime>m.calldate and accountid=c.accountid) AS callbackcount FROM `tf_cdr` c LEFT JOIN `tf_agent_missedcall` m ON c.id=m.cdrid WHERE ' + where + ' ORDER BY m.calldate DESC', [], callback);
    },
    // zipaudio: async function (audioArr) {

    //     return new Promise(async function (resolve, reject) {
    //         var i = 1;
    //         const filePath = `./uploads/audio/`;
    //         var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads/');

    //         var zip = new admz();
    //         var filename = Date.now();

    //         var audio_len = audioArr.length;

    //         await Call.getaudiofileinarray(audioArr.toString(), async function (err, rows) {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 if (rows.length > 0) {
    //                     var array = rows[0]['RecPath'].split(',');
    //                     await array.forEach(async (i) => {
    //                         var file = 'https://agent.cloudX.in/api/call/audio/' + i;

    //                         await download(file, filePath)
    //                             .then(async () => {
    //                                 console.log(file);
    //                                 try {
    //                                     if (await fs.existsSync(filePath+i)) {
    //                                         await zip.addLocalFile(filePath+i);
    //                                         var willSendthis = await zip.toBuffer();  
    //                                         await zip.writeZip(DOWNLOAD_DIR + "Audio"+filename+".zip");
    //                                         i++; 
    //                                     } 
    //                                 } catch (err) {
    //                                     console.error(err);
    //                                 }
    //                             })
    //                     });

    //                 }

    //             }


    //         });
    //         if( i == audio_len){
    //             resolve(1);
    //         }else{
    //             resolve(0);
    //         }

    //     })
    // },

    getconferencememberbyid: function (id, callback) {
        return db.query('SELECT *,contact_no as mobile FROM `tf_conference_member`  WHERE conference_id=?', [id], callback);
    },
    insertconferencememberrecord: function (data, callback) {
        return db.query('INSERT INTO tf_conference_member_record SET ?', [data], callback);
    },
    findconferencechart: function (id, callback) {
        return db.query('SELECT (select count(member_id) from tf_conference_member where conference_id = ?) as total, (select count(m.member_id) from tf_conference_member m left join tf_conference_member_record mr on m.member_id=mr.memberid left join tf_cdr c ON mr.cdrid=c.id where m.conference_id = ? and mr.cdrid > 0 and c.CdrStatus = 0) as leftp,(select count(m.member_id) from tf_conference_member m left join tf_conference_member_record mr on m.member_id=mr.memberid left join tf_cdr c ON mr.cdrid=c.id where m.conference_id = ? and mr.cdrid > 0 and c.CdrStatus = 1) as joined, (select count(m.member_id) from tf_conference_member m left join tf_conference_member_record mr on m.member_id=mr.memberid where m.conference_id = ? and mr.cdrid is NULL) as unjoined FROM `tf_conference_member` WHERE conference_id  =? group by conference_id = ?', [id, id, id, id, id, id], callback);
    },
    get_lead_by_id: function (lid, callback) {
        return db.query('SELECT * FROM `tf_leads` WHERE `l_id` = ?', [lid], callback);
    },
    add_timeline_lead: function (request, callback) {
        return db.query('Insert INTO tf_lead_timeline SET ?', request, callback);
    },
    checkLeadIdByContactId: function (id, callback) {
        return db.query('SELECT lead_id from tf_contacts where cont_id= ? and lead_id>0', [id], callback);
    },
    get_lead_stage_status: function (lid, callback) {
        return db.query('SELECT C.*,CD.stage_status as statusdb,CD.status_master as masterstatus FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ?', [lid], callback);
    },
    getcdrwithleadid: function (cid, callback) {
        return db.query('SELECT CON.lead_id,C.cont_id FROM tf_cdr C LEFT JOIN tf_contacts CON ON CON.cont_id=C.cont_id WHERE id=?', [cid], callback);
    },
    getcdrfeedbackformdata: function (cid, fid, callback) {
        return db.query('SELECT * FROM tf_feedbackform_data WHERE cdrid=? and fid=?', [cid, fid], callback);
    },
    checkformmetatocontactmeta: function (mtitle, contid, callback) {
        return db.query('SELECT * FROM tf_contacts_meta WHERE meta_key=? and cont_id=?', [mtitle, contid], callback);
    },
    savecontactmeta: function (request, callback) {
        return db.query('Insert INTO tf_contacts_meta SET ?', request, callback);
    },
    searchqueueCall: function (data, callback) {
        //console.log(data);
        var where = 'accountid=' + data.userid;
        /*if (data.startdate != '1970-01-01') {
            where += " and CallStartTime >='" + data.startdate + " 00:00:00'";
            //where += " and CallStartTime >='2021-12-01 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            //where += " and CallStartTime<='2021-12-01 23:59:59'";
            where += " and CallStartTime >='" + data.enddate + " 23:59:59'";
        }*/
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.did) {
            where += " and DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' and in_queue = 1 ORDER BY CallStartTime ASC ', [], callback);
    },
    searchcallpulse: function (data, callback) {
        //console.log(data);
        var where = 'accountid=' + data.userid;
        if (data.startdate != '1970-01-01') {
            where += " and CallStartTime >='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and CallStartTime<='" + data.enddate + " 23:59:59'";
        }
        return db.query('SELECT * FROM `tf_cdr` where ' + where + ' and CallTalkTime > 0 ORDER BY CallStartTime ASC ', [], callback);
    },
    getagentdid: function (id, callback) {
        return db.query("SELECT * FROM `tf_did_numbers` WHERE account_id =" + id, callback);
    },
    hangupqueuecall: function (qdata, callback) {

        return db.query('update tf_queuecall set ? WHERE qid = ? ', [qdata, qdata.qid], callback);


    },
    hangupcalldata: function (cdata, callback) {
        //db.query('update tf_cdr set ? WHERE id = ?', [cdata, cdata.id], callback);
        // db.query('update tf_queuecall set ? WHERE cdrid = ?', [qdata, qdata.cdrid], callback);

        return db.query('update tf_cdr set ? WHERE id = ?', [cdata, cdata.id], callback);


    },
    getmaxtimequeuecall: function (id, callback) {
        //console.log('SELECT * FROM `tf_queuecall` WHERE `accountid` = '+id+' AND `status` = "0" order by times desc limit 1');
        return db.query('SELECT * FROM `tf_queuecall` WHERE `accountid` = ' + id + ' AND `status` = "0" order by start_time ASC limit 1', [id], callback);
    },
    getagents: function (id, callback) {
        return db.query("SELECT * FROM `tf_account_table` WHERE created_by=" + id + " AND current_status=0 and is_deleted ='no'", callback);
    },
    searchsupervisorcalllog: function (data, callback) {
        //console.log(JSON.stringify(data));
        var where = 'S.supervisor_account_id=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime) >='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime) <='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentstatus) {
            where += " and C.AgentStatus='" + data.agentstatus + "'";
        }
        if (data.did) {
            where += " and C.DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and C.AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and C.DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and C.LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and C.serviceid='" + data.service + "'";
        }

        //console.log('SELECT * FROM `tf_cdr` C INNER JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID  where ' + where + ' ORDER BY C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
        return db.query('SELECT * FROM `tf_cdr` C INNER JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID  where ' + where + ' ORDER BY C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    searchsupervisorcalllogtotal: function (data, callback) {
        //console.log(JSON.stringify(data));
        var where = 'S.supervisor_account_id=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime) >='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime) <='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.agentstatus) {
            where += " and C.AgentStatus='" + data.agentstatus + "'";
        }
        if (data.did) {
            where += " and C.DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and C.AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and C.DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and C.LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and C.serviceid='" + data.service + "'";
        }

        // console.log('SELECT * FROM `tf_cdr` C INNER JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID  where ' + where);
        return db.query('SELECT COUNT(C.id) AS total FROM `tf_cdr` C INNER JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID  where ' + where, [], callback);
    },
    supervisor_calllogexcel: function (data, callback) {
        //console.log(data);
        var where = 'S.supervisor_account_id=' + data.customer_id;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(C.CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and C.CallStatus='" + data.status + "'";
        }
        if (data.did) {
            where += " and C.DID='" + data.did + "'";
        }
        if (data.agentid) {
            where += " and C.AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and C.CallerNumber LIKE  '" + data.callerno + "%'";
        }
        if (data.agentno) {
            where += " and C.AgentNumber LIKE '" + data.agentno + "%'";
        }
        if (data.calltype) {
            where += " and C.CallType='" + data.calltype + "'";
        }
        if (data.disconnected_by) {
            where += " and C.DisconnectedBy='" + data.disconnected_by + "'";
        }
        if (data.lastdestination) {
            where += " and C.LastDestination='" + data.lastdestination + "'";
        }
        if (data.extension) {
            where += " and C.LastExtension='" + data.extension + "'";
        }
        if (data.service) {
            where += " and C.serviceid='" + data.service + "'";
        }
        //console.log('SELECT *,DATE_FORMAT(CallStartTime,"%d-%m-%Y %H:%i:%s") as CallStartTime FROM `tf_cdr` where ' + where + ' order by CallStartTime DESC');
        return db.query('SELECT C.*,DATE_FORMAT(C.CallStartTime,"%d-%m-%Y %H:%i:%s") as CallStartTime FROM `tf_cdr` C INNER JOIN tf_supervisor_agents S ON S.AgentID=C.AgentID where ' + where + ' order by CallStartTime DESC', [], callback);

    },
    searchsupervisiorCallPulse: function (data, callback) {

        return db.query("SELECT DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,AgentTalkTime,CallStatus,AgentStatus,CallType,CallPluse  FROM `tf_cdr` WHERE agentid IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id=" + data.userid + " AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00') AND CONCAT('" + data.enddate + "',' 23:59:59') AND CallTalkTime > 0 ORDER BY CallStartTime ASC", callback)
    },
    search_supervisior_MissedCallData: function (data, callback) {
        var timezone = data.timezone;
        var where = 'c.AgentID IN(SELECT AgentID FROM tf_supervisor_agents WHERE supervisor_account_id=' + data.customer_id + ')';
        if (data.startdate != '1970-01-01') {
            where += ' AND DATE(m.calldate) >="' + data.startdate + '"';
        }
        if (data.enddate != '1970-01-01') {
            where += 'AND  DATE(m.calldate) <="' + data.enddate + '"';
        }
        if (data.agentid) {
            where += "AND c.AgentID =" + data.agentid;
        }
        //console.log('SELECT c.DID,c.AgentName,m.calldate AS missedtime,c.CallerNumber,c.CallerName,(SELECT COUNT(id) FROM tf_cdr WHERE CallerNumber =c.CallerNumber AND  CallStartTime>m.calldate AND accountid=c.accountid) AS callbackcount FROM tf_cdr c LEFT JOIN `tf_agent_missedcall` m ON c.id=m.cdrid WHERE '+where+'  ORDER BY m.calldate DESC');
        return db.query('SELECT c.DID,c.AgentName,m.calldate AS missedtime,c.CallerNumber,c.CallerName,(SELECT COUNT(id) FROM tf_cdr WHERE CallerNumber =c.CallerNumber AND  CallStartTime>m.calldate AND accountid=c.accountid) AS callbackcount FROM tf_cdr c LEFT JOIN `tf_agent_missedcall` m ON c.id=m.cdrid WHERE ' + where + '  ORDER BY m.calldate DESC', [], callback);


    },
    search_supervisior_feedback: function (data, callback) {

        if (data.agentid) {
            var where = '';

            if (data.startdate != '1970-01-01') {
                where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00') "
            }
            if (data.enddate != '1970-01-01') {
                where += "AND CONCAT('" + data.enddate + "',' 23:59:59')  "
            } if (data.feedback) {
                return db.query('SELECT id,DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,CallStatus,AgentStatus,CallType FROM tf_cdr WHERE agentid =' + data.agentid + ' ' + where + ' AND id IN (SELECT cdrid FROM tf_feedbackform_data where fid = ' + data.feedback + ') ORDER BY id DESC', callback)

            } else {

                return db.query('SELECT id,DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,CallStatus,AgentStatus,CallType FROM tf_cdr WHERE agentid =' + data.agentid + ' ' + where + ' AND id IN (SELECT cdrid FROM tf_feedbackform_data) ORDER BY id DESC', callback)
            }
        }
        else {
            var where = 'agentid IN (SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id=' + data.customer_id + ' AND agentid IS NOT NULL AND agentid!="" AND agentid!=0)';

            if (data.startdate != '1970-01-01') {
                where += " And CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00') "
            }
            if (data.enddate != '1970-01-01') {
                where += "AND CONCAT('" + data.enddate + "',' 23:59:59')  "
            }
            if (data.feedback) {
                return db.query('SELECT id,DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,CallStatus,AgentStatus,CallType FROM `tf_cdr` WHERE ' + where + 'AND id IN (SELECT cdrid FROM `tf_feedbackform_data` where fid =' + data.feedback + ') ORDER BY id DESC', [], callback);

            } else {
                return db.query('SELECT id,DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,CallStatus,AgentStatus,CallType FROM `tf_cdr` WHERE ' + where + 'AND id IN (SELECT cdrid FROM `tf_feedbackform_data`) ORDER BY id DESC', [], callback);

            }

        }
        // console.log('SELECT DID,AgentName,CallStartTime,CallerName,CallerNumber,CallTalkTime,CallStatus,AgentStatus,CallType FROM `tf_cdr` WHERE agentid IN (SELECT agentid FROM tf_supervisor_agents WHERE ' +where+' AND id IN (SELECT cdrid FROM `tf_feedbackform_data`) ORDER BY id DESC');
    },
    getcallroutingdetail: function (id, callback) {
        return db.query("SELECT b.account_name,a.agentid,a.cdrid,a.callstatus,a.calldate,c.callernumber FROM tf_agent_missedcall a LEFT JOIN tf_account_table b ON a.agentid=b.account_id LEFT JOIN tf_cdr c ON a.cdrid=c.id WHERE a.cdrid=" + id + ";", [], callback);
    },
    getagentleadfilter: function (data, callback) {
        var where;
        //  console.log("data");
        //  console.log(JSON.stringify(data));
        where = 'feedback!="" and AgentID=' + data.userid;
        if (data.feedback) {
            where += " and feedback='" + data.feedback + "'";
        }
        if (data.callerno != '') {
            where += " and CallerNumber like '" + data.callerno + "%'";
        }
        if (data.startdate != '1970-01-01' && data.startdate != '') {
            // var startdateObj = new Date(data.startdate);
            // var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
            // data.startdate = startdate;
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"

            // where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {
            // var enddateObj = new Date(data.enddate);
            // var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
            // data.enddate = enddate;
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "

            // where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }

        //console.log('SELECT * FROM `tf_cdr` where  ' + where + ' ORDER BY CallStartTime DESC');
        return db.query('SELECT * FROM `tf_cdr` where  ' + where + ' ORDER BY CallStartTime DESC', [], callback);
    },

    change_feedback_view_card_data: function (data, callback) {
        var where;
        //  console.log("data");
        //  console.log(JSON.stringify(data));
        where = 'feedback!="" and AgentID=' + data.userid;
        if (data.feedback) {
            where += " and feedback='" + data.feedback + "'";
        }
        if (data.callerno != '') {
            where += " and CallerNumber like '" + data.callerno + "%'";
        }
        if (data.startdate != '1970-01-01' && data.startdate != '') {
            // var startdateObj = new Date(data.startdate);
            // var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
            // data.startdate = startdate;
            where += " and CallStartTime BETWEEN CONCAT('" + data.startdate + "',' 00:00:00')"

            // where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {
            // var enddateObj = new Date(data.enddate);
            // var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
            // data.enddate = enddate;
            where += " and CONCAT('" + data.enddate + "',' 23:59:59') "

            // where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }

        //console.log('SELECT DISTINCT(callstatus)AS call_status,COUNT(*) AS cnt FROM tf_cdr WHERE ' + where + ' GROUP BY call_status');
        return db.query('SELECT DISTINCT(callstatus)AS call_status,COUNT(*) AS cnt FROM tf_cdr WHERE  ' + where + ' GROUP BY call_status', [], callback);
    },
    getivrroutingdetail: function (id, callback) {
        return db.query("SELECT a.ivrid,b.ivrname,a.extension,a.cdrid FROM tf_getivrinput a LEFT JOIN IvrBuilder b ON a.ivrid=b.BuilderID WHERE a.cdrid=" + id + " ORDER BY a.id ASC", [], callback);
    },
    getCallLogByRecording: function (recname, callback) {
        return db.query('SELECT accountid,CallStartTime FROM `tf_cdr` WHERE  RecPath = ?', [recname], callback);
    },
}

module.exports = Call;
