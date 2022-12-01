var db = require('../database/db');
var tfdb = require('../database/tfdb');
const { type } = require('os');
var async = require("async");
const { query } = require('express');
var mysql = require('mysql');

var Default = {
    getdidrouting: function (id, callback) {
        return db.query('SELECT D.did_number,N.* FROM `tf_did_numbers` N INNER JOIN tf_did D ON N.did=D.did WHERE N.account_id=? order by N.assginDate desc', [id], callback);
    },
    getDIDdetail: function (id, callback) {
        return db.query('SELECT * from tf_did_numbers where id=' + id, [], callback);
    },
    updatedid: function (data, callback) {
        return db.query('update tf_did_numbers set ? WHERE id = ?', [data, data.id], callback);
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
    getivr: function (id, callback) {
        return db.query('SELECT * from IvrBuilder where UserID=' + id + " " + 'ORDER by CreateDate DESC ', [], callback);
    },
    insertivr: function (data, callback) {
        return db.query('Insert INTO IvrBuilder SET ?', data, callback);
    },
    insertivrExt: function (data, callback) {

        db.query('Insert INTO tf_IvrBuilderExtension (IvrBuilderID,Extension,DestinationType,DestinationAction,DestinationSMS,DestinationEmail,DestinationAPI) VALUES ?', [data], callback);
    },
    insertivrExtplay: function (data, callback) {
        console.log(data);
        db.query('Insert INTO tf_IvrBuilderExtension (IvrBuilderID,DestinationType,DestinationAction,DestinationSMS,DestinationEmail,DestinationAPI,call_status) VALUES ?', [data], callback);
    },
    getagents: function (id, callback) {
        return db.query('SELECT * from tf_account_table where current_status = 0 and is_deleted = "no" and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
        // return db.query('SELECT * from tf_account_table where  current_status =0 and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    getmanagertime: function (id, callback) {
        return db.query('SELECT metakey,metavalue from tf_configuration_calender where (metakey = "autostarttime" or metakey = "autoendtime") and user_id=' + id, [], callback);
    },
    getagentdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id=' + id, [], callback);
    },
    updateUser: function (data, callback) {
        return db.query('update tf_account_table set ? where account_id= ?', [data, data.account_id], callback);
    },
    insertagent: function (data, callback) {
        return db.query('Insert INTO tf_account_table SET ?', data, callback);
    },
    updateagent: function (data, callback) {
        return db.query('update tf_account_table set ? WHERE account_id = ?', [data, data.account_id], callback);
    },
    deleteagent: function (id, username, callback) {
        db.query('DELETE FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                tfdb.query('DELETE FROM ps_endpoints where id=?', [username], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        tfdb.query('DELETE FROM ps_aors where id=?', [username], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                return tfdb.query('DELETE FROM ps_auths where id=?', [username], callback);
                            }
                        })
                    }
                })
            }
        });
    },
    deletetocheckhunt: function (id, callback) {
        return db.query('SELECT * from HuntGroupDetail where  AgentID=?', [id], callback);
    },
    deleteivr: function (id, callback) {
        return db.query('DELETE FROM IvrBuilder where BuilderID=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM tf_IvrBuilderExtension where IvrBuilderID=?', [id], callback);
            }
        })
    },
    getlog: function (id, callback) {
        return db.query("SELECT id,uid,date,date as login,logout_time as logout,ip FROM `tf_loginactivity` WHERE `uid` = " + id + "  order by date DESC", [], callback)
        //return db.query('SELECT * from tf_loginactivity where uid='+ id+' and like action "Login" order by date DESC ',[],callback);
    },
    getlogout: function (id, callback) {
        //console.log("id"+id)
        return db.query("SELECT * FROM `tf_loginactivity` WHERE `uid` = " + id + " AND `action` LIKE 'logout' order by date DESC", [], callback)

        //return db.query('SELECT * from tf_loginactivity where uid='+ id+' and like action "Logout" order by date DESC',[],callback);
    },
    getivrdetail: function (id, callback) {
        return db.query('SELECT * from IvrBuilder where BuilderID=' + id, [], callback);
    },
    getivrExtensiondetail: function (id, callback) {
        return db.query('SELECT * from tf_IvrBuilderExtension where IvrBuilderID=' + id, [], callback);
    },
    updateivr: function (data, id, callback) {
        return db.query('update IvrBuilder set ? WHERE BuilderID = ?', [data, id], callback);
    },
    updateivrExt: function (data, ivrid, callback) {
        return db.query('DELETE FROM tf_IvrBuilderExtension where IvrBuilderID=?', [ivrid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('Insert INTO tf_IvrBuilderExtension (IvrBuilderID,Extension,DestinationType,DestinationAction,DestinationSMS,DestinationEmail,DestinationAPI) VALUES ?', [data], callback);
            }
        })
    },
    updateivrExt_play: function (data, ivrid, callback) {
        return db.query('DELETE FROM tf_IvrBuilderExtension where IvrBuilderID=?', [ivrid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('Insert INTO tf_IvrBuilderExtension (IvrBuilderID,DestinationType,DestinationAction,DestinationSMS,DestinationEmail,DestinationAPI,call_status) VALUES ?', [data], callback);
            }
        })
    },
    gethuntgroup: function (id, callback) {
        return db.query('SELECT * from HuntGroup where AccountID=' + id+' ORDER BY GroupName ASC', [], callback);
    },
    inserthuntgroup: function (data, callback) {
        return db.query('Insert INTO HuntGroup SET ?', data, callback);
    },
    gethuntgroupdetail: function (id, callback) {
        return db.query('SELECT * from HuntGroup where GroupID=' + id, [], callback);
    },
    updatehuntgroup: function (data, callback) {
        return db.query('update HuntGroup set ? WHERE GroupID = ?', [data, data.GroupID], callback);
    },
    deletehuntgroup: function (id, callback) {
        return db.query('DELETE FROM HuntGroup where GroupID=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM HuntGroupDetail where HuntGroupID=?', [id], callback);
            }
        })
    },
    getassignedagents: function (id, callback) {
        return db.query('SELECT D.ID,D.AgentID, D.seq_no ,A.account_name as agentname from HuntGroupDetail as D inner join tf_account_table as A on D.AgentID=A.account_id where A.current_status=0 and A.is_deleted ="no" and  HuntGroupID=' + id + '', [], callback);
    },
    insertassignagent: function (data, callback) {
        return db.query('Insert INTO HuntGroupDetail SET ?', data, callback);
    },
    assignagentslist: function (id, callback) {
        db.query('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table pr  where pr.created_by=' + id + ' and pr.account_id not in (select AgentID from HuntGroupDetail)', function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    deleteassignagent: function (id, callback) {
        return db.query('DELETE FROM HuntGroupDetail where ID=?', [id], callback);
    },
    updatesequenceno: function (data, callback) {
        return db.query('update HuntGroupDetail set ? WHERE ID = ?', [data, data.ID], callback);
    },


    savekyc: function (data, callback) {
        //console.log(data);
        return db.query('Insert INTO tf_kyc SET ?', data, callback);
    },
    findAgentMobile: function (mobile, callback) {
        return db.query('SELECT * from tf_account_table where account_type=1 and mobile=?', [mobile], callback);

    },
    findAgentEditMobile: function (mobile, id, callback) {
        return db.query('SELECT * from tf_account_table where account_type=1 and mobile=? and account_id!=?', [mobile, id], callback);

    },
    getkycdata: function (id, callback) {
        //return db.query('SELECT * from tf_kyc ',[],callback);
        return db.query('SELECT tf_kyc.*,tf_account_table.account_name FROM `tf_kyc` INNER JOIN tf_account_table ON tf_kyc.account_id =tf_account_table.account_id AND `status` = 1 order by uploaded_date desc', [], callback)


    },
    getkycpendingdata: function (id, callback) {
        //return db.query('SELECT * from tf_kyc ',[],callback);
        return db.query('SELECT tf_kyc.*,tf_account_table.account_name FROM `tf_kyc` INNER JOIN tf_account_table ON tf_kyc.account_id =tf_account_table.account_id AND `status` != 1 order by uploaded_date desc', [], callback)


    },
    approvekyc: function (data, callback) {
        return db.query('update tf_kyc set ? WHERE kyc_id = ?', [data, data.kyc_id], callback);

    },
    getkycformdata: function (id, callback) {
        return db.query('SELECT * from tf_kyc WHERE account_id = ' + id, [], callback);
        // return db.query('SELECT tf_kyc.*,tf_account_table.account_name FROM `tf_kyc` INNER JOIN tf_account_table ON tf_kyc.account_id =tf_account_table.account_id WHERE tf_kyc.account_id ='+id,[],callback)
    },
    updatekyc: function (data, callback) {

        return db.query('update tf_kyc set ? WHERE kyc_id = ?', [data, data.kyc_id], callback);

    },
    getkycapprovestatus: function (id, callback) {
        return db.query('SELECT * from tf_kyc WHERE kyc_id = ' + id, [], callback);

    },
    saveclicktocallscript: function (data, callback) {
        return db.query('Insert INTO tf_clicktocall SET ?', data, callback);
    },
    getclicktocallccriptlist: function (id, callback) {
        return db.query('SELECT * FROM `tf_clicktocall` C INNER JOIN HuntGroup H ON C.agentgroup=H.GroupID  WHERE C.account_id=?', [id], callback);
    },
    deleteclicktocallscript: function (id, callback) {
        return db.query('DELETE FROM tf_clicktocall where clickid=?', [id], callback);
    },
    getoutbountdid: function (id, callback) {
        return db.query('SELECT D.did_number,N.* FROM `tf_did_numbers` N INNER JOIN tf_did D ON N.did=D.did WHERE N.account_id=? and N.Type=9 order by N.assginDate desc', [id], callback);
    },
    getagentgroupwithpackage: function (id, callback) {
        return db.query('SELECT HG.GroupName AS groupname,HG.transfer_extesion as transferext FROM `HuntGroup` HG INNER JOIN tf_account_table A ON A.created_by=HG.AccountID WHERE A.account_id=? ', [id], callback);
    },
    searchcall: function (data, callback) {
        //console.log(data.status);
        var where = "created_by=" + data.customer_id;

        if (data.status != null) {
            where += " and current_status=" + data.status;
        }
        if (data.agentname) {
            where += " and account_name='" + data.agentname + "'";
        }
        if (data.agentnumber) {
            where += " and mobile='" + data.agentnumber + "'";
        }
        if (data.did) {
            where += " and did_alloted='" + data.did + "'";
        }
        if (data.deleted) {
            where += " and is_deleted='" + data.deleted + "'";
        }

        return db.query("SELECT *,(SELECT COUNT(l_id) as lead_count FROM tf_leads WHERE tf_leads.agent_id=tf_account_table.account_id) AS lead_count FROM `tf_account_table` where " + where + " order by account_id desc", [], callback);
    },
    getemaildata: function (id, callback) {
        //console.log('select * from tf_emailtemplate where account_id= ' + id+" "+'ORDER by add_date DESC');
        return db.query('select * from tf_emailtemplate where account_id= ' + id + " " + 'ORDER by email_id DESC', [], callback)

    },
    getscheduleemaildata: function (id, callback) {
        return db.query('select * from tf_emailtemplate where account_id= ' + id + " " + 'AND isschedulemeeting = 1 ORDER by email_id DESC', [], callback)

    },
    getschedulesmsdata: function (id, callback) {
        return db.query('select * from tf_smstemplate where account_id= ' + id + " " + ' ORDER by sms_id DESC', [], callback)

    },
    getemaildetail: function (id, callback) {
        return db.query('select * from tf_emailtemplate where email_id=' + id, [], callback)

    },
    getemailadd: function (id, callback) {
        //tf_account_table
        return db.query('select GROUP_CONCAT(distinct email) as email from temp_email_send where email != ""', [], callback)

    },
    getinquiryemail: function (id, callback) {
        //tf_support
        return db.query('select GROUP_CONCAT(distinct email) as email from tf_support where email != ""', [], callback)

    },
    updateemaildata: function (data, callback) {
        return db.query('update tf_emailtemplate set ? WHERE email_id = ?', [data, data.email_id], callback);

    },
    saveemaildata: function (data, callback) {
        return db.query('Insert INTO tf_emailtemplate SET ? ', data, callback);

    },
    deleteemaildata: function (id, callback) {
        return db.query('DELETE FROM tf_emailtemplate where email_id=?', [id], callback);

    },
    getsmsdata: function (id, callback) {
        return db.query('select * from tf_smstemplate where account_id =' + id + " " + 'ORDER by add_date DESC', [], callback)
    },
    updatesmsdata: function (data, callback) {
        return db.query('update tf_smstemplate set ? WHERE sms_id = ?', [data, data.sms_id], callback);

    },
    savesmsdata: function (data, callback) {
        return db.query('Insert INTO tf_smstemplate SET ? ', data, callback);

    },
    deletesmsdata: function (id, callback) {
        return db.query('DELETE FROM tf_smstemplate where sms_id=?', [id], callback);

    },
    getsmsdetail: function (id, callback) {
        return db.query('select * from tf_smstemplate where sms_id=' + id, [], callback)

    },
    getkycviewdata: function (id, callback) {
        return db.query('SELECT * from tf_kyc WHERE kyc_id = ' + id, [], callback);

    },
    getplandetail: function (id, callback) {
        return db.query('SELECT tf_packages.*,tf_account_table.account_id,tf_account_table.package_id,tf_account_table.expiry_date FROM `tf_packages` INNER JOIN tf_account_table ON tf_packages.package_id =tf_account_table.package_id WHERE tf_account_table.account_id=' + id + ' AND tf_account_table.expiry_date < CURRENT_TIMESTAMP order by tf_account_table.create_date asc', [], callback);
    },
    getKYCstatus: function (id, callback) {
       // console.log('SELECT A.kyc_status,A.account_role,(SELECT status FROM tf_kyc where account_id='+id+' ORDER BY kyc_id DESC LIMIT 1) as status FROM tf_account_table A  where A.account_id='+id);
        return db.query('SELECT A.kyc_status,A.account_role,(SELECT status FROM tf_kyc where account_id=? ORDER BY kyc_id DESC LIMIT 1) as status FROM tf_account_table A  where A.account_id=?', [id, id], callback);
    },
    searchreqdata: function (data, callback) {
        var where;
        where = 'accountid=' + data.userid

        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber like " + data.callerno;
        }
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        //console.log('SELECT * FROM `tf_cdr` where '+where+'' );
        return db.query('SELECT * FROM `tf_cdr` where ' + where + '', [], callback);
    },
    notassignagentslist: function (data, callback) {
        // console.log(data.groupid);
        return db.query('SELECT pr.account_id,pr.account_name FROM tf_account_table as pr  where  pr.current_status ="0" and pr.is_deleted="no" and pr.created_by=' + data.userid + ' and pr.account_id not in (select AgentID from HuntGroupDetail where HuntGroupID=' + data.groupid + ')', [], callback);
    },
    getManagerCurrentplanDetail: function (data, callback) {
        //console.log('SELECT (SELECT P.package_name FROM `Billing_data` BD INNER JOIN tf_packages P ON P.package_id=BD.Plan_Type WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL  ORDER BY Bill_ID desc limit 1) as package,(SELECT Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as packageprice,(SELECT Plan_user FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as Plan_user,(SELECT Plan_channel FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as Plan_channel,(SELECT P.SMS_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_SMS_Package P ON P.SMS_ID=BD.SMS_ID WHERE Account_ID=B.Account_ID AND BD.SMS_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as smspackage,(SELECT SMS_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND SMS_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as smsvalue,(SELECT P.Mail_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Mail_Package P ON P.Mail_ID=BD.Mail_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Mail_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as mailpackage,(SELECT Mail_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Mail_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as mailvalue,(SELECT P.Meet_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Meet_Package P ON P.Meet_ID=BD.Meet_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Meet_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as meetpackage,(SELECT Meet_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Meet_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as meetvalue,(SELECT P.Digital_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Digital_Package P ON P.Digital_ID=BD.Digital_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Digital_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as digitalpackage,(SELECT Digital_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Digital_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as digitalvalue ,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Digital_ID IS NOT NULL) AS digitalexpiry,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Meet_ID IS NOT NULL) AS meetexpiry,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Mail_ID IS NOT NULL) AS mailexpiry FROM `Billing_data` B LEFT JOIN tf_account_table A ON A.account_id=B.Account_ID WHERE B.Account_ID=' + data.id + ' AND DATE(A.expiry_date)>="'+data.date+'" GROUP by B.Account_ID');
        return db.query('SELECT (SELECT P.package_name FROM `Billing_data` BD INNER JOIN tf_packages P ON P.package_id=BD.Plan_Type WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as package,(SELECT Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as packageprice,(SELECT Plan_user FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as Plan_user,(SELECT Plan_channel FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Plan_Type IS NOT NULL ORDER BY Bill_ID desc limit 1) as Plan_channel,(SELECT P.SMS_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_SMS_Package P ON P.SMS_ID=BD.SMS_ID WHERE Account_ID=B.Account_ID AND BD.SMS_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as smspackage,(SELECT SMS_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND SMS_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as smsvalue,(SELECT P.Mail_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Mail_Package P ON P.Mail_ID=BD.Mail_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Mail_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as mailpackage,(SELECT Mail_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Mail_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as mailvalue,(SELECT P.Meet_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Meet_Package P ON P.Meet_ID=BD.Meet_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Meet_ID IS NOT NULL ORDER BY Bill_ID desc limit 1) as meetpackage,(SELECT Meet_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Meet_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as meetvalue,(SELECT P.Digital_Plan FROM `Billing_data` BD INNER JOIN tf_Tele_Digital_Package P ON P.Digital_ID=BD.Digital_ID left join tf_account_balance A ON A.Account_ID=BD.Account_ID WHERE BD.Account_ID=B.Account_ID AND BD.Digital_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as digitalpackage,(SELECT Digital_Plan_Value FROM `Billing_data`  WHERE Account_ID=B.Account_ID AND Digital_ID IS NOT NULL  ORDER BY Bill_ID desc limit 1) as digitalvalue ,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Digital_ID IS NOT NULL) AS digitalexpiry,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Meet_ID IS NOT NULL) AS meetexpiry,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID=B.Account_ID AND Mail_ID IS NOT NULL) AS mailexpiry FROM `Billing_data` B LEFT JOIN tf_account_table A ON A.account_id=B.Account_ID WHERE B.Account_ID=' + data.id + ' AND DATE(A.expiry_date)>="'+data.date+'" GROUP by B.Account_ID', [], callback);
    },
    getagentassignlead: function (id, callback) {
        return db.query('SELECT * from tf_agent_assignlead where agent_id=' + id + " " + 'ORDER by add_date DESC ', [], callback);
    },
    getmanager: function (id, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_type` =2 and NOT account_id=' + id + " " + 'ORDER by create_date DESC ', [], callback);

    },
    createagentsipaccount: function (username,accountid, callback) {
        db.query('select voice_server_id from tf_account_table where account_id = ?', [accountid], function (err, results) {
            if(results.length>0){
                var voiceserverid = results[0].voice_server_id
                db.query('select * from tf_asterisk_server where server_id= ?', [voiceserverid], function (err, serverdata) {
                    //console.log(serverdata);
                    if(serverdata.length){
                        var connection = mysql.createPool({
                            host: serverdata[0].server_mysql_host, //192.168.1.27
                            user: serverdata[0].server_mysql_username, //root
                            port: '3306',
                            password: serverdata[0].server_mysql_password, //Garuda@dv1234
                            database: serverdata[0].server_database_name,
                        });
                        connection.query('select * from ps_endpoints where id = ?', [username], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                if (results.length > 0) {
                                    callback(err, results);
                                } else {
                                    var from_domain = serverdata[0].server_ip
                                    var aors = { id: username, max_contacts: 5, contact: '', qualify_frequency: 20, remove_existing: 'yes' }
                                    var auths = { id: username, auth_type: 'userpass', password: 'garudavoip@dv', username: username }
                                    var endpoints = { id: username, transport: 'transport-wss', aors: username, outbound_auth: username, context: 'agent-voip-outgoing', disallow: 'all', allow: 'alaw', direct_media: 'yes', rtp_symmetric: 'yes', force_rport: 'yes', rewrite_contact: 'yes', webrtc: 'yes',from_domain:from_domain }//dtls_ca_file: '/etc/asterisk/keys/fullchain.pem', dtls_cert_file: '/etc/asterisk/keys/asterisk.pem'
                                    connection.query('INSERT INTO ps_endpoints SET ?', [endpoints], function (err, results) {
                                        if (err) {
                                            console.log("[mysql error]", err);
                                        } else {
                                            connection.query('INSERT INTO ps_aors SET ?', [aors], function (err, results) {
                                                if (err) {
                                                    console.log("[mysql error]", err);
                                                } else {
                                                    connection.query('INSERT INTO ps_auths SET ?', [auths], function(err,results){
                                                        connection.end();
                                                        callback(err, results);
                                                    });
                                                    
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        callback(err, serverdata);
                    }
                })
            }else{
                tfdb.query('select * from ps_endpoints where id = ?', [username], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            callback(err, results);
                        } else {
                            var aors = { id: username, max_contacts: 5, contact: '', qualify_frequency: 20, remove_existing: 'yes' }
                            var auths = { id: username, auth_type: 'userpass', password: 'garudavoip@dv', username: username }
                            var endpoints = { id: username, transport: 'transport-wss', aors: username, outbound_auth: username, context: 'agent-voip-outgoing', disallow: 'all', allow: 'alaw', direct_media: 'yes', rtp_symmetric: 'yes', force_rport: 'yes', rewrite_contact: 'yes', dtls_ca_file: '/etc/asterisk/keys/fullchain.pem', dtls_cert_file: '/etc/asterisk/keys/asterisk.pem', webrtc: 'yes' }
                            tfdb.query('INSERT INTO ps_endpoints SET ?', [endpoints], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                } else {
                                    tfdb.query('INSERT INTO ps_aors SET ?', [aors], function (err, results) {
                                        if (err) {
                                            console.log("[mysql error]", err);
                                        } else {
                                            return tfdb.query('INSERT INTO ps_auths SET ?', [auths], callback);
                                        }
                                    })
                                }
                            });
                        }
                    }
                });
            }
        })
    },
    getnotifications: function (id, callback) {
        return db.query('SELECT * from tf_notifications where userid=? ORDER by created_date DESC limit 5', [id], callback);
    },
    getallnotifications: function (id, callback) {
        return db.query('SELECT * from tf_notifications where userid=? ORDER by created_date DESC', [id], callback);
    },
    inserttmpuser: function (data, callback) {
        return db.query('Insert INTO tf_tmp_user SET ?', data, callback);
    },
    saveuserkyc: function (data, callback) {
        //console.log(data);
        return db.query('Insert INTO tf_tmp_user_kyc SET ?', data, callback);
    },
    updateuserkyc: function (data, callback) {

        return db.query('update tf_tmp_user_kyc set ? WHERE kycid = ?', [data, data.kycid], callback);

    },
    updateplan: function (data, callback) {

        return db.query('update tf_tmp_user set ? WHERE userid = ?', [data, data.userid], callback);

    },
    gettempuser: function (id, callback) {
        return db.query('SELECT u.* FROM `tf_tmp_user` u  WHERE u.username=? ', [id], callback);
    },
    gettempkycdoc: function (id, callback) {
        return db.query('SELECT k.kycid,k.registration_certi,k.gst_certificate,k.agreement,k.pan_card,k.authorized_person_proof,k.approval_status FROM `tf_tmp_user_kyc` k  WHERE k.userid=? ', [id], callback);
    },
    getleaddetails: function (id, callback) {
        //console.log('SELECT name,lead_name,agent_id,email_id,mobile_no FROM `tf_leads`  WHERE l_id= '+id);
        return db.query('SELECT name,lead_name,agent_id,email_id,mobile_no,expected_closing,priority FROM `tf_leads`  WHERE l_id=? ', [id], callback);
    },
    getlmsdetails: function (id, callback) {
        //console.log('SELECT name,lead_name,agent_id,email_id,mobile_no FROM `tf_leads`  WHERE l_id= '+id);
        return db.query('SELECT * FROM `tf_leads`  WHERE name="' + id + '"', callback);
    },
    getfreeagents: function (id, callback) {
        return db.query('SELECT A.account_name,A.mobile,A.account_id FROM tf_account_table A WHERE A.created_by = ? AND A.current_status = 0 AND A.is_loggedin = "yes" AND A.account_name NOT IN (SELECT AgentName from tf_cdr WHERE AgentName=A.account_name and CdrStatus IN (1,2,3)) AND A.account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=A.account_id and break_status=0 AND date = CURRENT_DATE) and A.account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=A.account_id and status=0)', [id], callback);
    },
    getschedulelist: function (id, f_date, callback) {
        //console.log('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,user_id,meeting_link,customer_id  from tf_scheduler where user_id=' + id + ' AND DATE(StartTime) = "' + f_date + '" AND is_call = 0  order by id asc');
        return db.query('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,user_id,meeting_link,customer_id,original_meeting_link  from tf_scheduler where user_id=' + id + ' AND DATE(StartTime) = "' + f_date + '" AND is_call = 0  order by id asc', [], callback);
    },
    getcomingschedulelist: function (id, f_date, callback) {
        //console.log('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,user_id,meeting_link,customer_id  from tf_scheduler where user_id=' + id + ' AND DATE(StartTime) = "' + f_date + '"  order by id asc');
        return db.query('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,user_id,meeting_link,customer_id,original_meeting_link  from tf_scheduler where user_id=' + id + ' AND DATE(StartTime) > "' + f_date + '" order by id asc', [], callback);
    },
    getcustomerschedulelist: function (id, f_date, callback) {
        //console.log('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,user_id,meeting_link,customer_id  from tf_scheduler where user_id=' + id + ' AND DATE(StartTime) = "' + f_date + '"  order by id asc');
        return db.query('SELECT  (TIME_TO_SEC(s.EndTime) - TIME_TO_SEC(s.StartTime))/60  as time,s.meeting_type AS EventType,s.StartTime ,s.EndTime,a.account_name,s.customer_name as Subject  from tf_scheduler s LEFT JOIN tf_account_table a ON s.user_id=a.account_id where s.user_id=' + id + ' AND DATE(StartTime) = "' + f_date + '" order by s.s_id desc limit 0,1', [], callback);
    },
    getcustomerschedulemeetlist: function (id, f_date, callback) {
        //console.log('SELECT  (TIME_TO_SEC(s.EndTime) - TIME_TO_SEC(s.StartTime))/60  as time,s.meeting_type AS EventType,s.StartTime ,s.EndTime,a.account_name,s.customer_name as Subject  from tf_scheduler s LEFT JOIN tf_schedule_meeting sm ON s.user_id=sm.agent_id LEFT JOIN tf_account_table a ON s.user_id=a.account_id where sm.meetingid=' + id + ' AND DATE(s.StartTime) = "' + f_date + '" order by s.s_id desc limit 0,1');
        return db.query('SELECT  (TIME_TO_SEC(s.EndTime) - TIME_TO_SEC(s.StartTime))/60  as time,s.meeting_type AS EventType,s.StartTime ,s.EndTime,a.account_name,s.customer_name as Subject  from tf_scheduler s LEFT JOIN tf_schedule_meeting sm ON s.user_id=sm.agent_id LEFT JOIN tf_account_table a ON s.user_id=a.account_id where sm.meetingid=' + id + '  order by s.s_id desc limit 0,1', [], callback);
    },
    getAlltickets: function (data, callback) {
        var where ='';
        if(data.startdate && data.enddate){
            where +=" and T.created_date>='"+data.startdate+" 00:00:00' and T.created_date<='"+data.enddate+" 23:59:59'"
        }
        if(data.priority.length>0){
            where +=" and T.priority IN ("+data.priority+")";
        }
        if(data.userrole==1){
            if(data.managerid==48){
                if(data.agent!=''){
                    where +=" and T.agent_id IN ("+data.agent+")";
                }
                if(data.userid){
                    where +=" and T.account_id="+data.userid;
                }
                if(data.assigngroupagent){
                    return db.query('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id WHERE T.assign_to='+data.assignto+' '+where+' ORDER BY T.created_date DESC', [], callback);
                }else{
                    //  console.log('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id WHERE (T.raised_by = ' + data.assignto+' or T.agent_id='+data.assignto+') '+where+' ORDER BY T.created_date DESC');
                    return db.query('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id WHERE (T.raised_by = ' + data.assignto+' or T.agent_id='+data.assignto+') '+where+' ORDER BY T.created_date DESC', [], callback);
                    
                }
                //console.log('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id WHERE T.assign_to='+data.assignto+' '+where+' ORDER BY T.created_date DESC');
                
            }else{
                return db.query('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id WHERE (T.raised_by = ' + data.userid+' or T.agent_id='+data.userid+') '+where+' ORDER BY T.created_date DESC', [], callback);
            }
            
        }else{
            if(data.managerid==48){
                var where1='WHERE 1=1 ';
                if(data.startdate && data.enddate){
                    where1 +=" AND  T.created_date>='"+data.startdate+" 00:00:00' and T.created_date<='"+data.enddate+" 23:59:59'"
                }
                if(data.priority.length>0){
                    where1 +=" and T.priority IN ("+data.priority+")";
                }
                if(data.agent!=''){
                    where1 +=" and T.agent_id IN ("+data.agent+")";
                }
                if(data.userid!=''){
                    where1 +=" and T.account_id="+data.userid;
                }
                return db.query('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id '+where1+' ORDER BY T.created_date DESC', [], callback);
            }else{
                if(data.agent!=''){
                    where +=" and T.agent_id IN ("+data.agent+")";
                }
                return db.query('SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table where account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table where account_id=T.assign_to) AS assignagentname from tf_tickets T LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type LEFT JOIN tf_account_table A ON A.account_id=T.account_id  WHERE T.account_id = ' + data.userid+' '+where+' ORDER BY T.created_date DESC', [], callback);
            }
            
        }        
    },
    geticketdetail: function (id, callback) {
        return db.query('SELECT * from tf_tickets WHERE ticket_id = ' + id, [], callback);
    },
    updateticket: function (data, callback) {
        return db.query('update tf_tickets set ? WHERE ticket_id = ?', [data, data.ticket_id], callback);
    },
    getsmscampaign: function (id, callback) {
        return db.query('select * from tf_smscampagis where account_id =? and cams_type="Single" ORDER by cam_date DESC', [id], callback)
    },
    getschedulemanagerlist: function (id, f_date, callback) {
        //console.log('SELECT s.s_id as ID,s.meeting_type AS EventType,s.customer_name AS Subject,s.Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,s.user_id,s.meeting_link  from tf_scheduler s LEFT JOIN tf_account_table a ON s.user_id = a.account_id where a.created_by=' + id + ' AND DATE(StartTime) = "' + f_date + '"  order by id asc');
        return db.query('SELECT s.s_id as ID,s.meeting_type AS EventType,s.customer_name AS Subject,s.Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,s.user_id,s.meeting_link,a.account_name,s.original_meeting_link,s.customer_id  from tf_scheduler s LEFT JOIN tf_account_table a ON s.user_id = a.account_id where a.created_by=' + id + ' AND DATE(StartTime) = "' + f_date + '" AND is_call = 0  order by id asc', [], callback);
    },
    getagenthours: function (id, callback) {
        return db.query('SELECT  start_time,end_time  from tf_account_table  where account_id=' + id, [], callback);
    },
    getagentmeethours: function (id, callback) {
        return db.query('SELECT  a.account_id ,a.start_time,a.end_time  from tf_account_table a LEFT JOIN tf_schedule_meeting s ON a.account_id=s.agent_id where s.meetingid=' + id, [], callback);
    },
    addfilerequestcalender: function (Contacts, callback) {
        return db.query('Insert INTO tf_bulkupload_calender_request SET ?', Contacts, callback);
    },
    getreportdata: function (data, callback) {
        return db.query('select * from tf_report_master', [], callback)
    },
    saveschedulereport: function (data, callback) {
        return db.query('Insert INTO tf_schedule_report SET ?', data, callback);
    },
    getsechudelreportdata: function (data, callback) {
        return db.query('select * from tf_schedule_report where `account_id`= ' + data + ' ORDER BY `created_date` DESC', [], callback)
    },
    getreasondata: function (id, callback) {
        //return db.query('SELECT * from tf_hold_calling_reason WHERE agent_id = ' + id, [], callback);
        return db.query('SELECT * from tf_hold_calling_reason WHERE ACW=0 ', [], callback);
    },
    saveholdcallingreasondata: function (data, callback) {
        return db.query('Insert INTO tf_hold_calling_reason SET ?', data, callback);
    },
    getreasondetaildata: function (id, callback) {
        return db.query('SELECT * from tf_hold_calling_reason WHERE reason_id = ' + id, [], callback);
    },
    updatereasondata: function (data, callback) {
        return db.query('update tf_hold_calling_reason set ? WHERE reason_id = ?', [data, data.reason_id], callback);
    },
    deletereasondata: function (id, callback) {
        return db.query('DELETE FROM tf_hold_calling_reason where reason_id=?', [id], callback);
    },
    getactiveagents: function (id, callback) {
        return db.query('SELECT * from tf_account_table where is_deleted="no" and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    getactiveagents_2: function (id, callback) {
        return db.query('SELECT * from tf_account_table where is_deleted="no" and current_status=0 and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    getcallreviewformdata: function (id, callback) {
        //return db.query('SELECT * from tf_hold_calling_reason WHERE agent_id = ' + id, [], callback);
        return db.query('SELECT * from tf_call_review_form where account_id='+id, [], callback);
    },
    getdefaultcallreviewformdata: function (id, callback) {
        //return db.query('SELECT * from tf_hold_calling_reason WHERE agent_id = ' + id, [], callback);
        return db.query('SELECT * from tf_call_review_form where account_id='+id, [], callback);
    },
    savecallreviewformdata: function (data, callback) {
        return db.query('Insert INTO tf_call_review_form SET ?', data, callback);
    },
    getcallreviewformdetail: function (id, callback) {
        return db.query('SELECT * from tf_call_review_form WHERE form_id = ' + id, [], callback);
    },
    updatecallreviewformdata: function (data, callback) {
        return db.query('update tf_call_review_form set ? WHERE form_id = ?', [data, data.form_id], callback);
    },
    deletecallreviewformdata: function (id, callback) {
        return db.query('DELETE FROM tf_call_review_form where form_id=?', [id], callback);
    },
    savereviewrate: function (data, callback) {
        // console.log('SELECT * FROM tf_manager_review_rate where account_id='+data.account_id+' and audio_id="'+data.audio_id+'" and review_formid='+data.review_formid);
        db.query('SELECT * FROM tf_manager_review_rate where cdrid=' + data.cdrid + ' and review_formid=' + data.review_formid, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    //console.log(results[0].rate_id);
                    db.query('update tf_manager_review_rate set ? where rate_id= ?', [data, results[0].rate_id], callback);
                } else {
                    //console.log('insert');
                    db.query('Insert INTO tf_manager_review_rate SET ?', data, callback);
                }
            }
        });
    },
    getreviewrate: function (cdrid, callback) {
        return db.query('SELECT * FROM tf_manager_review_rate where cdrid="' + cdrid + '" order by review_formid asc', [], callback);
    },
    saveheaderfootersetting: function (data, callback) {
        // console.log('SELECT * FROM tf_manager_review_rate where account_id='+data.account_id+' and audio_id="'+data.audio_id+'" and review_formid='+data.review_formid);
        db.query('SELECT * FROM tf_header_footer_setting where account_id=' + data.account_id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                //console.log(results[0]);
                if (results.length > 0) {
                    return db.query('update tf_header_footer_setting set ? where setting_id= ?', [data, results[0].setting_id], callback);
                } else {
                    return db.query('Insert INTO tf_header_footer_setting SET ?', data, callback);
                }
            }
        });
    },
    getheaderfootersetting: function (id, callback) {
        return db.query('SELECT * FROM tf_header_footer_setting where account_id=' + id, [], callback);
    },
    getcdrdetail: function (id, callback) {
        return db.query('SELECT * FROM tf_cdr where id=' + id, [], callback);
    },
    getmorenotification: function (id, callback) {
        return db.query('SELECT * from tf_notifications where userid=? ORDER by created_date DESC ', [id], callback);
    },
    getsounddata: function (id, callback) {
        return db.query("SELECT * FROM `tf_sound_library` WHERE status =1 and account_id =" + id, callback);
    },
    getassignedsupervisoragents: function (id, callback) {
        return db.query('SELECT D.ID, A.account_name as agentname,D.AgentID,A.account_name,A.account_id,A.email,A.mobile,A.authorised_person_name,A.current_status,A.is_loggedin from tf_supervisor_agents as D inner join tf_account_table as A on D.AgentID=A.account_id where A.current_status="0" and  supervisor_account_id=' + id + ' and AgentID!=' + id, [], callback);
    },
    unassignsupervisoragentslist: function (data, callback) {
        // console.log(data.groupid);
        //console.log('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table pr  where  pr.current_status="0" and pr.created_by=' + data.userid + ' and pr.account_id not in (select AgentID from tf_supervisor_agents where supervisor_account_id=' + data.groupid + ')');
        db.query('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table pr  where  pr.current_status="0" and pr.created_by=' + data.userid + ' and account_role=1 and pr.account_id not in (select AgentID from tf_supervisor_agents where supervisor_account_id=' + data.groupid + ')', function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    savesupervisorassignagent: function (data, callback) {
        return db.query('Insert INTO tf_supervisor_agents SET ?', data, callback);
    },
    deletesupervisorassignagent: function (id, callback) {
        return db.query('DELETE FROM tf_supervisor_agents where ID=?', [id], callback);
    },
    searchsupervisoragent: function (data, callback) {
        var where = 'D.supervisor_account_id=' + data.customer_id + ' and D.AgentID!=' + data.customer_id;
        if (data.agentname) {
            where += " and A.account_name='" + data.agentname + "'";
        }
        if (data.agentnumber) {
            where += " and A.mobile='" + data.agentnumber + "'";
        }
        return db.query('SELECT D.ID, A.account_name as agentname,D.AgentID,A.account_name,A.account_id,A.email,A.mobile,A.authorised_person_name,A.current_status,A.is_loggedin from tf_supervisor_agents as D inner join tf_account_table as A on D.AgentID=A.account_id where A.current_status="0" and  ' + where + '', [], callback);

    },

    agentdeleteshoft: function (id, callback) {
        return db.query("update tf_account_table set is_deleted = 'yes' , mobile = '' where account_id = " + id, [], callback);
    },
    getinactiveAgents: function (id, callback) {
        return db.query('SELECT * from tf_account_table where  current_status =1 and is_deleted = "no" and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
        // return db.query('SELECT * from tf_account_table where  current_status =0 and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    getdeleteAgentdata: function (id, callback) {
        return db.query('SELECT * from tf_account_table where   is_deleted = "yes" and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
        // return db.query('SELECT * from tf_account_table where  current_status =0 and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    insertsupervisoragent: function (data, callback) {
        // console.log('SELECT * FROM tf_manager_review_rate where account_id='+data.account_id+' and audio_id="'+data.audio_id+'" and review_formid='+data.review_formid);
        db.query('SELECT * FROM tf_supervisor_agents where AgentID=' + data.AgentID, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                //console.log(results[0]);
                if (results.length > 0) {
                    //return db.query('update tf_header_footer_setting set ? where setting_id= ?', [data,results[0].setting_id], callback);
                } else {
                    return db.query('Insert INTO tf_supervisor_agents SET ?', data, callback);
                }
            }
        });
    },
    getleadsbyagentid: function (id, callback) {
        //console.log('SELECT * from tf_leads where agent_id=' + id);
        return db.query('SELECT * from tf_leads where agent_id=' + id, [], callback);
        // return db.query('SELECT * from tf_account_table where  current_status =0 and created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    updatelead: function (data, callback) {
        return db.query('update tf_leads set ? WHERE l_id = ?', [data, data.l_id], callback);
    },
    Notassignsupervisior: function (data, callback) {
        // console.log(data.groupid);
        return db.query('SELECT distinct pr.account_id,pr.account_id,pr.account_name FROM tf_account_table as pr where pr. account_role =2 and pr.current_status ="0" and pr.created_by='+data.userid+' and pr.account_id not in (select supervisor_id from tf_call_disposition_supervisor where disposition_id= '+data.groupid+')', [], callback);
    },
    save_assign_to_supervisior: function (data, callback) {
        return db.query('Insert INTO tf_call_disposition_supervisor SET ?', data, callback);
    },
    getassignsupervisior:function(data,callback){
        return db.query('SELECT D.ID,D.supervisor_id ,A.account_name as agentname from tf_call_disposition_supervisor as D inner join tf_account_table as A on D.supervisor_id=A.account_id where D.disposition_id ='+data,callback);
    },
    deleteassignsupervisior: function (id, callback) {
        return db.query('DELETE FROM tf_call_disposition_supervisor where id=?', [id], callback);
    },
    checkcontecteditmobile: function (data, callback) {
        return db.query("SELECT * FROM `tf_contacts` where cont_id !='"+data.count_id+"' and mobile= "+data.mobile+" and customer_id = "+data.userid,callback)

    },
    checkcontactmobile:function(data,callback){
        return db.query("SELECT * FROM `tf_contacts` where  mobile= "+data.mobile+" and customer_id = "+data.userid,callback)
    },
    deleteallnotification: function (id, callback) {
        return db.query('DELETE FROM tf_notifications where userid=?', [id], callback);
    },
    getdholeraagentdealdonedata:function(data,callback){
        var where = '';
        if(data.startdate && data.enddate){
            where +=' and deal_date between "'+data.startdate+'" and "'+data.enddate+'"';
        }
        //console.log("SELECT D.*,L.lead_name FROM `tf_lead_deal_done` D LEFT JOIN tf_leads L ON L.l_id=D.lead_id where  D.account_id= "+data.agent_id+" "+where+" order by deal_date DESC")
        return db.query("SELECT D.*,L.lead_name,(SELECT name FROM tf_dholera_company WHERE id=D.company) AS company,(SELECT projectname FROM tf_dholera_company_project WHERE id=D.project) AS project FROM `tf_lead_deal_done` D LEFT JOIN tf_leads L ON L.l_id=D.lead_id where  D.account_id= "+data.agent_id+" "+where+" order by deal_date DESC",callback)
    },
    getticketstatuscount: function (data, callback) {
        var where ='';
        if(data.startdate && data.enddate){
            where +=" and created_date>='"+data.startdate+" 00:00:00' and created_date<='"+data.enddate+" 23:59:59'"
        }
        if(data.priority.length>0){
            where +=" and priority IN ("+data.priority+")";
        }
        
        if(data.userrole==1){
            if(data.managerid==48){
                if(data.agent!=''){
                    where +=" and agent_id IN ("+data.agent+")";
                }
                if(data.userid){
                    where +=" and account_id="+data.userid;
                }
                return db.query('SELECT COUNT(ticket_id) AS count,status FROM tf_tickets WHERE assign_to='+data.assignto+' '+where+' GROUP BY status', [], callback);
            }else{
                return db.query('SELECT COUNT(ticket_id) AS count,status FROM tf_tickets WHERE (raised_by = ' + data.userid+' or agent_id='+data.userid+') '+where+' GROUP BY status', [], callback);
            }
            
        }else{
            if(data.managerid==48){
                var where1='WHERE 1=1 ';
                if(data.startdate && data.enddate){
                    where1 +=" and  created_date>='"+data.startdate+" 00:00:00' and created_date<='"+data.enddate+" 23:59:59'"
                }
                if(data.priority.length>0){
                    where1 +=" and priority IN ("+data.priority+")";
                }
                if(data.agent!=''){
                    where1 +=" and agent_id IN ("+data.agent+")";
                }
                if(data.userid!=''){
                    where1 +=" and account_id="+data.userid;
                }
                
                return db.query('SELECT COUNT(ticket_id) AS count,status FROM tf_tickets '+where1+' GROUP BY status', [], callback);
            }else{
                if(data.agent!=''){
                    where +=" and agent_id IN ("+data.agent+")";
                }
                return db.query('SELECT COUNT(ticket_id) AS count,status FROM tf_tickets  WHERE account_id = ' + data.userid+' '+where+' GROUP BY status', [], callback);
            }            
        }        
    },
    gettickettimeline:function(id,callback){
        return db.query("SELECT * FROM `tf_ticket_timeline` where  ticket_id= "+id,callback)
    },
    getticketdetail:function(id,callback){
        return db.query("SELECT T.*,I.issue_name,A.account_name,(SELECT account_name FROM tf_account_table WHERE account_id=T.agent_id) AS agentname,(SELECT account_name FROM tf_account_table WHERE account_id=T.assign_to) AS assignagentname FROM `tf_tickets` T LEFT JOIN tf_account_table  A ON A.account_id=T.account_id LEFT JOIN tf_issue_type I ON I.issue_id=T.issue_type where  ticket_id= "+id,callback)
    },
    addticketnote: function (data, callback) {
        return db.query('Insert INTO tf_ticket_timeline SET ?', data, callback);
    },
    getticketassignagentdetail: function (id, callback) {
        return db.query('SELECT A.account_name,A.email,A.mobile from tf_tickets T LEFT JOIN tf_account_table A ON A.account_id=T.assign_to WHERE T.ticket_id = ' + id, [], callback);getticketassignagentdetail
    },
    addwhatsappticket: function (data, callback) {
        return db.query('Insert INTO tf_ticket_whatsapp set ? ', [data], callback);
    },
    getactivesalesgroupagents: function (id, callback) {
        return db.query('SELECT A.account_name,A.account_id from HuntGroupDetail as D inner join tf_account_table as A on D.AgentID=A.account_id LEFT JOIN tf_settings S ON S.setting_value=D.HuntGroupID where A.current_status=0 AND S.setting_name="ticket_assign_agentgroup"', [], callback);
    },
    getnotassignedticket:function (id, callback) {
        return db.query('SELECT subject,ticket_id from tf_tickets where assign_to IS NULL', [], callback);
    },
    get_admin_acitivy_log:function(data,callback){
        var where =''
        console.log(data);
        if(data.account_id){
            where ="a.account_id = "+data.account_id +" and "
        }
        if(data.startdate  != 'NaN-aN-aN'  && data.enddate != 'NaN-aN-aN' && data.startdate  != ' '  && data.enddate != ' '){
            if(data.startdate){
                where +="  a.action_date BETWEEN '"+data.startdate+" 00:00:00' "
            }
            if(data.enddate){
                where += " AND '"+data.enddate+" 23:59:59'"
            }
            return db.query("SELECT a.*,b.account_name FROM `tf_activity_logs` a INNER JOIN tf_account_table b ON a.account_id = b.account_id  where "+where,callback)
        }else{
            return db.query('SELECT a.*,b.account_name FROM `tf_activity_logs` a INNER JOIN tf_account_table b ON a.account_id = b.account_id  ',callback)
        }        
    },
    checkrequestotp: function (mobile,otp, callback) {
        return db.query('select * from  tf_request_otp where mobile = ? and otp = ? order by request_date desc limit 1', [mobile,otp], callback);
    },
    saverequestotp:function (data, callback) {
        return db.query('Insert INTO tf_request_otp SET ?', [data], callback);
    },
    get_manager_id:function(data,callback){
        return db.query("SELECT account_id,account_name FROM `tf_account_table` WHERE account_type = 2",callback)
    },
    savesignupdata: function (data, callback) {
        return db.query('Insert INTO tf_account_table SET ?', data, callback);
    },
    getEmailSMSConfiguration: function (data, callback) {
        return db.query("SELECT ES.smtp_server,ES.smtp_username,ES.smtp_password,ES.smtp_port,SS.username,SS.auth_key,SS.server_url,SS.senderid,ST.sms_text,ST.contentid,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE 'signup'", [], callback);
    },
    insertagentsip: function (data, callback) {
        return db.query('Insert INTO tf_agent_sip_account SET ?', data, callback);
    },
    getusergroupdetailbyID: function (id, callback) {
        return db.query('SELECT * from HuntGroupDetail where  ID=?', [id], callback);
    },
    createqueuemember: function (groupid,accountid, callback) {
        db.query('select voice_server_id from tf_account_table where account_id = ?', [accountid], function (err, results) {
            if(results.length>0){
                const voiceserverid = results[0].voice_server_id
                db.query('select * from tf_asterisk_server where server_id= ?', [voiceserverid], function (err, serverdata) {
                    //console.log(serverdata);
                    if(serverdata.length){
                        const connection = mysql.createPool({
                            host: serverdata[0].server_mysql_host, //192.168.1.27
                            user: serverdata[0].server_mysql_username, //root
                            port: '3306',
                            password: serverdata[0].server_mysql_password, //Garuda@dv1234
                            database: serverdata[0].server_database_name,
                        });
                        connection.query('select * from queue_table where name = ?', [groupid], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                                connection.end();
                            } else {
                                if (results.length > 0) {
                                    connection.end();
                                    callback(err, results);
                                } else {
                                    const qdata = { name: groupid, queue_youarenext: 'queue-youarenext', queue_thereare: 'queue-thereare', queue_callswaiting: 'queue-callswaiting', queue_holdtime: 'queue_holdtime', queue_minutes: 'queue_minutes', queue_seconds: 'queue_seconds', queue_reporthold: 'queue_reporthold', wrapuptime: '30', strategy: 'linear', joinempty: 'yes',ringinuse:'no' }
                                    connection.query('INSERT INTO queue_table SET ?', [qdata], function (err, results) {
                                        if (err) {
                                            console.log("[mysql error]", err);
                                        } else {
                                            connection.end();
                                            callback(err, results);
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        callback(err, serverdata);
                    }
                })
            }else{
                
            }
        })
    },
    assignqueuemember: function (groupid,agentid,accountid, callback) {
        db.query('select voice_server_id from tf_account_table where account_id = ?', [accountid], function (err, results) {
            if(results.length>0){
                const voiceserverid = results[0].voice_server_id
                db.query('select * from tf_asterisk_server where server_id= ?', [voiceserverid], function (err, serverdata) {
                    //console.log(serverdata);
                    if(serverdata.length){
                        const connection = mysql.createPool({
                            host: serverdata[0].server_mysql_host, //192.168.1.27
                            user: serverdata[0].server_mysql_username, //root
                            port: '3306',
                            password: serverdata[0].server_mysql_password, //Garuda@dv1234
                            database: serverdata[0].server_database_name,
                        });
                        db.query('select account_name from tf_account_table where account_id = ?', [agentid], function (err, results) {
                            if(results.length>0){
                                connection.query('select * from queue_member_table where membername = ? and queue_name = ?', [results[0]['account_name'],groupid], function (err, res) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                        connection.end();
                                    } else {
                                        if (res.length > 0) {
                                            connection.end();
                                            callback(err, res);
                                        } else {
                                            const qdata = { membername: results[0]['account_name'], queue_name: groupid, interface: 'PJSIP/'+results[0]['account_name'],paused:0}
                                            connection.query('INSERT INTO queue_member_table SET ?', [qdata], function (err, results) {
                                                if (err) {
                                                    console.log("[mysql error]", err);
                                                } else {
                                                    connection.end();
                                                    callback(err, results);
                                                }
                                            });
                                        }
                                    }
                                });
                            }else{
                                callback(err, serverdata);
                            }
                        });
                    }else{
                        callback(err, serverdata);
                    }
                })
            }else{
                
            }
        })
    },
    deletequeuemember: function (groupid,agentid,accountid, callback) {
        db.query('select voice_server_id from tf_account_table where account_id = ?', [accountid], function (err, results) {
            if(results.length>0){
                const voiceserverid = results[0].voice_server_id
                db.query('select * from tf_asterisk_server where server_id= ?', [voiceserverid], function (err, serverdata) {
                    //console.log(serverdata);
                    if(serverdata.length){
                        const connection = mysql.createPool({
                            host: serverdata[0].server_mysql_host, //192.168.1.27
                            user: serverdata[0].server_mysql_username, //root
                            port: '3306',
                            password: serverdata[0].server_mysql_password, //Garuda@dv1234
                            database: serverdata[0].server_database_name,
                        });
                        db.query('select account_name from tf_account_table where account_id = ?', [agentid], function (err, results) {
                            if(results.length>0){
                                connection.query('delete from queue_member_table where membername = ? and queue_name = ?', [results[0]['account_name'],String(groupid)], function (err, res) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                        connection.end();
                                    } else {
                                        if (res.length > 0) {
                                            connection.end();
                                            callback(err, res);
                                        } else {
                                            connection.end();
                                            callback(err, res);
                                        }
                                    }
                                });
                            }else{
                                callback(err, serverdata);
                            }
                        });
                    }else{
                        callback(err, serverdata);
                    }
                })
            }else{
                
            }
        })
    },
    updatemobilewithsoftdelete: function (data, callback) {
        return db.query("update tf_account_table set ? where account_id = ?", [data,data.account_id], callback);
    },
    deleteagentfromagentgroup: function (id, callback) {
        return db.query('DELETE FROM HuntGroupDetail where AgentID=?', [id], callback);
    },
    deleteagentfromcampaign: function (id, callback) {
        return db.query('DELETE FROM tf_campaigns_agent where agent_id=?', [id], callback);
    }
}

module.exports = Default;
