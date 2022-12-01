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
// const askapi = new awry.API({
//     baseUrl: 'http://192.168.1.26:8088/ari',
//     username: 'autodial',
//     password: 'Garuda@dv18'
// });
var path = require('path');
var Zoho = require('../model/zoho');
var requestify = require('requestify'); 
const { urlencoded } = require('body-parser');
var moment = require('moment')
const helper = require('../helper/common');

var zohoclientid = '1000.B7BW369Z9Y6KAQMAYYQVJ9XHHRZ1EJ'
var zohoclientsecret = '661e923c8fd464b270ff62a92b212e422f871309d7'
var Accounts_URL = 'https://accounts.zoho.in'
var redirecturi = 'https://app.cloudX.in/api/zoho/'

var zoholeadclientid = '1000.DNQXHXEZJ6MO64ZX79FH0W6A6CFK4J'
var zoholeadclientsecret = '806b9d9ebed0f33d2db24f4e9a49f42be5ddc8fd87'
var leadredirecturi = 'https://app.cloudX.in/api/zoho/leadtoken'


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

function enablephonebridgeintegration(access_token)
{
    url = Accounts_URL+'/phonebridge/v3/integrate'
    requestify.request(url, {
        method: 'POST',
        headers :{  
            Authorization:"Bearer " + access_token // token
        }
    }).then(function(response) {
        console.log(response)
    })
    .fail(function(response) {
        console.log(response)
    }); 
}

function generatenewaccesstoken(id){
    return new Promise(function(resolve, reject){
        Zoho.getaccesscode(id,function (err, rows) {
            if(rows.length > 0){
                adata = rows[0]
                var lastdate = adata.date
                var accountserver = adata.accountsserver
                var nowdate = new Date()
                var lastcodetime = moment(lastdate, 'YYYY-MM-DD HH:mm:ss')
                var nowtime = moment(nowdate, 'YYYY-MM-DD HH:mm:ss')
                var diff = nowtime.diff(lastcodetime, 'minutes')
                console.log(diff)
                if(diff>60){
                    url = accountserver+'/oauth/v2/token'
                    zdata = {refresh_token:adata.refresh_token,client_id:zohoclientid,client_secret:zohoclientsecret,grant_type:"refresh_token"}
                    requestify.request(url, {
                        method: 'POST',
                        body: zdata,
                        dataType: 'form-url-encoded',
                    }).then(function(response) {
                        result = JSON.parse(response.body)
                        console.log(result)
                        newtoken = result.access_token
                        Zoho.updateaccesstoken({access_token:newtoken,date: new Date()},id)
                        resolve(newtoken);
                    })
                    .fail(function(response) {
                        console.log(response)
                        reject(new Error("Error User is undefined"));
                    });
                }else{
                    resolve(adata.access_token);
                }
            }else{
                reject(new Error("Error Token not found"));
            }
        })
    })
}

async function getaccesstoken(id){
    return new Promise(function(resolve, reject){
        Zoho.getaccesscode(id,function (err, rows) {
            if(rows.length > 0){
                var adata = rows[0]
                var lastdate = adata.date
                var accountserver = adata.accountsserver
                var apidomain = adata.api_domain
                var token = adata.access_token
                var nowdate = new Date()
                var lastcodetime = moment(lastdate, 'YYYY-MM-DD HH:mm:ss')
                var nowtime = moment(nowdate, 'YYYY-MM-DD HH:mm:ss')
                var diff = nowtime.diff(lastcodetime, 'minutes')
                //console.log(diff)
                if(diff>60){
                    var url = accountserver+'/oauth/v2/token'
                    var zdata = {refresh_token:adata.refresh_token,client_id:zohoclientid,client_secret:zohoclientsecret,grant_type:"refresh_token"}
                    requestify.request(url, {
                        method: 'POST',
                        body: zdata,
                        dataType: 'form-url-encoded',
                    }).then(function(response) {
                        var result = JSON.parse(response.body)
                        console.log(result)
                        var token = result.access_token
                        Zoho.updateaccesstoken({access_token:token,date:new Date()},id)
                        resolve({token,apidomain});
                    })
                    .fail(function(response) {
                        console.log(response)
                        reject(new Error("Error User is undefined"));
                    });
                }else{
                    resolve({token,apidomain});
                }
            }else{
                //reject(new Error("Error Token not found"));
                resolve('invalid');
            }
        })
    })
}
async function getzohousers(apidomain,access_token)
{
    return new Promise(function(resolve, reject){
        url = apidomain+'/phonebridge/v3/users'
        console.log(url)
        requestify.request(url, {
            method: 'GET',
            headers :{  
                Authorization:"Bearer " + access_token // token
            }
        }).then(function(response) {
            result = JSON.parse(response.body)
            resolve(result.users);
        })
        .fail(function(response) {
            result = JSON.parse(response.body)
            console.log(result)            
            resolve([]);
        });
    })
}

