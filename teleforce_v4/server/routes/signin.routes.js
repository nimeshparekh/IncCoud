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
var ldap = require('ldapjs');
var urllib = require('urllib');
require("dotenv").config();
var requestify = require('requestify'); 
var helper = require("../helper/common");

function isObject(obj) {
    return obj != null && obj.constructor.name === "Object"
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/', function (req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    res.status(200).send({ 'your ip:': ip });
});
router.post('/', async function (req, res) {
    console.log('login started..')
    const username = req.body.username;
    const password = req.body.password;
    
    const ip = req.body.ip;
    const host = req.body.host?req.body.host:'';
    const deviceinfo = req.body.deviceinfo?req.body.deviceinfo:{};

    var result = false;
    // urllib.request("https://cloudX.in/api/default/signin/", {
    //     method: 'POST',
    //     data: { username: username, password: password },
    // }, function (error, resp) {
    //     if (error) {
    //         console.log(error)
    //         return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
    //     }
    //     else {            
    //         var result = JSON.parse(resp);
    //         if (result.islogin) {
                Signin.findUser(username,function (err, user) {
                    console.log(user)
                    if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
                    if (user && user.length > 0) {
                        const result = bcrypt.compareSync(password, user[0].account_password);
                        if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });

                        if(user[0].account_type==1 && user[0].account_id!=226){
                            if(host=='app.cloudX.in'){

                                return res.status(200).send({ 'islogin': false, 'msg': 'Not allowed to login on app.cloudX.in','redirecturl':'https://agent.cloudX.in/signin' });
                            }
                          
                        }
                        if(user[0].account_type!=1 && user[0].account_id!=42 ){
                            console.log(host);
                            if(host=='agent.cloudX.in'){
                                return res.status(200).send({ 'islogin': false, 'msg': 'Not allowed to login on agent.cloudX.in','redirecturl':'https://app.cloudX.in/signin' });
                            }
                        }
                      
                        if(user[0].expiry_date <= new Date() && user[0].account_type == 2 ){
                            return res.status(200).send({ 'islogin': false, 'msg': 'Account is expired...','Expired':user[0].expiry_date});
                        }else{
                            
                        }
                    //  if(user[0].account_type == 1 ){,'otherlogin':user[0].account_id
                    //   Signin.agent_expire_date(user[0].created_by , function (err, rowes) {
                    //         if(rowes[0].expiry_date <= new Date()  ){
                    //             return res.status(200).send({ 'islogin': false, 'msg': 'Account is expired...'});
                    //         }else{
                               
                    //         }      
                    //     });
                    //  }
                     /*if(user[0].login_token!='' && user[0].login_token!=null && user[0].account_type==1){
                        return res.status(200).send({ 'islogin': false, 'msg': 'You are logged in other device.','otherlogin':user[0].account_id});
                    } */
                        const expiresIn = 24 * 60 * 60;
                        const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type,agentrole: user[0].account_role, uid: username, secret: password }, SECRET_KEY, {
                            expiresIn: expiresIn
                        });
                        //console.log(accessToken);
                        var managerid = user[0].account_type==1?user[0].created_by:user[0].account_id
                        if(managerid==1556){
                            if(ip=='103.144.119.141' || ip=='103.99.15.90'){
                            }else{
                                //return res.status(200).send({ 'islogin': false, 'msg': 'Login not allowed from outside network' });
                            }
                        }
                      
                        var m = new Date();
                        logdata = { uid: user[0].account_id, date: m, action: 'Login', ip : ip,userAgent : deviceinfo.userAgent,deviceType : deviceinfo.deviceType,device : deviceinfo.device,browser : deviceinfo.browser,host: host};
                        Signin.UpdateUser({ is_loggedin: 'yes',login_token:accessToken }, user[0].account_id);
                        Signin.insertactivitylog(logdata, function (err, rows) {
                            loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status ,supervisior_role : user[0].supervisor_only};
                            res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn, "ip":ip });
                        });
                        if(user[0].account_type==1){
                            var tdata = {uid:managerid,lastdate:m,aid:user[0].account_id,account_name:user[0].account_name,mobile:user[0].mobile}
                            Signin.updateAgentQueueTime(tdata, user[0].account_id)
                        }
                    } else {
                        const expiresIn = 60 * 60;
                        const accessToken = jwt.sign({ uid: username, secret: password }, SECRET_KEY, {
                            expiresIn: expiresIn
                        });
                        return res.status(200).send({ 'islogin': false, 'msg': 'Televoice user not found!' });
                        return res.status(200).send({ 'islogin': true, 'isldap': true, "username": username, "access_token": accessToken, "expires_in": expiresIn, 'msg': 'TeleVoice user not found!' });
                    }
                });
    //         } else {
    //             var msg = result.msg
    //             console.log(msg)
    //             if (isObject(msg)) {
    //                 msg = msg.lde_message
    //             }
    //             if(msg=='No user found'){
    //                 Signin.findUser(username, function (err, user) {
    //                     if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
    //                     if (user && user.length > 0) {
    //                         const result = bcrypt.compareSync(password, user[0].account_password);
    //                         console.log("result::"+user);
    //                         if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });                            const expiresIn = 24 * 60 * 60;
    //                         const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type, uid: username, secret: password }, SECRET_KEY, {
    //                             expiresIn: expiresIn
    //                         });
    //                         //console.log(accessToken);
    //                         var m = new Date();
    //                         logdata = { uid: user[0].account_id, date: m, action: 'Login' };
    //                         Signin.UpdateUser({ is_loggedin: 'yes' }, user[0].account_id);
    //                         Signin.insertactivitylog(logdata, function (err, rows) {
    //                             loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status };
    //                             res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
    //                         });
    //                     } else {
    //                         const expiresIn = 60 * 60;
    //                         const accessToken = jwt.sign({ uid: username, secret: password }, SECRET_KEY, {
    //                             expiresIn: expiresIn
    //                         });
    //                         //return res.status(200).send({ 'islogin': false, 'msg': 'TeleVoice user not found!' });
    //                         return res.status(200).send({ 'islogin': true, 'isldap': true, "username": username, "access_token": accessToken, "expires_in": expiresIn, 'msg': 'TeleVoice user not found!' });
    //                     }
    //                 });
    //             }else{
    //                 res.status(200).send({ 'islogin': false, 'msg': msg });
    //             }
    //         }

    //     }
    // });
})
router.get('/logout/:id', function (req, res) {
    const userid = req.params.id;
    console.log("data :"+ userid);
    var m = new Date();
    if (userid > 0) {
        var data = { uid: userid, logout_time: m, action: 'Logout' };
        Signin.UpdateUser({ is_loggedin: 'no',login_token:null }, userid, function (err, rows) {
            console.log(err);
        });

        Signin.updateactivitylog(data, userid, function (err, rows) {
            console.log(err);
        });
        Signin.deleteAgentQueueTime(userid);
        res.status(200).send({ 'data': 'Activity log saved successfully' });
    }else{
        res.status(200).send({ 'data': 'Activity log saved successfully' });
    }
})
router.get('/getrole/', authorize, function (req, res) {
    const id = req.query.tknuserid
    const userrole = req.query.tknuserrole;
    const agentrole = req.query.tknagentrole;
    //console.log(JSON.stringify(req.query)+'===')
    Signin.getUserRole(id,async function (err, user) {
        if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
        //console.log(user[0])
        if(user[0].is_loggedin=='no' && userrole==1){
            res.status(503).send('')
            //res.status(200).send({ 'data': { account_type: userrole, account_id: id } });
        }else{
            var voipurl = ''
            if(userrole==1){
                voipurl = await helper.GetVoipDomain(id)
            }
            var sockerurl = await helper.GetSocketDomain(id,userrole)
            res.status(200).send({ 'data': { account_type: userrole, account_id: id,agent_type: agentrole ,voipurl:voipurl,sockerurl:sockerurl,created_by:user[0].created_by} });
        }
    })
})
router.post('/getaccess/', authorize, function (req, res) {
    accesspath = ['/campaigns', '/ivr-builder', '/click-to-call', '/conference-call', '/miss-call', '/agent-dialer']
    accessArr = { 0: 'ivr' }
    const userid = req.query.tknuserid;
    const path = req.body.path;
    console.log(req.body)
    if (userid > 0) {
        Signin.getUserRoleAccess(userid, function (err, rows) {
            //console.log(path)
            if (rows.length > 0) {
                account_type = rows[0].account_type
                services = JSON.parse(rows[0].services)
                // console.log(services)
                if (account_type == 4 || account_type == 3) {
                    res.status(200).send({ 'authenticated': true });
                } else {
                    if (accesspath.includes(path)) {
                        res.status(200).send({ 'authenticated': true });
                    } else {
                        if (path == "/accessdenied") {
                            res.status(200).send({ 'authenticated': true });
                        } else {
                            res.status(200).send({ 'authenticated': true });
                        }
                    }
                }
            } else {
                res.status(200).send({ 'authenticated': false });
            }
        });
    } else {
        res.status(200).send({ 'authenticated': false });
    }
})
router.post('/checkusername', function (req, res) {
    //console.log("editid :"+req.body.editid);
    Signin.findUser(req.body.check, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});

router.post('/checkemail', function (req, res) {
    //console.log("editid :"+req.body.editid);
    Signin.findUserByEmail(req.body.check, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});

//Update UUID of Device
router.post('/updateuuid', function (req, res) {
    id = req.body.id
    uuid = req.body.uuid
    udata = { uuid: uuid }
    Signin.UpdateUser(udata, id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ 'msg': 'updated' });
        }
    });
});
router.post('/setagentliveip', function (req, res) {
    id = req.body.agentid
    ip = req.body.ip
    udata = { login_ip: ip }
    Signin.UpdateUser(udata, id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ 'msg': 'updated' });
        }
    });
});

