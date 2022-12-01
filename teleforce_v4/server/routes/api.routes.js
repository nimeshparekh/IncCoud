var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var API = require('../model/api');
var crypto = require('crypto');
const awry = require('awry');
var urllib = require('urllib');
var multer = require('multer');
const mime = require('mime');
var helper = require("../helper/common");
var Contacts = require('../model/Contacts');
var validator = require("email-validator");
var nodemailer = require('nodemailer');
var dateFormat = require("dateformat");
var now = new Date();
const request = require('request');
var db = require('../database/db');
require("dotenv").config();
//console.log(process.env.ERPURL)
const validatePhoneNumber = require('validate-phone-number-node-js');
var moment = require('moment'); // require
var admin = require("firebase-admin");
var serviceAccount = require("../teleforce-ebf8e-firebase-adminsdk-8e948-fa48e52af3.json");
const authorize = require("../middlewares/auth");
var ERP = require('../model/erp');
var Call = require('../model/call');
var async = require("async");
var requestify = require('requestify');
const bcrypt = require('bcryptjs');
var Default = require('../model/default');

// console.log(moment(new Date('2022-08-22 13:31:41')).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss'))

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var APIRESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
var RESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
// var APIRESTERPNext = new APIRESTERPNext({
//     username: 'Administrator',
//     password: 'Garuda@dv1234',
//     baseUrl: 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
// })
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://cloudX-ebf8e.firebaseio.com"
//   });

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}
router.get('/generateauthkey/:id', function (req, res) {
    accountid = req.params.id
    crypto.randomBytes(32, (err, buf) => {
        if (err) throw err;
        const key = buf.toString('hex');
        //console.log(key)
        API.updateUser({ AccessKey: key }, accountid, function (err, rows) {
            if (err) {
                console.log(err)
                res.status(200).send({ "err": 'db error' });
            }
            else {
                res.status(200).send({ "msg": 'API key generated successfully' });
            }
        })
    })
});

//Get All Agent
router.post('/getallagent', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                aid = rows[0].account_id
                API.getallmanageragent(aid, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

//Outgoing Call
router.post('/agentoutgoingcall',async function (req, res) {
    console.log("s here");
    console.log(req.body)
    var authkey = req.body.authkey;
    var agentid = req.body.agentid;
    var maxduration = req.body.maxduration?req.body.maxduration:7200;
    var mobile = req.body.mobile;
    mobile = mobile.replace(/\s/g, '');
    mobile = mobile.replace('+', '');
    mobile = mobile.replace(/-/g, '');
    mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
    mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
    var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
    console.log('secondarysip',secondarysip)
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
                            var AgentID = adata.account_id
                            // console.log(AgentID)
                            var AgentNumber = adata.mobile
                            AgentNumber = AgentNumber.toString()[0] == 0 ? AgentNumber : '0' + AgentNumber
                            var AgentName = adata.account_name
                            var manager_id = adata.created_by
                            var did_alloted = adata.did_alloted
                            API.checkactiveamanageraccount(manager_id,async function (err, results) {
                                if (err) {
                                    res.status(200).send({ "msg": 'server error' });
                                } else {
                                    if (results.length > 0) {
                                        var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                        const askrestapi = new awry.API({
                                            baseUrl: voiceserverdata.ari_url,
                                            username: voiceserverdata.ari_username,
                                            password: voiceserverdata.ari_password,
                                        });
                                        if (did_alloted > 0) {
                                            var did = did_alloted
                                            if(secondarysip=='yes'){
                                                did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                            }
                                            var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                            if(connectmethod==1){
                                                var agentchannels = await helper.getOnlyAgentVOIP([{ account_name: AgentName, mobile: AgentNumber }], did,manager_id)
                                            }else if(connectmethod==0){
                                                var agentchannels = await helper.getAgentVOIPStatus([{ account_name: AgentName, mobile: AgentNumber }], did,manager_id)
                                            }else{
                                                var agentchannels = ['PJSIP/' + AgentNumber + '@SM' + did]
                                            }
                                            console.log(agentchannels)
                                            var params = { 'endpoint': agentchannels[0], callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": mobile, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing","Maxduration":String(maxduration) } };
                                            askrestapi.channels.originate(params).then(results => {
                                                console.log('api success',agentchannels)
                                                var chdata = results.data
                                                var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: mobile, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING" }
                                                API.insertcdr(cdrdata, function (err, result) {
                                                    if (err) return console.log(err)
                                                    var cdrid = result.insertId
                                                    res.status(200).send({ "msg": "Call originate succesfully.", "uid": chdata.id, 'id': cdrid });
                                                })
                                            }).catch(function (err) {
                                                //console.log(err)
                                                console.log('ari error')
                                                res.status(200).send({ "msg": 'Something went wrong!' });
                                            });
                                        } else {
                                            API.findoutgoingdid(manager_id,async function (err, results) {
                                                if (err) {
                                                    res.status(200).send({ "msg": 'db error' });
                                                } else {
                                                    if (results.length > 0) {
                                                        var didArr = results[0]
                                                        var did = didArr.did
                                                        if(secondarysip=='yes'){
                                                            did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                                        }
                                                        var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                                        if(connectmethod==1){
                                                            var agentchannels = await helper.getOnlyAgentVOIP([{ account_name: AgentName, mobile: AgentNumber }], did,manager_id)
                                                        }else if(connectmethod==0){
                                                            var agentchannels = await helper.getAgentVOIPStatus([{ account_name: AgentName, mobile: AgentNumber }], did,manager_id)
                                                        }else{
                                                            var agentchannels = ['PJSIP/' + AgentNumber + '@SM' + did]
                                                        }
                                                        console.log(agentchannels)
                                                        var params = { 'endpoint': agentchannels[0], callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": mobile, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing","Maxduration":String(maxduration) } };
                                                        askrestapi.channels.originate(params).then(results => {
                                                            console.log('api success',agentchannels)
                                                            var chdata = results.data
                                                            var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: mobile, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING" }
                                                            API.insertcdr(cdrdata, function (err, result) {
                                                                if (err) return console.log(err)
                                                                var cdrid = result.insertId
                                                                res.status(200).send({ "msg": "Call originate succesfully.", "uid": chdata.id, 'id': cdrid });
                                                            })
                                                        }).catch(function (err) {
                                                            console.log('ari error')
                                                            res.status(200).send({ "msg": 'Something went wrong!' });
                                                        });
                                                    } else {
                                                        res.status(200).send({ "msg": 'No Outgoing DID found!' });
                                                    }
                                                }
                                            })
                                        }
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

//Outgoing IVR Call
router.post('/ivroutgoingcall', function (req, res) {
    var weekdayArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    let date_ob = new Date();
    let nowhours = date_ob.getHours()
    let nowminute = date_ob.getMinutes()
    let nowsecond = date_ob.getSeconds()
    let nowday = date_ob.getDay()
    console.log('ivroutgoingcall',nowhours+':'+nowminute+':'+nowsecond+'==>'+nowday)
    var beginningTime = moment().set('hour', "10").set('minute', "00");
    var endTime = moment().set('hour', "19").set('minute', "00");
    var nowtime = moment(new Date(),"HH:mm")
    if(nowday>0 && nowtime.isBetween(beginningTime,endTime)){
        console.log('valid time')
        var authkey = req.body.authkey?req.body.authkey:'';
        var ivrid = req.body.ivrid?req.body.ivrid:0;
        var mobile = req.body.mobile?req.body.mobile:'';
        var inputcode = req.body.code?req.body.code:0;
        var ticketdata = {
            "channel": req.body.channel?req.body.channel:'',
            "invoice": req.body.invoice?req.body.invoice:'',
            "ticket_id": req.body.code?req.body.code:'',
            "model_number": req.body.model_number?req.body.model_number:'',
            "mobile_number": req.body.mobile?req.body.mobile:'',
            "product_group": req.body.product_group?req.body.product_group:'',
            "product_image": req.body.product_image?req.body.product_image:'',
            "purchase_date": req.body.purchase_date?req.body.purchase_date:'',
            "ticket_status": req.body.ticket_status?req.body.ticket_status:'',
            "problem_description": req.body.problem_description?req.body.problem_description:'',
        }
        if(mobile!=''){
            mobile = mobile.replace(/\s/g, '');
            mobile = mobile.replace('+', '');
            mobile = mobile.replace(/-/g, '');
            mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
            mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
            API.checkauthkey(authkey, function (err, rows) {
                if (err) {
                    res.status(200).send({ "msg": 'server error' });
                }
                else {
                    if (rows.length > 0) {
                        var manager_id = rows[0].account_id
                        API.getIVRDetail(ivrid, function (err, rows) {
                            if (err) {
                                res.status(200).send({ "msg": 'db error' });
                            }
                            else {
                                if (rows.length > 0) {
                                    var ivrdata = rows[0]
                                    API.checkactiveamanageraccount(manager_id,async function (err, results) {
                                        if (err) {
                                            res.status(200).send({ "msg": 'server error' });
                                        } else {
                                            if (results.length > 0) {
                                                var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
                                                API.findoutgoingdid(manager_id,async function (err, results) {
                                                    if (err) {
                                                        res.status(200).send({ "msg": 'db error' });
                                                    } else {
                                                        if (results.length > 0) {
                                                            var didArr = results[0]
                                                            var did = didArr.did
                                                            if(secondarysip=='yes'){
                                                                did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                                            }
                                                            //var params = { 'endpoint': 'PJSIP/' + mobile + '@SM' + did, callerId: did, extension: mobile, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": mobile, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing" } };
                                                            var rdata = {mobile:mobile,did:did,manager_id:manager_id,ivrid:ivrid,inputcode:inputcode,ticketdata:JSON.stringify(ticketdata)}
                                                            API.insertnextbaserequest(rdata, function (err, result) {
                                                                res.status(200).send({ "msg": "Call originate succesfully."});
                                                            })
                                                        } else {
                                                            res.status(200).send({ "msg": 'No Outgoing DID found!' });
                                                        }
                                                    }
                                                })
                                            } else {
                                                res.status(200).send({ "msg": 'Account not active' });
                                            }
                                        }
                                    })
                                } else {
                                    res.status(200).send({ "msg": 'Invalid IVR ID' });
                                }
                            }
                        });
                    } else {
                        res.status(200).send({ "msg": 'Invalid auth key' });
                    }
                }
            })
        }else{
            res.status(200).send({ "msg": 'Invalid mobile' });
        }
    }else{
        console.log('Invalid time')
        res.status(200).send({ "msg": 'Invalid time' });
    }
})

// Pull CDR Report by uid
router.post('/pullreport', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var uid = req.body.uid;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                API.findcdrbyuid(uid, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

// Pull CDR Report by id
router.post('/pullreportbyid', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var uid = req.body.id;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                API.findcdrbyid(uid, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

// Pull CDR Incoming Call By Date
router.post('/pullincomingreport', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var date = req.body.date;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                API.findincomingcdrbydate(date, rows[0].account_id, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})


//Mobile Verification
router.post('/verifymobile', function (req, res) {
    console.log(req.body)
    var mobile = req.body.mobile;
    var user_id = req.body.user_id;
    API.getuserdetail(user_id,async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            if (rows.length > 0) {
                console.log(rows)
                var adata = rows[0]
                if (adata.account_type == 1) {
                    manager_id = adata.created_by
                } else {
                    manager_id = user_id
                }
                var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                API.findverifydid(manager_id, function (err, results) {
                    if (err) {
                        res.status(200).send({ "msg": 'db error' });
                    } else {
                        console.log(results)
                        if (results.length > 0) {
                            didArr = results[0]
                            did = didArr.did
                            params = { 'endpoint': 'PJSIP/' + mobile + '@SM' + did, callerId: did, extension: mobile, context: "cloudX_verify", variables: { "DID": did, "CallerNumber": mobile } };
                            askrestapi.channels.originate(params).then(data => {
                                console.log(data)
                                channelid = data.data['id']
                                vdata = { mobile: mobile, did: did, channelid: channelid }
                                API.insertverifymobile(vdata)
                                res.status(200).send({ "msg": "Call originate succesfully." });
                            }).catch(function (err) {
                                console.log(err)
                            });
                        }
                    }
                })
            }
        }
    })
})
router.post('/checkverifymobile',async function (req, res) {
    var mobile = req.body.mobile;
    var did = req.body.did;
    var user_id = req.body.user_id;
    var voiceserverdata = await helper.GetManagerVoiceServerData(user_id)
    const askrestapi = new awry.API({
        baseUrl: voiceserverdata.ari_url,
        username: voiceserverdata.ari_username,
        password: voiceserverdata.ari_password,
    });
    API.findverifynumber(mobile, function (err, rows) {
        if (rows.length > 0) {
            var data = rows[0]
            console.log(data)
            API.updateverifynumber({ verify: 'yes' }, data.id, function (err, rows) {

            })
            API.updateUser({ is_mobile_verify: 'yes' }, user_id, function (err, rows) {

            })
            var params = { 'channelId': data.channelid, reason: 'no_answer' };
            askrestapi.channels.hangup(params).then(data => {
                console.log(data)
            }).catch(function (err) {
                console.log(err)
            });
            res.status(200).send({ "msg": "success" });
        } else {
            res.status(200).send({ "msg": "failed" });
        }
    });
})


//SMS API OTP ROUTE
router.get('/sendotp', function (req, res) {
    console.log(req.query)
    var authkey = req.query.authkey;
    var mobile = req.query.mobile;
    var message = req.query.message;
    if (/^\d{11}$/.test(mobile)) {
        API.checkauthkey(authkey, function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                if (rows.length > 0) {
                    adata = rows[0]
                    manager_id = adata.account_id
                    API.checkactiveamanageraccount(manager_id, function (err, results) {
                        if (err) {
                            res.status(200).send({ "msg": 'server error' });
                        } else {
                            if (results.length > 0) {
                                var smsurl = "https://bulksmsapi.vispl.in/?username=garudotp&password=garuda@123&messageType=text&mobile=" + mobile + "&senderId=GARADV&ContentID=1&EntityID=1701159385149488800&message=" + message
                                urllib.request("http://192.168.1.26:3001/api/sendsms/", {
                                    method: 'POST',
                                    data: { smsurl: smsurl },
                                    rejectUnauthorized: false,
                                }, function (error, resp) {
                                    if (error) {
                                        console.log(error)
                                        res.status(200).send({ "msg": error });
                                    }
                                    else {
                                        console.log(resp)
                                        var smsstatus = 'sent';
                                        var smscredit = message.length < 160 ? 1 : 2;
                                        var numberdata = { cdr_id: 0, account_id: manager_id, mobile: mobile, text: message, sms_status: smsstatus, sms_credit: smscredit, sentdate: new Date() };
                                        API.insertsmsdata(numberdata, function (err, count) {
                                            if (err) {
                                                //console.log(err);
                                            } else {

                                            }
                                        })
                                        res.status(200).send({ "msg": 'Message sent.' });
                                    }
                                });
                            } else {
                                res.status(200).send({ "msg": 'Account not active' });
                            }
                        }
                    })
                } else {
                    res.status(200).send({ "msg": 'Invalid auth key' });
                }
            }
        })
    } else {
        res.status(200).send({ "msg": 'Invalid mobile' });
    }
})

router.post('/uploads', function (req, res, next) {
    var m = new Date();
    var imgid = 'IMG' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/media')
        },
        filename: function (req, file, cb) {
            cb(null, imgid + '.' + mime.getExtension(file.mimetype))
        },
    })
    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured");
        }
        else {
            console.log(req.file);
            var customerid = req.body.customerid;
            var type = req.file.mimetype;
            var filename = req.file.filename;
            var path = req.file.path;
            var size = req.file.size;
            res.status(200).send({ 'filelink': 'https://agent.cloudX.in/api/media/' + req.file.filename });
        };
    });
})

