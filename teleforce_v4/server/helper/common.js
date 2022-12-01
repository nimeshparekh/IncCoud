var db = require('../database/db');
var async = require("async");
var admin = require("firebase-admin");
var Admin = require('../model/admin');
var API = require('../model/api');
var Contacts = require('../model/Contacts');
var Digital = require('../model/digital');
var fs = require('fs');
var validUrl = require('valid-url');
var Path = require('path');
var Url = require('url');
require("dotenv").config();
// var serviceAccount = require("../cron/teleforce-ebf8e-firebase-adminsdk-8e948-fa48e52af3.json");
var serviceAccount = require("../cron/teleforce-ebf8e-firebase-adminsdk-8e948-fa48e52af3.json");
// 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cloudX-ebf8e.firebaseio.com"
});
var request = require('request');
var requestify = require('requestify');
var Report = require('../model/report');
var ERP = require('../model/erp');
var Products = require('../model/products');
var nodemailer = require('nodemailer');
var dateFormat = require("dateformat");
const awry = require('awry');
const { json } = require('body-parser');
var Zoho = require('../model/zoho');
var moment = require('moment')
var urllib = require('urllib');
var zohoclientid = '1000.DNQXHXEZJ6MO64ZX79FH0W6A6CFK4J'
var zohoclientsecret = '806b9d9ebed0f33d2db24f4e9a49f42be5ddc8fd87'
var Accounts_URL = 'https://accounts.zoho.in'
require("dotenv").config({ path: Path.resolve(__dirname, '../.env') });
var helper = {
    GetManagerIdByAgent: async function (agentid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT created_by FROM tf_account_table  WHERE account_id=?', [agentid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].created_by);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    SearchContactIDByMobile: function (mobile, accountid) {
        mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
        mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
        console.log(mobile + "==" + accountid)
        return new Promise(function (resolve, reject) {
            db.query('SELECT name,cont_id FROM tf_contacts  WHERE mobile =  ? and customer_id=? order by lead_id desc', [mobile, accountid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    SendFirebaseNotification: function (userid, title, body) {
        db.query('SELECT webtoken,uuid FROM tf_account_table  WHERE account_id=?', [userid], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                if (results.length > 0) {
                    var adata = results[0]
                    const webregistrationToken = adata.webtoken
                    if (webregistrationToken != '' && webregistrationToken != null) {
                        var options = {
                            'method': 'POST',
                            'url': 'https://fcm.googleapis.com/fcm/send',
                            'headers': {
                                'Authorization': 'key=AAAAOFwSwLM:APA91bHnomxIJBHHYDiDQ-2GsoLbdMq8G2tZWbzCTeGM6qXQSS7t_wnfuY67KBU-HFPQrBHHA_y6hYq0zgCFEXuuzEF6gKSlwvEKChRn6Vf4HxXN1DN6C0gIgSp8dqI_uj1efB59wAzi',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "notification": {
                                    "body": body,
                                    "title": title
                                },
                                "priority": "high",
                                "data": {
                                    "clickaction": "FLUTTERNOTIFICATIONCLICK",
                                    "id": "1",
                                    "status": "done"
                                },
                                "to": webregistrationToken
                            })
                        };
                        request(options, function (error, response) {
                            if (error) { console.log(error) }
                            console.log(response.body);
                        });
                    }
                    //
                    const mobileregistrationToken = adata.uuid
                    if (mobileregistrationToken != '' && mobileregistrationToken != null) {
                        var options = {
                            'method': 'POST',
                            'url': 'https://fcm.googleapis.com/fcm/send',
                            'headers': {
                                'Authorization': 'key=AAAAOFwSwLM:APA91bHnomxIJBHHYDiDQ-2GsoLbdMq8G2tZWbzCTeGM6qXQSS7t_wnfuY67KBU-HFPQrBHHA_y6hYq0zgCFEXuuzEF6gKSlwvEKChRn6Vf4HxXN1DN6C0gIgSp8dqI_uj1efB59wAzi',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "notification": {
                                    "body": body,
                                    "title": title
                                },
                                "priority": "high",
                                "data": {
                                    "clickaction": "FLUTTERNOTIFICATIONCLICK",
                                    "id": "1",
                                    "status": "done"
                                },
                                "to": mobileregistrationToken
                            })
                        };
                        request(options, function (error, response) {
                            if (error) { console.log(error) }
                            console.log(response.body);
                        });
                    }
                }
            }
        })
    },
    calldatadividebydate: function (data) {
        var calldata = []
        var i = 1
        return new Promise(function (resolve, reject) {
            var i = 1
            async.forEachOf(data, async (element, key, callback) => {
                console.log(element.calldate)
                if (calldata[element.calldate]) {
                    calldata[element.calldate].push(element)
                } else {
                    calldata[element.calldate] = element
                }
                if (i == data.length) {
                    console.log(data.length + "==" + i)
                    console.log(calldata)
                    resolve(calldata);
                } else {
                    i++
                }

            });
        })
    },
    SendPanelNotification: function (userid, title, body) {
        var data = { userid: userid, title: title, body: body }
        db.query('INSERT INTO tf_notifications SET ?', [data], function (err, results) {
        })
    },
    GetCdrDataById: async function (cdrid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_cdr  WHERE id=?', [cdrid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    UpdateCallHistoryByMobile: async function (name, mobile, managerid, callback) {
        return db.query('UPDATE `tf_cdr` SET CallerName = ? WHERE CallerNumber like "' + mobile + '" and accountid = ?', [name, managerid], callback);
    },

    SaveContactMeta: async function (key, value, conid, managerid) {
        key = key.toLowerCase().replace(/\s/g, '')
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_contacts_meta  WHERE cont_id=? and meta_key = ?', [conid, key], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        var data = { meta_value: value }
                        db.query('Update tf_contacts_meta SET ? WHERE cont_id=? and meta_key = ?', [data, conid, key], function (err, results) { })
                        resolve(results);
                    } else {
                        var data = { account_id: managerid, cont_id: conid, meta_key: key, meta_value: value }
                        //console.log(data)
                        if (key != '') {
                            db.query('INSERT INTO tf_contacts_meta SET ?', [data], function (err, results) { })
                        }
                        resolve(0);
                    }
                }
            })
        })
    },
    GetContactAllMeta: async function (conid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_contacts_meta  WHERE cont_id=?', [conid], function (err, results) {
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
    SendthirdAPI: async function (data, type) {
        console.log(data)
        console.log(type + "==>>>")
        if (type == 'missed') {
            var managerid = data.accountid
            console.log('missed api call')
            if (managerid == 1993) {
                if (data.CallType == 'incoming') {
                    var calltype = 'inbound'
                } else {
                    var calltype = 'outbound'
                }
                if (data.AgentID == '' || data.AgentID == null) {
                    data.AgentID = 0
                }
                var tdata = { id: data.id, from: data.CallerNumber, tfuserid: data.AgentID, start_time: String(data.CallStartTime), end_time: String(data.CallEndTime), duration: data.CallDuration, hangupby: data.DisconnectedBy, callstatus: "MISSED", calltype: calltype }
                console.log(tdata)
                requestify.request("https://maxifysales.com:5000/api/tf/callmissed", {
                    method: 'POST',
                    body: tdata,
                    dataType: 'form-url-encoded',
                }).then(function (response) {
                    console.log(response + "===missed api==" + type)
                    var ldata = { accountid: managerid, agent_id: data.AgentID, cdrid: data.id, event: "missed", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                    db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                })
                    .fail(function (response) {
                        console.log(JSON.stringify(response))
                        console.log(response + "==missed api error==" + type)
                        var ldata = { accountid: managerid, agent_id: data.AgentID, cdrid: data.id, event: "missed", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                        db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                    });
                console.log("=============================")
            }
        }
        if (type == 'incoming') {
            var agentid = data.userid
            var managerid = await this.GetManagerIdByAgent(agentid)
            console.log(managerid + "test incoming")
            if (managerid == 1993) {
                console.log(managerid + "wisom test incoming")
                if (data.type == 'incoming') {
                    var calltype = 'inbound'
                } else {
                    var calltype = 'outbound'
                }
                var tdata = { id: data.id, from: data.from, tfuserid: agentid, status: 'Ringing', calltype: calltype }
                console.log(tdata)
                requestify.request("https://maxifysales.com:5000/api/tf/callincoming", {
                    method: 'POST',
                    body: tdata,
                    dataType: 'form-url-encoded',
                }).then(function (response) {
                    console.log(JSON.stringify(response))
                    console.log("===incomingapi success==" + type)
                    var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "incoming", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                    db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                })
                    .fail(function (response) {
                        console.log(JSON.stringify(response))
                        console.log("==incomingapi error==" + type)
                        var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "incoming", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                        db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                    });
                console.log("=============================")
            } else {
                console.log("no manager wisdom")
            }
        }
        if (type == 'end') {
            //console.log(data)
            var managerid = data.accountid
            if (managerid == 1993) {
                if (data.CallType == 'incoming') {
                    var calltype = 'inbound'
                } else {
                    var calltype = 'outbound'
                }
                var tdata = { id: data.id, from: data.CallerNumber, tfuserid: data.AgentID, start_time: String(data.CallStartTime), end_time: String(data.CallEndTime), duration: data.CallDuration, hangupby: data.DisconnectedBy, callstatus: data.CallStatus, voiceuri: 'https://agent.cloudX.in/api/call/audio/' + data.RecPath, calltype: calltype }
                console.log(tdata)
                requestify.request("https://maxifysales.com:5000/api/tf/callend", {
                    method: 'POST',
                    body: tdata,
                    dataType: 'form-url-encoded',
                }).then(function (response) {
                    console.log(JSON.stringify(response))
                    console.log(response + "===api==" + type)
                    var ldata = { accountid: managerid, agent_id: data.AgentID, cdrid: data.id, event: "callend", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                    db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                })
                    .fail(function (response) {
                        console.log(JSON.stringify(response))
                        console.log("==api error==" + type)
                        var ldata = { accountid: managerid, agent_id: data.AgentID, cdrid: data.id, event: "callend", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                        db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                    });
                console.log("=============================")
            }
        }
        if (type == 'answer') {
            var agentid = data.userid
            var managerid = await this.GetManagerIdByAgent(agentid)
            if (managerid == 1993) {
                if (data.type == 'incoming') {
                    var calltype = 'inbound'
                } else {
                    var calltype = 'outbound'
                }
                var tdata = { id: data.id, from: data.from, tfuserid: agentid, status: 'Answer', calltype: calltype }
                console.log(tdata)
                requestify.request("https://maxifysales.com:5000/api/tf/callanswer", {
                    method: 'POST',
                    body: tdata,
                    dataType: 'form-url-encoded',
                }).then(function (response) {
                    console.log(response + "===api==" + type)
                    var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "answer", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                    db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                })
                    .fail(function (response) {
                        console.log(JSON.stringify(response))
                        console.log(response + "==api error==" + type)
                        var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "answer", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                        db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                    });
                console.log("=============================")
            }
        }
        if (type == 'dial') {
            var agentid = data.userid
            var managerid = await this.GetManagerIdByAgent(agentid)
            if (managerid == 1993) {
                if (data.type == 'incoming') {
                    var calltype = 'inbound'
                } else {
                    var calltype = 'outbound'
                }
                var tdata = { id: data.id, from: data.from, tfuserid: agentid, status: 'Ringing', calltype: calltype }
                console.log(tdata)
                requestify.request("https://maxifysales.com:5000/api/tf/calldial", {
                    method: 'POST',
                    body: tdata,
                    dataType: 'form-url-encoded',
                }).then(function (response) {
                    console.log(response + "===api==" + type)
                    var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "dial", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                    db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                })
                    .fail(function (response) {
                        console.log(response + "==api error==" + type)
                        var ldata = { accountid: managerid, agent_id: agentid, cdrid: data.id, event: "dial", req_data: JSON.stringify(tdata), res_data: JSON.stringify(response) }
                        db.query('INSERT INTO tf_thirdpartyapi_log SET ?', [ldata], function (err, results) { console.log(err) })
                    });
                console.log("=============================")
            } else {
                console.log("no manager")
            }
        }
    },
    CreateShortLink: async function (url) {
        return new Promise(function (resolve, reject) {
            requestify.request("https://slss.in/", {
                method: 'POST',
                body: { url: url },
                dataType: 'form-url-encoded',
            }).then(function (response) {
                var rs = response.getBody();

                var shorturl = rs.url
                resolve(shorturl);
            })
                .fail(function (response) {
                    //console.log(response + "==api error==" + type)
                    resolve();
                });
        })
    },
    CreditSms: function (msg) {

        return new Promise(function (resolve, reject) {
            msg = new String(msg);
            console.log(msg.length);
            var msgunicode = true;
            var msgcharcnt = msg.length;
            var msgcredit;
            var chartxt = "unicode characters.";
            if (msgcharcnt > 70 && msgcharcnt < 135) {
                msgcredit = 2
            }
            if (msgcharcnt > 134 && msgcharcnt < 202) {
                msgcredit = 3;
            }
            if (msgcharcnt > 201) {
                msgcredit = 4
            }
            if (msgcharcnt < 71) {
                msgcredit = 1;
            }
            resolve(msgcredit);
        })
    },
    UpdateCampaignNumbers: function (camid, acid, conid, segid) {
        db.query('UPDATE `tf_campaigns` SET cam_status = "1",cam_action = 1 where camid = ?', [camid]);
        return db.query('INSERT INTO `tf_campaigns_numbers` SET cam_id = ?,account_id = ?,cont_id = ?,segment_id = ?', [camid, acid, conid, segid]);
    },
    UpdateEmailCampaignNumbers: function (camid, acid, conid, segid) {
        //db.query('UPDATE `tf_email_campagin` SET cam_status = "0" where cid = ?', [camid]);
        return db.query('INSERT INTO `tf_email_camapgin_number` SET cid = ?,cont_id = ?', [camid, conid]);
    },
    calculateDateTimeDiff: function (date1, date2) {
        return new Promise(function (resolve, reject) {
            var dt1 = new Date(date1);
            var dt2 = new Date(date2);
            var diff = (dt2.getTime() - dt1.getTime()) / 1000;
            var date = new Date(0);
            date.setSeconds(diff); // specify value for SECONDS here
            var timeString = date.toISOString().substr(11, 8);
            resolve(timeString);
        })
    },

    calulatesectomin: function (time) {
        return new Promise(function (resolve, reject) {
            var hours = Math.floor(time / 3600);
            var timeString = new Date(time * 1000).toISOString().substr(11, 8)
            resolve(timeString);
        })
    },

    calulatemintosec: function (time) {
        return new Promise(function (resolve, reject) {
            var timeString = new Date((time * 60) * 1000).toISOString().substr(11, 8)
            resolve(timeString);
        })
    },

    calulatesectomin: function (time) {
        return new Promise(function (resolve, reject) {
            var hours = Math.floor(time / 3600);
            var timeString = new Date(time * 1000).toISOString().substr(11, 8)
            resolve(timeString);
        })
    },

    calculateidealtime: function (date1, date2, talktime, wraptime, breaktime) {
        return new Promise(function (resolve, reject) {
            if (breaktime == null) {
                breaktime = 0;
            }
            if (wraptime == null) {
                wraptime = 0;
            }
            if (talktime == null) {
                talktime = 0;
            }
            if (loggedtime == null) {
                loggedtime = 0;
            }
            var dt1 = new Date(date1);
            var dt2 = new Date(date2);
            var loggedtime = (dt2.getTime() - dt1.getTime()) / 1000;
            var idealtime = parseInt(loggedtime.toString()) - parseInt(talktime) - parseInt(wraptime) - parseInt(breaktime)
            var timeString = new Date(idealtime * 1000).toISOString().substr(11, 8)
            resolve(timeString);
        })
    },

    calculateperformancetime: function (date1, date2, talktime, wraptime, breaktime) {
        return new Promise(function (resolve, reject) {
            if (breaktime == null) {
                breaktime = 0;
            }

            if (wraptime == null) {
                wraptime = 0;
            }
            if (talktime == null) {
                talktime = 0;
            }
            if (loggedtime == null) {
                loggedtime = 0;
            }
            var dt1 = new Date(date1);
            var dt2 = new Date(date2);
            var loggedtime = (dt2.getTime() - dt1.getTime()) / 1000;
            var idealtime = (parseInt(talktime) + parseInt(wraptime) * 100) / parseInt(loggedtime.toString())
            //console.log(idealtime)
            var timeString = idealtime > 0 ? Math.round(idealtime) : 0
            resolve(timeString);
        })
    },

    getAudio: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT RecPath FROM `tf_cdr` WHERE id = ?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['RecPath']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },

    fileExist(filePath) {
        return new Promise((resolve, reject) => {
            fs.access(filePath, fs.F_OK, (err) => {
                if (err) {
                    console.error(err)
                    return reject(err);
                }
                //file exists
                resolve();
            })
        });
    },
    async calculatePerformance(dates, managerid) {
        return new Promise((resolve, reject) => {
            async.forEachOf(dates, async (log, callback) => {
                var curr_date = log;
                var pdata = { userid: managerid, startdate: curr_date, enddate: curr_date };

                await Report.cronagentperformancedata(pdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("MMM");
                    }
                });
            })
        });
    },
    async agentperformance(data) {
        return new Promise(async function (resolve, reject) {
            db.query('SELECT t.uid,a.account_id,a.account_name,t.date,(SELECT logout_time FROM `tf_loginactivity` WHERE uid=t.uid and DATE(date)=DATE(t.date) order by id desc limit 1) AS logout_time, (SELECT (SUM(TIME_TO_SEC(TIMEDIFF(b.stop_time, b.start_time)))) AS breaktime FROM `tf_breaktime` b WHERE account_id=t.uid AND DATE(start_time) = "' + data.startdate + '" ) as breaktime, (SELECT (SUM(AgentTalkTime)) FROM `tf_cdr` WHERE AgentID=a.account_id AND DATE(CallStartTime) = "' + data.startdate + '" ) AS talktime,(SELECT (COUNT(id)) FROM `tf_cdr` WHERE AgentID=a.account_id AND DATE(CallStartTime) >= "' + data.startdate + '" AND CallTypeID IN (0,1)) AS totalcalls,(SELECT WrapUpTime FROM `HuntGroup` WHERE GroupID IN (SELECT HuntGroupID FROM `HuntGroupDetail` WHERE `AgentID` = a.account_id ) limit 0,1) AS wrapuptime,(SELECT CloseTime FROM `HuntGroup` WHERE GroupID IN (SELECT HuntGroupID FROM `HuntGroupDetail` WHERE `AgentID` = a.account_id ) limit 0,1) AS closetime  FROM tf_loginactivity t INNER JOIN tf_account_table a ON a.account_id=t.uid WHERE DATE(date)= "' + data.startdate + '" AND t.uid IN (SELECT account_id FROM `tf_account_table` WHERE created_by = ' + data.userid + ') GROUP BY t.uid', function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    resolve(results[0]);
                }
            })
        });
    },
    updateAgentQueueTime: function (id, callback) {
        var m = new Date();
        var data = { lastdate: m }
        return db.query('SELECT * FROM tf_tmp_agent where aid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    row = results[0]
                    return db.query('Update tf_tmp_agent set ? where tid=?', [data, row.tid], callback);
                } else {
                    return db.query('SELECT * FROM tf_tmp_agent where aid=?', [id], callback);
                }
            }
        })
    },
    GenerateErpLead: function (data, managerid, agentid) {
        return new Promise(function (resolve, reject) {
            console.log(data)
            db.query('SELECT erp_email,erp_password FROM tf_account_table  WHERE account_id=?', [managerid], function (err, rows) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    console.log(rows)
                    if (rows.length > 0) {
                        resolve(0);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    async randomString(length) {
        return new Promise(async function (resolve, reject) {
            var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result = '';
            for (var i = 0; i < length; i++) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }

            resolve("TELE" + result);
        });
    },
    async randomNumber(length) {
        return new Promise(async function (resolve, reject) {
            var randomChars = '0123456789';
            var result = '';
            for (var i = 0; i < length; i++) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
            //var result = Math.floor(Math.random() * 1000000);
            resolve(result);
        });
    },
    getsaveitems: async function (resp) {
        return new Promise(function (resolve, reject) {
            ERP.getitem_check(resp.name, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(rows.length);
                    if (rows.length == 0) {
                        var fdata = { 'item_price_id': resp.name, 'product_name': resp.item_name, 'product_status': 1, 'account_id': 42, 'price': resp.price_list_rate, 'amount': resp.price_list_rate, 'actual_qty': 1, 'item_code': resp.item_code, 'item_name': resp.item_name, 'is_sync': 'yes' }
                        console.log(fdata)
                        Products.insertproduct(fdata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                resolve("'Product saved succesfully.'");
                            }

                        })
                    } else {
                        resolve("'Product alredy saved succesfully.'");
                    }
                }
            })
        })
    },
    EventLogout: async function (id) {
        return new Promise(function (resolve, reject) {
            requestify.request("https://auth.cloudX.in/api/signin/forcelogout", {
                method: 'POST',
                body: { user_id: id },
                dataType: 'form-url-encoded',
            }).then(function (response) {
                resolve();
            }).fail(function (response) {
                //console.log(response + "==api error==" + type)
                resolve();
            });
        })
    },
    SaveConfugurationMeta: async function (key, value, managerid) {
        key = key.toLowerCase().replace(/\s/g, '')
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_configuration  WHERE user_id=? and metakey = ?', [managerid, key], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        var data = { metavalue: value }
                        db.query('Update tf_configuration SET ? WHERE user_id=? and metakey = ?', [data, managerid, key], function (err, results) { })
                        resolve(results);
                    } else {
                        var data = { user_id: managerid, metakey: key, metavalue: value }
                        //console.log(data)
                        if (key != '') {
                            db.query('INSERT INTO tf_configuration SET ?', [data], function (err, results) { })
                        }
                        resolve(0);
                    }
                }
            })
        })
    },

    SaveCalenderConfugurationMeta: async function (key, value, managerid) {
        key = key.toLowerCase().replace(/\s/g, '')
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_configuration_calender  WHERE user_id=? and metakey = ?', [managerid, key], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        var data = { metavalue: value }
                        db.query('Update tf_configuration_calender SET ? WHERE user_id=? and metakey = ?', [data, managerid, key], function (err, results) { })
                        resolve(results);
                    } else {
                        var data = { user_id: managerid, metakey: key, metavalue: value }
                        //console.log(data)
                        if (key != '') {
                            db.query('INSERT INTO tf_configuration_calender SET ?', [data], function (err, results) { })
                        }
                        resolve(0);
                    }
                }
            })
        })
    },

    LeadSendEmail: async function (leadid, agentid, email_config, temp_id, from, to, customername = '') {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_emailtemplate  WHERE email_id=?', [temp_id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('error')
                } else {
                    if (results.length > 0) {
                        var emaildata = results[0]
                        var transporter = nodemailer.createTransport(email_config);
                        var subject = emaildata.email_subject //"Thank you for interest in our service."
                        var emailhtml = emaildata.email_html
                        emailhtml = emailhtml.replace("{name}", customername);
                        var toemail = to
                        var mailOptions = {
                            from: from,
                            to: toemail,
                            subject: subject,
                            html: emailhtml,
                            attachments: []
                        };
                        //console.log(mailOptions);
                        transporter.sendMail(mailOptions, function (error, res) {
                            if (error) {
                                console.log(error);
                                resolve('error')
                            } else {
                                console.log('Email sent=>');
                                var info = { User_id: emaildata.account_id, agent_id: agentid, email_to: toemail, lead_name: leadid, frommail: from, response: res.response, messageId: res.messageId }
                                //console.log(res);
                                //console.log(info);
                                db.query('Insert INTO tf_leads_email set ? ', [info], function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                        resolve('error')
                                    } else {
                                        console.log(rows);
                                        console.log('saved');
                                        resolve('sent')
                                    }
                                })

                            }
                        })
                    } else {
                        resolve('error')
                    }
                }
            })
        })
    },
    getAgentData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT mobile,account_name FROM `tf_account_table` WHERE `account_id` = ? and is_loggedin='yes'  and account_id NOT IN (SELECT agent_id from tf_agent_details WHERE agent_id= ? and agent_status IN (1,2,3)) and account_id NOT IN (SELECT account_id from tf_breaktime WHERE account_id=? and break_status=0) and account_id NOT IN (SELECT account_id from tf_callingpausetime WHERE account_id=? and status=0)", [id, id, id, id],
                async function (err, rows) {
                    //console.log(rows)                                             
                    if (rows === undefined) {
                        resolve([]);
                    } else {
                        resolve(rows);
                    }
                }
            )
        }
        )
    },
    getAgentVOIPStatus: async function (data, did, managerid) {
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
                    agdata = 'PJSIP/' + mobile + '@SM' + did
                    return agdata
                }
            }).catch(function (err) {
                //console.log(err)
                agdata = 'PJSIP/' + mobile + '@SM' + did
                return agdata;
            });
        })
        var avaichannels = await Promise.all(promises)
        avaichannels = avaichannels.filter(function (item) {
            return item !== false
        })
        console.log(avaichannels)
        return avaichannels
    },
    insertcdr: function (data, callback) {
        return db.query('INSERT INTO tf_cdr SET ?', [data], callback);
    },
    getSmsBalance: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT SMS_Pr_Balance FROM tf_account_balance WHERE Account_ID=?", [id],
                async function (err, rows) {
                    //console.log(rows)                                             
                    if (rows === undefined) {
                        resolve(0);
                    } else {
                        resolve(rows[0].SMS_Pr_Balance);
                    }
                }
            )
        }
        )
    },
    GetManagerAuthKey: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT AccessKey FROM tf_account_table  WHERE account_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].AccessKey);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },

    getLeadId: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT l_id FROM `tf_leads` WHERE name = "' + id + '"', function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['l_id']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },

    getLeadOwner: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT lead_owner FROM `tf_leads` WHERE name = "' + id + '"', function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['lead_owner']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },


    get_stage_staus: async function (cdrid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT status_master FROM tf_lead_stage_status where stage_id=?', [cdrid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results.map(ag => {
                            return ag.status_master
                        }));
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    get_stage_staus_erp: async function (uid, stageid, userrole, pagerecord = 10) {
        return new Promise(function (resolve, reject) {
            if (userrole == 1) {
                db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [uid], function (err, aresults) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        row = aresults[0]
                        if (row.show_no_id == 1) {
                            db.query('SELECT L.*,C.cont_id AS mobileno,A.show_no_id,A.whatsup_access,A.account_name as agentname,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "call" AND lead_id = L.l_id) as totalcall,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "sms" AND lead_id = L.l_id) as totalsms,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "email" AND lead_id = L.l_id) as totalemail,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "whatsapp" AND lead_id = L.l_id) as totalwhatsapp FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id LEFT JOIN tf_contacts C ON C.lead_id=L.l_id WHERE L.agent_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted="no" order by modified ASC limit ' + pagerecord, [uid, stageid], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                    resolve([]);
                                } else {
                                    if (results.length > 0) {
                                        resolve(results);
                                    } else {
                                        resolve([]);
                                    }
                                }
                            })
                        } else {
                            db.query('SELECT L.*,L.mobile_no as mobileno,A.show_no_id,A.whatsup_access,A.account_name as agentname,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "call" AND lead_id = L.l_id) as totalcall,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "sms" AND lead_id = L.l_id) as totalsms,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "email" AND lead_id = L.l_id) as totalemail,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "whatsapp" AND lead_id = L.l_id) as totalwhatsapp FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes"  and L.is_deleted="no" order by modified ASC limit ' + pagerecord, [uid, stageid], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                    resolve([]);
                                } else {
                                    if (results.length > 0) {
                                        resolve(results);
                                    } else {
                                        resolve([]);
                                    }
                                }
                            })
                        }
                    }
                })

            } else {
                db.query('SELECT L.*,L.mobile_no as mobileno,A.show_no_id,A.whatsup_access,A.account_name as agentname,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "call" AND lead_id = L.l_id) as totalcall,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "sms" AND lead_id = L.l_id) as totalsms,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "email" AND lead_id = L.l_id) as totalemail,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE action_type = "whatsapp" AND lead_id = L.l_id) as totalwhatsapp FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE L.User_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted="no" order by modified ASC limit ' + pagerecord, [uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                        resolve([]);
                    } else {
                        if (results.length > 0) {
                            resolve(results);
                        } else {
                            resolve([]);
                        }
                    }
                })
            }
        })
    },
    get_sup_stage_staus_erp: async function (uid, stageid, userrole, pagerecord = 10) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [uid], function (err, aresults) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = aresults[0]
                    if (row.show_no_id == 1) {
                        db.query('SELECT L.*,C.cont_id AS mobileno,A.show_no_id,A.whatsup_access,A.account_name as agentname,(SELECT COUNT(CD.id) FROM `tf_contacts` C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id = L.l_id) as totalcall FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S.AgentID=L.agent_id LEFT JOIN tf_account_table A ON L.agent_id=A.account_id LEFT JOIN tf_contacts C ON C.lead_id=L.l_id WHERE S.supervisor_account_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" AND L.is_deleted="no" order by modified ASC limit ' + pagerecord, [uid, stageid], function (err, results) {
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
                    } else {
                        db.query('SELECT L.*,L.mobile_no as mobileno,A.show_no_id,A.whatsup_access,A.account_name as agentname,(SELECT COUNT(CD.id) FROM `tf_contacts` C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id = L.l_id) as totalcall FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S.AgentID=L.agent_id LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE S.supervisor_account_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" AND L.is_deleted="no" order by modified ASC limit ' + pagerecord, [uid, stageid], function (err, results) {
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
                    }
                }
            })


        })
    },

    get_stage_staus_erp_total: async function (uid, stageid, userrole) {
        return new Promise(function (resolve, reject) {
            if (userrole == 1) {
                db.query('SELECT count(l_id) as totallead FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE L.agent_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" AND L.is_deleted="no" order by l_id DESC limit 10', [uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]['totallead']);
                        } else {
                            resolve(0);
                        }
                    }
                })
            } else {
                db.query('SELECT count(l_id) as totallead FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE L.User_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" AND L.is_deleted="no" order by l_id DESC limit 10', [uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]['totallead']);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }
        })
    },
    get_sup_stage_staus_erp_total: async function (uid, stageid, userrole) {
        return new Promise(function (resolve, reject) {

            db.query('SELECT count(l_id) as totallead FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S.AgentID=L.agent_id LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE S.supervisor_account_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and is_sync = "yes" AND L.is_deleted="no" order by l_id DESC limit 10', [uid, stageid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['totallead']);
                    } else {
                        resolve(0);
                    }
                }
            })

        })
    },

    get_stage_staus_erp_null: async function (uid, stageid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) AND agent_id is null and is_sync = "yes" order by l_id DESC', [uid, stageid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    opportunity_amount_total: async function (uid, stageid, userrole) {
        return new Promise(function (resolve, reject) {
            if (userrole == 1) {
                db.query('SELECT SUM(opportunity_amount) AS value FROM tf_leads WHERE agent_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) AND is_deleted="no"', [uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        //console.log(results[0]['value'])
                        if (results[0]['value'] != null) {
                            resolve(results[0]['value']);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }
            else {
                db.query('SELECT SUM(opportunity_amount) AS value FROM tf_leads WHERE User_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) AND is_deleted="no"', [uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        //console.log(results[0]['value'])
                        if (results[0]['value'] != null) {
                            resolve(results[0]['value']);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }

        })
    },
    sup_opportunity_amount_total: async function (uid, stageid, userrole) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT SUM(opportunity_amount) AS value FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S. AgentID=L.agent_id WHERE S.supervisor_account_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) AND L.is_deleted="no"', [uid, stageid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    //console.log(results[0]['value'])
                    if (results[0]['value'] != null) {
                        resolve(results[0]['value']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },

    opportunity_amount_total_agent_null: async function (uid, stageid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT SUM(opportunity_amount) AS value FROM tf_leads WHERE User_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) AND agent_id is null', [uid, stageid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    console.log(results[0]['value'])
                    if (results[0]['value'] != null) {
                        resolve(results[0]['value']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    get_stage_staus_daily: async function (date, uid, stageid, userrole) {
        return new Promise(function (resolve, reject) {
            if (userrole == 1) {
                db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE DATE(L.creation) =? AND L.agent_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" AND L.is_deleted="no" order by l_id DESC', [date, uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        console.log(results.length)
                        if (results.length > 0) {
                            resolve(results.length);
                        } else {
                            resolve(0);
                        }
                    }
                })
            } else {
                db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE DATE(L.creation) =? AND L.User_id= ? and L.status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted="no" order by L.l_id DESC', [date, uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        console.log(results.length)
                        if (results.length > 0) {
                            resolve(results.length);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }

        })
    },
    get_stage_staus_date_format: async function (date, end, uid, stageid, userrole, data) {
        return new Promise(function (resolve, reject) {
            if (userrole == 1) {
                var where = "";
                if (date ) {
                    where += " and DATE(L.creation)>='" + date + "'";
                }
                if (end ) {
                    where += " and DATE(L.creation)<='" + end + "'";
                }
                if (data.modifiedstartdate != '1970-01-01' && data.modifiedstartdate != null) {
                    where += " and DATE(L.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01' && data.modifiedenddate != null) {
                    where += " and DATE(L.modified)<='" + data.modifiedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and L.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and L.lead_name like '" + data.lead_name + "'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and L.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and L.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and L.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE  agent_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted = "no" ' + where + ' order by l_id DESC', [ uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        console.log(results.length)
                        if (results.length > 0) {
                            resolve(results.length);
                        } else {
                            resolve(0);
                        }
                    }
                })

            } else {
                var where = "";

                if (data.agent != '') {
                    where += " and L.agent_id IN (" + data.agent + ")";
                }

                if (data.modifiedstartdate != '1970-01-01' && data.modifiedstartdate != null) {
                    where += " and DATE(L.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01' && data.modifiedenddate != null) {
                    where += " and DATE(L.modified)<='" + data.modifiedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and L.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and L.lead_name like '" + data.lead_name + "'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and L.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and L.source IN (" + data.source + ")";
                }

                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and L.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and L.tag_id IN (" + data.tag_id + ")";
                }

                db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE  DATE(creation) >=? AND DATE(creation) <=? AND User_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted = "no" ' + where + ' order by l_id DESC', [date, end, uid, stageid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        console.log(results.length)
                        if (results.length > 0) {
                            resolve(results.length);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }

        })
    },
    getLeadTimeline: async function (lid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT CD.* FROM tf_contacts C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id = ? ORDER BY CD.id ASC', [lid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    reject()
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
    GetUsername: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT account_name FROM tf_account_table  WHERE account_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].account_name);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    GetManagerBalance: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_account_balance  WHERE Account_ID=?', [id], function (err, results) {
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
    GetManagerOBDUsages: async function (id, date) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT SUM(C.CallPluse) as total,DATE(C.CallStartTime) as date FROM `tf_campaigns_numbers` N INNER JOIN tf_campaigns CA ON N.cam_id=CA.camid INNER JOIN tf_cdr C ON N.numid=C.auto_numid WHERE N.account_id=? AND CA.cam_method=1 AND date>=?', [id, date], function (err, results) {
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
    best_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackagedetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    sms_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpacksmsdetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    mail_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackmaildetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    meet_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackmeetdetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    digital_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackdigitaldetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    digitalads_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackdigitaladsdetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    tollfree_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpacktollfreedetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    obd_package: function (data) {
        return new Promise(function (resolve, reject) {
            Admin.getpackobddetail(data, async function (err, pdata) {
                if (err) {
                    resolve(0)
                }
                else {
                    resolve(pdata[0])
                }
            })
        })
    },
    GetAgentLMSCampaign: async function (agentid, accountid) {
        return new Promise(function (resolve, reject) {
            console.log(accountid + '----' + agentid)
            db.query('SELECT camid FROM `tf_campaigns` WHERE `account_id` = ? AND `lms_agentid` = ?', [accountid, agentid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    console.log(results)
                    if (results.length > 0) {
                        resolve(results[0]['camid']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    CreateAgentLMSCampaign: async function (agentid, accountid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ?', [agentid], function (err, rs1) {
                if (rs1.length > 0) {
                    var campaigndata = { cam_name: "LMS Lead - " + rs1[0]['account_name'], account_id: accountid, create_date: new Date(), cam_type: 0, cam_method: 0, dialer_type: '0', cam_status: '0', cam_action: 0, retry: 'no', maxretry: 3, retrytime: null, lms_agentid: agentid }
                    db.query('INSERT INTO tf_campaigns set ?', [campaigndata], function (err, rs2) {
                        if (err) {
                            resolve(0);
                        } else {
                            var camid = rs2.insertId
                            var adata = { cam_id: camid, agent_id: agentid, account_id: accountid }
                            db.query('Insert INTO tf_campaigns_agent set ?', [adata], function (err, rs1) { })
                            if (rs1[0]['did_alloted'] != '') {
                                var data = { cam_id: camid, did: rs1[0]['did_alloted'], account_id: accountid }
                                db.query('Insert INTO tf_campaigns_did set ?', [data], function (err, rs1) { })
                            } else {
                                db.query('SELECT did FROM `tf_did_numbers` WHERE account_id = ?  AND active = 1 AND Type=9', [accountid], function (err, rs3) {
                                    if (rs3.length > 0) {
                                        var did = rs3[0].did
                                        var data = { cam_id: camid, did: did, account_id: accountid }
                                        db.query('Insert INTO tf_campaigns_did set ?', [data], function (err, rs1) { })
                                    }
                                })
                            }
                            resolve(camid);
                        }
                    })
                } else {
                    resolve(0);
                }
            })
        })
    },
    GetAPIData: async function (cdrid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_manager_api_data  WHERE cdr_id=?', [cdrid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    if (results.length > 0) {
                        var apidArr = results[0]
                        var apidata = JSON.parse(apidArr.data)
                        console.log(apidata)
                        var rs = []
                        if (apidata != null) {
                            Object.keys(apidata).forEach(function (key) {
                                console.log(key, apidata[key]);
                                rs.push({ meta_key: key, meta_value: apidata[key] })
                            });
                        }
                        resolve(rs);
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    getloggedatabyid: function (filter, agentid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT (SELECT logout_time FROM `tf_loginactivity` WHERE uid=' + agentid + ' and DATE(date)=DATE(t.date) ORDER BY id DESC limit 1) AS logout_time,date,(SELECT CloseTime FROM `HuntGroup` WHERE GroupID IN (SELECT HuntGroupID FROM `HuntGroupDetail` WHERE `AgentID` = ' + agentid + ' ) limit 0,1) AS closetime FROM `tf_loginactivity` t WHERE t.uid = ' + agentid + ' AND (DATE(t.date) BETWEEN "' + filter.startdate + '" and "' + filter.enddate + '") GROUP BY DATE(t.date)', [], function (err, results) {
                if (err) {
                    resolve([]);
                } else {
                    var loggedtime = 0;
                    if (results.length > 0) {
                        for (let index = 0; index < results.length; index++) {
                            const element = results[index];
                            //console.log(index);
                            if (element.logout_time == null) {
                                //console.log(element.date)
                                var date = new Date();
                                if (element.date.getDate() + element.date.getMonth() + element.date.getFullYear() == date.getDate() + date.getMonth() + date.getFullYear()) {
                                    element.logout_time = new Date()
                                } else {
                                    var closetime = element.closetime
                                    var month = element.date.getMonth() + 1
                                    var closedate = element.date.getFullYear() + '/' + month + '/' + element.date.getDate()
                                    var timestamp = Date.parse(closedate + " " + closetime);
                                    var momentDate = new Date(timestamp)
                                    element.logout_time = momentDate
                                    //console.log(element.logout_time)
                                }
                            }
                            var dt1 = new Date(element.date);
                            var dt2 = new Date(element.logout_time);
                            var difftime = (dt2.getTime() - dt1.getTime()) / 1000;
                            loggedtime = loggedtime + difftime;
                            //console.log(element.logout_time+"::"+element.date+"::"+agentid);
                        }
                        //resolve(loggedtime+"::"+agentid);
                    }
                    resolve(loggedtime);

                }



            })
        })
    },
    GetManagerSettingById: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT setting_name,setting_value FROM tf_manager_settings  WHERE account_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    getEmailTemplateAttachment: async function (tempid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT attach_file FROM tf_emailtemplate  WHERE email_id=?', [tempid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].attach_file);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    GetEmailServerLastData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM `tf_manager_email_server` WHERE account_id = ' + id + ' order by server_id desc', function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetAgentEmailServerData: async function (agentid, userid) {
        return new Promise(function (resolve, reject) {
            console.log('SELECT M.* FROM `tf_account_table` A INNER JOIN tf_manager_email_server M ON M.server_id=A.emailserver_alloted  WHERE A.account_id = ' + agentid);
            db.query('SELECT M.* FROM `tf_account_table` A INNER JOIN tf_manager_email_server M ON M.server_id=A.emailserver_alloted  WHERE A.account_id = ' + agentid, function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        console.log('SELECT * FROM `tf_manager_email_server` WHERE account_id = ' + userid + ' order by server_id desc');
                        db.query('SELECT * FROM `tf_manager_email_server` WHERE account_id = ' + userid + ' order by server_id desc', function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                                resolve([]);
                            } else {
                                if (results.length > 0) {
                                    resolve(results);
                                } else {
                                    resolve([]);
                                }
                            }
                        })
                    }
                }
            })

        })
    },

    async getleadetail(id) {
        return new Promise(async function (resolve, reject) {
            db.query('SELECT * FROM tf_leads WHERE l_id = ?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    resolve(results);
                }
            })
        });
    },
    async getaccesstoken(id) {
        return new Promise(function (resolve, reject) {
            Zoho.getaccesscode(id, function (err, rows) {
                if (rows.length > 0) {
                    var adata = rows[0]
                    var lastdate = adata.date
                    var accountserver = adata.accountsserver
                    var apidomain = adata.api_domain
                    var nowdate = new Date()
                    var lastcodetime = moment(lastdate, 'YYYY-MM-DD HH:mm:ss')
                    var nowtime = moment(nowdate, 'YYYY-MM-DD HH:mm:ss')
                    var diff = nowtime.diff(lastcodetime, 'minutes')
                    var token = adata.access_token
                    console.log(diff)
                    if (diff > 60) {
                        var url = accountserver + '/oauth/v2/token'
                        var zdata = { refresh_token: adata.refresh_token, client_id: zohoclientid, client_secret: zohoclientsecret, grant_type: "refresh_token" }
                        requestify.request(url, {
                            method: 'POST',
                            body: zdata,
                            dataType: 'form-url-encoded',
                        }).then(function (response) {
                            var result = JSON.parse(response.body)
                            console.log(result)
                            var token = result.access_token
                            if (token != '' && token != undefined) {
                                Zoho.updateaccesstoken({ access_token: token, date: new Date() }, id)
                            }
                            resolve({ token, apidomain });
                        })
                            .fail(function (response) {
                                console.log(response)
                                resolve({});
                            });
                    } else {
                        resolve({ token, apidomain });
                    }
                } else {
                    resolve({});
                }
            })
        })
    },
    async PushZohoLead(lid, accountid) {
        var that = this
        db.query('SELECT * FROM tf_zoho_access_code WHERE accountid = ? and zoho_integration="enable"', [accountid], async function (err, results) {
            if (err) {
                console.log(err)
            } else {
                if (results.length > 0) {
                    var ldata = await that.getleadetail(lid)
                    var accessArr = await that.getaccesstoken(accountid)
                    console.log(accessArr)
                    console.log(ldata)
                    if (accessArr.token && ldata.length > 0) {
                        var data = ldata[0]
                        var access_token = accessArr.token
                        var mobile = data.mobile_no.substr(-10)
                        console.log(data.lead_name.split(' '))
                        var leadname = data.lead_name.split(' ')
                        var fname = leadname[0]
                        var lname = leadname[1] ? leadname[1] : leadname[0]
                        if (data.zohoid != '' && data.zohoid != undefined) {
                            var url = accessArr.apidomain + '/crm/v2/Leads/' + data.zohoid
                            //var zdata = {Lead_Status:data.status}
                            var zdata =
                            {
                                "Lead_Status": data.status,
                                "Phone": data.mobile_no,
                                "Mobile": mobile,
                                "First_Name": fname,
                                "Last_Name": lname,
                                "Full_Name": data.lead_name,
                                "City": data.city,
                                "Email": data.email_id,
                                "Lead_Source": data.source,
                                "Ads_Name": data.ads_name,
                                "Whatsapp_Number": data.whatsapp_number
                            }
                            var method = 'PUT'
                        } else {
                            var url = accessArr.apidomain + '/crm/v2/Leads'
                            if (lname == '') {
                                lname = 'Noname'
                            }
                            var zdata =
                            {
                                "Lead_Status": data.status,
                                "Phone": data.mobile_no,
                                "Mobile": mobile,
                                "First_Name": fname,
                                "Last_Name": lname,
                                "Full_Name": data.lead_name,
                                "City": data.city,
                                "Email": data.email_id,
                                "Lead_Source": data.source,
                                "ad_id": data.ads_id,
                                "ad_name": data.ads_name,
                                "Ads_Name": data.ads_name,
                                "Whatsapp_Number": data.whatsapp_number
                            }
                            var method = 'POST'
                        }
                        console.log(url)
                        console.log(zdata)
                        let requestBody = {}
                        let recordArray = []
                        var zohoid = 0
                        recordArray.push(zdata)
                        requestBody['data'] = recordArray
                        console.log(JSON.stringify(requestBody))
                        requestify.request(url, {
                            method: method,
                            body: requestBody,
                            encoding: "utf8",
                            headers: {
                                "Authorization": "Bearer " + access_token, // token
                            },
                            throwHttpErrors: false
                        }).then(function (response) {
                            console.log(response.body)
                            var zdata = JSON.parse(response.body)
                            console.log(zdata['data'][0]['details'])
                            zohoid = zdata['data'][0]['details']['id']
                            if (zdata['data'][0]['status'] == 'success') {
                                console.log(zohoid)
                                db.query('UPDATE `tf_leads` SET zohoid = ? where l_id = ?', [zohoid, lid]);
                            }
                            //console.log(JSON.parse(response))
                        })
                            .fail(function (response) {
                                console.log(response.body)
                            });
                    }
                }
            }
        })
    },
    getOnlyAgentVOIP: async function (data, did, managerid) {
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
    getLeadComment: async function (lid) {
        return new Promise(function (resolve, reject) {
            //console.log('SELECT comment FROM tf_lead_comment WHERE lead_id='+lid+' order by comment_id desc');
            db.query('SELECT comment FROM tf_lead_comment WHERE lead_id=' + lid + ' order by comment_id desc', [lid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    reject()
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
    GetDialerCallbackCount: async function (number, mdate) {
        return new Promise(function (resolve, reject) {
            //console.log('SELECT COUNT(id) as callbackcount FROM `tf_cdr` C LEFT JOIN tf_agent_missedcall m ON m.cdrid=C.id WHERE m.cdrid=? AND (`CallerNumber`=CONCAT("0",RIGHT(CallerNumber,10)))  and C.CallStartTime>m.calldate   and CallTypeID=1');
            if (mdate) {
                var startdateObj = new Date(mdate);
                var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) + ' ' + ('0' + startdateObj.getHours()).slice(-2) + ":" + ('0' + startdateObj.getMinutes()).slice(-2) + ":" + ('0' + startdateObj.getSeconds()).slice(-2);
                //console.log('SELECT COUNT(id) as count FROM `tf_cdr` WHERE CallerNumber=CONCAT("0",RIGHT(' + number + ',10))  and CallStartTime>"' + startdate + '" AND CallTypeID=1');
                db.query('SELECT COUNT(id) as count FROM `tf_cdr` WHERE (CallerNumber=CONCAT("0",RIGHT(' + number + ',10))  OR CallerNumber=RIGHT(' + number + ',10)) and CallStartTime>"' + startdate + '" AND CallTypeID=1', [], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0].count);
                        } else {
                            resolve(0);
                        }
                    }
                })
            } else {
                resolve(0);
            }
        })
    },
    GetIncomingCallbackCount: async function (number, mdate) {
        return new Promise(function (resolve, reject) {
            if (mdate) {
                var dateObj1 = new Date(mdate);
                var startdate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2)
                db.query('SELECT COUNT(id) as count FROM `tf_cdr` WHERE (CallerNumber=CONCAT("91",RIGHT(' + number + ',10)) OR CallerNumber=' + number + ')  and CallStartTime>="' + startdate + ' 00:00:00" and CallTypeID=2', [], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0].count);
                        } else {
                            resolve(0);
                        }
                    }
                })
            } else {
                resolve(0);
            }
        })
    },
    GetOutgoingCallbackCount: async function (number, mdate) {
        return new Promise(function (resolve, reject) {
            if (mdate) {
                var startdateObj = new Date(mdate);
                var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) + ' ' + ('0' + startdateObj.getHours()).slice(-2) + ":" + ('0' + startdateObj.getMinutes()).slice(-2) + ":" + ('0' + startdateObj.getSeconds()).slice(-2);
                // console.log('SELECT COUNT(id) as count FROM `tf_cdr` WHERE CallerNumber=CONCAT("0",RIGHT(' + number + ',10))  and CallStartTime>"' + startdate + '" AND CallTypeID=0');
                db.query('SELECT COUNT(id) as count FROM `tf_cdr` WHERE (CallerNumber=CONCAT("0",RIGHT(' + number + ',10))  OR CallerNumber=RIGHT(' + number + ',10)) and CallStartTime>"' + startdate + '" AND CallTypeID=0', [], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0].count);
                        } else {
                            resolve(0);
                        }
                    }
                })
            } else {
                resolve(0);
            }
        })
    },
    GetVoipDomain: async function (agentid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT erp_userid FROM tf_account_table  WHERE account_id IN (SELECT created_by FROM tf_account_table  WHERE account_id=?)', [agentid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['erp_userid']);
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    get_sup_stage_staus_date_format: async function (date, end, uid, stageid, userrole, data) {
        return new Promise(function (resolve, reject) {
            var where = "";
            if (data.agent.length>0) {
                where += " and L.agent_id IN (" + data.agent + ")";
            }

            if (data.modifiedstartdate != '1970-01-01' && data.modifiedstartdate != null) {
                where += " and DATE(L.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01' && data.modifiedenddate != null) {
                where += " and DATE(L.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and L.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and L.lead_name like '%" + data.lead_name + "%'";
            }

            if (data.ads_name != '' && data.ads_name != null) {
                where += " and L.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and L.source IN (" + data.source + ")";
            }
            if (data.mobileno != '' && data.mobileno != null) {
                where += " and L.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and L.tag_id IN (" + data.tag_id + ")";
            }
            //console.log('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S.AgentID=L.agent_id LEFT JOIN tf_account_table A ON S.AgentID=A.account_id WHERE  DATE(L.creation) >=? AND DATE(L.creation) <=? AND S.supervisor_account_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and is_sync = "yes" '+where+' order by l_id DESC');
            db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_supervisor_agents S ON S.AgentID=L.agent_id LEFT JOIN tf_account_table A ON S.AgentID=A.account_id WHERE  DATE(L.creation) >=? AND DATE(L.creation) <=? AND S.supervisor_account_id= ? and status in (SELECT status_master FROM tf_lead_stage_status where stage_id=?) and L.is_sync = "yes" and L.is_deleted = "no" ' + where + ' order by l_id DESC', [date, end, uid, stageid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    console.log(results.length)
                    if (results.length > 0) {
                        resolve(results.length);
                    } else {
                        resolve(0);
                    }
                }
            })


        })
    },
    already_channel: async function (page_id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT COUNT(page_id) as pg FROM td_channels WHERE page_id = ?', [page_id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    resolve(results[0].pg);
                }
            })
        })
    },
    Getassign_group_id: async function (account_name, page_id, access_media) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM `td_channels` WHERE `username` = ? AND `page_id` = ? AND `access_media` = ? ORDER BY `channel_id` DESC', [account_name, page_id, access_media], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].assign_group);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    GetManagerIdByAgent_name: async function (agentid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT account_name FROM tf_account_table  WHERE account_id=?', [agentid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].account_name);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
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

    async AddWhatsappChat(data, user_id, role) {
        console.log('AddWhatsappChat', data);
        var that = this
        db.query('SELECT * FROM `td_chat` WHERE sender_id = ? and (user_id=? or agent_id=?)', [data.mobile, data.account_id, data.account_id], async function (error, results) {
            var save_data = {}
            save_data.user_id = data.account_id
            save_data.sender_id = data.mobile
            save_data.channel_type = 'whatsapp'
            save_data.lead_id = data.lead_id
            if (results.length == 0) {
                chat_id = await that.addChat(save_data, user_id, role)
                console.log('inser_idchat_id', chat_id);
            } else {
                chat_id = results[0].chat_id
            }

            var chat_details = {}
            chat_details.chat_id = chat_id
            chat_details.chat_text = data.message
            if (validUrl.isUri(data.message)) {
                var result = Path.extname(Url.parse(data.message).pathname);
                if (result == '.png' || result == '.jpg' || result == '.jpeg' || result == '.webp') {
                    chat_details.option_type = "image";
                    chat_details.attachement = data.message;
                    chat_details.chat_text = '';
                }
                else if (result == '.ogg') {
                    chat_details.option_type = "audio";
                    chat_details.attachement = data.message;
                    chat_details.chat_text = '';
                }
                else if (result == '.pdf') {
                    chat_details.option_type = "file";
                    chat_details.attachement = data.message;
                    chat_details.chat_text = '';
                }
            }
            db.query('INSERT INTO td_chat_details SET ?', [chat_details], async function (error, results) {
                console.log('chat_id', results.insertId);
            })

        })
    },

    AddWhatsappChatWebhook: async function (data, type) {
        console.log('AddWhatsappChatWebhook', data);
        console.log('AddWhatsappChatWebhook', data.account_id);
        var that = this
        if (data.event == "INBOX") {
            var mobile = data.from.substr(-10)
            db.query('SELECT * FROM `td_chat` WHERE sender_id = ? and (user_id=? or agent_id=?)', [mobile, data.account_id, data.account_id], async function (error, results) {
                var save_data = {}
                save_data.user_id = data.account_id
                save_data.sender_id = mobile
                save_data.channel_type = 'whatsapp'
                console.log(error)
                if (results.length == 0) {
                    chat_id = await that.addChat(save_data, '', '')
                } else {
                    chat_id = results[0].chat_id
                }

                var chat_details = {}
                chat_details.chat_id = chat_id
                chat_details.chat_text = data.text
                chat_details.is_echo = 1
                if (validUrl.isUri(data.text)) {

                    var result = Path.extname(Url.parse(data.text).pathname);
                    if (result == '.png' || result == '.jpg' || result == '.jpeg' || result == '.webp') {
                        chat_details.option_type = "image";
                        chat_details.attachement = data.text;
                        chat_details.chat_text = '';
                    }
                    else if (result == '.ogg') {
                        chat_details.option_type = "audio";
                        chat_details.attachement = data.text;
                        chat_details.chat_text = '';
                    }
                    else if (result == '.pdf') {
                        chat_details.option_type = "file";
                        chat_details.attachement = data.text;
                        chat_details.chat_text = '';
                    }
                }
                db.query('INSERT INTO td_chat_details SET ?', [chat_details], async function (error, results) {
                    console.log('chat_id', results.insertId);
                })

                Digital.get_message_to_user_username(chat_id, async function (err, user1) {
                    console.log('get_message_to_user_username', user1);
                    if (err) {
                        console.log("Message Not Save:", err);
                    } else {
                        console.log('Message Username')
                        if (user1.length > 0) {
                            var user_
                            var manager_id
                            if (user1[0].agent_id == null) {
                                user_ = user1[0].user_id
                                manager_id = user1[0].user_id
                            } else {
                                user_ = user1[0].agent_id
                                manager_id = user1[0].user_id
                            }
                            console.log('user_', user_);
                            var socketendpoint = await helper.GetSocketDomain(manager_id, 2)
                            var options = {
                                'method': 'POST',
                                'url': "https://" + socketendpoint + '/socketapi/chatincoming',
                                'headers': {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                form: {
                                    'userid': user_,
                                    'manager_id': manager_id,
                                    'senderid': user1[0].sender_id,
                                    'sendername': user1[0].first_name,
                                    'chatid': chat_id,
                                    'chatdata': JSON.stringify(user1)
                                }
                            };
                            request(options, function (error, response) {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log(response.body)
                                }
                            });
                            //Send Firebase
                            helper.SendFirebaseChatNotification(user_, 'New whatsapp message', data.text,chat_id)
                        }
                    }
                })

            })
        }
    },
    addChat: async function (save_data, login_agent_id, role) {
        if (role == 1) {
            var agentid = login_agent_id
        } else {
            var agentid = await this.agentAssignWhatschat(save_data)
        }

        save_data.agent_id = agentid
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO td_chat SET ?', [save_data], function (error, rows) {
                if (error) {
                    console.log("[mysql error]", error);
                    resolve(0)
                } else {
                    resolve(rows.insertId);
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
    ChatUpdateInLive: async function (data) {
        return new Promise(function (resolve, reject) {
            db.query('Update `td_chat` set live_status=0,last_update=now() WHERE sender_id = ? and  (user_id=? or agent_id=?)', [data.mobile, data.account_id, data.account_id], async function (error, rows) {
                if (error) {
                    console.log("[mysql error]", error);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    GetManagerSettingValueByName: async function (id, name) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT setting_value FROM tf_manager_settings  WHERE account_id=? and setting_name = ?', [id, name], function (err, results) {
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
    GetMessageAgent: async function (gid, user) {
        console.log('GetMessageAgent', gid);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM HuntGroupDetail  WHERE HuntGroupID=?', [gid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    console.log('results_Hunt', results);
                    if (results.length > 0) {
                        var agentlead = []
                        var cnt = 0
                        results.forEach(element => {
                            db.query('SELECT * FROM td_chat WHERE agent_id=? and user_id = ? ORDER BY chat_id DESC LIMIT 1', [element.AgentID, user], function (err, rows) {
                                cnt = cnt + 1
                                if (rows.length > 0) {
                                    var row = rows[0]
                                    agentlead.push({ id: element.AgentID, date: row.date_time })
                                    console.log('agentlead', agentlead)
                                    //console.log(cnt+'=='+results.length)
                                    if (cnt == results.length) {
                                        agentlead.sort(function (a, b) {
                                            var c = new Date(a.date).getTime();
                                            var d = new Date(b.date).getTime();
                                            return c > d ? 1 : -1;
                                        });
                                        console.log('lead', agentlead)
                                        resolve(agentlead[0].id);
                                    }
                                } else {
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
    agentAssignWhatschat: async function (data) {
        console.log('agentAssignWhatschat', data);
        var that = this
        return new Promise(function (resolve, reject) {
            db.query(' SELECT * FROM `tf_manager_settings` WHERE `account_id` = ? AND `setting_name`="agent_incoming_agent_group"', [data.user_id], async function (error, results) {
                if (error) {
                    console.log("[mysql error]", error);
                } else {
                    console.log('inn', results);
                    if (results.length > 0) {
                        var manager_id = results[0].setting_value;
                        var agentid = await that.GetMessageAgent(manager_id, data.account_id);
                        console.log('agentid', agentid);
                        resolve(agentid);
                    }
                }
            })

        })
    },
    getChannelToken: async function (data) {
        ;
        return new Promise(function (resolve, reject) {
            db.query(' SELECT * FROM `td_chat` WHERE `sender_id` = ? AND `user_id`=?', [data.sender_id, data.user_id], async function (error, results) {
                if (error) {
                    console.log("[mysql error]", error);
                } else {
                    //console.log('getChannelToken',results);

                    if (results.length > 0) {
                        db.query(' SELECT accessToken FROM `td_channels` WHERE `page_id` = ? AND `username`=?', [results[0].channel_id, data.user_id], async function (error, results) {
                            if (error) {
                                console.log("[mysql error]", error);
                            } else {
                                if (results.length > 0) {
                                    resolve(results[0].accessToken);
                                }
                                else {
                                    resolve('token not found');
                                }
                            }
                        })
                    } else {
                        resolve('channel not found');
                    }

                }
            })

        })
    },
    voiceCampaignCaller: async function (data) {
        console.log('voiceCampaignCaller', data);
    },
    fb_ads_first_insights: async function (data) {
        console.log('data', data);
        return new Promise(function (resolve, reject) {
            let campaignid = data.ads_id
            let customerid = data.username
            let page_id = data.page_id
            let access_fbtoken = data.accessToken
            let timex = Math.floor(Date.now() / 1000)
            let data_change = {}
            urllib.request(process.env.FBGRAPHAPIVERSION12 + campaignid + '/insights?fields{reach,spend,cost_per_conversion,cost_per_action_type,social_spend,inline_post_engagement,cpm,cpc,frequency,clicks,unique_ctr,inline_link_clicks,impressions,cost_per_inline_link_click}&access_token=' + access_fbtoken, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    console.log(error);
                }
                else {

                    var result = JSON.parse(resp);
                    console.log('result', result)
                    if (result.error) {
                        data_change.last_sync_insights = new Date()
                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                            if (err) {
                                resolve('ERROR')
                            }
                            else {
                                console.log('ADS ERROR successfully updated!');
                                resolve('SAVE')
                            }
                        })
                    }
                    else if (result['data'][0]) {
                        let insights = result['data'][0]
                        let data_list = {}
                        data_list.reach = insights['reach'];
                        data_list.spend = insights.spend;
                        data_list.cost_per_action_type = JSON.stringify(insights.cost_per_action_type);
                        data_list.social_spend = insights.social_spend;
                        data_list.inline_post_engagement = insights.inline_post_engagement;
                        data_list.cpm = insights.cpm;
                        data_list.cpc = insights.cpc;
                        data_list.frequency = insights.frequency;
                        data_list.clicks = insights.clicks;
                        data_list.unique_ctr = insights.unique_ctr;
                        data_list.inline_link_clicks = insights.inline_link_clicks;
                        data_list.impressions = insights.impressions;
                        data_list.cost_per_inline_link_click = insights.cost_per_inline_link_click;
                        data_list.date_start = insights.date_start;
                        data_list.date_stop = insights.date_stop;
                        data_list.access_customer_id = customerid;
                        data_list.ads_id = campaignid
                        data_list.page_id = page_id
                        let spend = result['data'][0]['spend'];
                        var options = {
                            'method': 'GET',
                            'url': process.env.FBGRAPHAPIVERSION12 + campaignid + '/leads?access_token=' + access_fbtoken + '&filtering=[{"field": "time_created","operator": "LESS_THAN","value": ' + timex + '}]&limit=5000',
                            'headers': {
                            }
                        };
                        request(options, function (error, response) {
                            if (error) {
                                console.log(error);
                            } else {
                                var result = JSON.parse(response.body);
                                console.log('leads_result', result);
                                let lead_count = result['data'].length
                                let per_lead_amount = spend / lead_count;
                                if (per_lead_amount == 'Infinity') {
                                    data_list.per_lead_spend = 0
                                } else {
                                    data_list.per_lead_spend = per_lead_amount
                                }
                                //console.log(campaignid);
                                // console.log(per_lead_amount);
                                //console.log(spend);
                                // console.log(lead_count);
                                data_list.lead_diffrents = lead_count
                                Digital.create_insights(data_list, function (err, rows2) {
                                    if (err) {
                                        resolve('ERROR')
                                    } else {
                                        data_change.last_sync_insights = new Date()
                                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                                            if (err) {
                                                resolve('ERROR')
                                            }
                                            else {
                                                console.log('ADS successfully updated!');
                                                resolve('SAVE')
                                            }
                                        })
                                    }
                                })
                            }
                        });

                    }
                    else {
                        data_change.last_sync_insights = new Date()
                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                            if (err) {
                                resolve('ERROR')
                            }
                            else {
                                console.log('ADS ERROR successfully updated!');
                                resolve('SAVE')
                            }
                        })
                    }
                }
            });
        });
    },
    fb_ads_insights: async function (data) {
        return new Promise(function (resolve, reject) {
            let campaignid = data.ads_id
            let customerid = data.username
            let page_id = data.page_id
            let access_fbtoken = data.accessToken
            console.log(process.env.FBGRAPHAPIVERSION12 + campaignid + '/insights?fields{reach,spend,cost_per_conversion,cost_per_action_type,social_spend,inline_post_engagement,cpm,cpc,frequency,clicks,unique_ctr,inline_link_clicks,impressions,cost_per_inline_link_click}&access_token=' + access_fbtoken);
            let data_change = {}
            urllib.request(process.env.FBGRAPHAPIVERSION12 + campaignid + '/insights?fields{reach,spend,cost_per_conversion,cost_per_action_type,social_spend,inline_post_engagement,cpm,cpc,frequency,clicks,unique_ctr,inline_link_clicks,impressions,cost_per_inline_link_click}&access_token=' + access_fbtoken, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    console.log(error);
                }
                else {

                    var result = JSON.parse(resp);
                    console.log(result);
                    if (result.error) {
                        data_change.last_sync_insights = new Date()
                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                            if (err) {
                                resolve('ERROR')
                            }
                            else {
                                console.log('ADS ERROR successfully updated!');
                                resolve('SAVE')
                            }
                        })
                    } else if (result['insights']) {
                        let insights = result['insights']['data'][0]
                        let data_list = {}
                        data_list.reach = insights['reach'];
                        data_list.spend = insights.spend;
                        data_list.cost_per_action_type = JSON.stringify(insights.cost_per_action_type);
                        data_list.social_spend = insights.social_spend;
                        data_list.inline_post_engagement = insights.inline_post_engagement;
                        data_list.cpm = insights.cpm;
                        data_list.cpc = insights.cpc;
                        data_list.frequency = insights.frequency;
                        data_list.clicks = insights.clicks;
                        data_list.unique_ctr = insights.unique_ctr;
                        data_list.inline_link_clicks = insights.inline_link_clicks;
                        data_list.impressions = insights.impressions;
                        data_list.cost_per_inline_link_click = insights.cost_per_inline_link_click;
                        data_list.date_start = insights.date_start;
                        data_list.date_stop = insights.date_stop;
                        data_list.access_customer_id = customerid;
                        data_list.ads_id = campaignid
                        data_list.page_id = page_id
                        let spend = result['insights'].data[0]['spend'];
                        let timex = Math.floor(Date.now() / 1000)
                        Digital.list_ads_lead(campaignid, customerid, function (err, rows3) {
                            if (err) {
                                resolve('ERROR')
                            } else {
                                let last_spend = rows3[0].spend
                                console.log(last_spend);
                                console.log(spend);
                                if (JSON.parse(spend) > JSON.parse(last_spend)) {
                                    console.log("big");
                                    var new_spend = spend - last_spend
                                } else {
                                    var new_spend = last_spend - spend
                                }
                                data_list.per_lead_spend = new_spend
                                var options = {
                                    'method': 'GET',
                                    'url': process.env.FBGRAPHAPIVERSION12 + campaignid + '/leads?access_token=' + access_fbtoken + '&filtering=[{"field": "time_created","operator": "LESS_THAN","value": ' + timex + '}]&limit=5000',
                                    'headers': {
                                    }
                                };
                                request(options, function (error, response) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        var result = JSON.parse(response.body);
                                        let lead_count = result['data'].length
                                        console.log(lead_count);
                                        Digital.list_ads_lead_sum(campaignid, function (err, rows0) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                let last_lead = rows0[0].sum;
                                                let per_lead = (lead_count - last_lead)
                                                let per_lead_amount = new_spend / per_lead;
                                                console.log(new_spend / per_lead);
                                                console.log(new_spend);
                                                console.log(per_lead);
                                                console.log("hey");
                                                if (per_lead_amount == 'Infinity') {
                                                    data_list.per_lead_spend = last_spend
                                                } else if (new_spend == 0 && per_lead == 0) {
                                                    console.log("Sssss");
                                                    data_list.per_lead_spend = last_spend
                                                } else {
                                                    data_list.per_lead_spend = per_lead_amount
                                                }
                                                Digital.create_insights(data_list, function (err, rows2) {
                                                    if (err) {
                                                        resolve('ERROR')
                                                    } else {
                                                        data_change.last_sync_insights = new Date()
                                                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                                                            if (err) {
                                                                resolve('ERROR')
                                                            }
                                                            else {
                                                                console.log('ADS successfully updated!');
                                                                resolve('SAVE')
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })

                                        // let per_lead_amount = spend / lead_count;
                                    }
                                })
                            }
                        })

                    } else {
                        data_change.last_sync_insights = new Date()
                        Digital.update_insights_status(data_change, data.Ad_id, function (err, rows) {
                            if (err) {
                                resolve('ERROR')
                            }
                            else {
                                console.log('ADS ERROR successfully updated!');
                                resolve('SAVE')
                            }
                        })
                    }

                }
            });
        });
    },
    // Generate LMS Lead
    GenerateLead: async function (data) {
        var that = this
        return new Promise(async function (resolve, reject) {
            const managerid = data.account_id
            var phone = data.mobile ? data.mobile : ''
            var mobile = data.mobile ? data.mobile : ''
            mobile = mobile.toString()[0] == '+' ? mobile.substring(1) : mobile
            mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
            mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
            var email = data.email ? data.email : ''
            var name = data.name ? data.name : 'New Lead';
            var address = data.address ? data.address : '';
            var city = data.city ? data.city : '';
            var state = data.state ? data.state : '';
            var lead_source = data.lead_source ? data.lead_source : ''
            var notes = data.notes ? data.notes : ''
            var ads_id = data.ads_id ? data.ads_id : ''
            var ads_name = data.ads_name ? data.ads_name : ''
            var ads_keyword = data.ads_keyword ? data.ads_keyword : ''
            var ad_leadid = data.ad_leadid ? data.ad_leadid : ''
            var agentgroupid = data.agentgroupid ? data.agentgroupid : ''
            var extraitems = data.extraparams ? data.extraparams : {} // Array 
            var segmentid = data.category ? data.category : '';
            var agentid = data.agentid ? data.agentid : 0
            var chat_id = data.chat_id ? data.chat_id : 0
            if (agentid > 0) { } else {
                if (agentgroupid != '') {
                    var agentid = await API.GetLeadAgent(agentgroupid)
                } else {
                    var agentgroup = await API.GetConfigBykey('group', managerid);
                    var agentid = await API.GetLeadAgent(agentgroup)
                }
            }
            if (segmentid != '') {
                segmentid = await API.GetConfigBykey('category', managerid);
            }
            var lead = {};
            lead.city = city;
            lead.address_line1 = address;
            lead.state = state;
            lead.email_id = email;
            lead.phone = phone;
            lead.mobile_no = mobile;
            lead.lead_name = name.replace(/[^a-zA-Z ]/g, "");
            lead.source = lead_source;
            lead.notes = JSON.stringify(notes);
            lead.status = "Lead";
            lead.title = name;
            lead.User_id = managerid
            lead.agent_id = agentid
            lead.is_sync = "yes"
            lead.ads_id = ads_id
            lead.ads_name = ads_name
            lead.ads_keyword = ads_keyword
            lead.ad_leadid = ad_leadid
            lead.creation = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            // Extra fields
            if (typeof extraitems === 'string' || extraitems instanceof String) {
                extraitems = JSON.parse(extraitems)
            }
            console.log(extraitems)
            var ContactMetaArr = []
            if (extraitems != '') {
                const extraArr = Array.from(Object.keys(extraitems), k => [`${k}`, extraitems[k]]);
                console.log(extraArr)
                if (extraArr != undefined && extraArr.length > 0) {
                    extraArr.forEach(item => {
                        // console.log(item)
                        console.log(item[0] + "====" + item[1])
                        ContactMetaArr.push({ 'metakey': item[0], 'metavalue': item[1] })
                        if (item[0].toLowerCase() == 'city') {
                            lead.city = item[1]
                        }
                        if (item[0].toLowerCase() == 'state') {
                            lead.state = item[1]
                        }
                        if (item[0].toLowerCase() == 'designation') {
                            lead.designation = item[1]
                        }
                        if (item[0].toLowerCase() == 'country') {
                            lead.county = item[1]
                        }
                        if (item[0].toLowerCase() == 'website') {
                            lead.website = item[1]
                        }
                        if (item[0].toLowerCase() == 'pincode') {
                            lead.pincode = item[1]
                        }
                        if (item[0].toLowerCase() == 'gender') {
                            lead.gender = item[1]
                        }
                        if (item[0].toLowerCase() == 'whatsapp_number') {
                            lead.whatsapp_number = item[1]
                        }
                    });
                }
            }
            API.findlead(mobile, managerid, async function (err, data) {
                if (data.length > 0 && managerid!=1790) {
                    //Duplicate Lead
                    var leadid = data[0].l_id
                    lead.l_id = leadid
                    delete lead.status
                    delete lead.agent_id
                    delete lead.creation
                    API.updatelead(lead, async function (err, rows) {
                        if (err) {
                            console.log(err);
                            resolve(0)
                        } else {
                            var timeline = {}
                            timeline.agent_id = data[0].agent_id
                            timeline.account_id = managerid
                            timeline.lead_id = leadid
                            timeline.current_status = data[0].current_status
                            timeline.notes = 'Modified (Duplicate Lead)'
                            ERP.add_timeline_lead(timeline, function (err, rows2) { })
                            that.fire_trigger_by_leadid(leadid)
                            resolve(1)
                        }
                    })
                    //Update Chat Lead ID
                    if (chat_id > 0) {
                        db.query('UPDATE td_chat SET lead_id = ? WHERE chat_id = ?', [leadid, chat_id], async function (error, results) {
                            console.log('chat_id', results);
                        })
                    }
                } else {
                    //New Lead
                    API.addlead_db(lead, async function (err, rows) {
                        if (err) {
                            console.log(err);
                            resolve(0)
                        }
                        else {
                            var leadid = rows.insertId
                            if (leadid > 0) {
                                let year = new Date().getFullYear()
                                let month = new Date().getMonth()
                                let lead_name = {}
                                lead_name.name = 'CRM-LEAD-' + year + '-' + (month + 1) + leadid
                                ERP.updat_lead_name(lead_name, leadid, function (err, rows2) { })
                                var nowdate = new Date();
                                var cont_id = 'CON' + nowdate.getUTCFullYear() + "" + (nowdate.getUTCMonth() + 1) + "" + nowdate.getUTCDate() + "" + nowdate.getUTCHours() + "" + nowdate.getUTCMinutes() + "" + nowdate.getUTCSeconds() + nowdate.getMilliseconds() + Math.floor(100 + Math.random() * 900);
                                var data = { cont_id: cont_id, customer_id: managerid, created_date: nowdate, name: name, email: email, mobile: mobile, address: address, city: city, state: state, lead_source: lead_source, category: segmentid, created_by: managerid, lead_id: leadid }
                                Contacts.createcontact(data, function (err, result) {
                                    if (err) {
                                        resolve(0)
                                    }
                                    else {
                                        var conid = cont_id
                                        ContactMetaArr.forEach(item => {
                                            console.log(item['metakey'] + "====" + item['metavalue'])
                                            that.SaveContactMeta(item['metakey'], item['metavalue'], conid, managerid)
                                        });
                                        var timeline = {}
                                        timeline.agent_id = agentid
                                        timeline.account_id = managerid
                                        timeline.lead_id = leadid
                                        timeline.current_status = 'Lead'
                                        timeline.notes = 'Created'
                                        ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                        resolve(2)
                                    }
                                });
                                that.PushZohoLead(leadid, agentid)
                                that.fire_trigger_by_leadid(leadid)
                                //Update Chat Lead ID
                                if (chat_id > 0) {
                                    db.query('UPDATE td_chat SET lead_id = ? WHERE chat_id = ?', [leadid, chat_id], async function (error, results) {
                                        console.log('chat_id', results);
                                    })
                                }
                            } else {
                                resolve(0)
                            }
                        }
                    })
                }
            })
        })
    },
    //Trigger functions
    checkAccountExpiry: async function (accountid, callback) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT account_id FROM `tf_account_table` WHERE `account_id` = ? and current_status=0 and expiry_date >=CURDATE()', [accountid],
                async function (err, rows) {
                    if (rows === undefined) {
                        resolve(false);
                    } else {
                        if (rows.length > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                }
            )
        })
    },
    GetLeadContactData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_contacts  WHERE lead_id=?', [id], function (err, results) {
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
        })
    },
    GetLeadContactData: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_contacts  WHERE lead_id=?', [id], function (err, results) {
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
        })
    },
    GetTriggerAction: async function (tid, lid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_triggers_action  WHERE t_id=? AND lead_id=?', [tid, lid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(1);
                } else {
                    if (results.length > 0) {
                        resolve(1);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    InsertTriggerAction: async function (data) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO tf_triggers_action  SET ?', [data], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(1);
                } else {
                    if (results.length > 0) {
                        resolve(1);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    InsertSmsReport: async function (data) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO tf_sms_report  SET ?', [data], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    var rid = results.insertId
                    resolve(rid);
                }
            })
        })
    },
    GetSmsTemplateById: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_smstemplate  WHERE sms_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetEmailTemplateById: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_emailtemplate  WHERE email_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetWhatsappTemplateById: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_whatsapp_template  WHERE wtemp_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetSmsServerByManagerId: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT A.*,S.server_name,S.server_type,S.sid,S.server_url from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=? and S.server_type=0', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetAPIDataById: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_manager_api  WHERE api_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    async fire_trigger_action(tid, ldata, actionname, actionvalue) {
        var that = this
        var l_id = ldata.l_id
        var accountid = ldata.User_id
        var agentid = ldata.agent_id
        var leadname = ldata.lead_name
        var leadmobile = ldata.mobile_no
        var leademail = ldata.email_id
        var agentdata = ''
        var condata = await that.GetLeadContactData(l_id)
        var cont_id = condata['cont_id'] ? condata['cont_id'] : ''
        var category = condata['category'] ? condata['category'] : ''
        const checkactionstatus = await that.GetTriggerAction(tid, l_id)
        if (checkactionstatus == 0) {
            if (actionname == 'call') {
                var voicecamid = await that.GetAgentLMSCampaign(agentid, accountid)
                if (cont_id != '') {
                    if (voicecamid > 0) {
                        that.UpdateCampaignNumbers(voicecamid, accountid, cont_id, category)
                    } else {
                        voicecamid = await that.CreateAgentLMSCampaign(agentid, accountid)
                        that.UpdateCampaignNumbers(voicecamid, accountid, cont_id, category)
                    }
                    that.InsertTriggerAction({ t_id: tid, lead_id: l_id })
                } else {
                    console.log('Lead contact not mapped')
                }
            }
            if (actionname == 'sms') {
                var smsserverdata = await that.GetSmsServerByManagerId(accountid)
                if (smsserverdata.length > 0) {
                    var updatedbalance = await that.UpdateSMSBalance(accountid)
                    if (leadmobile != '' && leadmobile != null && updatedbalance > 0) {
                        var tempid = actionvalue
                        var tempdata = await that.GetSmsTemplateById(tempid)
                        if (tempdata.length > 0) {
                            var serverArr = smsserverdata[0];
                            var templateid = tempdata[0].templateid;
                            var contentid = tempdata[0].contentid;
                            var message = tempdata[0].sms_text;
                            var space = ' '
                            message = message.replace("{#var1#}", space);
                            message = message.replace("{#var2#}", space);
                            message = message.replace("{#var3#}", space);
                            message = message.replace("{#var4#}", space);
                            message = message.replace("{#var5#}", space);
                            var url = serverArr.server_url;
                            url = url.replace('{msg}', message);
                            url = url.replace('{mobile}', leadmobile);
                            url = url.replace('{contentid}', contentid);
                            url = url.replace('{templateid}', templateid);
                            request(encodeURI(url), { json: true, "rejectUnauthorized": false }, async (err, res, body) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("sms respo");
                                    console.log(JSON.stringify(body));
                                    var transactionId = body.transactionId;
                                    var sms_status = body.state;
                                    var status;
                                    if (sms_status == 'SUBMIT_ACCEPTED' || sms_status == 'DELIVERY_SUCCESS') {
                                        status = '1';
                                    }
                                    else {
                                        status = '2';
                                    }
                                    var smsstatus = sms_status;
                                    var msgcharcnt = message.length;
                                    var msgcredit = 0;
                                    if (/[^\u0000-\u00ff]/.test(message)) {
                                        if (msgcharcnt > 70 && msgcharcnt < 135) {
                                            msgcredit = 2
                                        }
                                        if (msgcharcnt > 134 && msgcharcnt < 202) {
                                            msgcredit = 3
                                        }
                                        if (msgcharcnt > 201) {
                                            msgcredit = 4
                                        }
                                        if (msgcharcnt < 71) {
                                            msgcredit = 1
                                        }
                                    } else {
                                        if (msgcharcnt > 160 && msgcharcnt < 307) {
                                            msgcredit = 2
                                        }
                                        if (msgcharcnt > 306 && msgcharcnt < 460) {
                                            msgcredit = 3
                                        }
                                        if (msgcharcnt < 161) {
                                            msgcredit = 1
                                        }
                                    }
                                    var numberdata = { account_id: accountid, mobile: leadmobile, cdr_id: l_id, sms_status: smsstatus, sms_uid: transactionId, sms_credit: msgcredit, sentdate: new Date(), text: message };
                                    var smsid = await that.InsertSmsReport(numberdata)
                                    //Update Lead Timeline
                                    var timeline = {}
                                    timeline.agent_id = agentid
                                    timeline.account_id = accountid
                                    timeline.lead_id = l_id
                                    timeline.current_status = ldata.status
                                    timeline.notes = 'SMS - ' + message
                                    timeline.lead_id = l_id
                                    timeline.action_type = 'sms'
                                    timeline.action_id = smsid
                                    ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                }
                            })
                            that.InsertTriggerAction({ t_id: tid, lead_id: l_id })
                        }
                    }
                } else {
                    console.log('Sms server not assigned => ' + accountid)
                }
            }
            if (actionname == 'email') {
                if (leademail != '') {
                    var OwnServerArr = await that.GetEmailServerLastData(accountid)
                    var tempid = actionvalue
                    var tempdata = await that.GetEmailTemplateById(tempid)
                    if (OwnServerArr.length > 0) {
                        //Own server
                        var ServerData = OwnServerArr[0]
                        var transOptions = {
                            host: ServerData.smtp_server,
                            port: ServerData.smtp_port,
                            secure: false,
                            auth: {
                                user: ServerData.smtp_username,
                                pass: ServerData.smtp_password,
                            },
                        };
                        var transporter = nodemailer.createTransport(transOptions);
                        var text = tempdata[0].email_html ? tempdata[0].email_html : 'From ' + ServerData.server_name
                        var subject = tempdata[0].email_subject ? tempdata[0].email_subject : 'From ' + ServerData.server_name
                        var attachementfile = tempdata[0].attach_file ? tempdata[0].attach_file : ''
                        let info = {
                            from: ServerData.server_name + " " + ServerData.smtp_username, // sender address
                            to: leademail, // list of receivers
                            subject: subject, // Subject line
                            html: text, // plain text body
                        };
                        if (attachementfile != '' && attachementfile != null) {
                            var filepath = 'https://app.cloudX.in/api/' + attachementfile;
                            if (fs.existsSync('./uploads/' + attachementfile)) {
                                info.attachments = [
                                    {
                                        path: './uploads/' + attachementfile
                                    }
                                ]
                            } else {
                                var localpath = await that.DownloadLiveFileToLocal(filepath, attachementfile)
                                console.log(localpath)
                                info.attachments = [
                                    {
                                        path: localpath
                                    }
                                ]
                            }
                        }
                        console.log(info)
                        transporter.sendMail(info, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                //console.log(info);
                                if (info.accepted.length > 0) {
                                    info.email_to = leademail
                                    info.text_description = text
                                    info.subject = subject
                                    info.frommail = ServerData.smtp_username
                                    info.User_id = accountid
                                    info.agent_id = agentid
                                    console.log(info)
                                    delete info.accepted
                                    delete info.rejected
                                    info.lead_name = l_id
                                    info.attachment_file = attachementfile
                                    ERP.addleadsemail_db(info, function (err, rows) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            //Update Lead Timeline
                                            var timeline = {}
                                            timeline.agent_id = agentid
                                            timeline.account_id = accountid
                                            timeline.lead_id = l_id
                                            timeline.current_status = ldata.status
                                            timeline.notes = 'Email - ' + subject
                                            timeline.action_type = 'email'
                                            timeline.action_id = rows.insertId
                                            ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                        }
                                    })
                                }
                            }
                            that.InsertTriggerAction({ t_id: tid, lead_id: l_id })
                        })

                    } else {
                        //cloudX server

                    }
                }
            }
            if (actionname == 'whatsapp') {
                var whatsappapi = await that.GetManagerSettingValueByName(accountid, 'whatsup_api')
                if (leadmobile != '' && leadmobile != null && whatsappapi > 0) {
                    var apiArr = await that.GetAPIDataById(whatsappapi)
                    if (apiArr.length > 0) {
                        var apidata = apiArr[0]
                        var tempid = actionvalue
                        var tempdata = await that.GetWhatsappTemplateById(tempid)
                        var attachfile = tempdata[0].attach_file
                        //
                        var url = apidata.api_endpoint
                        var attachurl = apidata.api_endpoint
                        var msg = tempdata[0].wtemp_description;
                        var mobile = leadmobile.substr(-10)
                        url = url.replace('{mobile}', mobile).replace('{text}', msg);
                        var method = apidata.api_method
                        var payload = apidata.api_payload != null ? apidata.api_payload.replace('{mobile}', mobile).replace('{text}', msg).replace('{link}', '') : {}
                        var header = apidata.api_header != null ? apidata.api_header : {}
                        var headertype = apidata.api_header_type
                        if (headertype == 'json') {
                            var options = {
                                'method': method,
                                'url': url,
                                'headers': header,
                                body: JSON.stringify(payload)
                            };
                        } else {
                            var options = {
                                'method': method,
                                'url': url,
                                'headers': header,
                                form: JSON.parse(payload)
                            };
                        }
                        request(options, async function (error, response) {
                            console.log(error);
                            //console.log(response.body);
                            var sdata = { lead_id: l_id, cdrid: 0, account_id: accountid, message: msg, mobile: mobile }
                            await that.AddWhatsappChat(sdata, agentid, 1);
                            ERP.addwhatsapp_db(sdata, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    //Update Lead Timeline
                                    var timeline = {}
                                    timeline.agent_id = agentid
                                    timeline.account_id = accountid
                                    timeline.lead_id = l_id
                                    timeline.current_status = ldata.status
                                    timeline.notes = 'Whatsapp - ' + msg
                                    timeline.action_type = 'whatsapp'
                                    timeline.action_id = rows.insertId
                                    ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                }
                            })
                        });
                        //
                        if (attachfile != '' && attachfile != null) {
                            var filepath = 'https://app.cloudX.in/api/' + attachfile;
                            console.log(filepath);
                            attachurl = attachurl.replace('{mobile}', mobile).replace('{text}', filepath);
                            var payload = apidata.api_payload != null ? apidata.api_payload.replace('{mobile}', mobile).replace('{text}', '').replace('{link}', filepath) : {}
                            if (headertype == 'json') {
                                var options = {
                                    'method': method,
                                    'url': attachurl,
                                    'headers': header,
                                    body: JSON.stringify(payload)
                                };
                            } else {
                                var options = {
                                    'method': method,
                                    'url': attachurl,
                                    'headers': header,
                                    form: JSON.parse(payload)
                                };
                            }
                            console.log('options', options);
                            request(options, async function (error, response) {

                            });
                        }
                        that.InsertTriggerAction({ t_id: tid, lead_id: l_id })
                    }
                }
            }
            if (actionname == 'api') {
                var apiid = actionvalue

            }
        }
    },
    DownloadLiveFileToLocal(link, name) {
        return new Promise(function (resolve, reject) {
            var cnt = 0
            var newlink = ''
            var download = function (uri, fname, callback) {
                request.head(uri, function (err, res, body) {
                    request(uri).pipe(fs.createWriteStream(fname)).on('close', callback);
                });
            };
            download(link, './uploads/' + name, function (data) {
                newlink = './uploads/' + name
                resolve(newlink)
            })
        })
    },
    // Fire Lead Trigges
    fire_trigger_by_leadid(leadid) {
        var that = this
        db.query('SELECT * FROM tf_leads WHERE l_id = ?', [leadid], async function (err, rows) {
            if (rows.length > 0) {
                var ldata = rows[0]
                var accountid = ldata.User_id
                var agentid = ldata.agent_id
                var leadstatus = ldata.status
                var leadcreation = ldata.creation
                var leadmodified = ldata.modified
                var checkaccount = await that.checkAccountExpiry(accountid)
                if (checkaccount) {
                    db.query('SELECT * FROM tf_triggers WHERE account_id = ?', [accountid], async function (err, trows) {
                        if (trows.length > 0) {
                            async.forEachOf(trows, async (element, key, callback) => {
                                var columnname = element.column_name
                                var condition_value = element.condition_value
                                var action_name = element.action_name
                                var action_value = element.action_value
                                var tid = element.t_id
                                if (columnname == 'status') {
                                    if (leadstatus == condition_value) {
                                        that.fire_trigger_action(tid, ldata, action_name, action_value)
                                    }
                                }
                            })
                        }
                    })
                } else {
                    console.log('Account expired')
                }
            }
        })
    },
    UpdateSMSBalance: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_account_balance  WHERE Account_ID=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    if (results.length > 0) {
                        var balance = results[0]['SMS_Pr_No']
                        var startdate = results[0]['SMS_Startdate']
                        db.query('SELECT SUM(sms_credit) as total,sentdate FROM `tf_sms_report` WHERE `account_id` = ? AND sentdate >=?', [id, startdate], function (err, results) {
                            if (err) {
                                resolve(0);
                            } else {
                                if (results[0]['total'] > 0) {
                                    var currentbalance = balance - results[0]['total']
                                    currentbalance = currentbalance > 0 ? currentbalance : 0
                                    db.query('update tf_account_balance set SMS_Pr_Balance=?,SMS_Pr_Used=? WHERE Account_ID=?', [currentbalance, results[0]['total'], id]);
                                    resolve(currentbalance);
                                } else {
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
    GetAccountIdBySmsTxnID: async function (txnid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_sms_report  WHERE sms_uid=?', [txnid], function (err, results) {
                if (results.length > 0) {
                    var id = results[0].account_id
                    resolve(id)
                } else {
                    resolve(0)
                }
            })
        })
    },
    GetEmmMalingListId: async function (name) {
        //name = name.replace(/\s/g,'')
        return new Promise(function (resolve, reject) {
            var options = {
                'method': 'POST',
                'url': process.env.OPENEMMRESTAPI + 'mailinglist?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                'headers': {
                    'Content-Type': 'application/json'
                },
                json: {
                    'name': name,
                    'description': name,
                }
            };
            request(options, function (error, response) {
                if (error) {
                    console.log(error)
                    resolve(0)
                } else {
                    console.log(response.body);
                    if (response.body.error) {
                        resolve(0)
                    } else {
                        var emmid = response.body.mailinglist_id
                        resolve(emmid)
                    }
                }
            });
        })
    },
    GetSMSLinkReplaceWithShortLink: async function (linkid, numid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_sms_links  WHERE sl_id=?', [linkid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve('');
                } else {
                    if (results.length > 0) {
                        //resolve(results);
                        const linkData = results[0]
                        const link = linkData.sl_url
                        requestify.request(process.env.SHORT_LINK_URL, {
                            method: 'POST',
                            body: { url: link },
                            dataType: 'form-url-encoded',
                        }).then(function (response) {
                            console.log(response + "===api==")
                            const rs = JSON.parse(response.body);
                            const shorturl = rs.url
                            const shorturllink = process.env.SHORT_LINK_URL + shorturl;
                            db.query('UPDATE tf_sms_campagins_number SET `shorturl_link`=? WHERE numid=?', [shorturl, numid]);
                            resolve(shorturllink);
                        })
                            .fail(function (response) {
                                console.log(messsge);
                                resolve('');
                            });
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    GetSMSFormReplaceWithShortLink: async function (formid, numid) {
        return new Promise(function (resolve, reject) {
            const form_url = process.env.FORM_LINK_URL + formid + "/" + numid;
            requestify.request(process.env.SHORT_LINK_URL, {
                method: 'POST',
                body: { url: form_url },
                dataType: 'form-url-encoded',
            }).then(function (response) {
                console.log(response + "===api==")
                const rs = JSON.parse(response.body);
                const shorturl = rs.url
                const shorturllink = process.env.SHORT_LINK_URL + shorturl;
                db.query('UPDATE tf_sms_campagins_number SET `form_shortlink`=? WHERE numid=?', [shorturl, numid]);
                resolve(shorturllink);
            })
                .fail(function (response) {
                    console.log(messsge);
                    resolve('');
                });
        })
    },
    GetLeadByContactID: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT lead_id FROM `tf_contacts` WHERE cont_id = ?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    if (results.length > 0) {
                        var leadid = results[0].lead_id
                        if (leadid > 0) {
                            db.query('SELECT * FROM `tf_leads` WHERE l_id = ?', [leadid], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                    resolve([]);
                                } else {
                                    if (results.length > 0) {
                                        resolve(results);
                                    } else {
                                        resolve([]);
                                    }
                                }
                            })
                        } else {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    GetMediaDetail: async function (mediaid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM td_bucket_file WHERE  `F_id`=' + mediaid, [], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    GetSocketDomain: async function (id, role) {
        return new Promise(function (resolve, reject) {
            if (role == 1) {
                db.query('SELECT socket_url FROM tf_account_table  WHERE account_id IN (SELECT created_by FROM tf_account_table  WHERE account_id=?)', [id], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                        resolve('');
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]['socket_url']);
                        } else {
                            resolve('');
                        }
                    }
                })
            } else {
                db.query('SELECT socket_url FROM tf_account_table  WHERE account_id = ?', [id], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                        resolve('');
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]['socket_url']);
                        } else {
                            resolve('');
                        }
                    }
                })
            }
        })
    },
    GetAgentIdByZohoUserId: async function (uid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT mapuser_id FROM tf_zoho_user WHERE  zohouserid= ?', [uid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(0);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]['mapuser_id']);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    getLeadStageNameByStatus: async function (userid, status) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT C.stage_name FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + userid + ' AND CD.status_master = "' + status + '"', [lid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    reject()
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
    GenerateManualLead: function (data, managerid, agentid) {
        return new Promise(function (resolve, reject) {
            console.log("data::"+JSON.stringify(data))
            var array = { lead_name: data.name, email_id: data.email, mobile_no: data.mobile, source: data.lead_source, address: data.address, city: data.city, state: data.state }
            var timeline = {}
            array.is_sync = "yes"
            array.status = "Lead"
            array.User_id = managerid;
            if (agentid > 0) {
                array.agent_id = agentid;
                timeline.agent_id = agentid
            }
            timeline.account_id = managerid
            var now = new Date();
            array.creation = dateFormat(now, "yyyy-mm-dd HH:MM:ss");

            ERP.check_lead_by_mobile(managerid, data.mobile, function (err, rows) {
                if (err) {
                    resolve(0);
                }
                else {
                    console.log(rows.length);
                    if (rows.length == 0) {
                        ERP.addlead_db(array, function (err, rows) {
                            if (err) {
                                resolve(0);
                            }
                            else {
                                console.log(rows)
                                console.log(rows.insertId)
                                let year = new Date().getFullYear()
                                let lead_name = {}
                                lead_name.name = 'CRM-LEAD-' + year + '-' + (09000 + rows.insertId)
                                console.log(lead_name);
                                timeline.lead_id = rows.insertId
                                var lead_id = rows.insertId
                                timeline.current_status = 'Lead'
                                ERP.updat_lead_name(lead_name, rows.insertId, function (err, rows2) {
                                    if (err) {
                                        resolve(0);
                                    }
                                    else {
                                        ERP.add_timeline_lead(timeline, function (err, rows2) {
                                            if (err) {
                                                resolve(0);
                                            } else {
                                                resolve(lead_id);
                                            }
                                        })
                                    }

                                })
                            }

                        })
                    }
                    else {
                        if (rows.length > 0) {
                            ERP.updat_lead_name(array, rows[0].l_id, function (err, rows2) {
                                if (err) {
                                    resolve(0);
                                }
                                else {
                                    timeline.lead_id = rows[0].l_id
                                    timeline.current_status = 'Lead'
                                    ERP.add_timeline_lead(timeline, function (err, rows2) {
                                        if (err) {
                                            resolve(0);
                                        } else {
                                            resolve(rows[0].l_id);
                                        }
                                    })
                                }

                            })
                        } else {
                            resolve(0);
                        }

                    }
                }
            })
        })
    },
    GetChat: async function (chatid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM td_chat WHERE chat_id = ?', [chatid], function (error, rows) {
                if (error) {
                    resolve({})
                } else {
                    if (rows.length > 0) {
                        resolve(rows[0]);
                    } else {
                        resolve({})
                    }
                }
            })
        })
    },
    checkAgentVOIPStatus: async function (data, managerid) {
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
                console.log(results.data.state)
                if (results.data.state == 'online') {
                    return ag
                } else {
                    return []
                }
            }).catch(function (err) {
                console.log(err)
                return [];
            });
        })
        var avaichannels = await Promise.all(promises)
        avaichannels = avaichannels.filter(function (item) {
            return item !== false
        })
        //console.log(avaichannels)
        return avaichannels
    },
    SendFirebaseChatNotification: function (userid, title, body,chatid) {
        db.query('SELECT webtoken,uuid FROM tf_account_table  WHERE account_id=?', [userid], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                if (results.length > 0) {
                    var adata = results[0]
                    const webregistrationToken = adata.webtoken
                    if (webregistrationToken != '' && webregistrationToken != null) {
                        var options = {
                            'method': 'POST',
                            'url': 'https://fcm.googleapis.com/fcm/send',
                            'headers': {
                                'Authorization': 'key=AAAAOFwSwLM:APA91bHnomxIJBHHYDiDQ-2GsoLbdMq8G2tZWbzCTeGM6qXQSS7t_wnfuY67KBU-HFPQrBHHA_y6hYq0zgCFEXuuzEF6gKSlwvEKChRn6Vf4HxXN1DN6C0gIgSp8dqI_uj1efB59wAzi',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "notification": {
                                    "body": body,
                                    "title": title
                                },
                                "priority": "high",
                                "data": {
                                    "clickaction": "FLUTTERNOTIFICATIONCLICK",
                                    "id": "1",
                                    "status": "done",
                                    "chat_id": chatid,
                                    "type": 'chat',
                                    "msg": body,
                                },
                                "to": webregistrationToken
                            })
                        };
                        request(options, function (error, response) {
                            if (error) { console.log(error) }
                            console.log(response.body);
                        });
                    }
                    //
                    const mobileregistrationToken = adata.uuid
                    if (mobileregistrationToken != '' && mobileregistrationToken != null) {
                        var options = {
                            'method': 'POST',
                            'url': 'https://fcm.googleapis.com/fcm/send',
                            'headers': {
                                'Authorization': 'key=AAAAOFwSwLM:APA91bHnomxIJBHHYDiDQ-2GsoLbdMq8G2tZWbzCTeGM6qXQSS7t_wnfuY67KBU-HFPQrBHHA_y6hYq0zgCFEXuuzEF6gKSlwvEKChRn6Vf4HxXN1DN6C0gIgSp8dqI_uj1efB59wAzi',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "notification": {
                                    "body": body,
                                    "title": title
                                },
                                "priority": "high",
                                "data": {
                                    "clickaction": "FLUTTERNOTIFICATIONCLICK",
                                    "id": "1",
                                    "status": "done",
                                    "chat_id": chatid,
                                    "type": 'chat',
                                    "msg": body,
                                },
                                "to": mobileregistrationToken
                            })
                        };
                        request(options, function (error, response) {
                            if (error) { console.log(error) }
                            console.log(response.body);
                        });
                    }
                }
            }
        })
    },
    AssignTicketToAgent: async function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_settings  WHERE setting_name="ticket_assign_agentgroup"', [], function (err, results) {
                if (err) {
                    resolve(null);
                } else {
                    if (results.length > 0) {
                        var agentgroupid = results[0].setting_value;
                        db.query('SELECT * FROM HuntGroupDetail H LEFT JOIN tf_account_table A ON A.account_id=H.AgentID WHERE HuntGroupID=? AND A.current_status=0', [agentgroupid], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                                resolve(null);
                            } else {
                                if (results.length > 0) {
                                    var agentticket = []
                                    var cnt = 0 
                                    results.forEach(element => {
                                        db.query('SELECT * FROM tf_tickets  WHERE assign_to = ? ORDER BY ticket_id DESC LIMIT 1', [element.AgentID], function (err, rows) {
                                            cnt = cnt + 1
                                            console.log(rows);
                                            if(rows.length>0){
                                                var row = rows[0]
                                                agentticket.push({id:element.AgentID,date:row.created_date})
                                                //console.log(agentlead)
                                                //console.log(cnt+'=='+results.length)
                                                if(cnt==results.length){
                                                    agentticket.sort(function(a, b) {
                                                        var c = new Date(a.date).getTime();
                                                        var d = new Date(b.date).getTime();
                                                        return c>d?1:-1;
                                                    });
                                                    //console.log(agentlead)
                                                    console.log("if::"+agentticket[0].id);
                                                    resolve(agentticket[0].id);
                                                }        
                                            }else{
                                                console.log("else::"+element.AgentID);
                                                resolve(element.AgentID);
                                            }
                                        })
                                    });
                                } else {
                                    resolve(null);
                                }
                            }
                        })
                    } else {
                        resolve(null);
                    }
                }
            })
        })
    },
    AssignTicketToCurrentSalesAgent: async function (accountid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_settings  WHERE setting_name="ticket_assign_agentgroup"', [], function (err, results) {
                if (err) {
                    resolve(null);
                } else {
                    if (results.length > 0) {
                        var agentgroupid = results[0].setting_value;
                        db.query('SELECT * FROM HuntGroupDetail  WHERE HuntGroupID=? AND AgentID='+accountid, [agentgroupid], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                                resolve(null);
                            } else {
                                if (results.length > 0) {
                                    resolve(results[0].AgentID);
                                } else {
                                    resolve(null);
                                }
                            }
                        })
                    } else {
                        resolve(null);
                    }
                }
            })
        })
    },
    GetAgentGroupsByManagerID: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT transfer_extesion FROM HuntGroup  WHERE AccountID=? and transfer_extesion>0', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
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
    GetMobileCircleOperator: async function (num) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM series  WHERE msc_code = ?', [num], function (err, results) {
                if (err) {
                    resolve([]);
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
    GetAgeConsentBrandSelectOption: async function (cdrid,ivrid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT extension FROM tf_getivrinput  WHERE cdrid = ? AND ivrid = ?', [cdrid,ivrid], function (err, results) {
                if (err) {
                    resolve(0);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].extension);
                    } else {
                        resolve(0);
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
}
module.exports = helper;