//Login Using LDAP
router.post('/ldaplogin', function (req, res) {
    var result = "";
    const username = req.body.username;
    const password = req.body.password;
    if (username != '' && password != '') {
        var client = ldap.createClient({
            url: [process.env.LDAPURL, process.env.LDAPURL]
        });
        client.bind("cn=vmail,dc=cloudX,dc=in", "KMtrUjiGneP2UJvoAYqGfz2P4bRFQ4rj", function (err) {
            if (err) {
                result += "Reader bind failed ===>" + err;
                return res.status(200).send({ 'islogin': false, 'msg': result });
            }

            result += "Reader bind succeeded\n";

            var filter = '(uid=' + req.body.username + ')';

            result += `LDAP filter: ${filter}\n`;

            client.search("domainName=cloudX.in,o=domains,dc=cloudX,dc=in", { filter: filter, scope: "sub" },
                (err, searchRes) => {
                    var searchList = [];

                    if (err) {
                        result += "Search failed " + err;
                        return res.status(200).send({ 'islogin': false, 'msg': result });
                    }

                    searchRes.on("searchEntry", (entry) => {
                        result += "Found entry: " + entry + "\n";
                        //console.log(result)
                        searchList.push(entry);
                    });

                    searchRes.on("error", (err) => {
                        result += "Search failed with " + err;
                        return res.status(200).send({ 'islogin': false, 'msg': result });
                    });

                    searchRes.on("end", (retVal) => {
                        result += "Search results length: " + searchList.length + "\n";
                        for (var i = 0; i < searchList.length; i++)
                            result += "DN:" + searchList[i].objectName + "\n";
                        result += "Search retval:" + retVal + "\n";

                        if (searchList.length === 1) {
                            client.bind(searchList[0].objectName, req.body.password, function (err) {
                                if (err) {
                                    result += "Bind with real credential error: " + err;
                                    return res.status(200).send({ 'islogin': false, 'msg': err });
                                }
                                else {
                                    result += "Bind with real credential is a success";
                                    Signin.findUser(username, function (err, user) {
                                        if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
                                        if (user && user.length > 0) {
                                            var m = new Date();
                                            const expiresIn = 24 * 60 * 60;
                                            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
                                                expiresIn: expiresIn
                                            });
                                            logdata = { uid: user[0].account_id, date: m, action: 'Login' };
                                            Signin.UpdateUser({ is_loggedin: 'yes' }, user[0].account_id);
                                            Signin.insertactivitylog(logdata, function (err, rows) {
                                                loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status };
                                                res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
                                            });
                                        } else {
                                            const expiresIn = 24 * 60 * 60;
                                            const accessToken = jwt.sign({ id: username }, SECRET_KEY, {
                                                expiresIn: expiresIn
                                            });
                                            return res.status(200).send({ 'islogin': true, 'msg': 'Login successful', "access_token": accessToken, "expires_in": expiresIn });
                                        }
                                    })
                                }
                            });  // client.bind (real credential)


                        } else { // if (searchList.length === 1)
                            result += "No unique user to bind";
                            console.log(result)
                            return res.status(200).send({ 'islogin': false, 'msg': "No user found" });
                        }

                    });   // searchRes.on("end",...)

                });   // client.search

        }); // client.bind  (reader account)

    } else {
        return res.status(200).send({ 'islogin': false, 'msg': 'Please enter username and password!' });
    }
})

