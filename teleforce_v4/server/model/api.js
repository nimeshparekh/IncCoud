var db = require('../database/db');

var API = {
    checkauthkey: function (key, callback) { 
         return db.query('Select * from tf_account_table where AccessKey=?',[key], callback);
    },
    updateUser: function (data,accountid, callback) {
        return db.query('update tf_account_table set ? where account_id= ?', [data, accountid], callback);
    },
    getuserdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id= ?', [id], callback);
    },
    checkactiveamanageraccount:function (id, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ? and current_status=0 and expiry_date >=CURDATE()', [id], callback);
    },
    findoutgoingdid:function (id, callback) {
        return db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1 AND Type=9', [id], callback);
    },
    getallmanageragent:function (id, callback) {
        return db.query('SELECT account_id,account_name,mobile FROM `tf_account_table` WHERE created_by = ?  AND account_type = 1', [id], callback);
    },
    findcdrbyuid:function (id, callback) {
        return db.query('SELECT uniqueid,uniqueid as UID,DID,AgentID,AgentName,AgentNumber,AgentStatus,CallerNumber,CallerName,CallType,CallStartTime,CallEndTime,CallDuration,CallTalkTime,CallStatus,AgentStatus,RecPath FROM tf_cdr where uniqueid=?', [id], callback);
    },
    insertverifymobile:function (data, callback) {
        return db.query('INSERT INTO tf_verify_mobile SET ?', [data], callback);
    },
    findverifynumber:function (mobile, callback) {
        return db.query('SELECT * FROM `tf_verify_mobile` WHERE mobile = ? and verify="no" order by date desc', [mobile], callback);
    },
    updateverifynumber: function (data,id, callback) {
        return db.query('update tf_verify_mobile set ? where id= ?', [data, id], callback);
    },
    findverifydid:function (id, callback) {
        return db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1', [id], callback);
    },
    insertsmsdata:function (data, callback) {
        return db.query('INSERT INTO tf_sms_report SET ?', [data], callback);
    },
    insertcdr:function (data, callback) {
        return db.query('INSERT INTO tf_cdr SET ?', [data], callback);
    },
    addlead_db: function (data, callback) {
        return db.query('Insert INTO tf_leads set ? ', [data], callback);
    },
    getuserdetailbyname: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_name= ?', [id], callback);
    },
    getCampaign: function (id,type,callback) { 
        if(type=='voice'){
            return db.query('Select camid,cam_name from tf_campaigns where account_id=? ORDER BY camid DESC',[id], callback);
        }else if(type=='sms'){
            return db.query('Select cid,cam_name from tf_smscampagis where account_id=? ORDER BY cid DESC',[id], callback);
        }else if(type=='email'){
            return db.query('Select cid,cam_name from tf_email_campagin where account_id=? ORDER BY cid DESC',[id], callback);
        }else{
            return callback
        }
    },
    getSegment: function (id, callback) { 
        return db.query('Select cont_id,name from tf_segments where customer_id=? order by created_date desc',[id], callback);
    },
    findincomingcdrbydate:function (date,id, callback) {
        return db.query('SELECT uniqueid,uniqueid as UID,DID,AgentID,AgentName,AgentNumber,AgentStatus,CallerNumber,CallerName,CallType,CallStartTime,CallEndTime,CallDuration,CallTalkTime,CallStatus,AgentStatus,RecPath FROM tf_cdr where CallTypeID=2 and DATE(CallStartTime)=? and accountid = ?', [date,id], callback);
    },
    insertscheduledata:function (data, callback) {
        return db.query('INSERT INTO tf_scheduler SET ?', [data], callback);
    },
    getschedulelistCust: function (id, callback) {
        return db.query('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,schedule_type as  RoomId,original_meeting_link from tf_scheduler where  `StartTime` IS NOT NULL AND `EndTime` IS NOT NULL AND `user_id` = ' + id, [], callback);
    },
    agentschdulelist: function (id, callback) {
        return db.query('SELECT s_id as ID,meeting_type AS EventType,"" AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,schedule_type as  RoomId,true as IsBlock from tf_scheduler where  `StartTime` IS NOT NULL AND `EndTime` IS NOT NULL AND `user_id` = ' + id, [], callback);
    },
    agentmeetingschdulelist: function (id, callback) {
        return db.query('SELECT s.s_id as ID,s.meeting_type AS EventType,"" AS Subject,s.Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,s.schedule_type as  RoomId,true as IsBlock from tf_scheduler s LEFT JOIN tf_schedule_meeting sm ON s.user_id = sm.agent_id where  s.StartTime IS NOT NULL AND s.EndTime IS NOT NULL AND sm.meetingid = ' + id, [], callback);
    },
    updatescheduledata: function (data, callback) {
        return db.query('update tf_scheduler set ? where s_id= ?', [data, data.s_id], callback);
    },
    deletescheduledata: function (sid, callback) {
        return db.query('DELETE FROM tf_scheduler where s_id= ?', [sid], callback);
    },
    getemailtemplate: function (id, callback) {
        return db.query('SELECT  a.account_name,a.email,e.email_html from tf_account_table a left join tf_emailtemplate e ON a.created_by=e.account_id where e.isschedulemeeting>0 AND a.account_id=' + id+' ORDER BY e.email_id desc limit 0,1', [], callback);
    },
    getemaildetail: function (id, callback) {
        return db.query('select * from tf_emailtemplate where email_id=' + id, [], callback)
    },
    getmeetingdata: function (id, callback) {
        return db.query('select customer_id,agent_id from tf_schedule_meeting where meetingid=' + id, [], callback)
    },
    getsmstemplate: function (id, callback) {
        return db.query('SELECT  a.account_name,a.email,e.sms_text,e.contentid,e.templateid,e.senderid from tf_account_table a left join tf_smstemplate e ON a.created_by=e.account_id where e.isschedulemeeting>0 AND a.account_id=' + id+' ORDER BY e.sms_id desc limit 0,1', [], callback);
    },
    GetConfigBykey: async function (key,id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_configuration  WHERE user_id=? and metakey = ?', [id,key], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].metavalue);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    addlead_db: function (data, callback) {
        return db.query('Insert INTO tf_leads set ? ', [data], callback);
    },
    findlead:function (mobile,id, callback) {
        return db.query('SELECT * FROM tf_leads WHERE mobile_no = ? and User_id = ? and is_deleted = "no"', [mobile,id], callback)
    },
    updatelead: function (data, callback) {
        console.log(data.l_id)
        return db.query('update tf_leads set ? WHERE l_id = ?', [data, data.l_id], callback);
    },
    GetLeadAgent: async function (gid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM HuntGroupDetail  WHERE HuntGroupID=?', [gid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        var agentlead = []
                        var cnt = 0 
                        results.forEach(element => {
                            db.query('SELECT * FROM tf_leads  WHERE agent_id=? and User_id = ? ORDER BY l_id DESC LIMIT 1', [element.AgentID,element.UserID], function (err, rows) {
                                cnt = cnt + 1
                                if(rows.length>0){
                                    var row = rows[0]
                                    agentlead.push({id:element.AgentID,date:row.creation})
                                    //console.log(agentlead)
                                    //console.log(cnt+'=='+results.length)
                                    if(cnt==results.length){
                                        agentlead.sort(function(a, b) {
                                            var c = new Date(a.date).getTime();
                                            var d = new Date(b.date).getTime();
                                            return c>d?1:-1;
                                        });
                                        //console.log(agentlead)
                                        resolve(agentlead[0].id);
                                    }        
                                }else{
                                    resolve(element.AgentID);
                                }
                            })
                        });
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    addleadsemail_db: function (data, callback) {
        return db.query('Insert INTO tf_leads_email set ? ', [data], callback);
    },
    GetEmailServerData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_manager_email_server  WHERE server_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    getschedulelistManager: function (id,startdate,enddate, callback) {
        //console.log('SELECT s.s_id as ID,s.meeting_type AS EventType,s.customer_name AS Subject,s.Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,a.account_name,s.original_meeting_link from tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id = a.account_id where a.created_by='+id);
        return db.query('SELECT s.s_id as ID,concat(s.customer_name," (",s.meeting_type,")") AS Subject,TRIM(LEADING "undefined<br>" FROM Description ) as Description,s.mobile AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,a.account_name,s.original_meeting_link from tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id = a.account_id where s.account_id='+id+' AND s.StartTime between "' + startdate + '" and "' + enddate + '" or a.created_by='+id , [], callback);
        //console.log('SELECT s.s_id as ID,s.meeting_type AS EventType,s.customer_name AS Subject,s.Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,a.account_name  from tf_scheduler s LEFT JOIN tf_account_table a ON s.user_id = a.account_id where a.created_by=' + id);
        //return db.query('SELECT s.s_id as ID,s.meeting_type AS EventType,CONCAT("Customer  : ",s.customer_name) AS Description,s.email AS Location,s.mobile AS OwnerId,s.StartTime ,s.EndTime,CONCAT("Agent  : ",a.account_name) as Subject  from tf_scheduler s LEFT JOIN tf_account_table a ON s.user_id = a.account_id where a.created_by=' + id, [], callback);
    },
    getAgentGroup: function (id, callback) { 
        return db.query('Select GroupID,GroupName from HuntGroup where AccountID=? order by GroupID desc',[id], callback);
    },
    GetLeadContactData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_contacts  WHERE lead_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    getmanagerdigitalbalance:function (username, callback) {
        return db.query('SELECT B.Account_ID,B.Digital_ID,DP.brand_no,DP.channel_no,DP.member_no,DP.group_no,DP.monitor_no,DP.hashtag_no,DP.messanger,DP.user,DP.bot,DP.mediaspace,B.Digital_Startdate,B.Digital_Expire,B.Ads_ID,B.Ads_Startdate,B.Ads_User_Balance,B.Ads_Value,B.Ads_User_Used FROM tf_account_balance B INNER JOIN tf_account_table A ON A.account_id=B.Account_ID LEFT JOIN tf_Tele_Digital_Package DP ON DP.Digital_ID=B.Digital_ID  WHERE A.account_name="'+username+'"', [], callback);
        //return db.query('SELECT *,B.Account_GST_NO,B.Account_Address,B.Account_State_Code,B.Company_GST_ID,B.Plan_discount,B.SMS_ID,B.SMS_Plan_Value,B.Mail_ID,B.Mail_Plan_Value,B.Meet_ID,B.Meet_Plan_Value,B.Digital_ID,B.Digital_Plan_Value,B.plan_minuits,B.free_minuites,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate from tf_account_table A LEFT JOIN Billing_data B ON B.Account_ID=A.account_id where A.account_id='+id+' ORDER BY B.Bill_ID DESC LIMIT 1', [], callback);
    },
    updatemaangeraccountbalance: function (data, callback) {
        return db.query('update tf_account_balance set ? where Account_ID= ?', [data, data.Account_ID], callback);
    },
    findcdrbydate:function (date,id, callback) {
        return db.query('SELECT uniqueid,uniqueid as UID,DID,AgentID,AgentName,AgentNumber,AgentStatus,CallerNumber,CallerName,CallType,DATE_FORMAT(CallStartTime,"%Y-%m-%d %H:%i:%s") as CallStartTime,DATE_FORMAT(CallEndTime,"%Y-%m-%d %H:%i:%s") as CallEndTime,CallDuration,CallTalkTime,CallStatus,AgentStatus,feedback,RecPath FROM tf_cdr where  DATE(CallStartTime)=? and accountid = ?', [date,id], callback);
    },
    getcalenderschedulelist: function (id,startdate,endDate, callback) {
        return db.query('SELECT s_id as ID,meeting_type AS EventType,customer_name AS Subject,Description,email AS Location,mobile AS OwnerId,StartTime ,EndTime,schedule_type as  RoomId,original_meeting_link from tf_scheduler where  `StartTime` IS NOT NULL AND `EndTime` IS NOT NULL AND StartTime between "' + startdate + '" and "' + endDate + '" AND `user_id` = ' + id, [], callback);
    },
    getIVRDetail: function (id, callback) {
        return db.query('SELECT * from IvrBuilder where BuilderID= ?', [id], callback);
    },
    findcdrbyid:function (id, callback) {
        return db.query('SELECT id,uniqueid as UID,accountid,DID,AgentID,AgentName,AgentNumber,AgentStatus,CallerNumber,CallerName,CallType,CallStartTime,CallEndTime,CallDuration,CallTalkTime,CallStatus,AgentStatus,LastDestination,CONCAT("https://app.cloudX.in/api/call/audio/",RecPath) as RecPath FROM tf_cdr where id=?', [id], callback);
    },
    insertapidata:function (data, callback) {
        return db.query('INSERT INTO tf_manager_api_data SET ?', [data], callback);
    },
    getmanagerfreeagent:function (id, callback) {
        return db.query('SELECT A.account_name,A.account_id,A.mobile FROM tf_account_table A WHERE A.created_by = ? AND A.current_status = 0 AND A.is_loggedin="yes" AND A.account_name NOT IN (SELECT AgentName from tf_cdr WHERE AgentName=A.account_name and CdrStatus IN (1,2,3)) AND A.account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=A.account_id and break_status=0) and A.account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=A.account_id and status=0) ORDER BY A.account_id ASC', [id], callback);
    },
    updatecdr:function (data,id, callback) {
        return db.query('UPDATE tf_cdr SET ? where id=?', [data,id], callback);
    },
    insertnextbaserequest:function (data, callback) {
        return db.query('INSERT INTO tf_cdr_request_nexxbase SET ?', [data], callback);
    },
    getmanagerfreeagentbygroup:function (id,groupid, callback) {
        return db.query('SELECT A.account_name,A.account_id,A.mobile FROM `HuntGroupDetail` G INNER JOIN tf_account_table A ON G.AgentID=A.account_id WHERE G.HuntGroupID = ? AND G.UserID = ? AND A.current_status = 0 AND A.is_loggedin="yes" AND A.account_name NOT IN (SELECT AgentName from tf_cdr WHERE AgentName=A.account_name and CdrStatus IN (1,2,3)) AND A.account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=A.account_id and break_status=0) and A.account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=A.account_id and status=0) ORDER BY A.account_id ASC', [groupid,id], callback);
    },
    whatsappGetChat(data,callback){
        var mobile=data.from.substr(-10)
        return db.query('SELECT * FROM `td_chat` WHERE sender_id = ? and user_id=?', [mobile,data.account_id], callback);  
    },
    updateSMSCampaignReport: function (data, txnid, callback) {
        return db.query('update tf_sms_campagins_number set ? where transactionId= ?', [data, txnid], callback);
    },
    updateSMSReport: function (data, txnid, callback) {
        return db.query('update tf_sms_report set ? where sms_uid= ?', [data, txnid], callback);
    },
    getmanagerallagentbygroup:function (id,groupid, callback) {
        return db.query('SELECT A.account_name,A.account_id,A.mobile FROM `HuntGroupDetail` G INNER JOIN tf_account_table A ON G.AgentID=A.account_id WHERE G.HuntGroupID = ? AND G.UserID = ? AND A.current_status = 0  ORDER BY A.account_id ASC', [groupid,id], callback);
    },
    getqueuecall:function (id, callback) {
        return db.query('SELECT cdrid,did,times FROM `tf_queuecall` WHERE accountid = ? AND status = "0"', [id], callback);
    },
    //Almond
    UpdateNegativeAge: async function (data) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM almond_age_negative  WHERE mobile=?', [data.mobile], function (err, results) {
                if (err) {
                    resolve('');
                } else {
                    if (results.length > 0) {
                        const id = results[0].id
                        const data = {hit_count:results[0].hit_count+1}
                        db.query('UPDATE almond_age_negative SET ? where id=?', [data,id], function (err, results) {
                            console.log(err)
                        });
                        resolve('');
                    } else {
                        db.query('INSERT INTO almond_age_negative SET ?', [data],  function (err, results) {
                            console.log(err)
                        });
                        resolve('');
                    }
                }
            })
        })
    },
    CheckCallerNegativeAge:function (mobile, callback) {
        return db.query('SELECT * FROM `almond_age_negative` WHERE mobile = ?', [mobile], callback);
    },
    CheckCallerRegistration:function (mobile, callback) {
        return db.query('SELECT * FROM `almond_caller_registration` WHERE mobile = ?', [mobile], callback);
    },
    InsertCallerRegistration: function (data, callback) {
        return db.query('Insert INTO almond_caller_registration set ? ', [data], callback);
    },
    UpdateCallerRegistration: function (data,id, callback) {
        return db.query('UPDATE almond_caller_registration set ? where id = ?', [data,id], callback);
    },
    //Almond
    findapi:function (id, callback) {
        return db.query('SELECT * FROM tf_manager_api where api_id=?', [id], callback);
    },
    deleteagent: function (id, callback) {
        return db.query('DELETE FROM tf_account_table where account_id=?', [id], callback);
    },
    getagentbyname:function (name,accountid, callback) {
        return db.query('SELECT * FROM tf_account_table where account_name= ? and created_by = ?', [name,accountid], callback);
    },
    deleteagentfromgroup: function (id, callback) {
        return db.query('DELETE FROM HuntGroupDetail where AgentID=?', [id], callback);
    },
    GetSmsServerByManagerId: function (managerid, callback) {
        return db.query('SELECT A.*,S.server_name,S.server_type,S.sid,S.server_url from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=? and S.server_type=0', [managerid], callback);
    }
}


module.exports = API;