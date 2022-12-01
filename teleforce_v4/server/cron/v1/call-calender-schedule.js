var cron = require('node-cron');
//var Report = require('../../model/report');
var async = require('async');

var db = require('../../database/db');
var json2xls = require('json2xls');
var fs = require('fs');
var dateFormat = require('dateformat');
var moment = require('moment');
var helper = require('../../helper/common');
var dateFormat = require("dateformat");
var validator = require("email-validator");
var nodemailer = require('nodemailer');
var request = require('request');
const awry = require('awry');
var API = require('../../model/api');
var requestify = require('requestify'); 

//'*/3600 * * * * *'
cron.schedule("*/10 * * * * *", async () => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 10 second schedule call ==> ' + date_ob + ' ' + hours + ':' + minutes);

    var date1 = new Date();
    var date2 = new Date();

    date1.setMinutes(date1.getMinutes() - 1);
    var start_date = dateFormat(date1, "yyyy-mm-dd HH:MM:ss");

    date2.setMinutes(date2.getMinutes() + 1);
    var end_date = dateFormat(date2, "yyyy-mm-dd HH:MM:ss");

    console.log("start_date :" + start_date);
    console.log("end_date :" + end_date);

    if (hours > 7 && hours < 23) {
        await db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,a.mobile as account_mobile,a.did_alloted FROM tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id=a.account_id  WHERE s.is_call = 0 and s.meeting_type = "Call" and StartTime between "' + start_date + '" and "' + end_date + '" ', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("total schedule call :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata,async (data, callback) => {
                        //console.log(adata);
                        var s_id = data['s_id'];
                        var meeting_type = data['meeting_type'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var StartTime = data['StartTime'];
                        var EndTime = data['EndTime'];
                        var meeting_link = data['meeting_link'];
                        var AgentName = data['account_name'];
                        var account_email = data['account_email'];
                        var mobile = data['mobile'];
                        var account_mobile = data['account_mobile']?data['account_mobile']:'';
                        var s_id = data['s_id'];
                        var manager_id = data['managerid'];
                        var dateObj = new Date(StartTime);
                        var m_startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);
                        var dateObj_1 = new Date(EndTime);
                        var m_enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);
                        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;
                        var AgentNumber = account_mobile.toString()[0] == 0 ? account_mobile : '0' + account_mobile;
                        var did_alloted = data['did_alloted'];
                        var AgentID = data['user_id'];
                        var lastnote = data['Description'];
                        db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ' + manager_id + ' and current_status=0 and expiry_date >=CURDATE()', [], async function (err, mdata) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (mdata.length > 0) {
                                    var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                    const askrestapi = new awry.API({
                                        baseUrl: voiceserverdata.ari_url,
                                        username: voiceserverdata.ari_username,
                                        password: voiceserverdata.ari_password,
                                    });
                                    const agentsdata =  await helper.getAgentData(AgentID);
                                    console.log(agentsdata);
                                    if(agentsdata.length>0){
                                        if (did_alloted > 0) {
                                            var did = did_alloted;
                                            mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile;
                                            var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                            if(manager_id==1556 || manager_id==2319 || manager_id==2307 || manager_id==2600 || manager_id==2733 || manager_id==2791 || connectmethod==1){
                                                var agentchannels = await helper.getOnlyAgentVOIP([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                            }else{
                                                var agentchannels = await helper.getAgentVOIPStatus([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                            }
                                            var rs = agentchannels.join('&')
                                            var params = { 'endpoint': rs, callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": mobile, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing" } };
                                            await askrestapi.channels.originate(params).then(results => {
                                                //console.log(data)
                                                var chdata = results.data
                                                var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: customer_name, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING" }
                                                API.insertcdr(cdrdata, async function (err, result) {
                                                    var cdrid = result.insertId
                                                    await db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                                    console.log("Call originate succesfully.");
                                                })    
                                            }).catch(function (err) {
                                                console.log(err)
                                            });    
                                        } else {
                                            API.findoutgoingdid(manager_id, async function (err, results) {
                                                if (err) {
                                                    console.log("No Outgoing DID found!");
                                                } else {
                                                    if (results.length > 0) {
                                                        var didArr = results[0]
                                                        var did = didArr.did
                                                        mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile;
                                                        var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                                        if(manager_id==1556 || manager_id==2319 || manager_id==2307 || manager_id==2600 || manager_id==2733 || manager_id==2791 || connectmethod==1){
                                                            var agentchannels = await helper.getOnlyAgentVOIP([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                                        }else{
                                                            var agentchannels = await helper.getAgentVOIPStatus([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                                        }
                                                        var rs = agentchannels.join('&')
                                                        var params = { 'endpoint': rs, callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": mobile, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing" } };
                                                        await askrestapi.channels.originate(params).then(results => {
                                                            //console.log(data)
                                                            var chdata = results.data
                                                            var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: customer_name, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING" }
                                                            API.insertcdr(cdrdata, async function (err, result) {
                                                                if (err) return console.log(err)
                                                                cdrid = result.insertId
                                                                await db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                                                console.log("Call originate succesfully.");
                                                            })
                                                        }).catch(function (err) {
                                                            console.log(err)
                                                        });
                                                    } else {
                                                        console.log("No Outgoing DID found!");
                                                    }
                                                }
                                            })
                                        }    
                                    }else{
                                        console.log("Agent busy");
                                        var zdata = {id:AgentID,name:customer_name,number:mobile,time:m_startdate,lastnote:lastnote,schedule_id:s_id}
                                        var socketendpoint = await helper.GetSocketDomain(AgentID,1);
                                        requestify.request("https://"+socketendpoint+"/socketapi/callschedule", {
                                            method: 'POST',
                                            body: zdata,
                                            dataType: 'form-url-encoded',
                                        }).then(function(response) {
                                            console.log(response)
                                            helper.SendFirebaseNotification(AgentID,"Schedule Call","Schedule Call for : "+mobile+" ("+customer_name+") at "+m_startdate)
                                            db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                        })
                                        .fail(function(response) {  
                                            console.log(response)
                                            db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                        });
                                    }
                                } else {
                                    console.log("Account not active");
                                }
                            }
                        });
                    })
                }
            }
        });
    }else{
        await db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,a.mobile as account_mobile,a.did_alloted FROM tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id=a.account_id  WHERE s.is_call = 0 and s.meeting_type = "Call" and StartTime between "' + start_date + '" and "' + end_date + '" ', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("total schedule call :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        //console.log(adata);
                        var s_id = data['s_id'];
                        var meeting_type = data['meeting_type'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var StartTime = data['StartTime'];
                        var EndTime = data['EndTime'];
                        var meeting_link = data['meeting_link'];
                        var AgentName = data['account_name'];
                        var account_email = data['account_email'];
                        var mobile = data['mobile'];
                        var account_mobile = data['account_mobile'];
                        var s_id = data['s_id'];
                        var manager_id = data['managerid'];
                        var dateObj = new Date(StartTime);
                        var m_startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);
                        var dateObj_1 = new Date(EndTime);
                        var m_enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);
                        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;
                        var AgentNumber = account_mobile.toString()[0] == 0 ? account_mobile : '0' + account_mobile;
                        var did_alloted = data['did_alloted'];
                        var AgentID = data['user_id'];
                        var lastnote = data['Description'];

                        db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ' + manager_id + ' and current_status=0 and expiry_date >=CURDATE()', [], async function (err, mdata) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (mdata.length > 0) {
                                    console.log("Agent busy");
                                    const zdata = {id:AgentID,name:customer_name,number:mobile,time:m_startdate,lastnote:lastnote,schedule_id:s_id}
                                    var socketendpoint = await helper.GetSocketDomain(AgentID,1);
                                    requestify.request("https://"+socketendpoint+"/socketapi/callschedule", {
                                        method: 'POST',
                                        body: zdata,
                                        dataType: 'form-url-encoded',
                                    }).then(function(response) {
                                        console.log(response)
                                        helper.SendFirebaseNotification(AgentID,"Schedule Call","Schedule Call for : "+mobile+" ("+customer_name+") at "+m_startdate)
                                        db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                    })
                                    .fail(function(response) {  
                                        console.log(response)
                                        db.query('UPDATE tf_scheduler SET is_call=1 where s_id=' + s_id);
                                    });
                                } else {
                                    console.log("Account not active");
                                }
                            }
                        });
                    })
                }
            }
        });
    }
});


function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}