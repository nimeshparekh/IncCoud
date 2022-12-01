var db = require('../database/db');

var Setting = {
    getsoundbyid: function (id, callback) {
        return db.query('SELECT * from tf_sound_library where id=?', [id], callback);
    },
    saveSound: function (data, callback) {
        return db.query('Insert INTO tf_sound_library SET ?', data, callback);
    },
    getsoundlist: function (id, callback) {
        return db.query('SELECT *,DATE_FORMAT(addDate,"%d-%m-%Y %H:%i:%s") as addDate from tf_sound_library where account_id=' + id + ' order by addDate desc', [], callback);
    },
    updateSound: function (data, callback) {
        return db.query('update tf_sound_library set ? WHERE id = ?', [data, data.id], callback);
    },
    deletesound: function (id, callback) {
        return db.query('DELETE FROM tf_sound_library where id=?', [id], callback);
    },
    getuserdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id=' + id, [], callback);
    },
    saveagentbreaktime: function (data, callback) {
        return db.query('Insert INTO tf_breaktime SET ?', data, callback);
    },
    getagentstartbreaktime: function (id, date, callback) {
        return db.query('SELECT *,DATE_FORMAT(start_time,"%d-%m-%Y %H:%i:%s %r") as startime from tf_breaktime where account_id=? and  break_status=0', [id], callback);
    },
    getagenttodaybreaktime: function (id, date, callback) {
        return db.query('SELECT B.*,R.reason_name from tf_breaktime B LEFT JOIN tf_hold_calling_reason R ON R.reason_id=B.break_type where B.account_id=? and B.date=?', [id, date], callback);
    },
    updateagentbreaktime: function (data, callback) {
        return db.query('update tf_breaktime set ? WHERE break_id = ?', [data, data.break_id], callback);
    },
    getapprovesoundlist: function (id, callback) {
        return db.query('SELECT *,DATE_FORMAT(addDate,"%d-%m-%Y %H:%i:%s") as addDate from tf_sound_library where account_id=' + id + ' and status=1 order by addDate desc', [], callback);
    },
    savesmsconfiguration: function (data, callback) {
        db.query('Insert INTO tf_sms_configuration (account_id,smsserver_id,agent_smstemp_id,event,caller_smstemp_id,created_date) VALUES ?', [data], callback);
    },
    getsmsconfigdetail: function (id, callback) {
        return db.query('SELECT * from tf_sms_configuration where account_id=' + id, [], callback);
    },
    updatesmsconfiguration: function (data, userid, callback) {
        return db.query('DELETE FROM tf_sms_configuration where account_id=?', [userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('Insert INTO tf_sms_configuration (account_id,smsserver_id,agent_smstemp_id,event,caller_smstemp_id,created_date) VALUES ?', [data], callback);
            }
        })
    },
    getemailsmsconfigdetail: function (id, callback) {
        return db.query('SELECT * from tf_emailsms_configuration where account_id=' + id, [], callback);
    },
    updatemailsmsconfiguration: function (data, userid, callback) {
        return db.query('DELETE FROM tf_emailsms_configuration where account_id=?', [userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('Insert INTO tf_emailsms_configuration (account_id,smsserver_id,emailserver_id,smstemp_id,event,emailtemp_id,created_date) VALUES ?', [data], callback);
            }
        })
    },
    savemailsmsconfiguration: function (data, callback) {
        return db.query('Insert INTO tf_emailsms_configuration (account_id,smsserver_id,emailserver_id,smstemp_id,event,emailtemp_id,created_date) VALUES ?', [data], callback);
    },
    getagentcallstoptime: function (id, callback) {
        return db.query('SELECT *,DATE_FORMAT(start_time,"%d-%m-%Y %H:%i:%s %r") as startime from tf_callingpausetime where account_id=? and  status=0', [id], callback);
    },
    saveagentholdtime: function (data, callback) {
        return db.query('Insert INTO tf_callingpausetime SET ?', data, callback);
    },
    updateagentholdtime: function (data, id, callback) {
        return db.query('update tf_callingpausetime SET ? where pause_id = ?', [data, id], callback);
    },
    // Feedback forms
    savefeedbackforms: function (data, callback) {
        return db.query('Insert INTO tf_feedbackforms SET ?', data, callback);
    },
    savefeedbackformmeta: function (data, callback) {
        return db.query('Insert INTO tf_feedbackform_meta SET ?', data, callback);
    },
    updatefeedbackformmeta: function (data, callback) {
        return db.query('update tf_feedbackform_meta set ? WHERE mid = ?', [data, data.mid], callback);
    },
    getfeedbackforms: function (id, callback) {
        return db.query('SELECT * from tf_feedbackforms where manager_id=?', [id], callback);
    },
    getfeedbackformbyid: function (userid, id, callback) {
        return db.query('SELECT * from tf_feedbackforms where manager_id=? and fid=?', [userid, id], callback);
    },
    getfeedbackformmeta: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_feedbackform_meta  WHERE form_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    getagentstartsifttime: function (id, date, callback) {
        return db.query('SELECT *,DATE_FORMAT(start_time,"%d-%m-%Y %H:%i:%s %r") as startime from tf_shifttime where account_id=? and  shift_status=0', [id], callback);
    },
    saveagentshifttime: function (data, callback) {
        return db.query('Insert INTO tf_shifttime SET ?', data, callback);
    },
    updateagentshifttime: function (data, callback) {
        return db.query('update tf_shifttime set ? WHERE shift_id = ?', [data, data.shift_id], callback);
    },
    updatefeedbackforms: function (data, callback) {
        return db.query('update tf_feedbackforms set ? WHERE fid = ?', [data, data.fid], callback);
    },
    getagentstartshifttime: function (id, date, callback) {
        return db.query('SELECT *,DATE_FORMAT(start_time,"%d-%m-%Y %H:%i:%s %r") as startime from tf_shifttime where account_id=? and  shift_status=0', [id], callback);
    },
    getagenttodayshifttime: function (id, date, callback) {
        return db.query('SELECT * from tf_shifttime where account_id=? and date=?', [id, date], callback);
    },

    getemailserverdata: function (id, callback) {
        return db.query('select * from tf_manager_email_server where account_id=?', [id], callback)
    },
    getemailserverdetail: function (id, callback) {
        return db.query('select * from tf_manager_email_server where server_id=' + id, [], callback)

    },
    updateemailserverdata: function (data, callback) {
        return db.query('update tf_manager_email_server set ? WHERE server_id = ?', [data, data.server_id], callback);

    },
    saveemailserverdata: function (data, callback) {
        return db.query('Insert INTO tf_manager_email_server SET ? ', data, callback);

    },
    deleteemailserverdata: function (id, callback) {
        console.log(id,"sdc");
        return db.query('DELETE FROM tf_manager_email_server where server_id=?', [id], callback);

    },
    getConfiguration: function (id, callback) {
        return db.query('select * from tf_configuration where user_id= ? ', [id], callback)
    },

    getCalenderConfiguration: function (id, callback) {
        return db.query('select * from tf_configuration_calender where user_id= ? ', [id], callback)
    },
    getagentaccesssetting: function (id, callback) {
        return db.query('select * from tf_manager_settings where account_id=' + id, [], callback);
    },
    saveagentleadaccesssetting: function (data, userid, callback) {
        db.query('select * from tf_manager_settings where account_id=' + userid, [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    return db.query('DELETE FROM tf_manager_settings where account_id=?', [userid], function (err, results) {
                        if (err) {
                            console.log("[mysql error]", err);
                        } else {
                            return db.query('Insert INTO tf_manager_settings (account_id,setting_name,setting_value) VALUES ?', [data], callback);
                        }
                    })
                } else {
                    return db.query('Insert INTO tf_manager_settings (account_id,setting_name,setting_value) VALUES ?', [data], callback);
                }
            }
        })
    },
    deletefeedbackform: function (id, callback) {
        return db.query('DELETE FROM tf_feedbackforms where fid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM tf_feedbackform_meta where form_id=?', [id], callback);
            }
        })
    },
    getbreakdiff: async function (id,endtime) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_breaktime  WHERE break_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    if (results.length > 0) {
                        const starttime = results[0]['start_time']
                        var dt1 = new Date(starttime);
                        var dt2 = new Date(endtime);
                        const timediff = (dt2.getTime() - dt1.getTime()) / 1000;
                        resolve(timediff);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    getholddiff: async function (id,endtime) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_callingpausetime  WHERE pause_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    if (results.length > 0) {
                        const starttime = results[0]['start_time']
                        var dt1 = new Date(starttime);
                        var dt2 = new Date(endtime);
                        const timediff = (dt2.getTime() - dt1.getTime()) / 1000;
                        resolve(timediff);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    accesssetting:function(id,callback){
        return db.query("SELECT * FROM tf_manager_settings WHERE account_id IN (SELECT created_by FROM tf_account_table WHERE account_id="+id+") ",callback);
    },
    getleadtags: function (id, callback) {
        return db.query('SELECT * from tf_lead_tags where account_id=?', [id], callback);
    },
    saveleadtagdata: function (data, callback) {
        return db.query('Insert INTO tf_lead_tags SET ?',data, callback);
    },
    updateleadtagdata: function (data, callback) {
        return db.query('update tf_lead_tags set ? WHERE tag_id = ?', [data, data.tag_id], callback);
    },
    deleteleadtagdata: function (id, callback) {
        return db.query('DELETE FROM tf_lead_tags where tag_id=?', [id], callback);
    },
    getleadtagbyid: function (id, callback) {
        return db.query('SELECT * from tf_lead_tags where tag_id=?', [id], callback);
    },
    getleadtagassignagents:function(id,callback){
        return db.query('SELECT D.assign_id,D.agent_id ,A.account_name as agentname from tf_lead_tag_supervisor as D inner join tf_account_table as A on D.agent_id=A.account_id where D.tag_id ='+id,callback);
    },
    unassignleadtagagentslist: function (data, callback) {
        //console.log('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table pr  where  pr.current_status="0" and pr.created_by=' + data.userid + ' and account_role=2 and pr.account_id not in (select agent_id from tf_lead_tag_supervisor where tag_id=' + data.tagid + ')');
        db.query('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table pr  where  pr.current_status="0" and pr.created_by=' + data.userid + ' and account_role=2 and pr.account_id not in (select agent_id from tf_lead_tag_supervisor where tag_id=' + data.tagid + ')', function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    saveleadtagassignagent: function (data, callback) {
        return db.query('Insert INTO tf_lead_tag_supervisor SET ?', data, callback);
    },
    deleteleadtagassignagent: function (id, callback) {
        return db.query('DELETE FROM tf_lead_tag_supervisor where assign_id=?', [id], callback);
    },

    getissuetypes: function (id, callback) {
        return db.query('SELECT * from tf_issue_type where account_id=?', [id], callback);
    },
    saveissuetypedata: function (data, callback) {
        return db.query('Insert INTO tf_issue_type SET ?',data, callback);
    },
    updateissuetypedata: function (data, callback) {
        return db.query('update tf_issue_type set ? WHERE issue_id = ?', [data, data.issue_id], callback);
    },
    deleteissuetypedata: function (id, callback) {
        return db.query('DELETE FROM tf_issue_type where issue_id=?', [id], callback);
    },
    getissuetypebyid: function (id, callback) {
        return db.query('SELECT * from tf_issue_type where issue_id=?', [id], callback);
    },
    getadminaccesssetting: function (id, callback) {
        return db.query('select * from tf_settings where account_id=' + id, [], callback);
    },
    save_admin_setting: function (data, userid, callback) {
        db.query('select * from tf_settings where account_id=' + userid, [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    return db.query('DELETE FROM tf_settings where account_id=?', [userid], function (err, results) {
                        if (err) {
                            console.log("[mysql error]", err);
                        } else {
                            return db.query('Insert INTO tf_settings (account_id,setting_name,setting_value) VALUES ?', [data], callback);
                        }
                    })
                } else {
                    return db.query('Insert INTO tf_settings (account_id,setting_name,setting_value) VALUES ?', [data], callback);
                }
            }
        })
    },
    getEmailSMSConfiguration: function (name, callback) {
        return db.query("SELECT ES.smtp_server,ES.smtp_username,ES.smtp_password,ES.smtp_port,SS.username,SS.auth_key,SS.server_url,SS.senderid,ST.sms_text,ST.contentid,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE '"+name+"'", [], callback);
    },

    get_supervisior_FormsData: function(data,callback){
        return db.query("SELECT * FROM tf_feedbackforms WHERE manager_id IN(SELECT DISTINCT(userid) FROM tf_supervisor_agents WHERE supervisor_account_id="+data+")",callback)
    }
}

module.exports = Setting;