router.post('/forcelogout',async function (req, res) {
    const userid = req.body.user_id;
    console.log(userid)
    var tdata = {userid:userid}
    var socketendpoint = await helper.GetSocketDomain(userid,1)
    if (userid > 0) {
        var m = new Date();
        var data = { uid: userid, logout_time: m, action: 'Logout' };
        Signin.UpdateUser({ is_loggedin: 'no',login_token:null }, userid,function (err, rows) {
            console.log(err);
            console.log(rows);
        });
        Signin.updateactivitylog(data, userid, function (err, rows) {
            console.log(err);
        });
        Signin.deleteAgentQueueTime(userid);
    }
    requestify.request("https://"+socketendpoint+"/socketapi/logout/", {
        method: 'POST',
        body: tdata,
        dataType: 'form-url-encoded',
    }).then(function(response) {
        console.log(JSON.stringify(response)+"===socket")
        return res.status(200).send({ 'msg': 'Agent logout successfully.' });
    })
    .fail(function(response) {
        console.log(JSON.stringify(response))
        console.log("==logout socket error")
        return res.status(200).send({ 'msg': 'Something went wrong.' });
    });
    // requestify.request("https://socket1.cloudX.in/socketapi/logout/", {
    //     method: 'POST',
    //     body: tdata,
    //     dataType: 'form-url-encoded',
    // }).then(function(response) {
    //     console.log(response+"===socket")
    //     //return res.status(200).send({ 'msg': 'Agent logout successfully.' });
    // })
    // .fail(function(response) {
    //     console.log(JSON.stringify(response))
    //     console.log("==logout socket error")
    //    // return res.status(200).send({ 'msg': 'Something went wrong.' });
    // });
})

router.post('/getlogindetail', function (req, res) {
    var id = req.body.id
    Signin.checkactivitylog(id, function (err, rows) {
        if (err) {
            res.status(200).json(err);
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
router.post('/check_user_name', function (req, res) {
    //console.log("editid :"+req.body.editid);
    Signin.check_user_name(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
module.exports = router;