router.post('/createcontact', async function (req, res) {
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                var m = new Date();
                var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                req.body.cont_id = cont_id;
                req.body.created_date = m;
                var mobile = req.body.mobile
                var email = req.body.email
                var name = req.body.name;
                var category = req.body.category;
                var address = req.body.address;
                var city = req.body.city;
                var state = req.body.state;
                var lead_source = req.body.lead_source
                var extraitems = req.body.extraparams // Array 
                var campaignid = req.body.campaignid
                var data = { cont_id: cont_id, customer_id: managerid, created_date: m, name: name, email: email, mobile: mobile, address: address, city: city, state: state, lead_source: lead_source, category: category, created_by: managerid }
                Contacts.createcontact(data, function (err, result) {
                    console.log(err)
                    if (err) {
                        res.status(400).json(err);
                    }
                    else {
                        var conid = cont_id
                        extraitems = JSON.parse(extraitems)
                        console.log(extraitems)
                        const extraArr = Array.from(Object.keys(extraitems), k => [`${k}`, extraitems[k]]);
                        console.log(extraArr)
                        if (extraArr != undefined && extraArr.length > 0) {
                            extraArr.forEach(item => {
                                // console.log(item)
                                console.log(item[0] + "====" + item[1])
                                helper.SaveContactMeta(item[0], item[1], conid, managerid)
                            });
                        }
                        if (campaignid > 0) {
                            helper.UpdateCampaignNumbers(campaignid, managerid, conid, category)
                        }
                        res.json({ 'msg': 'Contact added sucessfully!' });
                    }
                });
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
});

router.post('/createlead', async function (req, res) {
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                var m = new Date();
                var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                req.body.cont_id = cont_id;
                req.body.created_date = m;
                var mobile = req.body.mobile
                var email = req.body.email
                var name = req.body.name;
                var category = req.body.category;
                var address = req.body.address;
                var city = req.body.city;
                var state = req.body.state;
                var lead_source = req.body.lead_source
                var lead_id = req.body.lead_id
                if (lead_id != '') {
                    if (isNumeric(lead_id)) { } else {
                        lead_id = await GenerateLeadFromErp(lead_id, managerid)
                    }
                } else {
                    lead_id = ''
                }
                var extraitems = req.body.extraparams // Array 
                var campaignid = req.body.campaignid
                var emailcampaignid = req.body.emailcampaignid
                var smscampaignid = req.body.smscampaignid
                var data = { cont_id: cont_id, customer_id: managerid, created_date: m, name: name, email: email, mobile: mobile, address: address, city: city, state: state, lead_source: lead_source, category: category, created_by: managerid, lead_id: lead_id }
                Contacts.createcontact(data, function (err, result) {
                    console.log(err)
                    if (err) {
                        res.status(400).json(err);
                    }
                    else {
                        var conid = cont_id
                        //console.log(extraitems)
                        const extraArr = Array.from(Object.keys(extraitems), k => [`${k}`, extraitems[k]]);
                        //console.log(extraArr)
                        if (extraArr != undefined && extraArr.length > 0) {
                            extraArr.forEach(item => {
                                // console.log(item)
                                console.log(item[0] + "====" + item[1])
                                helper.SaveContactMeta(item[0], item[1], conid, managerid)
                            });
                        }
                        if (campaignid > 0) {
                            helper.UpdateCampaignNumbers(campaignid, managerid, conid, category)
                        }
                        if (emailcampaignid > 0) {
                            helper.UpdateEmailCampaignNumbers(campaignid, managerid, conid, category)
                        }
                        res.json({ 'msg': 'Contact added sucessfully!' });
                    }
                });

                //Send Email
                if (managerid == 48 || managerid == 42) {
                    if (email != '') {
                        var transOptions = {
                            host: 'mail.cloudX.in',
                            port: 587,
                            secure: false,
                            auth: {
                                user: 'no-reply@cloudX.in',
                                pass: 'Garuda@dv3',
                            },
                        };
                        var transporter = nodemailer.createTransport(transOptions);
                        var frommail = "cloudX<no-reply@cloudX.in>"
                        API.getemaildetail(22, function (err, rows) {
                            if (rows.length > 0) {
                                var row = rows[0]
                                var subject = "Thank you for interest in our service."
                                var emailhtml = row.email_html
                                var toemail = email
                                emailhtml = replaceAll(emailhtml, '[name]', name)
                                var mailOptions = {
                                    from: frommail,
                                    to: toemail,
                                    subject: subject,
                                    html: emailhtml,
                                    attachments: [
                                        {
                                            path: './uploads/cloudX.pdf'
                                        }
                                    ]
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        var response = info.response
                                        var info = {}
                                        info.User_id = managerid
                                        info.email_to = email
                                        info.lead_name = leadid
                                        info.frommail = frommail
                                        info.response = response
                                        API.addleadsemail_db(info)
                                    }
                                })
                            }
                        })
                    }
                }
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
});

//Get Campaigns
router.post('/getcampaigns', async function (req, res) {
    var username = req.body.username;
    var type = req.body.type;
    API.getuserdetailbyname(username, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                if (type != '') {
                    API.getCampaign(managerid, type, async function (err, rows) {
                        if (err) {
                            res.status(200).send({ "msg": 'server error' });
                        }
                        else {
                            res.status(200).send({ "data": rows });
                        }
                    })
                } else {
                    res.status(200).send({ "msg": 'Invalid type passed' });
                }
            } else {
                res.status(200).send({ "msg": 'No manager found!' });
            }
        }
    })
})
router.post('/getsegments', async function (req, res) {
    var username = req.body.username;
    API.getuserdetailbyname(username, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                API.getSegment(managerid, async function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'No manager found!' });
            }
        }
    })
})
router.post('/getagentgroup', async function (req, res) {
    var username = req.body.username;
    API.getuserdetailbyname(username, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                API.getAgentGroup(managerid, async function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'No manager found!' });
            }
        }
    })
})

router.post('/getauthkey', function (req, res) {
    var username = req.body.username
    API.getuserdetailbyname(username, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(200).send({ "authkey": '', "erp_email": "", "erp_password": "" });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "authkey": rows[0].AccessKey, "erp_email": rows[0].erp_email, "erp_username": rows[0].erp_username, "erp_password": rows[0].erp_password });
            } else {
                res.status(200).send({ "authkey": '', "erp_email": "", "erp_password": "" });
            }
        }
    })
});
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
function GenerateLeadFromErp(leadid, userid) {
    return new Promise(function (resolve, reject) {
        console.log(leadid)
        APIRESTERPNext.sainterpnext('/api/resource/Lead/' + leadid, 'GET', null).then(function (response) {
            if (response) {
                console.log(response)
                var lead = response
                lead.User_id = userid
                lead.is_sync = "yes"
                API.addlead_db(lead, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var lead_id = rows.insertId;
                        if (lead_id > 0) {
                            resolve(lead_id);
                        } else {
                            resolve(0);
                        }
                    }
                })
            }
        }).catch(function (error) {
            console.log(error);
            resolve(0);
        })

    })
}

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