router.get('/getzohousers/:id', function (req, res) {
    Zoho.getzohousers(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/install', function (req, res) {
    var url = "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,PhoneBridge.call.log,PhoneBridge.zohoone.search&client_id="+zohoclientid+"&redirect_uri="+redirecturi+"&state=garuda&response_type=code&access_type=offline"
    res.redirect(url)
})

router.get('/', function (req, res) {
    console.log(req.query)
    var state = req.query.state
    var code = req.query.code
    var location = req.query.location
    var accountsserver = req.query['accounts-server']
    res.render(__dirname + '/login.html', {
        message: '',
        messageClass: '',
        state: state,
        code: code,
        location:location,
        accountsserver
    });
});
router.get('/auth', function (req, res) {
    res.render('login');
})
router.post('/auth', function (req, res) {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    const state = req.body.state;
    const code = req.body.code;
    const location = req.body.location;
    const accountsserver = req.body.accountsserver;
    Signin.findUser(username, function (err, user) {
        //console.log(user)
        //if (err) res.send('Incorrect Username and/or Password!');res.end();
        if (user && user.length > 0) {
            const result = bcrypt.compareSync(password, user[0].account_password);//bcrypt.compareSync(password, user.password);
            if (!result){
                res.render(__dirname + '/login.html', {
                    message: 'Invalid password',
                    messageClass: 'alert-danger',
                    state: state,
                    code: code,
                    location:location,
                    accountsserver:accountsserver,
                });
            }else{
                var accountid = user[0].account_id;
                if(user[0].account_type==2){
                    if(code!=''){
                        var zdata = {accountid:accountid,code:code,location:location,state:state,accountsserver:accountsserver}
                        Zoho.savecode(zdata,async function (err, rows) {
                            url = accountsserver+'/oauth/v2/token'
                            zdata = {grant_type:'authorization_code',client_id:zohoclientid,client_secret:zohoclientsecret,redirect_uri:redirecturi,code:code}
                            console.log(zdata)
                            console.log(url)
                            requestify.request(url, {
                                method: 'POST',
                                body: zdata,
                                dataType: 'form-url-encoded',
                            }).then(function(response) {
                                data = JSON.parse(response.body)
                                apidomain = data.api_domain
                                accesstoken = data.access_token
                                zdata = {accountid:accountid,access_token:data.access_token,refresh_token:data.refresh_token,api_domain:data.api_domain,token_type:data.token_type,expires_in:data.expires_in}
                                url = apidomain+'/phonebridge/v3/integrate'
                                requestify.request(url, {
                                    method: 'POST',
                                    headers :{  
                                        Authorization:"Bearer " + accesstoken // token
                                    }
                                }).then(async function(response) {
                                    //console.log(response)
                                    Zoho.saveaccesscode(zdata,function (err, data) {
                                        console.log(err);
                                        console.log(data);
                                    })    
                                    Zoho.updatemanager({zoho_enable:'yes'},accountid,function (err, data) {
                                        console.log(err);
                                        console.log(data);
                                    })
                                    zohousers =  await getzohousers(apidomain,accesstoken)
                                    console.log(zohousers)
                                    zohousers.forEach(user => {
                                        zohouserid = user.zohouser
                                        zohousername = user.username
                                        zohouseremail = user.email
                                        udata = {account_id:accountid,zohouserid:zohouserid,zohousername:zohousername,zohouseremail:zohouseremail}
                                        Zoho.saveuser(udata)
                                    })
                                    res.render(__dirname + '/login.html', {
                                        message: 'PhoneBridge integration is successfully completed',
                                        messageClass: 'alert-success'
                                    });
                                })
                                .fail(function(response) {
                                    console.log(response)
                                    res.render(__dirname + '/login.html', {
                                        message: 'Error in integration within PhoneBridge',
                                        messageClass: 'alert-danger',
                                        state: state,
                                        code: code,
                                        location:location,
                                        accountsserver:accountsserver,
                                    });
                                });
                            })
                            .fail(function(response) {
                                res.render(__dirname + '/login.html', {
                                    message: 'Error to generate phonebridge access token',
                                    messageClass: 'alert-danger',
                                    state: state,
                                    code: code,
                                    location:location,
                                    accountsserver:accountsserver,
                                });
                            }); 
                        })
                    }else{
                        res.render(__dirname + '/login.html', {
                            message: 'Invalid access code',
                            messageClass: 'alert-danger',
                            state: state,
                            code: code,
                            location:location,
                            accountsserver:accountsserver,
                        });
                    }
                }if(user[0].account_type==1){
                    if(code!=''){
                        var zdata = {accountid:accountid,code:code,location:location,state:state,accountsserver:accountsserver}
                        Zoho.savecode(zdata,async function (err, rows) {
                            var url = accountsserver+'/oauth/v2/token'
                            var zdata = {grant_type:'authorization_code',client_id:zoholeadclientid,client_secret:zoholeadclientsecret,redirect_uri:leadredirecturi,code:code}
                            console.log(zdata)
                            console.log(url)
                            requestify.request(url, {
                                method: 'POST',
                                body: zdata,
                                dataType: 'form-url-encoded',
                            }).then(function(response) {
                                var data = JSON.parse(response.body)
                                console.log(data)
                                var apidomain = data.api_domain
                                var accesstoken = data.access_token
                                var zdata = {accountid:accountid,access_token:data.access_token,refresh_token:data.refresh_token,api_domain:data.api_domain,token_type:data.token_type,expires_in:data.expires_in}
                                Zoho.saveaccesscode(zdata,function (err, data) {
                                    console.log(err);
                                    console.log(data);
                                    if(err){
                                        res.render(__dirname + '/login.html', {
                                            message: 'Error to generate access token',
                                            messageClass: 'alert-danger',
                                            state: state,
                                            code: code,
                                            location:location,
                                            accountsserver:accountsserver,
                                        });
                                    }else{
                                        Zoho.updatemanager({zoho_enable:'yes'},accountid,function (err, data) {
                                            console.log(err);
                                            console.log(data);
                                        })
                                        res.render(__dirname + '/login.html', {
                                            message: 'Integration is successfully completed',
                                            messageClass: 'alert-success',
                                            state: '',
                                            code: '',
                                            location:'',
                                            accountsserver:'',
                                        });
                                    }
                                })
                            })
                            .fail(function(response) {
                                res.render(__dirname + '/login.html', {
                                    message: 'Error to generate access token',
                                    messageClass: 'alert-danger',
                                    state: state,
                                    code: code,
                                    location:location,
                                    accountsserver:accountsserver,
                                });
                            }); 
                        })
                    }else{
                        res.render(__dirname + '/login.html', {
                            message: 'Invalid access code',
                            messageClass: 'alert-danger',
                            state: state,
                            code: code,
                            location:location,
                            accountsserver:accountsserver,
                        });
                    }
                }else{
                    res.render(__dirname + '/login.html', {
                        message: 'Unauthorized',
                        messageClass: 'alert-danger',
                        state: state,
                        code: code,
                        location:location,
                        accountsserver:accountsserver,
                    });  
                }
				//res.redirect('/success');
            } 
        } else {
            res.render(__dirname + '/login.html', {
                message: 'Invalid username or password',
                messageClass: 'alert-danger',
                state: state,
                code: code,
                location:location,
                accountsserver:accountsserver,
            });
        }
    });
})

//Click to Call From Zoho
router.post('/clicktodial', function (req, res) {
    console.log(req.body)
    var mobile = req.body.tonumber;
    const tfuserid = req.body.tfuserid;
    mobile = mobile.replace(/\s/g, '');
    mobile = mobile.replace('+', '');
    mobile = mobile.replace(/-/g, '');
    mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
    console.log(mobile)
    Zoho.getagentbyid(tfuserid,async function(err,rows){
        if (err) {
            console.log(err);
        }
        else {
            ///console.log(rows);
            if(rows.length>0){
                var data = rows[0]
                var did = data.did_alloted
                var accountid = data.created_by
                var AgentID = tfuserid
                var AgentName = data.account_name
                var AgentNumber = data.mobile
                if(did!=''){
                    var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                    const askrestapi = new awry.API({
                        baseUrl: voiceserverdata.ari_url,
                        username: voiceserverdata.ari_username,
                        password: voiceserverdata.ari_password,
                    });
                    const params = { 'endpoint': 'PJSIP/0'+AgentNumber+'@SM'+did,callerId: did,app:'tfoutgoingzoho',appArgs:"zohoagent,"+mobile+","+did};//extension: '9033524218',context: "cloudX_outgoing_zoho",variables:{"DID":did,"NUMID":'0',"CallerNumber":mobile,"CallerName":mobile,"AgentID":'188',"AgentName":'devagent',"AgentNumber":'9033524218',"accountid": '122',"MemberChannel":"PJSIP/"+mobile+"@SM"+did,"CallType":"outgoing"}
                    askrestapi.channels.originate(params).then(results => {
                        //console.log(results)
                        var chdata = results.data
                        var uniqueid = chdata.id
                        var cname = chdata.name
                        console.log(uniqueid)
                        const cdrdata = {uniqueid:uniqueid,accountid:accountid,DID:did,serviceid:9,CallerType:1,CallerName:mobile,CallerNumber:mobile,AgentID:AgentID,AgentName:AgentName,AgentNumber:AgentNumber,CallTypeID:0,CallType:'outgoing',CallStartTime:new Date(),AgentCallStartTime:new Date(),CdrStatus:0,channel:cname}
                        Zoho.insertcdr(cdrdata, function (err, result) {
                            console.log(err)
                            cdrid = result.insertId
                        })
                        res.status(200).send('');
                    }).catch(function(err) {
                        console.log(err)
                        res.status(200).send('');
                    });
                }else{
                    Zoho.getaccesscode(accountid,async function (err, rows) {
                        if (err) {
                            res.status(400).json(err);
                        }
                        else {
                            if(rows.length > 0){
                                var adata = rows[0]
                                var apidomain = adata.api_domain
                                var url = apidomain+'/phonebridge/v3/clicktodialerror'
                                var zdata = {code:'noanswer',from:AgentNumber,to:mobile}
                                //console.log(zdata)
                                var access_token = await generatenewaccesstoken(accountid)
                                requestify.request(url, {
                                    method: 'POST',
                                    body: zdata,
                                    dataType: 'form-url-encoded',
                                    headers :{  
                                        Authorization:"Bearer " + access_token // token
                                    }
                                }).then(function(response) {
                                    //console.log(response)
                                })
                                .fail(function(response) {
                                    //console.log(response)
                                }); 
                                res.status(200).send('');
                            }
                        }
                    });
                }
            }
        }
    })
})

//Call End From Zoho
router.post('/hungupuri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                var params = { 'channelId': row.uniqueid,reason:'no_answer'};
                console.log(params)
                askrestapi.channels.hangup(params).then(data => {
                    //console.log(data)
                }).catch(function (err) {
                    console.log(err)
                    if(row.channel!=''){
                        var params = { 'channelId': row.channel,reason:'no_answer'};
                        askrestapi.channels.hangup(params).then(data => {
                            //console.log(data)
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                });
                var currentchannel = row.channelid
                var params = { 'channelId': currentchannel,reason:'no_answer'};
                console.log(params)
                askrestapi.channels.hangup(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    if(row.channel!=''){
                        var params = { 'channelId': row.channel,reason:'no_answer'};
                        askrestapi.channels.hangup(params).then(data => {
                            //console.log(data)
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }

                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Answer From Zoho
router.post('/answeruri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                var currentchannel = row.channelid
                var params = { 'channelId': currentchannel};
                console.log(params)
                askrestapi.channels.answer(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Mute From Zoho
router.post('/muteuri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(row.CallTypeID==2){
                    currentchannel = row.uniqueid
                }else{
                    currentchannel = row.channelid
                }
                var params = { 'channelId': currentchannel,direction:'out'};
                console.log(params)
                askrestapi.channels.mute(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Unmute From Zoho
router.post('/unmuteuri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(row.CallTypeID==2){
                    currentchannel = row.uniqueid
                }else{
                    currentchannel = row.channelid
                }
                var params = { 'channelId': currentchannel,direction:'out'};
                console.log(params)
                askrestapi.channels.unmute(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Hold From Zoho
router.post('/holduri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(row.CallTypeID==2){
                    currentchannel = row.uniqueid
                }else{
                    currentchannel = row.channelid
                }
                var params = { 'channelId': currentchannel};
                console.log(params)
                askrestapi.channels.hold(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call UnHold From Zoho
router.post('/unholduri', function (req, res) {
    console.log(req.body)
    const cdrid = req.body.callrefid;
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            console.log(err)
            if (err)  return  res.send("invalid");
            console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(row.CallTypeID==2){
                    currentchannel = row.uniqueid
                }else{
                    currentchannel = row.channelid
                }
                var params = { 'channelId': currentchannel};
                console.log(params)
                askrestapi.channels.unhold(params).then(data => {
                    //console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Key Press From Zoho
router.post('/keypressuri', function (req, res) {
    console.log(req.body)
    var cdrid = req.body.callrefid
    var digit = req.body.digit
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            //console.log(err)
            if (err)  return  res.send("invalid");
            //console.log(result)
            if(result.length>0){
                var row = result[0]
                var accountid  = row.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(row.CallTypeID==2){
                    currentchannel = row.uniqueid
                }else{
                    currentchannel = row.channelid
                }
                var params = { 'channelId': currentchannel,'dtmf':digit};
                console.log(params)
                askrestapi.channels.sendDTMF(params).then(data => {
                    console.log(data)
                    res.status(200).send("success");
                }).catch(function (err) {
                    console.log(err)
                    res.status(200).send("invalid");
                });
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Call Transfer
router.post('/calltransfer', function (req, res) {
    var cdrid = req.body.callrefid
    var agentid = req.body.agentid
    if(cdrid>0){
        Zoho.findcdr(cdrid,async function (err, result) {
            //console.log(err)
            if (err)  return  res.send("invalid");
            //console.log(result)
            if(result.length>0){
                var cdata = result[0]
                var accountid  = cdata.accountid
                var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                if(cdata.CallTypeID==2){
                    var callerchannelid = cdata.uniqueid
                    var agentchannelid = cdata.channelid
                }else{
                    var callerchannelid = cdata.channelid
                    var agentchannelid = cdata.uniqueid
                }
                Zoho.findZohoAgentById(agentid,async function (err, data) {
                    if(data.length>0){
                        var adata = data[0]
                        var did = cdata.DID
                        var bid = cdata.bridgeid
                        var agentmobile = adata.mobile
                        var zohouserid = adata.zohouserid
                        console.log(agentmobile)
                        console.log(did)
                        askrestapi.channels.originate({endpoint:'PJSIP/'+agentmobile+'@SM'+did,callerId:did,app:'tfoutgoingzoho',appArgs:"zohotransferagent,"+callerchannelid+","+bid+","+cdrid+","+agentid}).then(async data => {
                            var params = { 'channelId': agentchannelid};
                            //console.log(data.data)
                            var channelid = data.data['id']
                            //Save transfer Agent
                            var udata = {channelid:channelid,callrefid:cdrid,Date:new Date(),AgentID:adata.account_id,AgentName:adata.account_name,AgentNumber:adata.mobile,CallerNumber:cdata.CallerNumber,zohouser:zohouserid,accountid:cdata.accountid}
                            Zoho.savetransferagent(udata, function (err, result) {
                                //console.log(result)                                
                            })
                            //Call to Agent
                            var zdata = {type:'received',state:'ringing',id:String(cdrid),from:cdata.CallerNumber,to:agentmobile,zohouser:zohouserid}
                            var accessArr = await getaccesstoken(cdata.accountid)
                            var access_token = accessArr.token
                            //console.log(access_token)
                            if(access_token!='invalid'){
                                var url = accessArr.apidomain+'/phonebridge/v3/callnotify'
                                requestify.request(url, {
                                    method: 'POST',
                                    body: zdata,
                                    dataType: 'form-url-encoded',
                                    headers :{  
                                        Authorization:"Bearer " + access_token // token
                                    }
                                }).then(function(response) {
                                    //console.log(response)
                                })
                                .fail(function(response) {
                                    //console.log(response)
                                });       
                            } 
                            // var cdrdata = {CdrStatus:'1',channelid:channelid,AgentCallStartTime:new Date(),AgentID:adata.account_id,AgentName:adata.account_name,AgentNumber:adata.mobile}
                            // Zoho.updatecdr(cdrdata,cdrid, function (err, result) {
                            //     //console.log(result)                                
                            // })
                        }).catch(function(err) {
                            console.log(err)
                        });                      
                    }
                })
                res.status(200).send({msg:"success"});
            }else{
                res.status(200).send("invalid");
            }
        })
    }else{
        res.status(200).send("invalid");
    }
})

//Map Zoho User to cloudX Agent
router.post('/mapzohouser', function (req, res) {
    const userid = req.body.userid;
    const mapuserid = req.body.mapuserid;
    data = {mapuser_id:mapuserid}
    Zoho.updatezohouser(data,userid, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Agent map to zoho user successfully' });
        }
    })
})
router.get('/getzohouserbyid/:id', function (req, res) {
    Zoho.getzohouserbyid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/enabledisabledclicktodial', function (req, res) {
    const userid = req.body.userid;
    const action = req.body.action;
    Zoho.getzohouserbyid(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if(rows.length>0){
                data = rows[0]
                console.log(data)
                mapuserid = data.mapuser_id
                accountid = data.account_id
                if(mapuserid>0){
                    zohouserid = data.zohouserid
                    Zoho.getagentbyid(mapuserid,function(err,rows){
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if(rows.length>0){
                                data = rows[0]
                                Zoho.getaccesscode(accountid,async function (err, rows) {
                                    if (err) {
                                        res.status(400).json(err);
                                    }
                                    else {
                                        if(rows.length > 0){
                                            adata = rows[0]
                                            apidomain = adata.api_domain
                                            token = await generatenewaccesstoken(accountid)
                                            url = apidomain+'/phonebridge/v3/clicktodial'
                                            clicktodialuri = redirecturi+'clicktodial'
                                            zdata = {clicktodialuri:clicktodialuri,zohouser:zohouserid,clicktodialparam:'[{name:tfuserid,value:'+mapuserid+'}]'}
                                            console.log(zdata)
                                            if(action=='enable'){
                                                var method = 'POST'
                                                var pushzoho = 'yes'
                                            }else{
                                                var method = 'DELETE'
                                                var pushzoho = 'no'
                                            }
                                            requestify.request(url, {
                                                method: method,
                                                body: zdata,
                                                dataType: 'form-url-encoded',
                                                headers :{  
                                                    Authorization:"Bearer " + token // token
                                                }
                                            }).then(function(response) {
                                                console.log(response.body)
                                                url = apidomain+'/phonebridge/v3/callcontrol'
                                                answeruri = redirecturi+'answeruri'
                                                hungupuri = redirecturi+'hungupuri'
                                                muteuri = redirecturi+'muteuri'
                                                unmuteuri = redirecturi+'unmuteuri'
                                                holduri = redirecturi+'holduri'
                                                unholduri = redirecturi+'unholduri'
                                                keypressuri = redirecturi+'keypressuri'
                                                zdata = {hungupuri:hungupuri,muteuri:muteuri,unmuteuri:unmuteuri,holduri:holduri,unholduri:unholduri,keypressuri:keypressuri,zohouser:zohouserid,callcontrolparam:'[{name:tfuserid,value:'+mapuserid+'}]'}
                                                console.log(zdata)
                                                if(action=='enable'){
                                                    var method = 'POST'
                                                }else{
                                                    var method = 'DELETE'
                                                }
                                                requestify.request(url, {
                                                    method: method,
                                                    body: zdata,
                                                    dataType: 'form-url-encoded',
                                                    headers :{  
                                                        Authorization:"Bearer " + token // token
                                                    }
                                                }).then(function(response) {
                                                    console.log(response.body)
                                                    data = {push_zoho:pushzoho}
                                                    Zoho.updatezohouser(data,userid, function (err, result) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                    })
                                                    res.status(200).send({data:"Clicktodial functionality has been "+action+" successfully"});	
                                                })
                                                .fail(function(response) {
                                                    console.log(response)
                                                    res.status(200).send({data:"Problem to enable Clicktodial functionality"});	
                                                }); 
                                            })
                                            .fail(function(response) {
                                                console.log(response)
                                                res.status(200).send({data:"Problem to enable Clicktodial functionality"});	
                                            });
                                        }else{
                                            res.status(200).send({data:"No access token found"});	
                                        }
                                    }
                                })
                            }else{
                                res.status(200).send({data:"Invalid Agent map to Zoho user."});
                            }
                        }
                    })
                }else{
                    res.status(200).send({data:"No Agent map to Zoho user.Please map first."});
                }
            }
        }
    })
})
router.get('/getzohoaccessmanager/:id', function (req, res) {
    Zoho.getzohoaccessmanager(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/enabledisabledintegration', function (req, res) {
    const userid = req.body.userid;
    const action = req.body.action;
    Zoho.getzohoaccessmanager(userid,async function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if(rows.length>0){
                zdata = rows[0]
                var apidomain = zdata.api_domain
                var accountid = zdata.accountid
                url = apidomain+'/phonebridge/v3/integrate'
                token = await generatenewaccesstoken(accountid)
                if(action=='enable'){
                    var method = 'POST'
                }else{
                    var method = 'DELETE'
                }
                requestify.request(url, {
                    method: method,
                    headers :{  
                        Authorization:"Bearer " + token // token
                    }
                }).then(function(response) {
                    console.log(response)
                    data = {zoho_integration:action}
                    Zoho.updatezohoaccessmanager(data,userid, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    })
                    res.status(200).send({data:"Zoho Integration has been "+action+" successfully"});	
                })
                .fail(function(response) {
                    console.log(response)
                    res.status(200).send({data:"Problem to "+action+" Zoho Integration"});	
                });
            }else{
                res.status(200).send({data:"No zoho account found."});
            }
        }
    })
})

router.post('/checkzohouser', function (req, res) {
    const agentid = req.body.agentid;
    Zoho.findZohoAgentById(agentid,async function (err, data) {
        if(data.length>0){
            res.status(200).send({msg:"true"});
        }else{
            res.status(200).send({msg:""});
        }
    })
})
router.post('/reloadzohouser',async function (req, res) {
    const accountid = req.body.userid;
    Zoho.getaccesscode(accountid,async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            if(rows.length > 0){
                var adata = rows[0]
                var apidomain = adata.api_domain
                var accesstoken = await generatenewaccesstoken(accountid)
                var zohousers =  await getzohousers(apidomain,accesstoken)
                console.log(zohousers)
                zohousers.forEach(user => {
                    zohouserid = user.zohouser
                    zohousername = user.username
                    zohouseremail = user.email
                    udata = {account_id:accountid,zohouserid:zohouserid,zohousername:zohousername,zohouseremail:zohouseremail}
                    Zoho.saveuser(udata)
                })
                res.status(200).send({msg:"User reload successfully"});
            }else{
                res.status(200).send({msg:"Invalid access token"});
            }
        }
    })
})

router.post('/removezohoaccount',async function (req, res) {
    const accountid = req.body.userid;
    Zoho.deletezohoaccount(accountid,async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({msg:"Account deleted successfully from cloudX."});
        }
    })
})

//Leads API
router.get('/getaccess', function (req, res) {
    var url = "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.users.ALL&client_id="+zoholeadclientid+"&redirect_uri="+leadredirecturi+"&state=garuda&response_type=code&access_type=offline"
    res.redirect(url)
})

router.get('/leadtoken', function (req, res) {
    console.log(req.query)
    var state = req.query.state
    var code = req.query.code
    var location = req.query.location
    var accountsserver = req.query['accounts-server']
    res.render(__dirname + '/login.html', {
        message: '',
        messageClass: '',
        state: state,
        code: code,
        location:location,
        accountsserver
    });
});
router.post('/enabledisabledleadintegration', function (req, res) {
    const userid = req.body.userid;
    const action = req.body.action;
    Zoho.getzohoaccessmanager(userid,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({data:"No zoho account found."});
        }
        else {
            if(rows.length>0){
                var data = {zoho_integration:action}
                Zoho.updatezohoaccessmanager(data,userid, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                })
                res.status(200).send({data:"Zoho Integration has been "+action+" successfully"});	
            }else{
                res.status(200).send({data:"No zoho account found."});
            }
        }
    })
})
module.exports = router;