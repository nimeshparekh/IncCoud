var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Signin = require('../model/signin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
const awry = require('awry');
var path = require('path');
var Zoho = require('../model/zoho');
var requestify = require('requestify'); 
const { urlencoded } = require('body-parser');
var moment = require('moment')
var API = require('../model/api');

var zohoclientid = '1000.B7BW369Z9Y6KAQMAYYQVJ9XHHRZ1EJ'
var zohoclientsecret = '661e923c8fd464b270ff62a92b212e422f871309d7'
var Accounts_URL = 'https://accounts.zoho.in'
var redirecturi = 'https://dev.cloudX.in/api/zoho/'

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.post('/generatecall', function (req, res) {
    console.log(req.body)
    var authkey = req.body.authkey;
    var agentid = req.body.agentid;
    var mobile = req.body.mobile;
    mobile = mobile.replace(/\s/g, '');
    mobile = mobile.replace('+', '');
    mobile = mobile.replace(/-/g, '');
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                API.getuserdetail(agentid, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'db error' });
                    }
                    else {
                        if (rows.length > 0) {
                            var adata = rows[0]
                            var manager_id = adata.created_by
                            var AgentNumber = adata.mobile
                            var AgentName = adata.account_name
                            API.checkactiveamanageraccount(manager_id, function (err, results) {
                                if (err) {
                                    res.status(200).send({ "msg": 'server error' });
                                } else {
                                    if (results.length > 0) {
                                        requestify.request("https://uat.cloudX.in/socketapi/checkagentsocket", {
                                            method: 'POST',
                                            body: { userid: agentid },
                                            dataType: 'form-url-encoded',
                                        }).then(function (response) {
                                            console.log(response.body , "==api success==" )
                                            var resdata = JSON.parse(response.body)
                                            console.log(resdata['msg'])
                                            if(resdata['msg']){
                                                var cdrdata = { accountid: manager_id, serviceid: 9, CallerType: 1, CallerName: mobile, CallerNumber: mobile, AgentID: agentid, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 0, AgentStatus: "CALLING" }
                                                API.insertcdr(cdrdata, function (err, result) {
                                                    if (err) return console.log(err)
                                                    var cdrid = result.insertId
                                                    requestify.request("https://uat.cloudX.in/socketapi/autocalldial", {
                                                        method: 'POST',
                                                        body: { userid: agentid,callernumber:mobile,cdrid:cdrid },
                                                        dataType: 'form-url-encoded',
                                                    }).then(function (response) {
                                                        console.log(response , "==api success==")
                                                        var resdata = JSON.parse(response.body)
                                                        if(resdata['msg']){
                                                            res.status(200).send({ "msg": "Call originate succesfully.", 'id': cdrid });
                                                        }else{
                                                            res.status(200).send({ "msg": 'Agent not logged in.' });
                                                        }
                                                    }).fail(function (response) {
                                                        console.log(response , "==api error==")
                                                        res.status(200).send({ "msg": 'Agent not logged in.' });
                                                    });
                                                    //res.status(200).send({ "msg": "Call originate succesfully.", "uid": chdata.id, 'id': cdrid });
                                                })
                                            }else{
                                                res.status(200).send({ "msg": 'Agent not logged in.' });
                                            }
                                        }).fail(function (response) {
                                            console.log(response , "==api error==")
                                            res.status(200).send({ "msg": 'Agent not logged in.' });
                                        });
                                        
                                    } else {
                                        res.status(200).send({ "msg": 'Account not active' });
                                    }
                                }
                            })
                        } else {
                            res.status(200).send({ "msg": 'Invalid agent id' });
                        }
                    }
                });
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})


router.post('/updatecalllog', function (req, res) {
    console.log(req.body)
    var cdrid = req.body.cdrid
    var callernumber = req.body.callernumber
    var duration = req.body.duration
    var callstatus = 'NOANSWER'
    var agentcallstatus = 'ANSWER'
    if(duration>0){
        callstatus = 'ANSWER'
    }
    var callendtime = new Date()
    var cdrdata = {CallStatus:callstatus,AgentStatus:agentcallstatus,CallEndTime:callendtime,CdrStatus:0,CallTalkTime:duration,CallDuration:duration}
    API.updatecdr(cdrdata,cdrid, function (err, result) {
        console.log(result)
    })
    res.json({"msg":"success"});
})

router.post('/agentoutgoingcall', function (req, res) {
    console.log(req.body)
    var agentid = req.body.agentid;
    var mobile = req.body.mobile;
    mobile = mobile.replace(/\s/g, '');
    mobile = mobile.replace('+', '');
    mobile = mobile.replace(/-/g, '');
    if(agentid>0){
        API.getuserdetail(agentid, function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'db error' });
            }
            else {
                if (rows.length > 0) {
                    var adata = rows[0]
                    var manager_id = adata.created_by
                    var AgentNumber = adata.mobile
                    var AgentName = adata.account_name
                    API.checkactiveamanageraccount(manager_id, function (err, results) {
                        if (err) {
                            res.status(200).send({ "msg": 'server error' });
                        } else {
                            if (results.length > 0) {
                                var cdrdata = { accountid: manager_id, serviceid: 9, CallerType: 1, CallerName: mobile, CallerNumber: mobile, AgentID: agentid, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 0, AgentStatus: "CALLING" }
                                API.insertcdr(cdrdata, function (err, result) {
                                    if (err){
                                        res.status(200).send({ "msg": 'server error' });
                                    }else{
                                        var cdrid = result.insertId
                                        res.status(200).send({ "msg": "Call originate succesfully.", 'id': cdrid });    
                                    }
                                })
                            } else {
                                res.status(200).send({ "msg": 'Account not active' });
                            }
                        }
                    })
                } else {
                    res.status(200).send({ "msg": 'Invalid agent id' });
                }
            }
        });
    }else{
        res.status(200).send({ "msg": 'Invalid agent id' });
    }
})

module.exports = router;