router.post('/callschedule', async function (req, res) {
    var authkey = req.body.authkey;
    var scheduledatetime = req.body.scheduledatetime
    var agentid = req.body.agentid?req.body.agentid:0
    var mobile = req.body.mobile?req.body.mobile:''
    var description = req.body.description?req.body.description:''
    var customername = req.body.customername?req.body.customername:''
    API.checkauthkey(authkey, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                var sdata = { meeting_type: 'Call', customer_name: customername, Description: description, mobile: mobile, user_id: agentid, StartTime: scheduledatetime, EndTime: scheduledatetime,account_id: managerid};
                API.insertscheduledata(sdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "msg": 'server error' });
                    }else{
                        res.status(200).send({ "msg": 'call schedule successfully.' });
                    }
                })
            }else{
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

router.post('/Schedule', async function (req, res) {
    var data = req.body;
    console.log("key ::");
    console.log(JSON.stringify(data));
    var action = data.action;
    var added = data.added ? data.added : [];
    var deleted = data.deleted ? data.deleted : [];
    var changed = data.changed ? data.changed : [];
    var customer_id = data.params['customer_id'];
    var StartDate = data.params['StartDate'];
    var EndDate = data.params['EndDate'];
    var digitsrandom = Math.floor(100000 + Math.random() * 900000);
    var meeting_link = "https://meet.cloudX.in/" + digitsrandom;
    var short_link = await helper.CreateShortLink(meeting_link);
    var meet_link = "https://slss.in/" + short_link;

    if (added.length > 0) {
        var RoomId = added[0]['RoomId'];

        var dateObj = new Date(added[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(added[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);


        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (added[0]['EventType'] == 'Video') {
            var meet_desc = added[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = added[0]['Description'];
        }

        var data = {
            customer_name: added[0]['Subject'],
            email: added[0]['Location'],
            meeting_type: added[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: added[0]['OwnerId'],
            user_id: customer_id,
            meeting_link: (added[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (added[0]['EventType'] == 'Video') ? meeting_link : '',
        };

        API.insertscheduledata(data, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                res.status(200).send([]);
            }
        })


    } else if (changed.length > 0) {
        var dateObj = new Date(changed[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(changed[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (changed[0]['EventType'] == 'Video') {
            var meet_desc = changed[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = changed[0]['Description'];
        }

        var data = {
            customer_name: changed[0]['Subject'],
            email: changed[0]['Location'],
            meeting_type: changed[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: changed[0]['OwnerId'],
            user_id: customer_id,
            s_id: changed[0]['ID'],
            meeting_link: (changed[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (changed[0]['EventType'] == 'Video') ? meeting_link : '',
        };

        API.updatescheduledata(data, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": err });
            }
            else {
                res.status(200).send([]);
            }
        })

    } else if (deleted.length > 0) {
        var sid = deleted[0]['ID'];
        API.deletescheduledata(sid, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": err });
            }
            else {
                res.status(200).send([]);
            }
        })

    } else {
        API.getcalenderschedulelist(customer_id,StartDate,EndDate, async function (err, rows) {
            if (err) {
                res.status(200).send([]);
            }
            else {
                res.status(200).send(rows);
            }
        })
    }
})

router.post('/CustomerSchedule', async function (req, res) {
    var data = req.body;
    console.log("key ::");
    console.log(JSON.stringify(data));

    var action = data.action;
    var added = data.added ? data.added : [];
    var deleted = data.deleted ? data.deleted : [];
    var changed = data.changed ? data.changed : [];
    var customer_id = data.params['customer_id'];
    var secret = data.params['secret'];

    var digitsrandom = Math.floor(100000 + Math.random() * 900000);
    var meeting_link = "https://meet.cloudX.in/" + digitsrandom;

    var short_link = await helper.CreateShortLink(meeting_link);
    var meet_link = "https://slss.in/" + short_link;


    if (added.length > 0) {
        var dateObj = new Date(added[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(added[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);


        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (added[0]['EventType'] == 'Video') {
            var meet_desc = added[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = added[0]['Description'];
        }

        var data = {
            customer_name: added[0]['Subject'],
            email: added[0]['Location'],
            meeting_type: added[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: added[0]['OwnerId'],
            user_id: customer_id,
            meeting_link: (added[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (added[0]['EventType'] == 'Video') ? meeting_link : '',
        };


        API.insertscheduledata(data, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                res.status(200).send([]);
            }
        })

    } else {

        API.agentschdulelist(customer_id, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                console.log(rows);
                res.status(200).send(rows);
            }
        })
    }
})

router.post('/AppointmentSchedule', async function (req, res) {
    var data = req.body;
    //console.log("key ::");
    //console.log(JSON.stringify(data));

    var action = data.action;
    var added = data.added ? data.added : [];
    var deleted = data.deleted ? data.deleted : [];
    var changed = data.changed ? data.changed : [];
    var meeting_id = data.params['customer_id'];
    console.log("meeting_id ::" + meeting_id);
    var secret = data.params['secret'];

    var digitsrandom = Math.floor(100000 + Math.random() * 900000);
    var meeting_link = "https://meet.cloudX.in/" + digitsrandom;

    var short_link = await helper.CreateShortLink(meeting_link);
    var meet_link = "https://slss.in/" + short_link;


    if (added.length > 0) {
        var dateObj = new Date(added[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(added[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);


        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (added[0]['EventType'] == 'Video') {
            var meet_desc = added[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = added[0]['Description'];
        }

        var data = {
            customer_name: added[0]['Subject'],
            email: added[0]['Location'],
            meeting_type: added[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: added[0]['OwnerId'],
            meeting_link: (added[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (added[0]['EventType'] == 'Video') ? meeting_link : '',
        };

        //Get data from meeting id
        await API.getmeetingdata(meeting_id, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                var customer_id = rows[0]['customer_id'];
                var agent_id = rows[0]['agent_id'];
                data['user_id'] = agent_id;
                data['customer_id'] = customer_id;

                await API.insertscheduledata(data, async function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        res.status(200).send([]);
                    }
                })
            }
        })



    } else {

        API.agentmeetingschdulelist(meeting_id, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                console.log(rows);
                res.status(200).send(rows);
            }
        })
    }
})

router.post('/ManagerSchedule', async function (req, res) {
    var data = req.body;
    console.log("new key ::",req.body);
    //console.log(JSON.stringify(data));


    var action = data.action;
    var added = data.added ? data.added : [];
    var deleted = data.deleted ? data.deleted : [];
    var changed = data.changed ? data.changed : [];
    var customer_id = data.params['customer_id'];
    var StartDate = data.params['StartDate'];
    var EndDate = data.params['EndDate'];
    var secret = data.params['secret'];
    var where = data.where;

    if (added.length > 0) {

        var dateObj = new Date(added[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(added[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

        var digitsrandom = Math.floor(100000 + Math.random() * 900000);
        //added.meeting_link = "https://meet.cloudX.in/"+digitsrandom
        var meeting_link = "https://meet.cloudX.in/" + digitsrandom;

        var short_link = await helper.CreateShortLink(meeting_link);
        var meet_link = "https://slss.in/" + short_link;

        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (added[0]['EventType'] == 'Video') {
            var meet_desc = added[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = added[0]['Description'];
        }

        var data = {
            customer_name: added[0]['Subject'],
            email: added[0]['Location'],
            meeting_type: added[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: added[0]['OwnerId'],
            user_id: customer_id,
            meeting_link: (added[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (added[0]['EventType'] == 'Video') ? meeting_link : '',
        };
        console.log("data");
        //console.log(data);
        API.insertscheduledata(data, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                res.status(200).send([]);
            }
        })


    } else if (changed.length > 0) {
        var dateObj = new Date(changed[0]['StartTime']);
        var startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

        var dateObj_1 = new Date(changed[0]['EndTime']);
        var enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

        var digitsrandom = Math.floor(100000 + Math.random() * 900000);
        //added.meeting_link = "https://meet.cloudX.in/"+digitsrandom
        var meeting_link = "https://meet.cloudX.in/" + digitsrandom;

        var short_link = await helper.CreateShortLink(meeting_link);
        var meet_link = "https://slss.in/" + short_link;

        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

        if (changed[0]['EventType'] == 'Video') {
            var meet_desc = changed[0]['Description'] + '<br><a href="' + meet_link + '">' + meet_link + '</a>';
        } else {
            var meet_desc = changed[0]['Description'];
        }

        var data = {
            customer_name: changed[0]['Subject'],
            email: changed[0]['Location'],
            meeting_type: changed[0]['EventType'],
            StartTime: startdate,
            EndTime: enddate,
            Description: meet_desc,
            mobile: changed[0]['OwnerId'],
            user_id: customer_id,
            s_id: changed[0]['ID'],
            meeting_link: (changed[0]['EventType'] == 'Video') ? meet_link : '',
            original_meeting_link: (changed[0]['EventType'] == 'Video') ? meeting_link : '',
        };

        API.updatescheduledata(data, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": err });
            }
            else {
                res.status(200).send([]);
            }
        })

    } else if (deleted.length > 0) {
        var sid = deleted[0]['ID'];
        API.deletescheduledata(sid, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": err });
            }
            else {
                res.status(200).send([]);
            }
        })

    } else {
        // console.log("where");
        // console.log(where[0].value);
        if (data.where && where[0].value > 0) {
            API.getschedulelistCust(where[0].value, async function (err, rows) {
                if (err) {
                    res.status(200).send({ "msg": 'server error' });
                }
                else {
                    res.status(200).send(rows);
                }
            })
        } else {
            
            API.getschedulelistManager(customer_id,StartDate,EndDate, async function (err, rows) {
                if (err) {
                    res.status(200).send({ "msg": 'server error' });
                }
                else {
                    //console.log(rows);
                    res.status(200).send(rows);
                }
            })
        }

    }
})

//API for Lead create from multiple sources
router.post('/generatelead', async function (req, res) {
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error','status':'0' });
        }
        else {
            if (rows.length > 0) {
                var managerid = rows[0].account_id
                var managername = rows[0].account_name
                var erp_email = rows[0].erp_email
                var erp_password = rows[0].erp_password
                req.body.account_id = managerid
                var leadstatus = await helper.GenerateLead(req.body)
                return res.status(200).send({ "msg": 'Lead added succesfully.','status':leadstatus });

                var agentgroup = await API.GetConfigBykey('group', managerid);
                var m = new Date();
                var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds() + Math.floor(100 + Math.random() * 900);
                var mobile = req.body.mobile ? req.body.mobile : ''
                mobile = mobile.toString()[0] == '+' ? mobile.substring(1) : mobile
                mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
                mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
                var email = req.body.email ? req.body.email : ''
                var name = req.body.name ? req.body.name : 'New Lead';
                var category = req.body.category ? req.body.category : await API.GetConfigBykey('category', managerid);
                var address = req.body.address ? req.body.address : '';
                var city = req.body.city ? req.body.city : '';
                var state = req.body.state ? req.body.state : '';
                var lead_source = req.body.lead_source ? req.body.lead_source : ''
                var notes = req.body.notes ? req.body.notes : ''
                var extraitems = req.body.extraparams ? req.body.extraparams : '' // Array 
                var ads_id = req.body.ads_id ? req.body.ads_id : ''
                var ads_name = req.body.ads_name ? req.body.ads_name : ''
                var ads_keyword = req.body.ads_keyword ? req.body.ads_keyword : ''
                var ad_leadid = req.body.ad_leadid ? req.body.ad_leadid : ''
                var campaignid = req.body.campaignid ? req.body.campaignid : ''
                var emailcampaignid = req.body.emailcampaignid ? req.body.emailcampaignid : ''
                var smscampaignid = req.body.smscampaignid ? req.body.smscampaignid : ''
                var agentgroupid = req.body.agentgroupid ? req.body.agentgroupid : ''
                if(agentgroupid!=''){
                    var agentid = await API.GetLeadAgent(agentgroupid)
                }else{
                    var agentid = await API.GetLeadAgent(agentgroup)
                }
                var lead = {};
                lead.doctype = "Lead";
                lead.source = lead_source;
                lead.notes = JSON.stringify(notes);
                lead.email_id = email;
                lead.mobile_no = mobile;
                lead.lead_name = name.replace(/[^a-zA-Z ]/g, "");
                // Extra fields
                if(typeof extraitems === 'string' || extraitems instanceof String){
                    extraitems = JSON.parse(extraitems)
                }
                console.log(extraitems)
                if(extraitems!=''){
                    const extraArr = Array.from(Object.keys(extraitems), k => [`${k}`, extraitems[k]]);
                    console.log(extraArr)
                    if (extraArr != undefined && extraArr.length > 0) {
                        extraArr.forEach(item => {
                            // console.log(item)
                            console.log(item[0] + "====" + item[1])
                            if(item[0]=='city' || item[0]=='CITY' || item[0]=='City'){
                                lead.city = item[1]
                            }
                            if(item[0]=='state' || item[0]=='STATE' || item[0]=='State'){
                                lead.state = item[1]
                            }
                            
                        });
                    }
                }
                //
                API.findlead(mobile,managerid,async function (err, data) {
                    console.log(err)
                    if (data.length > 0) {
                        lead.l_id = data[0].l_id
                        if(ads_id!=''){
                            lead.ads_id = ads_id
                        }
                        if(ads_name!=''){
                            lead.ads_name = ads_name
                        }
                        if(ads_keyword!=''){
                            lead.ads_keyword = ads_keyword
                        }
                        var now = new Date();
                        lead.creation = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        lead.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        lead.modified_by = managername
                        lead.status = "Lead";
                        API.updatelead(lead, async function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Done");
                                var condata = await API.GetLeadContactData(data[0].l_id)
                                var cont_id = condata['cont_id']?condata['cont_id']:''
                                LeadCommunication(data[0].l_id, data[0], cont_id, campaignid, emailcampaignid, smscampaignid, category)
                                var timeline = {}
                                timeline.agent_id = data[0].agent_id
                                timeline.account_id = managerid
                                timeline.lead_id = data[0].l_id
                                timeline.current_status = 'Lead'
                                timeline.notes = 'Modified Lead BY ' + managername+' (Duplicate Lead)'
                                ERP.add_timeline_lead(timeline, function (err, rows2) {})
                                res.status(200).send({ "msg": 'Lead updated succesfully.','status':'1' });
                            }
                        })
                    } else {
                        var response = lead
                        response.owner = managername
                        response.lead_owner = managername
                        var now = new Date();
                        response.creation = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        response.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        response.modified_by = managername
                        response.status = "Lead";
                        response.title = name;
                        // var API_ERP = new RESTERPNext({
                        //     username: erp_email,
                        //     password: erp_password,
                        //     baseUrl: process.env.ERPURL
                        // })
                        //API_ERP.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (response) {
                            if (response) {
                                response.User_id = managerid
                                response.agent_id = agentid
                                response.is_sync = "yes"
                                response.ads_id = ads_id
                                response.ads_name = ads_name
                                response.ads_keyword = ads_keyword
                                response.ad_leadid = ad_leadid
                                API.addlead_db(response, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        var leadid = rows.insertId
                                        let year = new Date().getFullYear()
                                        let month = new Date().getMonth()
                                        let lead_name = {}
                                        lead_name.name = 'CRM-LEAD-'+year+'-'+(month+1)+leadid
                                        ERP.updat_lead_name(lead_name,leadid, function (err, rows2) {})
                                        cont_id = cont_id+leadid
                                        var data = { cont_id: cont_id, customer_id: managerid, created_date: m, name: name, email: email, mobile: mobile, address: address, city: city, state: state, lead_source: lead_source, category: category, created_by: managerid, lead_id: leadid }
                                        Contacts.createcontact(data, function (err, result) {
                                            //console.log(err)
                                            if (err) {
                                                res.status(200).json({'msg':err,'status':'0'});
                                            }
                                            else {
                                                var conid = cont_id
                                                console.log(typeof extraitems)
                                                if(typeof extraitems === 'string' || extraitems instanceof String){
                                                    extraitems = JSON.parse(extraitems)
                                                }
                                                if (extraitems != '') {
                                                    const extraArr = Array.from(Object.keys(extraitems), k => [`${k}`, extraitems[k]]);
                                                    console.log(extraArr)
                                                    if (extraArr != undefined && extraArr.length > 0) {
                                                        extraArr.forEach(item => {
                                                            // console.log(item)
                                                            console.log(item[0] + "====" + item[1])
                                                            helper.SaveContactMeta(item[0], item[1], conid, managerid)
                                                        });
                                                    }
                                                }
                                                var timeline = {}
                                                timeline.agent_id = agentid
                                                timeline.account_id = managerid
                                                timeline.lead_id = leadid
                                                timeline.current_status = 'Lead'
                                                timeline.notes = 'Create Lead BY ' + managername
                                                ERP.add_timeline_lead(timeline, function (err, rows2) {})
                                                res.json({ 'msg': 'Lead added sucessfully!','status':'2' });
                                            }
                                        });
                                        helper.PushZohoLead(leadid,agentid)
                                        //Communication
                                        LeadCommunication(leadid, response, cont_id, campaignid, emailcampaignid, smscampaignid, category)
                                    }
                                })
                            }
                        // }).catch(function (error) {
                        //     console.log(error);
                        //     res.status(200).send({ "msg": 'Email ID or Mobile is duplicate','status':'0' });
                        // });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key','status':'0' });
            }
        }
    })
});

async function LeadCommunication(leadid, data, contid, voicecamid, emailcamid, smscamid, category) {
    console.log(leadid)
    if (leadid > 0) {
        var managerid = data.User_id
        var agentid = data.agent_id
        var customeremail = data.email_id
        var customermobile = data.mobile_no
        var customername = data.lead_name
        API.getuserdetail(agentid, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": 'db error' });
            }
            else {
                //console.log(rows)
                if (rows.length > 0) {
                    var adata = rows[0]
                    //Call
                    console.log(voicecamid)
                    if (voicecamid>0) {
                        helper.UpdateCampaignNumbers(voicecamid, managerid, contid, category)
                    } else {
                        var autocall = await API.GetConfigBykey('autocall', managerid);
                        console.log(autocall+'==')
                        if (autocall == 'yes') {
                            var autocallstarttime = await API.GetConfigBykey('autocallstarttime', managerid);
                            var autocallendtime = await API.GetConfigBykey('autocallendtime', managerid);
                            var starttimeArr = autocallstarttime.split(':')
                            var endtimeArr = autocallendtime.split(':')
                            var beginningTime = moment().set('hour', starttimeArr[0]).set('minute', starttimeArr[1]);
                            var endTime = moment().set('hour', endtimeArr[0]).set('minute', endtimeArr[1]);
                            var nowtime = moment(new Date(), "HH:mm")
                            if (nowtime.isBetween(beginningTime, endTime)) {
                                voicecamid = await helper.GetAgentLMSCampaign(agentid,managerid)
                                if(voicecamid>0){
                                    helper.UpdateCampaignNumbers(voicecamid, managerid, contid, category)    
                                }else{
                                    voicecamid = await helper.CreateAgentLMSCampaign(agentid,managerid)
                                    helper.UpdateCampaignNumbers(voicecamid, managerid, contid, category)    
                                }
                            }
                        }
                    }

                    //Email
                    if (emailcamid > 0) {
                        //helper.UpdateEmailCampaignNumbers(emailcamid, managerid, contid, category)
                        var authkey = await helper.GetManagerAuthKey(managerid)
                        urllib.request('https://email.cloudX.in/api/tfapi/sendautoemail?email=' + customeremail + '&name=' + customername + '&campaignid=' + emailcamid + '&conid=' + contid + '&authkey=' + authkey, {
                            method: 'GET',
                            timeout: 50000,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }, function (error, resp) {
                            if (error) {
                                console.log("Call-campaign API error:");
                                console.log(error);
                            }
                            else {
                                console.log(JSON.parse(resp));
                            }
                        });
                    } else {
                        var autoemail = await API.GetConfigBykey('autoemail', managerid);
                        console.log(autoemail)
                        if (autoemail == 'yes') {
                            var emailserverid = adata['emailserver_alloted']
                            if (emailserverid > 0) {
                                var ServerData = await API.GetEmailServerData(emailserverid)
                                var transOptions = {
                                    host: ServerData.smtp_server,
                                    port: ServerData.smtp_port,
                                    secure: false,
                                    auth: {
                                        user: ServerData.smtp_username,
                                        pass: ServerData.smtp_password,
                                    },
                                };
                                var emailtemplateid = await API.GetConfigBykey('emailtemplate', managerid);
                                //console.log(ServerData)
                                await helper.LeadSendEmail(leadid, agentid, transOptions, emailtemplateid, ServerData.smtp_username, customeremail,customername)
                            } else {

                            }
                        }
                    }

                    //SMS
                    if (smscamid > 0) {
                        var smsbalance = await helper.getSmsBalance(managerid)
                        if (smsbalance > 0) {
                            var smscampaignid = smscamid
                            var authkey = await helper.GetManagerAuthKey(managerid)
                            urllib.request('https://sms.cloudX.in/api/tfapi/sendautosms?mobile=' + customermobile + '&name=' + customername + '&campaignid=' + smscampaignid + '&conid=' + contid + '&authkey=' + authkey, {
                                method: 'GET',
                                timeout: 50000,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }, function (error, resp) {
                                if (error) {
                                    console.log("Call-campaign API error:");
                                    console.log(error);
                                }
                                else {
                                    console.log(JSON.parse(resp));
                                }
                            });
                        }
                    } else {
                        var autosms = await API.GetConfigBykey('autosms', managerid);
                        console.log(autosms)
                        if (autosms == 'yes') {
                            var smsbalance = await helper.getSmsBalance(managerid)
                            if (smsbalance > 0) {
                                var smscampaignid = await API.GetConfigBykey('smscampaignid', managerid);
                                var authkey = await helper.GetManagerAuthKey(managerid)
                                urllib.request('https://sms.cloudX.in/api/tfapi/sendautosms?mobile=' + customermobile + '&name=' + customername + '&campaignid=' + smscampaignid + '&conid=' + contid + '&authkey=' + authkey, {
                                    method: 'GET',
                                    timeout: 50000,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }, function (error, resp) {
                                    if (error) {
                                        console.log("Call-campaign API error:");
                                        console.log(error);
                                    }
                                    else {
                                        console.log(JSON.parse(resp));
                                    }
                                });
                            }
                        }
                    }
                }
            }
        })
    }
}

//Website Chat Webhook
router.post("/chatwebhook", (req, res, next) => {
    console.log(req.body)
    res.status(200).send('EVENT_RECEIVED');

})

router.post("/agentcallstatus", (req, res, next) => {
    console.log(req.body)
    var status = req.body.status;
    var userid = req.body.userid;
    API.updateUser({ is_oncall: status }, userid, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(200).send({ "err": 'db error' });
        }
        else {
            res.status(200).send({ "msg": 'updated' });
        }
    })
})
router.post('/getdigitalmenuaccess', function (req, res) {
    var username = req.body.username
    API.getuserdetailbyname(username, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(200).send({ "menuaccess": null });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "menuaccess": rows[0].digital_access});
            } else {
                res.status(200).send({ "menuaccess": null });
            }
        }
    })
});
router.post('/getmanageraccountbalance', function (req, res) {
    var username = req.body.username
    API.getmanagerdigitalbalance(username, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(200).send({ "balance": null });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "balance": rows[0]});
            } else {
                res.status(200).send({ "balance": null });
            }
        }
    })
});
router.post('/updatemanageradsbalance', function (req, res) {
    var username = req.body.username
    var currentusedvalue = req.body.usedvalue;
    API.getmanagerdigitalbalance(username, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else {
            if (rows.length > 0) {
                var m = new Date();
                var startdate = new Date(rows[0].Ads_Startdate);
                var adsvalue=null;
                var adsbalance=null;
                if (startdate.getTime() <= m.getTime() && rows[0].Ads_User_Balance>0) {
                    var adsvalue = rows[0].Ads_Value;
                    var usedvalue = (rows[0].Ads_User_Used) + (currentusedvalue);                    
                    adsbalance = adsvalue - usedvalue;
                }else{
                    var adsvalue = rows[0].Ads_Value;
                    usedvalue=rows[0].Ads_User_Used;
                    adsbalance = rows[0].Ads_User_Balance;
                    //res.status(200).send( "Please renew your Ads balance package!!"); 
                }
                var udata = {Account_ID:rows[0].Account_ID,Ads_User_Used:usedvalue,Ads_User_Balance:adsbalance,Ads_Value:adsvalue}
               //console.log();
                API.updatemaangeraccountbalance(udata, function (err, rows) {
                    if (err) {
                        console.log(err)
                        //res.status(200).send({ "balance": null });
                    }
                    else {
                        res.status(200).send( "Ads balance updated successfully!!");                        
                    }
                })
            } else {
                res.status(200).send("User Ads balance not found!!" );
            }
        }
    })
});
//Google Messages Chat Webhook
router.get("/gmbchatwebhook", (req, res, next) => {
    console.log(req.body)
    res.status(200).send('EVENT_RECEIVED');

})
// Pull CDR All Call By Date
router.post('/pullallcallreport', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var date = req.body.date;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                API.findcdrbydate(date, rows[0].account_id, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

router.get("/checkcode", (req, res, next) => {
    res.status(200).send({status:true,data: {
        "model_number": "53738tshsjd",
        "mobile_number": "9654944091",
        "ticket_id": "328855",
        "problem_description": "This is test test test",
        "purchase_date": "2021-07-01",
        "invoice": "images/upload/Wf7x4OWJSHMsjXYXTHuI7hdtcCnnQG7uy6Wj2HL1.jpeg",
        "product_image": "images/product_images/JwZ7YaDVoljUXgWjhRGKh63KRKAae8RGtcPz8N4X.jpeg",
        "channel": "Amazon"
        }});

})

// Get Free Agent Count
router.post('/getfreeagent', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' , "data": []});
        }
        else {
            if (rows.length > 0) {
                API.getmanagerfreeagent(rows[0].account_id, function (err, rows) {
                    if (err) {
                        res.status(200).send({"msg": 'success', "data": [] });
                    } else {
                        res.status(200).send({ "msg": 'success',"data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key', "data": [] });
            }
        }
    })
})

// Get Free Agent By Group Count
router.post('/getfreeagentbygroup', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var groupid = req.body.groupid;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' , "data": []});
        }
        else {
            if (rows.length > 0) {
                API.getmanagerfreeagentbygroup(rows[0].account_id,groupid,async function (err, data) {
                    if (err) {
                        res.status(200).send({"msg": 'success', "data": [] });
                    } else {
                        var agentchannels = await helper.checkAgentVOIPStatus(data,rows[0].account_id)
                        res.status(200).send({ "msg": 'success',"data": agentchannels });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key', "data": [] });
            }
        }
    })
})

//Just Dial API
router.get('/jd/:id', function (req, res) {
    const authkey = req.params.id;
    console.log("jd =>",authkey)
    console.log(req.body)
    res.status(200).send('SUCCESS');
})
router.post('/jd/:id', function (req, res) {
    const managerid = req.params.id;
    console.log("jd =>",managerid)
    console.log(req.body)
    const ldata = req.body
    API.getuserdetail(managerid, async function (err, rows) {
        if (err) {
            res.status(200).send('Server error');
        }
        else {
            if (rows.length > 0) {
                const adata = rows[0]
                const userid = adata.account_id
                const data = {account_id:userid,mobile:ldata.mobile,email:ldata.email,name:ldata.name,address:ldata.area,city:ldata.city,city:ldata.city,lead_source:'JustDial',ads_id:ldata.leadid,notes:ldata,extraparams:ldata}
                console.log(data)
                if(ldata.mobile!='' && ldata.mobile!=null){
                    var leadstatus = await helper.GenerateLead(data)
                    console.log(leadstatus)
                }
                //return res.status(200).send({ "msg": 'Lead added succesfully.','status':leadstatus });
                res.status(200).send('SUCCESS');
            }else{
                res.status(200).send('Invalid request');
            }
        }
    })
    //res.status(200).send('SUCCESS');
})

//
router.get('/recordingdownload/:id', function (req, res) {
    url = 'http://192.168.1.26:8001/recordingdownload/' + req.params.id + '.zip';
    req.pipe(request(url)).pipe(res);
})

router.get('/GT_Account_Status', function (req, res) {
    console.log(req.query)
    res.send("1,DOWN,liveapi");    
});


//Whatsapp Webhook
router.get('/whatsapp/:id', function (req, res) {
    const authkey = req.params.id;
    console.log(authkey)
    console.log(req.body)
    res.status(200).send({'msg':'success'});
})
router.post('/whatsapp/:id', async function (req, res) {
    console.log('innn');
    const authkey = req.params.id;
    console.log(authkey)
    console.log('body_data',req.body)
    console.log(req.body.data)
    var data = JSON.parse(req.body.data);
    data.account_id = authkey
    if(req.body.event){
        if(req.body.event=="message"){
            console.log('wdata',req.body.data)
            console.log(req.body.data.messages)
        }
    }
    //console.log(data)
    //console.log(data.event)
    //param={user_id:authkey,data:}
    await helper.AddWhatsappChatWebhook(data);
   
    res.status(200).send({'msg':'success'});
})

//SMS Callback Webhook
router.get('/smscallback',async function (req, res) {
    console.log(req.query)
    // console.log(req.body)
    // console.log(req.params)
    console.log('callbakc from third party---------')
    var txnid = req.query.txid
    if(req.query.status=='DELIVERY_FAILED'){
        var sdata = { sms_status: req.query.status,status:'2'}
    }else{
        var sdata = { sms_status: req.query.status,status:'1'}
    }
    const accountid = await helper.GetAccountIdBySmsTxnID(txnid)
    helper.UpdateSMSBalance(accountid)
    API.updateSMSCampaignReport(sdata, txnid,function (err, rows) {
        console.log("updateSMSCampaignReport err",err)
        console.log("updateSMSCampaignReport success",rows)
    })
    var data = { sms_status: req.query.status}
    API.updateSMSReport(data, txnid,function (err, rows) {
        console.log("updateSMSReport err",err)
        console.log("updateSMSReport success",rows)
    })
    res.status(200).send({ "msg": 'success' });
})

//Zoho Lead Status
router.get('/zoholead/:id',async function (req, res) {
    const managerid = req.params.id;
    console.log(managerid)
    console.log('zoholead get',req.query)
    const mobile = req.query.Mobile
    const lead_source = req.query.source
    const name = req.query['Name']?req.query['Name']:'No Name'
    const zohouserid = req.query.Userid
    const agentid = await helper.GetAgentIdByZohoUserId(zohouserid)
    const ldata = {account_id:managerid,mobile:mobile,lead_source:lead_source,name:name,agentid:agentid}
    const leadstatus = await helper.GenerateLead(ldata)
    return res.status(200).send({ "msg": 'Lead added succesfully.','status':leadstatus });
    //res.status(200).send({'msg':'success'});
})

// Get All Agent By Group ID
router.post('/getallagentbygroupid', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var groupid = req.body.groupid;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({"msg": 'success', "data": [] });
        }
        else {
            if (rows.length > 0) {
                API.getmanagerallagentbygroup(rows[0].account_id,groupid, function (err, rows) {
                    if (err) {
                        res.status(200).send({"msg": 'success', "data": [] });
                    } else {
                        res.status(200).send({ "msg": 'success',"data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key', "data": [] });
            }
        }
    })
})

// Get Queue Call
router.post('/getqueuecall', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({"msg": 'success', "data": [] });
        }
        else {
            if (rows.length > 0) {
                API.getqueuecall(rows[0].account_id, function (err, rows) {
                    if (err) {
                        res.status(200).send({"msg": 'success', "data": [] });
                    } else {
                        res.status(200).send({ "msg": 'success',"data": rows });
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key', "data": [] });
            }
        }
    })
})

// Conference Call API
router.post('/conferencecall', function (req, res) {
    //console.log(req.body)
    var authkey = req.body.authkey;
    var caller1 = req.body.caller1?req.body.caller1:'';
    var caller2 = req.body.caller2?req.body.caller2:'';
    var caller3 = req.body.caller3?req.body.caller3:'';
    var caller4 = req.body.caller4?req.body.caller4:'';
    var caller5 = req.body.caller4?req.body.caller5:'';

    caller1 = caller1.toString()[0] == 0 ? caller1 : '0' + caller1
    var agentArr = []
    if(caller2!=''){
        agentArr.push(caller2)
    }
    if(caller3!=''){
        agentArr.push(caller3)
    }
    if(caller4!=''){
        agentArr.push(caller4)
    }
    if(caller5!=''){
        agentArr.push(caller5)
    }
    console.log(agentArr)
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                var manager_id = rows[0].account_id
                API.checkactiveamanageraccount(manager_id,async function (err, results) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        //console.log(results)
                        if (results.length > 0) {
                            var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                            console.log(voiceserverdata)
                            const askrestapi = new awry.API({
                                baseUrl: voiceserverdata.ari_url,
                                username: voiceserverdata.ari_username,
                                password: voiceserverdata.ari_password,
                            });
                            API.findoutgoingdid(manager_id,async function (err, results) {
                                if (err) {
                                    res.status(200).send({ "msg": 'db error' });
                                } else {
                                    console.log(results)
                                    if (results.length > 0) {
                                        var didArr = results[0]
                                        var did = didArr.did
                                        console.log(did)
                                        // if(secondarysip=='yes'){
                                        //     did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                        // }
                                        var autoid = Math.floor(Math.random() * 1000000);
                                        const memberchannel1 = 'PJSIP/' + caller1 + '@SM' + did
                                        const params1 = { 'endpoint': memberchannel1, callerId: did, extension: 's', context: "cloudX_conference_outgoing_with_transfer", variables: { "DID": did, "accountid": String(manager_id), "CallType": "conference", "MaxUser": "6", "ConfId": String(autoid),"CallerCount":"1" } };
                                        console.log(params1)
                                        askrestapi.channels.originate(params1).then(chresults => {
                                            var chdata = chresults.data
                                            var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 7, servicevalue: autoid, CallerType: 0, CallerName: caller1, CallerNumber: caller1, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3 }
                                            Call.insertcdr(cdrdata,async function (err, rs) {
                                                if (err) return console.log(err)
                                                var cdrid = rs.insertId
                                                var GroupArr = await helper.GetAgentGroupsByManagerID(manager_id)
                                                var groupstring = Object.keys(GroupArr).map(function(k){return GroupArr[k].transfer_extesion}).join(",");
                                                async.forEachOf(agentArr, async (num, key, callback) => {
                                                    num = num.toString()[0] == 0 ? num : '0' + num
                                                    var memberchannel2 = 'PJSIP/' + num + '@SM' + did
                                                    var params2 = { 'endpoint': memberchannel2, callerId: did, extension: 's', context: "cloudX_conference_outgoing_with_transfer", variables: { "DID": did, "accountid": String(manager_id), "CallType": "conference", "MaxUser": "6", "ConfId": String(autoid),'AgentGroup':groupstring,"CallerCount":String(key+2) } };
                                                    console.log(params2)
                                                    askrestapi.channels.originate(params2).then(chresults => {
                                                        var chdata = chresults.data
                                                        var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 7, servicevalue: autoid, CallerType: 0, CallerName: num, CallerNumber: num, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3 }
                                                        Call.insertcdr(cdrdata, function (err, rs) {
                                                            if (err) return console.log(err)
                                                            var cdrid = rs.insertId
                                                            // var rdata = { confid: conf_id, memberid: obj['member_id'], cdrid: cdrid }
                                                            // Call.insertconferencememberrecord(rdata)
                                                        })
                                                    }).catch(function (err) {
                                                        console.log('error==')
                                                    });
                                                })
                                            })
                                        }).catch(function (err) {
                                            console.log('error==')
                                        });
                                        // const memberchannel2 = 'PJSIP/' + caller2 + '@SM' + did
                                        // const params2 = { 'endpoint': memberchannel2, callerId: did, extension: 's', context: "cloudX_conference_outgoing", variables: { "DID": did, "accountid": String(manager_id), "CallType": "conference", "MaxUser": "6", "ConfId": String(autoid) } };
                                        // console.log(params2)
                                        // askrestapi.channels.originate(params2).then(chresults => {
                                        //     var chdata = chresults.data
                                        //     // var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: userid, DID: did, serviceid: 7, servicevalue: conf_id, CallerType: 0, CallerName: obj.member_name, CallerNumber: obj.mobile, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3 }
                                        //     // Call.insertcdr(cdrdata, function (err, rs) {
                                        //     //     if (err) return console.log(err)
                                        //     //     var cdrid = rs.insertId
                                        //     //     var rdata = { confid: conf_id, memberid: obj['member_id'], cdrid: cdrid }
                                        //     //     Call.insertconferencememberrecord(rdata)
                                        //     // })
                                        // }).catch(function (err) {
                                        //     console.log('error==')
                                        // });
                                        res.status(200).send({ "msg": 'Conference created' });
                                    } else {
                                        res.status(200).send({ "msg": 'No Outgoing DID found!' });
                                    }
                                }
                            })

                        } else {
                            res.status(200).send({ "msg": 'Account not active' });
                        }
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

//Almond Negative Age Consent
router.post('/almondnegativeage', async function (req, res) {
    const mobile = req.body.mobile;
    const extension = req.body.extension;
    const data = {mobile:mobile,cdrid:extension}
    API.UpdateNegativeAge(data, function (err, rows) {
    })
    res.status(200).send({ "msg": 'success' });
})
router.post('/almondbrandstory', async function (req, res) {
    const mobile = req.body.mobile;
    const cdrid = req.body.cdrid;
    API.CheckCallerRegistration(mobile, function (err, rows) {
        if(rows.length>0){
            const data = {mobile:mobile,hit_count:rows[0].hit_count+1}
            API.UpdateCallerRegistration(data,rows[0].id, function (err, rows) {

            })

            //Send SMS
            const apiID = 25 //Thankyou SMS2 API
            API.findapi(apiID,async function (err, rows) {
                if(rows.length>0){
                    var apidata = rows[0]
                    var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
                    var method = apidata.api_method
                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10))):{}
                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                    console.log(url)
                    console.log(payload)
                    console.log(header)
                    requestify.request(url, {
                        method: method,
                        body: payload,
                        headers : header,
                        dataType: 'json',
                    }).then(function(response) {
                        var resdata = JSON.parse(response.body)
                        console.log(response)
                        console.log(JSON.stringify(resdata.data))
                        if(resdata.status){

                        }
                        //
                        
                    })
                    .fail(function(response) {
                        console.log(response)
                    });
                }
            })
            
            res.status(200).send({"data":[], "status": 'true'}); // already registred
        }else{
            const data = {mobile:mobile,cdrid:cdrid}
            API.InsertCallerRegistration(data, function (err, rows) {
                var callerregid = rows.insertId
            //Send SMS
            // const apiID = 26 //Thankyou SMS1 API
            // API.findapi(apiID,async function (err, rows) {
            //     if(rows.length>0){
            //         var apidata = rows[0]
            //         var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
            //         var method = apidata.api_method
            //         var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10))):{}
            //         var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
            //         console.log(url)
            //         console.log(payload)
            //         console.log(header)
            //         requestify.request(url, {
            //             method: method,
            //             body: payload,
            //             headers : header,
            //             dataType: 'json',
            //         }).then(function(response) {
            //             var resdata = JSON.parse(response.body)
            //             console.log(response)
            //             console.log(JSON.stringify(resdata.data))
            //             if(resdata.status){
                            const apiID1 = 27 //Gratification API
                            API.findapi(apiID1,async function (err, rows) {
                                if(rows.length>0){
                                    var apidata = rows[0]
                                    var url = apidata.api_endpoint
                                    var method = apidata.api_method
                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10)).replace('{amount}',10).replace('{orderid}',cdrid)):{}
                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                    console.log(url)
                                    console.log(payload)
                                    console.log(header)
                                    requestify.request(url, {
                                        method: method,
                                        body: payload,
                                        headers : header,
                                        dataType: 'json',
                                    }).then(function(response) {
                                        var resdata = JSON.parse(response.body)
                                        console.log('Gratification',response)
                                        console.log('Gratification',JSON.stringify(resdata.data))
                                        if(resdata.txnType=='REC'){
                                            const apiID = 23 //Recharge SMS API
                                            API.findapi(apiID,async function (err, rows) {
                                                if(rows.length>0){
                                                    var apidata = rows[0]
                                                    var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
                                                    var method = apidata.api_method
                                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10))):{}
                                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                    console.log(url)
                                                    console.log(payload)
                                                    console.log(header)
                                                    requestify.request(url, {
                                                        method: method,
                                                        body: payload,
                                                        headers : header,
                                                        dataType: 'json',
                                                    }).then(function(response) {
                                                        var resdata = JSON.parse(response.body)
                                                        console.log(response)
                                                        console.log(JSON.stringify(resdata.data))
                                                        if(resdata.status){

                                                        }
                                                        //
                                                        
                                                    })
                                                    .fail(function(response) {
                                                        console.log(response)
                                                    });
                                                }
                                            })
                                        }else{
                                            const apiID = 24 //Wallet SMS API
                                            API.findapi(apiID,async function (err, rows) {
                                                if(rows.length>0){
                                                    var apidata = rows[0]
                                                    var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
                                                    var method = apidata.api_method
                                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10))):{}
                                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                    console.log(url)
                                                    console.log(payload)
                                                    console.log(header)
                                                    requestify.request(url, {
                                                        method: method,
                                                        body: payload,
                                                        headers : header,
                                                        dataType: 'json',
                                                    }).then(function(response) {
                                                        var resdata = JSON.parse(response.body)
                                                        console.log(response)
                                                        console.log(JSON.stringify(resdata.data))
                                                        if(resdata.status){

                                                        }
                                                        //
                                                        
                                                    })
                                                    .fail(function(response) {
                                                        console.log(response)
                                                    });
                                                }
                                            })
                                        }
                                        const customer_credit = resdata.amount?resdata.amount:0
                                        const data = {customer_credit:customer_credit}
                                        API.UpdateCallerRegistration(data,callerregid, function (err, rows) {

                                        })
                                    })
                                    .fail(function(response) {
                                        console.log(response)
                                    });
                                }
                            })
            //             }
            //         })
            //         .fail(function(response) {
            //             console.log(response)
            //         });
            //     }
            // })
            })
            res.status(200).send({"data":[], "status": ''}); // new
        }
    })
})
router.post('/almondwebhook', async function (req, res) {
    const bodydata = req.body;
    console.log(bodydata)
    const cdrid = bodydata.id
    const calltype = bodydata.type
    const state = bodydata.state
    console.log(calltype,state,cdrid)
    if(state=='missed' && calltype=='incoming'){
        API.findcdrbyid(cdrid,async function (err, rows) {
            if (err) {

            } else {
                if(rows.length>0){
                    const cdrdata = rows[0]
                    console.log(cdrdata)
                    if(cdrdata.LastDestination=='MissedCall'){
                        const did = cdrdata.DID
                        const callermobile = cdrdata.CallerNumber.substr(-10)
                        const manager_id = cdrdata.accountid
                        var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                        const askrestapi = new awry.API({
                            baseUrl: voiceserverdata.ari_url,
                            username: voiceserverdata.ari_username,
                            password: voiceserverdata.ari_password,
                        });
                        API.CheckCallerNegativeAge(callermobile,async function (err, rows) {
                            console.log(rows)
                            if(rows.length>0){
                                var negativeagecount = rows[0].hit_count
                            }else{
                                var negativeagecount = 0
                            }
                            if(negativeagecount<2){
                                API.CheckCallerRegistration(callermobile,async function (err, rows) {
                                    console.log(rows)
                                    if(rows.length>0){
                                        //Already exists
                                        const hitcount = rows[0].hit_count
                                        if(hitcount<20){
                                            const mobile = callermobile.toString()[0] == '0' ? callermobile : '0'+callermobile
                                            const ivrid = 1307
                                            const params = { 'endpoint': 'PJSIP/'+mobile+'@SM'+did,callerId: did, extension: 's',context: 'cloudX_outgoing_ivr',priority:1,variables:{"DID":String(did),"NUMID":"0","CallerNumber":mobile,"CallerName":mobile,"accountid": String(manager_id),"IVRID":String(ivrid),"CallType":"dialer","Archive": 'yes'}};
                                            console.log('params',params)
                                            askrestapi.channels.originate(params).then(results => {
                                                //console.log(data)
                                                const chdata = results.data
                                                var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9,servicevalue: ivrid, CallerType: 1, CallerName: mobile, CallerNumber: mobile, CallTypeID: 1, CallType: 'dialer', CdrStatus: 3}
                                                helper.insertcdr(cdrdata, function (err, result) {
                                                    var cdrid = result.insertId
                                                    console.log("Call originate succesfully")
                                                })
                                                const apiID = 29 //userRegistration
                                                API.findapi(apiID,async function (err, rows) {
                                                    if(rows.length>0){
                                                        var apidata = rows[0]
                                                        var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
                                                        var method = apidata.api_method
                                                        var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10)).replace('{final_status}',hitcount)):{}
                                                        var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                        console.log(url)
                                                        console.log(payload)
                                                        console.log(header)
                                                        requestify.request(url, {
                                                            method: method,
                                                            body: payload,
                                                            headers : header,
                                                            dataType: 'json',
                                                        }).then(function(response) {
                                                            var resdata = JSON.parse(response.body)
                                                            console.log(response)
                                                            console.log(JSON.stringify(resdata.data))
                                                            if(resdata.status){
            
                                                            }
                                                            //
                                                            
                                                        })
                                                        .fail(function(response) {
                                                            console.log(response)
                                                        });
                                                    }
                                                })
            
                                            }).catch(function (err) {
                                                console.log('not originate',err)
                                            });
                                        }else{
                                            console.log('hitcount',hitcount)
                                            const apiID = 32 //Caller Limit Segment
                                            API.findapi(apiID,async function (err, rows) {
                                                if(rows.length>0){
                                                    console.log(rows)
                                                    var apidata = rows[0]
                                                    var url = apidata.api_endpoint.replace('{mobile}',callermobile.substr(-10))
                                                    var method = apidata.api_method
                                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',callermobile.substr(-10)).replace('{final_status}',1)):{}
                                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                    console.log(url)
                                                    console.log(payload)
                                                    console.log(header)
                                                    requestify.request(url, {
                                                        method: method,
                                                        body: payload,
                                                        headers : header,
                                                        dataType: 'json',
                                                    }).then(function(response) {
                                                        var resdata = JSON.parse(response.body)
                                                        console.log(response)
                                                        console.log(JSON.stringify(resdata.data))
                                                        if(resdata.status){

                                                        }
                                                        //
                                                        
                                                    })
                                                    .fail(function(response) {
                                                        console.log(response)
                                                    });
                                                }
                                            })

                                            const apiID1 = 28 //Miss Call Log API
                                            var mobile = callermobile.substr(-10)
                                            var firstfourdigit = mobile.substring(0, 4)
                                            console.log('firstfourdigit',firstfourdigit)
                                            const CircleData = await helper.GetMobileCircleOperator(firstfourdigit)
                                            console.log('CircleData',CircleData)
                                            const circle = CircleData.circle?CircleData.circle:''
                                            const operator = CircleData.operator?CircleData.operator:''
                                            var newdate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                            const currentdate = newdate.format('YYYY-MM-DD HH:mm:ss')
                                            console.log('currentdate',currentdate)
                                            const start_time = moment(new Date(bodydata.start_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
                                            const end_time = moment(new Date(bodydata.end_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
                                            const call_duration = bodydata.duration?bodydata.duration:0
                                            const customer_credit = 0
                                            const age_consent = 2
                                            const brand_selected = 0
                                            const is_unique = 'false'
                                            const final_status = 'Registered Limit '
                                            const exit_point = 'Registered Limit Reach 20'
                                            API.findapi(apiID1,async function (err, rows) {
                                                if(rows.length>0){
                                                    var apidata = rows[0]
                                                    var url = apidata.api_endpoint
                                                    var method = apidata.api_method
                                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile).replace('{circle}',circle).replace('{operator}',operator).replace('{date}',currentdate).replace('{start_time}',start_time).replace('{end_time}',end_time).replace('{call_duration}',call_duration).replace('{customer_credit}',customer_credit).replace('{age_consent}',age_consent).replace('{brand_selected}',brand_selected).replace('{is_unique}',is_unique).replace('{final_status}',final_status).replace('{exit_point}',exit_point)):{}
                                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                    console.log(url)
                                                    console.log(payload)
                                                    console.log(header)
                                                    requestify.request(url, {
                                                        method: method,
                                                        body: payload,
                                                        headers : header,
                                                        dataType: 'json',
                                                    }).then(function(response) {
                                                        var resdata = JSON.parse(response.body)
                                                        console.log(response)
                                                        console.log(JSON.stringify(resdata.data))
                                                        if(resdata.status){
                                    
                                                        }
                                                        //
                                                    })
                                                    .fail(function(response) {
                                                        console.log(response)
                                                    });
                                                }
                                            })
                                        }
                                    }else{
                                        //First time
                                        const mobile = callermobile.toString()[0] == '0' ? callermobile : '0'+callermobile
                                        const ivrid = 1303
                                        const params = { 'endpoint': 'PJSIP/'+mobile+'@SM'+did,callerId: did, extension: 's',context: 'cloudX_outgoing_ivr',priority:1,variables:{"DID":String(did),"NUMID":"0","CallerNumber":mobile,"CallerName":mobile,"accountid": String(manager_id),"IVRID":String(ivrid),"CallType":"dialer","Archive": 'yes'}};
                                        console.log('params',params)
                                        askrestapi.channels.originate(params).then(results => {
                                            //console.log(data)
                                            const chdata = results.data
                                            var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9,servicevalue: ivrid, CallerType: 1, CallerName: mobile, CallerNumber: mobile, CallTypeID: 1, CallType: 'dialer', CdrStatus: 3}
                                            helper.insertcdr(cdrdata, function (err, result) {
                                                var cdrid = result.insertId
                                                console.log("Call originate succesfully")
                                            })
                                            const apiID = 29 //userRegistration
                                            API.findapi(apiID,async function (err, rows) {
                                                if(rows.length>0){
                                                    var apidata = rows[0]
                                                    var url = apidata.api_endpoint.replace('{mobile}',mobile.substr(-10))
                                                    var method = apidata.api_method
                                                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile.substr(-10)).replace('{final_status}',1)):{}
                                                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                                    console.log(url)
                                                    console.log(payload)
                                                    console.log(header)
                                                    requestify.request(url, {
                                                        method: method,
                                                        body: payload,
                                                        headers : header,
                                                        dataType: 'json',
                                                    }).then(function(response) {
                                                        var resdata = JSON.parse(response.body)
                                                        console.log(response)
                                                        console.log(JSON.stringify(resdata.data))
                                                        if(resdata.status){

                                                        }
                                                        //
                                                        
                                                    })
                                                    .fail(function(response) {
                                                        console.log(response)
                                                    });
                                                }
                                            })
                                        }).catch(function (err) {
                                            console.log('not originate',err)
                                        });
                                    }
                                })
                            }else{
                                const apiID = 22 //Circle & Negative Age SMS API 
                                API.findapi(apiID,async function (err, rows) {
                                    if(rows.length>0){
                                        var apidata = rows[0]
                                        var url = apidata.api_endpoint.replace('{mobile}',callermobile.substr(-10))
                                        var method = apidata.api_method
                                        var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',callermobile.substr(-10))):{}
                                        var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                        console.log(url)
                                        console.log(payload)
                                        console.log(header)
                                        requestify.request(url, {
                                            method: method,
                                            body: payload,
                                            headers : header,
                                            dataType: 'json',
                                        }).then(function(response) {
                                            var resdata = JSON.parse(response.body)
                                            console.log(response)
                                            console.log(JSON.stringify(resdata.data))
                                            if(resdata.status){

                                            }
                                            //
                                            
                                        })
                                        .fail(function(response) {
                                            console.log(response)
                                        });
                                    }
                                })

                                const apiID1 = 28 //Miss Call Log API
                                var mobile = callermobile.substr(-10)
                                var firstfourdigit = mobile.substring(0, 4)
                                console.log('firstfourdigit',firstfourdigit)
                                const CircleData = await helper.GetMobileCircleOperator(firstfourdigit)
                                console.log('CircleData',CircleData)
                                const circle = CircleData.circle?CircleData.circle:''
                                const operator = CircleData.operator?CircleData.operator:''
                                var newdate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                const currentdate = newdate.format('YYYY-MM-DD HH:mm:ss')
                                console.log('currentdate',currentdate)
                                const start_time = moment(new Date(bodydata.start_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
                                const end_time = moment(new Date(bodydata.end_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
                                const call_duration = bodydata.duration
                                const customer_credit = 0
                                const age_consent = 2
                                const brand_selected = 0
                                const is_unique = 'false'
                                const final_status = 'Negative Age Consent'
                                const exit_point = 'Negative Age Consent 2 Try'
                                API.findapi(apiID1,async function (err, rows) {
                                    if(rows.length>0){
                                        var apidata = rows[0]
                                        var url = apidata.api_endpoint
                                        var method = apidata.api_method
                                        var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile).replace('{circle}',circle).replace('{operator}',operator).replace('{date}',currentdate).replace('{start_time}',start_time).replace('{end_time}',end_time).replace('{call_duration}',call_duration).replace('{customer_credit}',customer_credit).replace('{age_consent}',age_consent).replace('{brand_selected}',brand_selected).replace('{is_unique}',is_unique).replace('{final_status}',final_status).replace('{exit_point}',exit_point)):{}
                                        var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                                        console.log(url)
                                        console.log(payload)
                                        console.log(header)
                                        requestify.request(url, {
                                            method: method,
                                            body: payload,
                                            headers : header,
                                            dataType: 'json',
                                        }).then(function(response) {
                                            var resdata = JSON.parse(response.body)
                                            console.log(response)
                                            console.log(JSON.stringify(resdata.data))
                                            if(resdata.status){
                        
                                            }
                                            //
                                        })
                                        .fail(function(response) {
                                            console.log(response)
                                        });
                                    }
                                })
                            }
                        })    
                    }
                }
            }
        })
    }

    if(state=='ended' && calltype=='incoming'){
        //{"date": "{date}", "circle": "{circle}", "mobile": "{mobile}", "end_time": "{endtime}", "operator": "{operator}", "start_time": "{starttime}", "call_duration": "{call_duration}", }
        // "is_unique": "{is_unique}", "exit_point": "{exit_point}", "age_consent": 21, "final_status": "{final_status}","brand_selected": "{brand}", "customer_credit": "{customer_credit}"
        var mobile = bodydata.from
        mobile = mobile.substr(-10)
        var firstfourdigit = mobile.substring(0, 4)
        console.log('firstfourdigit',firstfourdigit)
        const CircleData = await helper.GetMobileCircleOperator(firstfourdigit)
        console.log('CircleData',CircleData)
        const circle = CircleData.circle?CircleData.circle:''
        const operator = CircleData.operator?CircleData.operator:''
        var newdate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
        const currentdate = newdate.format('YYYY-MM-DD HH:mm:ss')
        console.log('currentdate',currentdate)
        const start_time = moment(new Date(bodydata.start_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
        const end_time = moment(new Date(bodydata.end_time)).add(5,'h').add(30,'m').format('YYYY-MM-DD HH:mm:ss')
        const call_duration = bodydata.duration
        const age_consent = await helper.GetAgeConsentBrandSelectOption(cdrid,1309)
        const brand_selected = await helper.GetAgeConsentBrandSelectOption(cdrid,1305)
        var exit_point = ''
        var final_status = ''
        API.CheckCallerRegistration(mobile, function (err, rows) {
            console.log(rows)
            if(rows.length>0){
                var customer_credit = rows[0].customer_credit
                if(rows[0].hit_count>0 && rows[0].cdrid!=cdrid){
                    var is_unique = false
                    exit_point = 'Brand Story'
                    final_status = 'Already Registered'
                    customer_credit = 0
                }else{
                    if(age_consent==2){
                        exit_point = 'Negative Age'
                        final_status = 'Negative Age'
                    }else if(age_consent==1){
                        exit_point = 'Brand Selection'
                        if(brand_selected>0 && brand_selected<=5){
                            exit_point = 'Brand Story'
                            final_status = 'Register'
                        }else{
                            exit_point = 'Brand Selection'
                            final_status = 'Invalid Brand'
                        }
                    }else{
                        exit_point = 'Age Consent'
                        final_status = 'Invalid Age'
                    }            
                    var is_unique = true
                }
            }else{
                var is_unique = true
                var customer_credit = 0
                if(age_consent==2){
                    exit_point = 'Negative Age'
                    final_status = 'Negative Age'
                }else if(age_consent==1){
                    exit_point = 'Brand Selection'
                    if(brand_selected>0 && brand_selected<=5){
                        exit_point = 'Brand Story'
                        final_status = 'Register'
                    }else{
                        exit_point = 'Brand Selection'
                        final_status = 'Invalid Brand'
                    }
                }else{
                    exit_point = 'Age Consent'
                    final_status = 'Invalid Age'
                }
            }
            const apiID = 28 //Miss Call Log API
            API.findapi(apiID,async function (err, rows) {
                if(rows.length>0){
                    var apidata = rows[0]
                    var url = apidata.api_endpoint
                    var method = apidata.api_method
                    var payload = apidata.api_payload!=null?JSON.parse(apidata.api_payload.replace('{mobile}',mobile).replace('{circle}',circle).replace('{operator}',operator).replace('{date}',currentdate).replace('{start_time}',start_time).replace('{end_time}',end_time).replace('{call_duration}',call_duration).replace('{customer_credit}',customer_credit).replace('{age_consent}',age_consent).replace('{brand_selected}',brand_selected).replace('{is_unique}',is_unique).replace('{final_status}',final_status).replace('{exit_point}',exit_point)):{}
                    var header = apidata.api_header!=null?JSON.parse(apidata.api_header):{}
                    console.log(url)
                    console.log(payload)
                    console.log(header)
                    requestify.request(url, {
                        method: method,
                        body: payload,
                        headers : header,
                        dataType: 'json',
                    }).then(function(response) {
                        var resdata = JSON.parse(response.body)
                        console.log(response)
                        console.log(JSON.stringify(resdata.data))
                        //if(resdata.status){
                            console.log(apidata)
                            var adata = {account_id:apidata.account_id,input_digit:0,cdr_id:cdrid,mobile:mobile,data:JSON.stringify(response.body)}
                            API.insertapidata(adata, function (err, result) {
                                console.log(err)
                            })
                        //}
                        //
                    })
                    .fail(function(response) {
                        console.log(response)
                        var adata = {account_id:apidata.account_id,input_digit:0,cdr_id:cdrid,mobile:mobile,data:JSON.stringify(response)}
                        API.insertapidata(adata, function (err, result) {
                            console.log(err)
                        })
                    });
                }
            })    
        })
    }

    res.status(200).send({ "msg": 'success' });
})

