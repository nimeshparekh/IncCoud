var db = require('../../database/db');
var admin = require("firebase-admin");
var serviceAccount = require("../teleforce-ebf8e-firebase-adminsdk-8e948-fa48e52af3.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloudX-ebf8e.firebaseio.com"
});
const awry = require('awry');
const askapi = new awry.API({
	baseUrl: process.env.ARIURL,
	username: process.env.ARIUSERNAME,
	password: process.env.ARIPASSWORD
});

const askapinoida = new awry.API({
    baseUrl: 'http://103.104.74.159:8088/ari',
    username: 'teledial',
    password: 'Garuda@DV18'
});

var Helper = {        
    getChannel: function (id,customerid,callback) {
        return db.query('SELECT did,outgoing_channel as channels,(SELECT COUNT(channel) as cnt FROM `tf_cdr` WHERE CdrStatus IN (1,2,3) AND accountid =? AND CallTypeID=1) as rchannel FROM `tf_campaigns_did` D INNER JOIN tf_account_table A ON D.account_id=A.account_id WHERE D.cam_id=? AND D.account_id=? ORDER BY RAND() LIMIT 1',[customerid,id,customerid], callback);
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
    checkAccountExpiry: async function (customerid,callback) {
        return new Promise(function(resolve, reject){
            db.query('SELECT account_id FROM `tf_account_table` WHERE `account_id` = ? and current_status=0 and expiry_date >=CURDATE()',[customerid],
                async function(err, rows){   
                    if(rows === undefined){
                        reject(new Error("Error rows is undefined"));
                    }else{
                        resolve(rows);
                    }
                }
            )
        })
    },
    getLiveAgent: async function(camid) {
        return new Promise(function(resolve, reject){
            db.query("SELECT A.account_name,A.mobile,A.account_id FROM `tf_campaigns_agent` C INNER JOIN tf_account_table A ON C.agent_id=A.account_id WHERE C.cam_id=? and A.is_loggedin='yes' and A.mobile!=''  and A.account_id NOT IN (SELECT agent_id from tf_agent_details WHERE agent_id= A.account_id and agent_status IN (1,2,3)) and A.account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=A.account_id and break_status=0) and A.account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=A.account_id and status=0) ORDER BY RAND()",[camid], 
                async function(err, rows){   
                    if(rows === undefined){
                        resolve([]);
                    }else{
                        resolve(rows);
                    }
                }
            )}
        )
    },
    getAgentLastcall: async function(id) {
        return new Promise(function(resolve, reject){
            //db.query("SELECT g.WrapUpTime,c.CallEndTime,c.CdrStatus FROM `tf_cdr` c LEFT JOIN HuntGroupDetail h ON c.AgentID=h.AgentID LEFT JOIN HuntGroup g ON h.HuntGroupID=g.GroupID WHERE c.`AgentID` = ? and c.CallTypeID = 1 ORDER BY c.AgentCallEndTime DESC LIMIT 0,1",[id], 
            db.query("SELECT g.WrapUpTime,c.last_updated as CallEndTime,c.agent_status as CdrStatus FROM `tf_agent_details` c LEFT JOIN HuntGroupDetail h ON c.agent_id=h.AgentID LEFT JOIN HuntGroup g ON h.HuntGroupID=g.GroupID WHERE c.`agent_id` = ? LIMIT 0,1",[id], 
                async function(err, rows){   
                    //console.log(rows)                                             
                    if(rows === undefined){
                        resolve([]);
                    }else{
                        resolve(rows);
                    }
                }
            )}
        )
    },
    SendFirebaseNotification: function(userid,title,body) {
        db.query('SELECT webtoken,uuid FROM tf_account_table  WHERE account_id=?', [userid], function (err, results) {
			if (err) {
				console.log(err);
			}else{
				adata = results[0]
                console.log(adata)
                const message_notification = {
                    notification: {
                        title: title,
                        body: body,
                    }
                };
                const  webregistrationToken = adata.webtoken
                const  mobileregistrationToken = adata.uuid
                const message = message_notification
                const options =  {}
                if(webregistrationToken!='' || webregistrationToken!=null){
                    admin.messaging().sendToDevice(webregistrationToken, message, options)
                    .then( response => {

                        console.log("Notification sent successfully")
                    
                    })
                    .catch( error => {
                        console.log(error);
                    });
                }
                if(mobileregistrationToken!='' || mobileregistrationToken!=null){
                    admin.messaging().sendToDevice(mobileregistrationToken, message, options)
                    .then( response => {

                        console.log("Notification sent successfully")
                    
                    })
                    .catch( error => {
                        console.log(error);
                    });
                }
            }
        })
    },
    SendPanelNotification: function(userid,title,body) {
        var data = {userid:userid,title:title,body:body}
        db.query('INSERT INTO tf_notifications SET ?', [data], function (err, results) {
        })
    },
    getAgentVOIPStatus: async function(data,did,managerid) {
        var voiceserverdata = await this.GetManagerVoiceServerData(managerid)
        const askrestapi = new awry.API({
            baseUrl: voiceserverdata.ari_url,
            username: voiceserverdata.ari_username,
            password: voiceserverdata.ari_password,
        });
        const promises = data.map(ag => {
            var username = ag.account_name
            var mobile = ag.mobile
            mobile = mobile.toString()[0] == 0 ? mobile : '0'+mobile
            var agdata = ''
            return askrestapi.endpoints.get({technology:'PJSIP',resource:username}).then(results => {
                if(results.data.state=='online'){
                    agdata = 'PJSIP/'+username
                    return agdata
                }else{
                    agdata = 'PJSIP/'+mobile+'@SM'+did
                    return agdata
                }
            }).catch(function(err) {
                agdata  = 'PJSIP/'+mobile+'@SM'+did
                return agdata;
            });
        })
        var avaichannels = await Promise.all(promises)
        avaichannels = avaichannels.filter(function(item) {
            return item !== false
        })
        console.log(avaichannels)
        return avaichannels
    },
    getAgentData: async function(id){
        return new Promise(function(resolve, reject){
            db.query("SELECT mobile,account_name FROM `tf_account_table` WHERE `account_id` = ? and is_loggedin='yes'  and account_id NOT IN (SELECT agent_id from tf_agent_details WHERE agent_id= ? and agent_status IN (1,2,3)) and account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=? and break_status=0) and account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=? and status=0)",[id,id,id,id],
                async function(err, rows){   
                    //console.log(rows)                                             
                    if(rows === undefined){
                        resolve([]);
                    }else{
                        resolve(rows);
                    }
                }
            )}
        )
    },
    getUserOBDBalance: async function(id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_account_balance  WHERE Account_ID=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        var balance = results[0]['OBD_No']
                        var startdate = results[0]['OBD_start_date']
                        var lastused = results[0]['OBD_User_Used']
                        db.query('SELECT SUM(C.CallPluse) as total,DATE(C.CallStartTime) as date FROM `tf_campaigns_numbers` N INNER JOIN tf_campaigns CA ON N.cam_id=CA.camid INNER JOIN tf_cdr C ON N.numid=C.auto_numid WHERE N.account_id=? AND CA.cam_method=1 AND date>=?', [id,startdate], function (err, results) {
                            if (err) {
                                resolve(0);
                            }else{
                                if(results[0]['total']>0){
                                    var currentbalance = balance - results[0]['total']
                                    currentbalance = currentbalance>0?currentbalance:0
                                    db.query('update tf_account_balance set OBD_User_Balance=? WHERE Account_ID=?',[currentbalance,id]);
                                    db.query('update tf_account_balance set OBD_User_Used=? WHERE Account_ID=?',[results[0]['total'],id]);
                                    resolve(currentbalance);
                                }else{
                                    resolve(balance);
                                }
                            }
                        })
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    getMobileAgentLastcall: async function(id) {
        return new Promise(function(resolve, reject){
            db.query("SELECT g.WrapUpTime,c.CallEndTime,c.CdrStatus FROM `tf_cdr` c LEFT JOIN HuntGroupDetail h ON c.AgentID=h.AgentID LEFT JOIN HuntGroup g ON h.HuntGroupID=g.GroupID WHERE c.`AgentID` = ? and c.CallTypeID = 1 ORDER BY c.CallEndTime DESC LIMIT 0,1",[id], 
                async function(err, rows){   
                    //console.log(rows)                                             
                    if(rows === undefined){
                        reject(new Error("Error rows is undefined"));
                    }else{
                        resolve(rows);
                    }
                }
            )}
        )
    },
    insertapidata:function (data, callback) {
        return db.query('INSERT INTO tf_manager_api_data SET ?', [data], callback);
    },
    getOnlyAgentVOIP: async function (data, did,managerid) {
        var voiceserverdata = await this.GetManagerVoiceServerData(managerid)
        const askrestapi = new awry.API({
            baseUrl: voiceserverdata.ari_url,
            username: voiceserverdata.ari_username,
            password: voiceserverdata.ari_password,
        });
        const promises = data.map(ag => {
            var username = ag.account_name
            var mobile = ag.mobile
            mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
            var agdata = ''
            return askrestapi.endpoints.get({ technology: 'PJSIP', resource: username }).then(results => {
                if (results.data.state == 'online') {
                    agdata = 'PJSIP/' + username
                    return agdata
                } else {
                    return []
                }
            }).catch(function (err) {
                console.log(err)
                return []
            });
        })
        var avaichannels = await Promise.all(promises)
        avaichannels = avaichannels.filter(function (item) {
            return item !== false
        })
        console.log(avaichannels)
        return avaichannels
    },
    getAgentNoidaVOIPStatus: async function(data,did) {
        const promises = data.map(ag => {
            var username = ag.account_name
            var mobile = ag.mobile
            mobile = mobile.toString()[0] == 0 ? mobile : '0'+mobile
            var agdata = ''
            return askapinoida.endpoints.get({technology:'PJSIP',resource:username}).then(results => {
                if(results.data.state=='online'){
                    agdata = 'PJSIP/'+username
                    return agdata
                }else{
                    agdata = 'PJSIP/'+mobile+'@SM'+did
                    return agdata
                }
            }).catch(function(err) {
                agdata  = 'PJSIP/'+mobile+'@SM'+did
                return agdata;
            });
        })
        var avaichannels = await Promise.all(promises)
        avaichannels = avaichannels.filter(function(item) {
            return item !== false
        })
        console.log(avaichannels)
        return avaichannels
    },
    CheckAdminSetting: async function (name) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT setting_value FROM tf_settings  WHERE setting_name = ? ORDER BY created_at DESC', [name], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['setting_value']);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    Getoutgoingdid: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1 AND Type=9', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['did']);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    GetManagerVoiceServerData: async function (accountid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT voice_server_id FROM tf_account_table  WHERE account_id=?', [accountid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    if (results.length > 0) {
                        db.query('SELECT * FROM tf_asterisk_server  WHERE server_id = ?', [results[0].voice_server_id], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                                resolve([]);
                            } else {
                                if (results.length > 0) {
                                    resolve(results[0]);
                                } else {
                                    resolve([]);
                                }
                            }
                        })
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    GetManagerSettingValueByName: async function (id,name) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT setting_value FROM tf_manager_settings  WHERE account_id=? and setting_name = ?', [id,name], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['setting_value']);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    UpdateAgentLiveStatus:function (data,agentid, callback) {
        return new Promise(function(resolve, reject){
            db.query('SELECT * FROM tf_agent_details where agent_id = ?', [agentid], function (err, results) {
                console.log(results)
                if (err) {
                    console.log(err)
                    resolve([]);
                }else{
                    if(results.length>0){
                        db.query('UPDATE tf_agent_details SET ? WHERE agent_id = ?', [data,agentid], function (err, results) {
                            if (err) {
                                console.log(err)
                                resolve([]);
                            }else{
                                console.log(results)
                                resolve(results)
                            }
                        })
                    }else{
                        data.agent_id = agentid
                        db.query('INSERT INTO tf_agent_details SET ?', [data], function (err, results) {
                            if (err) {
                                resolve([]);
                            }else{
                                resolve(results)
                            }
                        })
                    }
                }
            })
        })
    },
    CheckUserMintuteBalance:async function (id, callback) {
        return new Promise(function(resolve, reject){
            db.query('SELECT Tele_Plan_Minuites,Tele_Startdate FROM tf_account_balance where Account_ID=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                }else{
                    if(results.length>0){
                        var row = results[0]
                        var planminute = row.Tele_Plan_Minuites
                        if(planminute>0){
                            var startdate = row.Tele_Startdate
                            db.query('SELECT SUM(CallPluse) as usedminute FROM tf_cdr where accountid=? and DATE(CallStartTime)>=?', [id,startdate], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                    resolve(0);
                                }else{
                                    if(results.length>0){
                                        var usedminute = results[0].usedminute
                                        var currentbalance = planminute - usedminute
                                        currentbalance = currentbalance>0?currentbalance:0
                                        db.query('update tf_account_balance set Tele_Plan_Balance=? WHERE Account_ID=?',[currentbalance,id]);
                                        db.query('update tf_account_balance set Tele_Plan_Used=? WHERE Account_ID=?',[usedminute,id]);
                                        resolve(currentbalance);
                                    }else{
                                        resolve(planminute);
                                    }
                                }
                            });
                        }else{
                            resolve(0);
                        }
                    }else{
                        resolve(0);
                    }
                }
            })
        })
    },
    getAgentLastCallStatus: async function(id) {
        return new Promise(function(resolve, reject){
            db.query("SELECT g.WrapUpTime,c.last_updated,c.agent_status FROM `tf_agent_details` c LEFT JOIN HuntGroupDetail h ON c.agent_id=h.AgentID LEFT JOIN HuntGroup g ON h.HuntGroupID=g.GroupID WHERE c.`agent_id` = ? ORDER BY c.last_updated DESC LIMIT 0,1",[id], 
                async function(err, rows){   
                    //console.log(rows)                                             
                    if(rows === undefined){
                        resolve([]);
                    }else{
                        resolve(rows);
                    }
                }
            )}
        )
    },
    GetcontidByNumid: async function(id){
        return new Promise(function(resolve, reject){
            db.query("SELECT cont_id FROM `tf_campaigns_numbers` WHERE `numid` = ? ",[id],
                async function(err, rows){   
                    //console.log(rows)                                             
                    if(rows.length>0){
                        resolve(rows[0]['cont_id']);
                    }else{
                        resolve('');
                    }
                }
            )}
        )
    }
}

module.exports = Helper;