//Add Agent API
router.post('/createagent', function (req, res) {
    //console.log(req.body)
    const authkey = req.body.authkey;
    const groupid = req.body.groupid?req.body.groupid:0;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                const manager_id = rows[0].account_id
                const agentlimit = rows[0].user_limit
                API.checkactiveamanageraccount(manager_id,async function (err, results) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    } else {
                        if (results.length > 0) {
                            API.getallmanageragent(manager_id,async function (err, results) {
                                if (err) {
                                    res.status(200).send({ "msg": 'server error' });
                                } else {
                                    if(results.length<=agentlimit){
                                        var name = req.body.username?req.body.username:'';
                                        var email = req.body.email?req.body.email:'';
                                        var mobile = req.body.mobile?req.body.mobile:'';
                                        if (req.body.password) {
                                            var password = bcrypt.hashSync(req.body.password);
                                        }else{
                                            var password = bcrypt.hashSync(name+'@321');
                                        }
                                        var created_by = manager_id;
                                        var status = 0;
                                        var voip_status = 1;
                                        var starttime = '09:00:00';
                                        var endtime = '19:00:00';
                                        var showtype = 0;
                                        var did_alloted = '';
                                        var emailserver_alloted = ''
                                        var monitor_agent = 0;
                                        var authorised_person_name = name;
                                        var whatsup_access = 1;
                                        var account_role = 1
                                        var is_deleted = 'no';
                                        var m = new Date();
                                        const fdata = {
                                            account_type: 1, account_role: account_role, account_name: name, account_password: password, email: email, mobile: mobile,
                                            created_by: created_by, create_date: m, current_status: status, start_time: starttime, end_time: endtime,
                                            authorised_person_name: authorised_person_name, emailserver_alloted: emailserver_alloted, is_deleted: is_deleted,
                                            show_no_id: showtype, did_alloted: did_alloted, voip_status: voip_status, monitor_agent: monitor_agent, whatsup_access: whatsup_access
                                        };
                                        Default.insertagent(fdata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                                res.status(200).send({ "msg": 'Something went wrong!' });
                                            }
                                            else {
                                                const agentid = rows.insertId;
                                                if(groupid>0){
                                                    var fdata = { UserID: manager_id, AgentID: agentid, seq_no: 1, HuntGroupID: groupid };
                                                    Default.insertassignagent(fdata, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                    })
                                                }
                                                res.json({ 'msg': 'Agent created sucessfully.' });
                                            }
                                        })
                                    }else{
                                        res.status(200).send({ "msg": 'Agent limit reached' });
                                    }
                                }
                            })
                        }else{
                            res.status(200).send({ "msg": 'Account not active' });
                        }
                    }
                })
            } else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

router.post('/deleteagent', function (req, res) {
    const authkey = req.body.authkey;
    const agentname = req.body.agentname;
    API.checkauthkey(authkey, function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                const manager_id = rows[0].account_id
                API.getagentbyname(agentname,manager_id, function (err, rows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        if(rows.length>0){
                            API.deleteagent(rows[0].account_id, function (err, data) {
                                API.deleteagentfromgroup(rows[0].account_id, function (err, rows) {
                                })
                                res.status(200).send({ "msg": 'Agent deleted successfully.' });
                            })
                        }else{
                            res.status(200).send({ "msg": 'Agent not found!' });
                        }
                    }
                })
            }else {
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})


//Auto Call Text To Speech
router.post('/obdtextTospeechcall',async function (req, res) {
    console.log(req.body)
    const authkey = req.body.authkey;
    var number = req.body.callernumber;
    const script_text = req.body.script_text;
    const script_language = req.body.script_language;
    const valid_extention = req.body.valid_extention;
    const extention_action = req.body.extention_action;
    console.log(extention_action)
    if(extention_action!=''){
        Object.keys(extention_action).forEach(key => {
            console.log(extention_action[key])
        });
    }
    return
    API.checkauthkey(authkey,async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            if (rows.length > 0) {
                const accountid = rows[0].account_id
                var did = await helper.Getoutgoingdid(accountid);//'68202211'
                number = number.toString()[0] == 0 ? number : '0'+number
                if(did!=''){
                    var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                    // const askrestapi = new awry.API({
                    //     baseUrl: 'http://10.13.1.99:8088/ari',//voiceserverdata.ari_url,
                    //     username: 'teledial',//voiceserverdata.ari_username,
                    //     password: 'Garuda@DV18',//voiceserverdata.ari_password,
                    // });
                    const askrestapi = new awry.API({
                        baseUrl: voiceserverdata.ari_url,
                        username: voiceserverdata.ari_username,
                        password: voiceserverdata.ari_password,
                    });
                    const numid = 0
                    const context = 'cloudX_outgoing_textaudio';
                    const params = { 'endpoint': 'PJSIP/'+number+'@SM'+did,callerId: did, extension: 's',context: context,variables:{"DID":did,"NUMID":String(numid),"CallerNumber":number,"CallerName":number,"accountid": String(accountid),"ScriptText":script_text,"Language":script_language,"valid_extention":valid_extention,"CallType":"dialer"}};
                    askrestapi.channels.originate(params).then(results => {
                        //console.log(results.data)
                        var chdata = results.data
                        var cdrdata = {uniqueid:chdata.id,channel:chdata.name,accountid:accountid,DID:did,serviceid:9,CallStartTime:new Date(),CallerType:0,CallerName:number,CallerNumber:number,CallTypeID:1,CallType:'dialer',CdrStatus:3,auto_numid:numid}
                        helper.insertcdr(cdrdata, function (err, result) {
                            if (err)  return  console.log(err)
                            cdrid = result.insertId
                            console.log(cdrid)
                        })
                        const adata = {accountid:accountid,mobile:number,script_text:script_text,language:script_language,status:1}
                        db.query('INSERT INTO tf_textaudio_numbers set ?',[adata]);
                        res.status(200).send({ "msg": 'Call originated succesfully.' });
                    }).catch(function(err) {
                        console.log(err)
                        res.status(200).send({ "msg": 'Something went wrong' });
                        // db.query('update tf_textaudio_numbers set status=1 WHERE nid=?',[numid]);
                    });
                }else{
                    res.status(200).send({ "msg": 'Outgoing DID not found' });
                }
            }else{
                res.status(200).send({ "msg": 'Invalid auth key' });
            }
        }
    })
})

//Send SMS API
router.get('/sendsms', function (req, res) {
    console.log(req.query)
    var authkey = req.query.authkey;
    var mobile = req.query.mobile;
    var dltContentId = req.query.dltContentId?req.query.dltContentId:req.query.dltContentId;
    var message = req.query.message;
    if (/^\d{10}$/.test(mobile)) {
        if(dltContentId!=''){
            API.checkauthkey(authkey, function (err, rows) {
                if (err) {
                    res.status(200).send({ "msg": 'Something went wrong!' });
                }
                else {
                    if (rows.length > 0) {
                        const adata = rows[0]
                        const manager_id = adata.account_id
                        API.checkactiveamanageraccount(manager_id, function (err, results) {
                            if (err) {
                                res.status(200).send({ "msg": 'Something went wrong!' });
                            } else {
                                if (results.length > 0) {
                                    API.GetSmsServerByManagerId(manager_id, function (err, smsserverdata) {
                                        if (err) {
                                            console.log(err);
                                            res.status(200).send({ "msg": 'Sms server not assigned!!' });
                                        }
                                        else {
                                            if (smsserverdata.length > 0) {
                                                const serverArr = smsserverdata[0];
                                                //var smsurl = "https://pgapi.vispl.in/fe/api/v1/send?username=garudaadvsupres.trans&password=0HyUq&unicode=false&dltContentId="+dltContentId+"&from=TELFOR&to="+mobile+"&text="+message;
                                                var smsurl = serverArr.server_url;
                                                smsurl = smsurl.replace('{msg}', message);
                                                smsurl = smsurl.replace('{mobile}', mobile);
                                                smsurl = smsurl.replace('{contentid}', dltContentId);
                                                console.log(smsurl)
                                                urllib.request("http://10.13.1.103:3001/api/sendsms/", {
                                                    method: 'POST',
                                                    data: { smsurl: smsurl },
                                                    rejectUnauthorized: false,
                                                }, function (error, resp) {
                                                    if (error) {
                                                        console.log(error)
                                                        res.status(200).send({ "msg": 'Something went wrong!' });
                                                    }
                                                    else {
                                                        console.log(JSON.parse(resp))
                                                        var respArr = JSON.parse(resp).data
                                                        var smsstatus = respArr.state;
                                                        var transactionId = respArr.transactionId?respArr.transactionId:''
                                                        var smscredit = message.length < 160 ? 1 : 2;
                                                        var msgcharcnt = message.length;
                                                        if (/[^\u0000-\u00ff]/.test(message)) {
                                                            if (msgcharcnt > 70 && msgcharcnt < 135) {
                                                                smscredit = 2
                                                            }
                                                            if (msgcharcnt > 134 && msgcharcnt < 202) {
                                                                smscredit = 3
                                                            }
                                                            if (msgcharcnt > 201) {
                                                                smscredit = 4
                                                            }
                                                            if (msgcharcnt < 71) {
                                                                smscredit = 1
                                                            }
                                                        } else {
                                                            if (msgcharcnt > 160 && msgcharcnt < 307) {
                                                                smscredit = 2
                                                            }
                                                            if (msgcharcnt > 306 && msgcharcnt < 460) {
                                                                smscredit = 3
                                                            }
                                                            if (msgcharcnt < 161) {
                                                                smscredit = 1
                                                            }
                                                        }
                                                        var numberdata = { sms_uid:transactionId,cdr_id: 0, account_id: manager_id, mobile: mobile, text: message, sms_status: smsstatus, sms_credit: smscredit, sentdate: new Date() };
                                                        API.insertsmsdata(numberdata, function (err, count) {
                                                            if (err) {
                                                                //console.log(err);
                                                            } else {
            
                                                            }
                                                        })
                                                        res.status(200).send({ "msg": 'Message sent' });
                                                    }
                                                });
                                            }else{
                                                res.status(200).send({ "msg": 'Sms server not assigned!' });
                                            }
                                        }
                                    });                                    
                                } else {
                                    res.status(200).send({ "msg": 'Account not active' });
                                }
                            }
                        })
                    } else {
                        res.status(200).send({ "msg": 'Invalid auth key' });
                    }
                }
            })
        }else{
            res.status(200).send({ "msg": 'Content Id required' });
        }
    } else {
        res.status(200).send({ "msg": 'Invalid mobile' });
    }
})
module.exports = router;
