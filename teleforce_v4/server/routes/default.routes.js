var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Default = require('../model/default');
var ERP = require('../model/erp');
var API = require('../model/api');
var urllib = require('urllib');
const awry = require('awry');
var request = require('request');
var multer = require('multer');
const mime = require('mime');
const authorize = require("../middlewares/auth");
const bcrypt = require('bcryptjs');
var async = require("async");
var ldap = require('ldapjs');
require("dotenv").config();
var ssha = require('node-ssha256');
var requestify = require('requestify');
var dateFormat = require("dateformat");
var fs = require('fs-extra');
var path = require('path');     //used for file path

//Email integration
var nodemailer = require('nodemailer');
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



const { spawn } = require('child_process');
var pypath = require('../middlewares/pypath');
const helper = require('../helper/common');
const Digital = require('../model/digital');
python_sdk_path = pypath.path()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/', authorize, function (req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //console.log(ip);
    res.status(200).send({ 'your ip:': ip });
});

router.get('/getdidrouting/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getdidrouting(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getmanager/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getmanager(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getoutbountdid/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Default.getoutbountdid(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getDIDdetail/:id', authorize, function (req, res) {

    Default.getDIDdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows[0]);
            res.status(200).send({ "data": rows[0] });
        }
    })
})
//get kyc data
router.get('/getkycdata', authorize, function (req, res) {

    Default.getkycdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
//get kyc pending data
router.get('/getkycpendingdata', authorize, function (req, res) {
    Default.getkycpendingdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/updateDIDconfig', authorize, function (req, res) {
    var id = req.body.did_id;
    var type = req.body.type;
    var action = req.body.action;
    var m = new Date();
    fdata = { id: id, Type: type, Action: action };
    Default.updatedid(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'DID detail updated succesfully.' });
        }
    })
})
router.post('/savefile', authorize, function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    var upload = multer({ storage: storage }).single('uploadfile');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            //console.log(err);
            return res.status(422).send("an Error occured")
        }
        // No error occured.
        if (req.body.soundid != '') {
            //console.log(req.file);
            //name = req.file.path.substring(8);
            name = req.file.originalname;
            var m = new Date();
            size = req.file.size;
            var fileid = Math.floor(Math.random() * 1000)
            fdata = { id: req.body.soundid, filename: name, account_id: req.body.userid, fileid: fileid, filesize: size, duration: '00:00:10', updateDate: m }
            Default.updateSound(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(200).send({ "data": 'Sound file update succesfully.' });
                }
            })

        } else {
            name = req.file.path.substring(8);
            size = req.file.size;
            var m = new Date();
            var fileid = Math.floor(Math.random() * 1000)
            fdata = { filename: name, account_id: req.body.userid, fileid: fileid, addDate: m, filesize: size, duration: '00:00:10', active: 0, approved: 0, sorter: 0, updateDate: m }
            Default.saveSound(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(200).send({ "data": 'Sound file upload succesfully.' });
                }
            })
        }


    });
});
router.get('/getsoundlist/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getsoundlist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deletesound/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deletesound(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Sound File deleted successfully' });
        }
    })
})
router.get('/getivrlist/:id', authorize, async function (req, res) {
    //console.log(req.params.id);    
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }

    Default.getivr(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveIVR', authorize, function (req, res) {
    //console.log(req.body);
    var ivrname = req.body.ivrname;
    var ivrdesc = req.body.ivrdesc;
    var announcement = req.body.announcement;
    var type = req.body.type;
    var hitapi = req.body.hitapi > 0 ? 1 : 0;
    var apiID = req.body.hitapi
    var noinputdigit = req.body.noinputdigit;
    var timeout = req.body.timeout;
    var timeoutrecording = req.body.timeoutrecording;
    var invalidretryrecording = req.body.invalidretryrecording;
    var invalidrecording = req.body.invalidrecording;
    var invalidretries = req.body.invalidretries;
    var timeoutretries = req.body.timeoutretries;
    var timeoutretryrecording = req.body.timeoutretryrecording;
    var invaliddestinationtype = req.body.invaliddestinationtype;
    var timeoutdestinationtype = req.body.timeoutdestinationtype;
    var invaliddestinationaction = req.body.invaliddestinationaction;
    var timeoutdestinationaction = req.body.timeoutdestinationaction;
    var defaultdestinationtype = req.body.defaultdestinationtype;
    var defaultdestinationaction = req.body.defaultdestinationaction;

    var user_id = req.body.user_id;

    var m = new Date();
    var fdata = {
        UserID: user_id, IvrName: ivrname, IvrDesc: ivrdesc, AnnouncementID: announcement, AnnouncementType: type,
        ApiHit: hitapi, ApiID: apiID, noinputdigit: noinputdigit, TimeOut: timeout, CreateDate: m, InvalidRetryCount: invalidretries, NoInputRetryCount: timeoutretries,
        InvalidDestinationType: invaliddestinationtype, InvalidDestinationAction: invaliddestinationaction,
        NoInputDestinationType: timeoutdestinationtype, NoInputDestinationAction: timeoutdestinationaction,
        InvalidRetryAnnouncementID: invalidretryrecording, InvalidAnnounceMentID: invalidrecording,
        NoInputAnnouncementID: timeoutrecording, NoInputRetryAnnouncementID: timeoutretryrecording,
        DefaultDestinationType: defaultdestinationtype, DefaultDestinationAction: defaultdestinationaction
    };
    Default.insertivr(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (req.body.type == 1) {
                var insertid = rows['insertId'];
                var dtmfdetail = req.body.dtmfDetails;
                valuearray = []
                for (var i = 0; i < 10; i++) {
                    var detail = dtmfdetail[i];
                    if (detail['dtmf'] != '') {
                        dtmf = detail['dtmf'];
                        dtmftype = detail['dtmftype'];
                        dtmfaction = detail['dtmfaction'];
                        dtmfsms = detail['dtmfsms'];
                        dtmfemail = detail['dtmfemail'];
                        dtmfapi = detail['dtmfapi'];
                        dtmfdata = [insertid, dtmf, dtmftype, dtmfaction, dtmfsms, dtmfemail, dtmfapi];
                        valuearray.push(dtmfdata);
                    }

                }
                Default.insertivrExt(valuearray, function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send({ "data": 'IVR saved succesfully.' });
                    }
                })
            } else {
                if (req.body.type == 0) {
                    var insertid = rows['insertId'];
                    var dtmfdetail = req.body.callstatues;
                    console.log(req.body.callstatues)
                    valuearray = []
                    for (var i = 0; i < 2; i++) {
                        var detail = dtmfdetail[i];
                        if (detail['dtmf'] != '') {
                            dtmf = detail['dtmf'];
                            dtmftype = detail['dtmftype'];
                            dtmfaction = detail['dtmfaction'];
                            dtmfsms = detail['dtmfsms'];
                            dtmfemail = detail['dtmfemail'];
                            dtmfapi = detail['dtmfapi'];
                            dtmfdata = [insertid, dtmf, dtmftype, dtmfaction, dtmfsms, dtmfemail, dtmfapi];
                            valuearray.push(dtmfdata);
                        }
    
                    }
                    console.log(valuearray.length);
                    if(valuearray.length>0)
                    Default.insertivrExt(valuearray, function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).send({ "data": 'IVR saved succesfully.' });
                        }
                    })
                    else{
                        res.status(200).send({ "data": 'IVR saved succesfully.' });

                    }

            }}
        }
    })
})
router.post('/updateIVR', authorize, function (req, res) {
    //console.log(req.body);
    var ivrid = req.body.ivrid;
    var ivrname = req.body.ivrname;
    var ivrdesc = req.body.ivrdesc;
    var announcement = req.body.announcement;
    var type = req.body.type;
    var hitapi = req.body.hitapi > 0 ? 1 : 0;
    var apiID = req.body.hitapi
    var noinputdigit = req.body.noinputdigit;
    var timeout = req.body.timeout;
    var timeoutrecording = req.body.timeoutrecording;
    var invalidretryrecording = req.body.invalidretryrecording;
    var invalidrecording = req.body.invalidrecording;
    var invalidretries = req.body.invalidretries;
    var timeoutretries = req.body.timeoutretries;
    var timeoutretryrecording = req.body.timeoutretryrecording;
    var invaliddestinationtype = req.body.invaliddestinationtype;
    var timeoutdestinationtype = req.body.timeoutdestinationtype;
    var invaliddestinationaction = req.body.invaliddestinationaction;
    var timeoutdestinationaction = req.body.timeoutdestinationaction;
    var defaultdestinationtype = req.body.defaultdestinationtype;
    var defaultdestinationaction = req.body.defaultdestinationaction;

    var user_id = req.body.user_id;

    var m = new Date();
    fdata = {
        IvrName: ivrname, IvrDesc: ivrdesc, AnnouncementID: announcement, AnnouncementType: type,
        ApiHit: hitapi, ApiID: apiID, noinputdigit: noinputdigit, TimeOut: timeout, InvalidRetryCount: invalidretries, NoInputRetryCount: timeoutretries,
        InvalidDestinationType: invaliddestinationtype, InvalidDestinationAction: invaliddestinationaction,
        NoInputDestinationType: timeoutdestinationtype, NoInputDestinationAction: timeoutdestinationaction,
        InvalidRetryAnnouncementID: invalidretryrecording, InvalidAnnounceMentID: invalidrecording,
        NoInputAnnouncementID: timeoutrecording, NoInputRetryAnnouncementID: timeoutretryrecording,
        DefaultDestinationType: defaultdestinationtype, DefaultDestinationAction: defaultdestinationaction
    };
    Default.updateivr(fdata, ivrid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (req.body.type == 1) {                                                                                                   
                var insertid = ivrid;
                var dtmfdetail = req.body.dtmfDetails;
                valuearray = []
                for (var i = 0; i < 10; i++) {
                    var detail = dtmfdetail[i];
                    if (detail.dtmf != '') {
                        dtmf = detail['dtmf'];
                        dtmftype = detail['dtmftype'];
                        dtmfaction = detail['dtmfaction'];
                        dtmfsms = detail['dtmfsms'];
                        dtmfemail = detail['dtmfemail'];
                        dtmfapi = detail['dtmfapi'];

                        if (dtmf == 11) {
                            dtmf = 0
                        }
                        dtmfdata = [insertid, dtmf, dtmftype, dtmfaction, dtmfsms, dtmfemail, dtmfapi];
                        valuearray.push(dtmfdata);
                    }
                }
                //console.log(valuearray)
                Default.updateivrExt(valuearray, insertid, function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send({ "data": 'IVR saved succesfully.' });
                    }
                })
            } else {
                if (req.body.type == 0) {
                    var insertid = ivrid;
                    var dtmfdetail = req.body.callstatues;
                    valuearray = []
                    for (var i = 0; i < 2; i++) {
                        var detail = dtmfdetail[i];
                        if (detail.dtmf != '') {
                            dtmf = detail['dtmf'];
                            dtmftype = detail['dtmftype'];
                            dtmfaction = detail['dtmfaction'];
                            dtmfsms = detail['dtmfsms'];
                            dtmfemail = detail['dtmfemail'];
                            dtmfapi = detail['dtmfapi'];
    
                            if (dtmf == 11) {
                                dtmf = 0
                            }
                            dtmfdata = [insertid, dtmf, dtmftype, dtmfaction, dtmfsms, dtmfemail, dtmfapi];
                            valuearray.push(dtmfdata);
                        }
                    }
                    //console.log(valuearray)
                    Default.updateivrExt(valuearray, insertid, function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).send({ "data": 'IVR saved succesfully.' });
                        }
                    })
                }             }
        }
    })
})
router.get('/getivrdetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getivrdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ivardata = rows[0]
            Default.getivrExtensiondetail(req.params.id, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send({ "ivrdata": ivardata, "ivrext": rows });
                }
            })
        }
    })
})
router.get('/deleteivr/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deleteivr(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'IVR deleted successfully' });
        }
    })
})
router.get('/getagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup

    Default.getagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})// login activity

router.get('/getmanagertime/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getmanagertime(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getlog/:uid', authorize, function (req, res) {

    Default.getlog(req.params.uid, function (err, rows) {
        if (err) {

            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//logout activity
router.get('/getlogout/:uid', authorize, function (req, res) {

    Default.getlogout(req.params.uid, function (err, rows) {
        if (err) {

            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getagentdetail/', authorize, function (req, res) {
    Default.getagentdetail(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.get('/getagentdetailbyid/:id', authorize, function (req, res) {
    Default.getagentdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.post('/saveAgent', authorize, function (req, res) {
    console.log(req.body);
    var supervisor_only= req.body.supervisor_only
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    if (req.body.password) {
        var password = bcrypt.hashSync(req.body.password);
    }
    var created_by = req.body.created_by;
    var status = req.body.status;
    var voip_status = req.body.voip_status;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var showtype = req.body.showtype;
    var did_alloted = req.body.did_alloted;
    var emailserver_alloted = req.body.emailserver_alloted ? req.body.emailserver_alloted : null;
    var monitor_agent = req.body.monitor_agent;
    var authorised_person_name = req.body.authorised_person_name;
    var whatsup_access = req.body.whatsup_access;
    var account_role = req.body.user_role
    var is_deleted = req.body.deleted;
    var m = new Date();
    fdata = {
        account_type: 1, account_role: account_role, account_name: name, account_password: password, email: email, mobile: mobile,
        created_by: created_by, create_date: m, current_status: status, start_time: starttime, end_time: endtime,
        authorised_person_name: authorised_person_name, emailserver_alloted: emailserver_alloted, is_deleted: is_deleted,
        show_no_id: showtype, did_alloted: did_alloted, voip_status: voip_status, monitor_agent: monitor_agent, whatsup_access: whatsup_access,supervisor_only:supervisor_only
    };
    Default.insertagent(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.json({ 'msg': 'Something went wrong!' });
        }
        else {
            var agentid = rows.insertId;
            if (account_role == 2) {
                sdata = { supervisor_account_id: agentid, AgentID: agentid, UserID: created_by }
                Default.insertsupervisoragent(sdata, function (err, data) {
                    if (err) {
                        console.log(err);
                        //res.json({ 'msg': 'Something went wrong!' });
                    }
                    else {
                        console.log("supervisor agent assign successfully!!")
                        //res.json({ 'msg': 'Agent created sucessfully.' });
                    }
                })
            }
            if (voip_status == 0) {
                Default.createagentsipaccount(name, created_by, function (err, data) {
                    if (err) {
                        res.json({ 'msg': 'Something went wrong!' });
                    }
                    else {
                        console.log(data)
                        const sipdata = {agent_id:agentid,account_id:created_by,username:name,password:'garudavoip@dv'}
                        Default.insertagentsip(sipdata, function (err, data) {
                            if (err) {
                            }
                            else {
                                console.log(data)
                            }
                        })
                        res.json({ 'msg': 'Agent created sucessfully.' });
                    }
                })
            } else {
                res.json({ 'msg': 'Agent created sucessfully.' });
            }
            // var result = "";
            // var client = ldap.createClient({
            //     url: [process.env.LDAPURL, process.env.LDAPURL]
            // });
            // client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
            //     if (err) {
            //         result += "Reader bind failed " + err;
            //         res.status(200).send({ "data": err });
            //         return;
            //     }

            //     result += "Reader bind succeeded\n";
            //     var entry = {
            //         accountStatus: 'active',
            //         uid: req.body.name,
            //         cn: req.body.name,
            //         sn: req.body.name,
            //         userPassword: ssha.create(req.body.password),
            //         mail: [req.body.name + '@cloudX.in'],
            //         objectclass: ["inetOrgPerson", "mailUser", "shadowAccount", "amavisAccount"],
            //         enabledService: ["internal", "doveadm", "lib-storage", "indexer-worker", "dsync", "quota-status", "mail", "smtp", "smtpsecured", "smtptls", "pop3", "pop3secured", "pop3tls", "imap", "imapsecured", "imaptls", "managesieve", "managesievesecured", "managesievetls", "sieve", "sievesecured", "sievetls", "deliver", "lda", "lmtp", "recipientbcc", "senderbcc", "forward", "shadowaddress", "displayedInGlobalAddressBook", "sogo"],
            //         amavisLocal: "TRUE",
            //         mailboxFormat: "maildir",
            //         mailboxFolder: "Maildir",
            //         mailQuota: "1073741824",
            //         preferredLanguage: "en_US",
            //         mobile: req.body.mobile ? req.body.mobile : '',
            //         givenName: req.body.authorised_person_name,
            //         employeeNumber: agentid,
            //         homeDirectory: "/var/vmail/vmail1/cloudX.in/" + req.body.name
            //     };
            //     client.add('mail=' + req.body.name + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', entry, function (err) {
            //         if (err) {
            //             console.log(err.lde_message)
            //             res.status(200).send({ "data": err });
            //             return;
            //         } else {
            //             res.status(200).send({ "data": 'Agent detail saved succesfully.' });
            //         }
            //     });
            // })
        }

    })
})
router.post('/updateuser', function (req, res) {
    //console.log(req);
    var account_id = req.body.account_id;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var authorised_person_name = req.body.authorised_person_name;
    var company_address = req.body.company_address;
    var company_name = req.body.company_name;
    userdata = { account_id: account_id, email: email, mobile: mobile, authorised_person_name: authorised_person_name, company_address: company_address, company_name: company_name };
    Default.updateUser(userdata, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": 'profile updated succesfully.' });

        }
    });
});

router.post('/updatewebhook', function (req, res) {
    //console.log(req);
    var account_id = req.body.account_id;
    var webhookurl = req.body.webhookurl;
    userdata = { account_id: account_id, webhookurl: webhookurl };
    Default.updateUser(userdata, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": 'Webhook updated succesfully.' });

        }
    });
});
router.post('/changepassword', function (req, res) {
    //console.log(req);
    var account_id = req.body.account_id;
    var newpassword = req.body.newpassword;
    var confirmpassword = req.body.confirmpassword;
    if (newpassword == confirmpassword) {
        if (req.body.confirmpassword) {
            const password = bcrypt.hashSync(confirmpassword);
            confirmpassword = password;
        }
        passwordata = { account_id: account_id, account_password: confirmpassword };

        Default.updateUser(passwordata, function (err, count) {
            if (err) {
                res.status(200).send({ "data": 'Something went wrong!' });
            }
            else {
                var result = "";
                // var client = ldap.createClient({
                //     url: [process.env.LDAPURL, process.env.LDAPURL]
                // });
                // client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
                //     if (err) {
                //         result += "Reader bind failed " + err;
                //         res.status(200).send({ "data": err });
                //         return;
                //     }
                //     Default.getagentdetail(account_id, function (err, rows) {
                //         if (err) {
                //             console.log(err);
                //             res.status(200).send({ "data": 'No Agent found!' });
                //         }
                //         else {
                //             //console.log(rows)
                //             var row = rows[0]
                //             var agentname = row.account_name
                //             var change = new ldap.Change({
                //                 operation: 'replace',
                //                 modification: {
                //                     userPassword: ssha.create(req.body.newpassword),
                //                 }
                //             });
                //             client.modify('mail=' + agentname + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', change, function (err) {
                //                 if (err) {
                //                     res.status(200).send({ "data": err });
                //                     return;
                //                 } else {
                //                     res.status(200).send({ "data": 'password changed succesfully.' });
                //                 }
                //             });
                //         }
                //     })
                // })
                res.status(200).send({ "data": 'Password changed sucessfully.' });
            }
        });
    } else {
        res.status(200).send({ "data": 'Password Missmatch.' });
    }
});
router.post('/updateAgent', authorize, function (req, res) {
    console.log(req.body);
    var agentid = req.body.agentid;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var created_by = req.body.created_by;
    var status = req.body.status;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var showtype = req.body.showtype;
    var did_alloted = req.body.did_alloted;
    var emailserver_alloted = req.body.emailserver_alloted ? req.body.emailserver_alloted : null;
    var authorised_person_name = req.body.authorised_person_name;
    var voip_status = req.body.voip_status;
    var username = req.body.name;
    var monitor_agent = req.body.monitor_agent;
    var whatsup_access = req.body.whatsup_access;
    var account_role = req.body.user_role;
    var is_deleted = req.body.deleted;
    var m = new Date();
    var supervisor_only = req.body.supervisor_only;
    fdata = {
        account_id: agentid, account_name: name, email: email, mobile: mobile, created_by: created_by, last_modify_date: m,supervisor_only:supervisor_only,
        last_modify_by: created_by, current_status: status, start_time: starttime, end_time: endtime, authorised_person_name: authorised_person_name,
        show_no_id: showtype, did_alloted: did_alloted, emailserver_alloted: emailserver_alloted, voip_status: voip_status, monitor_agent: monitor_agent,
        whatsup_access: whatsup_access, account_role: account_role, is_deleted: is_deleted
    };
    Default.findAgentEditMobile(mobile, agentid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": 'This mobile no already exist!!' });
            } else {
                Default.updateagent(fdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        if (account_role == 2) {
                            sdata = { supervisor_account_id: agentid, AgentID: agentid, UserID: created_by }
                            Default.insertsupervisoragent(sdata, function (err, data) {
                                if (err) {
                                    console.log(err);
                                    //res.json({ 'msg': 'Something went wrong!' });
                                }
                                else {
                                    console.log("supervisor agent assign successfully!!")
                                    //res.json({ 'msg': 'Agent created sucessfully.' });
                                }
                            })
                        }

                        if (voip_status == 0) {
                            Default.createagentsipaccount(username, created_by, function (err, data) {
                                if (err) {
                                    console.log(err)
                                    //res.status(400).json(err);
                                }
                                else {
                                    console.log(data)
                                    //res.json({ 'msg': 'Agent created sucessfully.' });
                                }
                            })
                        }
                        // var result = "";
                        // var client = ldap.createClient({
                        //     url: [process.env.LDAPURL, process.env.LDAPURL]
                        // });
                        // client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
                        //     if (err) {
                        //         result += "Reader bind failed " + err;
                        //         res.status(200).send({ "data": err });
                        //         return;
                        //     }
                        //     if (status == 0) {
                        //         var accountstatus = "active"
                        //     } else {
                        //         var accountstatus = "disabled"
                        //     }
                        //     var change = new ldap.Change({
                        //         operation: 'replace',
                        //         modification: {
                        //             accountStatus: accountstatus,
                        //         }
                        //     });
                        //     client.modify('mail=' + username + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', change, function (err) {
                        //         if (err) {
                        //             res.status(200).send({ "data": err });
                        //             return;
                        //         } else {
                        //             res.status(200).send({ "data": 'Agent detail updated succesfully.' });
                        //         }
                        //     });
                        // })
                        res.status(200).send({ "data": 'Agent detail updated succesfully.' });
                    }

                })
            }
        }
    })

})
router.get('/deleteagent/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getagentdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'No Agent found!' });
        }
        else {
            //console.log(rows)
            var row = rows[0]
            var agentname = row.account_name
            Default.deletetocheckhunt(req.params.id, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                var groupid = rows.length;
                if (groupid == 0) {
                    Default.deleteagent(req.params.id, agentname, function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.status(200).send({ "data": 'Something went wrong!' });
                        }
                        else {
                            var result = "";
                            // var client = ldap.createClient({
                            //     url: [process.env.LDAPURL, process.env.LDAPURL]
                            // });
                            // client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
                            //     if (err) {
                            //         result += "Reader bind failed " + err;
                            //         res.status(200).send({ "data": err });
                            //         return;
                            //     }
                            //     client.del('mail=' + agentname + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', function (err) {
                            //         if (err) {
                            //             res.status(200).send({ "data": err });
                            //             return;
                            //         } else {
                            //             res.status(200).send({ "data": 'Agent detail deleted succesfully.' });
                            //         }
                            //     });
                            // })
                            res.status(200).send({ "data": 'Agent detail deleted succesfully.' });
                        }
                    })
                } else {
                    //console.log('Please Delete First Group')
                    res.status(200).send({ "data": 'This Agent Assign in Agent Group' });
                }

            });
        }
    })
})
router.get('/gethuntgroup/:id', authorize, async function (req, res) {
    //console.log(req.params.id);gethuntgroup
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Default.gethuntgroup(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveHuntgroup', authorize, function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var calltype = req.body.calltype;
    var holdmusic = req.body.holdmusic;
    var queuetimeout = req.body.queuetimeout;
    var agenttimeout = req.body.agenttimeout;
    var wrapuptime = req.body.wrapuptime;
    var hitapi = req.body.hitapi;
    var callrecording = req.body.callrecording;
    var sticky = req.body.sticky;
    var closed = req.body.closed;
    if (callrecording == true) {
        callrecording = 1;
    } else {
        callrecording = 0;
    }
    if (sticky == true) {
        sticky = 1;
    } else {
        sticky = 0;
    }
    if (closed == true) {
        closed = 1;
    } else {
        closed = 0;
    }
    var all = req.body.all;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    var sun = req.body.sun;
    if (mon == true) {
        mon = 1;
    } else {
        mon = 0;
    }
    if (tue == true) {
        tue = 1;
    } else {
        tue = 0;
    }
    if (wed == true) {
        wed = 1;
    } else {
        wed = 0;
    }
    if (thu == true) {
        thu = 1;
    } else {
        thu = 0;
    }
    if (fri == true) {
        fri = 1;
    } else {
        fri = 0;
    }
    if (sat == true) {
        sat = 1;
    } else {
        sat = 0;
    }
    if (sun == true) {
        sun = 1;
    } else {
        sun = 0;
    }
    if (all == true) {
        var mon = 1;
        var tue = 1;
        var wed = 1;
        var thu = 1;
        var fri = 1;
        var sat = 1;
        var sun = 1;
    }
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var destinationtype = req.body.destinationtype;
    var destinationaction = req.body.destinationaction;
    var userid = req.query.tknuserid;
    var trans_ext = req.body.trans_ext;

    const fdata = {
        GroupName: name, GroupDescription: description, AccountID: userid, CallType: calltype, MusicOnHoldID: holdmusic,
        Sticky: sticky, QueueTimeOut: queuetimeout, AgentTimeOut: agenttimeout, WrapUpTime: wrapuptime, CallRecording: callrecording,
        OpenTime: starttime, CloseTime: endtime, Closed: closed, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun,
        CloseType: destinationtype, CloseAction: destinationaction, ApiHit: hitapi, transfer_extesion: trans_ext
    };
    console.log(fdata)
    //fdata = { account_type: 1, account_name: name, account_password: password, email: email, mobile: mobile, created_by: created_by, create_date: m };
    Default.inserthuntgroup(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            const groupid = rows.insertId
            res.status(200).send({ "data": 'User group detail saved succesfully.' });
        }
    })
})
router.get('/getHuntgroupDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.gethuntgroupdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/updateHuntgroup', authorize, function (req, res) {
    var groupid = req.body.groupid;
    var name = req.body.name;
    var description = req.body.description;
    var calltype = req.body.calltype;
    var holdmusic = req.body.holdmusic;
    var queuetimeout = req.body.queuetimeout;
    var agenttimeout = req.body.agenttimeout;
    var wrapuptime = req.body.wrapuptime;
    var hitapi = req.body.hitapi;
    var callrecording = req.body.callrecording;
    var sticky = req.body.sticky;
    var closed = req.body.closed;
    if (callrecording == true) {
        callrecording = 1;
    } else {
        callrecording = 0;
    }
    if (sticky == true) {
        sticky = 1;
    } else {
        sticky = 0;
    }
    if (closed == true) {
        closed = 1;
    } else {
        closed = 0;
    }
    var all = req.body.all;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    var sun = req.body.sun;
    if (mon == true) {
        mon = 1;
    } else {
        mon = 0;
    }
    if (tue == true) {
        tue = 1;
    } else {
        tue = 0;
    }
    if (wed == true) {
        wed = 1;
    } else {
        wed = 0;
    }
    if (thu == true) {
        thu = 1;
    } else {
        thu = 0;
    }
    if (fri == true) {
        fri = 1;
    } else {
        fri = 0;
    }
    if (sat == true) {
        sat = 1;
    } else {
        sat = 0;
    }
    if (sun == true) {
        sun = 1;
    } else {
        sun = 0;
    }
    if (all == true) {
        var mon = 1;
        var tue = 1;
        var wed = 1;
        var thu = 1;
        var fri = 1;
        var sat = 1;
        var sun = 1;
    }
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var destinationtype = req.body.destinationtype;
    var destinationaction = req.body.destinationaction;
    var trans_ext = req.body.trans_ext;

    const fdata = {
        GroupID: groupid, GroupName: name, GroupDescription: description, CallType: calltype, MusicOnHoldID: holdmusic,
        Sticky: sticky, QueueTimeOut: queuetimeout, AgentTimeOut: agenttimeout, WrapUpTime: wrapuptime, CallRecording: callrecording,
        OpenTime: starttime, CloseTime: endtime, Closed: closed, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun,
        CloseType: destinationtype, CloseAction: destinationaction, ApiHit: hitapi, transfer_extesion: trans_ext
    };
    Default.updatehuntgroup(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            var userid = req.query.tknuserid;
            Default.createqueuemember(groupid, userid, function (err, data) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                }
            })
            res.status(200).send({ "data": 'User group detail updated succesfully.' });
        }
    })
})
router.get('/deleteHuntgroup/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deletehuntgroup(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Hunt Group detail deleted successfully' });
        }
    })
})
router.get('/getAssignedAgents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getassignedagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveAssignAgent', authorize, function (req, res) {
    //console.log(req.body);
    var groupid = req.body.groupid;
    var agentid = req.body.agentid;
    var seq_no = req.body.seq_no;
    var userid = req.body.userid;
    const fdata = { UserID: userid, AgentID: agentid, seq_no: seq_no, HuntGroupID: groupid };
    Default.insertassignagent(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            Default.assignqueuemember(groupid,agentid, userid, function (err, data) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                }
            })
            res.status(200).send({ "data": 'Agent assigned succesfully.' });
        }

    })
})
router.get('/AssignAgentsList/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.assignagentslist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/deleteAssignAgent/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getusergroupdetailbyID(req.params.id, function (err, resdata) {
        if(resdata.length>0){
            Default.deleteassignagent(req.params.id, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!' });
                }
                else {
                    const groupid = resdata[0].HuntGroupID
                    const agentid = resdata[0].AgentID
                    const userid = resdata[0].UserID
                    Default.deletequeuemember(groupid,agentid, userid, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(data)
                        }
                    })
                    res.status(200).send({ "data": 'Assign agent deleted successfully' });
                }
            })
        }else{
            res.status(200).send({ "data": 'Something went wrong!' });
        }
    });
})
router.post('/updateSequenceno', authorize, function (req, res) {
    var id = req.body.id;
    var seqno = req.body.seqno;
    fdata = { ID: id, seq_no: seqno };
    Default.updatesequenceno(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'DID detail updated succesfully.' });
        }
    })
})
//approve kyc data
router.post('/approvekyc', authorize, function (req, res) {
    // console.log(req.body);
    var kyc_id = req.body.kyc_id;
    var approved_by = req.body.approved_by;
    var m = new Date()
    var status = req.body.status;
    var note = req.body.note;
    if (status == 1) {
        fdata = {
            kyc_id: kyc_id, approved_by: approved_by,
            approve_date: m, status: status, note: note
        };
        //console.log(fdata);
        Default.approvekyc(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": 'status successfully...' });
            }
        })
    }
    else {
        fdata = { kyc_id: kyc_id, approved_by: approved_by, status: status, note: note };
        // console.log(fdata);
        Default.approvekyc(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": 'status successfully...' });
            }
        })

    }

})
//insert kyc form data
router.post('/savekycdata', authorize, function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/kyc')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'registration_certi',
                maxCount: 1
            },
            {
                name: 'gst_certificate',
                maxCount: 1
            },
            {
                name: 'agreement',
                maxCount: 1
            },
            {
                name: 'pan_card',
                maxCount: 1
            },
            {
                name: 'authorized_person_proof',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var account_id = req.body.account_id;

        var registration_certi = '';
        var gst_certificate = '';
        var agreement = '';
        var pan_card = '';
        var authorized_person_proof = '';

        var m = new Date();
        appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.registration_certi) {
            registration_certi = req.files.registration_certi[0].filename;
            // console.log(registration_certi);
            appadata = Object.assign({ registration_certi: registration_certi }, appadata)
        }
        if (req.files.gst_certificate) {
            gst_certificate = req.files.gst_certificate[0].filename;
            appadata = Object.assign({ gst_certificate: gst_certificate }, appadata)
        }
        if (req.files.pan_card) {
            pan_card = req.files.pan_card[0].filename;
            appadata = Object.assign({ pan_card: pan_card }, appadata)
        }
        if (req.files.authorized_person_proof) {
            authorized_person_proof = req.files.authorized_person_proof[0].filename;
            appadata = Object.assign({ authorized_person_proof: authorized_person_proof }, appadata)
        }
        if (req.files.agreement) {
            agreement = req.files.agreement[0].filename;
            //console.log(agreement);
            appadata = Object.assign({ agreement: agreement }, appadata)
        }

        Default.savekyc(appadata, function (err, count) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {

                res.status(200).send({ "data": 'KYC Document uploaded succesfully.pending for approval..' });

            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});
//update kyc form data
router.post('/updatekycdata', authorize, function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/kyc')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'registration_certi',
                maxCount: 1
            },
            {
                name: 'gst_certificate',
                maxCount: 1
            },
            {
                name: 'agreement',
                maxCount: 1
            },
            {
                name: 'pan_card',
                maxCount: 1
            },
            {
                name: 'authorized_person_proof',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var kyc_id = req.body.kyc_id;
        var account_id = req.body.account_id;
        var registration_certi = '';
        var gst_certificate = '';
        var agreement = '';
        var pan_card = '';
        var authorized_person_proof = '';

        var m = new Date();
        appadata = { kyc_id: kyc_id, account_id: account_id, uploaded_date: m };
        if (req.files.registration_certi) {
            registration_certi = req.files.registration_certi[0].filename;
            //console.log(registration_certi);
            appadata = Object.assign({ registration_certi: registration_certi }, appadata)
        }
        if (req.files.gst_certificate) {
            gst_certificate = req.files.gst_certificate[0].filename;
            appadata = Object.assign({ gst_certificate: gst_certificate }, appadata)
        }
        if (req.files.pan_card) {
            pan_card = req.files.pan_card[0].filename;
            appadata = Object.assign({ pan_card: pan_card }, appadata)
        }
        if (req.files.authorized_person_proof) {
            authorized_person_proof = req.files.authorized_person_proof[0].filename;
            appadata = Object.assign({ authorized_person_proof: authorized_person_proof }, appadata)
        }
        if (req.files.agreement) {
            agreement = req.files.agreement[0].filename;
            // console.log(agreement);
            appadata = Object.assign({ agreement: agreement }, appadata)
        }
        //name = req.file.path.substring(8);

        Default.updatekyc(appadata, function (err, count) {

            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {

                res.status(200).send({ "data": 'KYC Document update succesfully.pending for approval..' });

            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});
//get kyc form data by id
router.get('/getkycformdata/:id', function (req, res) {
    //console.log(req.params.id)
    Default.getkycformdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})
///get kyc approval form data   
router.get('/getkycapprovestatus/:id', function (req, res) {
    Default.getkycapprovestatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })

})
router.post('/checkagentmobile', function (req, res) {
    Default.findAgentMobile(req.body.check, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            // console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
//at agent edit check mobile no
router.post('/checkagenteditmobile', function (req, res) {
    Default.findAgentEditMobile(req.body.check, req.body.id, function (err, rows) {
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
router.post('/saveClicktoCallScript', authorize, function (req, res) {
    //console.log(req.body);
    var scriptname = req.body.scriptname;
    var domain = req.body.domain;
    var userid = req.body.userid;
    var agentgroup = req.body.agentgroup;
    var button_position = req.body.button_position;
    var tag_id = 'TF-' + Math.floor(Math.random() * 1000000);
    fdata = {
        account_id: userid, script_name: scriptname, domain: domain, agentgroup: agentgroup, button_position: button_position,
        tag_id: tag_id
    };
    Default.saveclicktocallscript(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Click to Call script saved succesfully.' });
        }

    })
})
router.get('/getClicktoCallScriptList/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getclicktocallccriptlist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deleteClicktoCallScript/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deleteclicktocallscript(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Click to Call script deleted successfully' });
        }
    })
})
router.get('/getAgentGroupwithPackage/', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getagentgroupwithpackage(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/searchAgent', authorize, function (req, res) {
    Default.searchcall(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
//get email tempalt data
router.get('/getemaildata/:id', authorize, async function (req, res) {
    //console.log(req.params);
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Default.getemaildata(managerid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getscheduleemaildata/:id', authorize, function (req, res) {
    //console.log(req.params);
    Default.getscheduleemaildata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getschedulesmsdata/:id', authorize, function (req, res) {
    //console.log(req.params);
    Default.getschedulesmsdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//Email send for product
router.post('/sendadminemail', authorize, async function (req, res) {

    var template_id = req.body.template_id;
    var agent_id = req.body.customer_id;
    var usertype = req.body.usertype;
    if (usertype == 'curr_users') {
        Default.getemailadd(agent_id, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("email add");

                var array = rows[0]['email'].split(',');

                let info = {
                    from: frommail,
                    to: array,
                    subject: "Televoice", // Subject line
                    //text: "test", // plain text body
                    html: req.body.email_template, // html body
                };
                transporter.sendMail(info, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("success");
                    }
                });

                //res.status(200).send({ "data": rows });
            }
        })
    }

    if (usertype == 'inqr_users') {
        Default.getinquiryemail(agent_id, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("email add");

                var array = rows[0]['email'].split(',');

                let info = {
                    from: frommail,
                    to: array,
                    subject: "Televoice", // Subject line
                    //text: "test", // plain text body
                    html: req.body.email_template, // html body
                };
                transporter.sendMail(info, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("success");
                    }
                });

                //res.status(200).send({ "data": rows });
            }
        })
    }
    res.status(200).send({ "data": 'email sent succesfully.' });
})

//get email data by id
router.get('/getemaildetail/:id', authorize, function (req, res) {

    Default.getemaildetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//update email template data
router.post('/updateemaildata', authorize, function (req, res) {
    // console.log(req.body);
    var email_id = req.body.email_id;
    var account_id = req.body.account_id;
    var email_title = req.body.email_title;
    var email_subject = req.body.email_subject;
    var email_description = req.body.email_description;
    var m = new Date()
    fdata = { email_id: email_id, account_id: account_id, email_title: email_title, email_subject: email_subject, email_description: email_description, update_date: m };
    //console.log("update",fdata);
    Default.updateemaildata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'email template updated succesfully.' });
        }

    })
})
// save email temaplate data
router.post('/saveemaildata', authorize, function (req, res) {

    var account_id = req.body.account_id;
    var email_title = req.body.email_title;
    var email_subject = req.body.email_subject;
    var email_description = req.body.email_description;
    var m = new Date();
    var n = new Date();
    fdata = { account_id: account_id, email_title: email_title, email_subject: email_subject, email_description: email_description, add_date: n };

    Default.saveemaildata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email temaplate data  saved succesfully.' });
        }
    })
})
// delete email template data
router.get('/deleteemaildata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deleteemaildata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email data deleted successfully' });
        }
    })
})
// get sms template by id
router.get('/getsmsdata/:id', authorize, async function (req, res) {
    //console.log(req.params);
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        userid = managerid
    }
    Default.getsmsdata(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get smas detail
router.get('/getsmsdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Default.getsmsdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// Get SMS Campaing
router.get('/getsmscampaign', authorize, function (req, res) {
    //console.log(req.params);
    var id = req.query.tknuserid
    Default.getsmscampaign(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// update sms template
router.post('/updatesmsdata', authorize, function (req, res) {
    // console.log(req.body);
    var sms_id = req.body.sms_id;
    var account_id = req.body.account_id;
    var sms_title = req.body.sms_title;
    var sms_text = req.body.sms_text;
    var sms_credits = req.body.sms_credits;
    var msg_limit = req.body.msg_limit;
    var msg_length = req.body.msg_length;
    var isschedulemeeting = req.body.isschedulemeeting;
    var is_meet = 0;
    if (isschedulemeeting == true) {
        is_meet = 1;
    }

    var m = new Date()
    fdata = { sms_id: sms_id, account_id: account_id, sms_text: sms_text, sms_title: sms_title, update_date: m, sms_credits: sms_credits, text_length: msg_length, text_limit: msg_limit, isschedulemeeting: is_meet };
    Default.updatesmsdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms updated succesfully.' });
        }

    })
})
//save sms template

router.post('/savesmsdata', authorize, function (req, res) {
    console.log(JSON.stringify(req.body));
    var account_id = req.body.account_id;
    var sms_title = req.body.sms_title;
    var sms_text = req.body.sms_text;
    var sms_credits = req.body.sms_credits;
    var m = new Date();
    var n = new Date();
    var msg_limit = req.body.msg_limit;
    var msg_length = req.body.msg_length;
    var isschedulemeeting = req.body.isschedulemeeting;
    var is_meet = 0;
    if (isschedulemeeting == true) {
        is_meet = 1;
    }

    fdata = { account_id: account_id, sms_text: sms_text, sms_title: sms_title, add_date: n, sms_credits: sms_credits, text_length: msg_length, text_limit: msg_limit, isschedulemeeting: is_meet };

    Default.savesmsdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms saved succesfully.' });
        }

    })
})
// delete sms tempalte
router.get('/deletesmsdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deletesmsdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted successfully' });
        }
    })
})
//get kyc view data
router.get('/getkycviewdata/:id', function (req, res) {
    //console.log(req.params.id)
    Default.getkycviewdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })

})
//get plan detail
router.get('/getplandetail/:id', authorize, function (req, res) {
    console.log(req.params.id);
    Default.getplandetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getKYCStatus/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        userid = managerid
    }
    Default.getKYCstatus(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})
/// serch request data
router.post('/searchReqData', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Default.searchreqdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }

    })
})
//NOT Assign Agent List with agent group 
router.post('/NotAssignAgentsList/', authorize, function (req, res) {
    // console.log(req.body.groupid);
    var groupid = req.body.groupid ? req.body.groupid : 0
    var data = { groupid: groupid, userid: req.body.userid }
    Default.notassignagentslist(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//NOT Assign Agent List with agent group 
router.get('/getManagerCurrentplanDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    var dateObj = new Date();
    var date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

    var data = { id: req.params.id, date: date };
    Default.getManagerCurrentplanDetail(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/agentChangePassword', authorize, function (req, res) {
    //console.log(req.body);
    var agentid = req.body.agentid;
    var newpassword = bcrypt.hashSync(req.body.newpassword);
    var m = new Date();
    fdata = { account_id: agentid, account_password: newpassword };
    Default.updateUser(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var result = "";
            // var client = ldap.createClient({
            //     url: [process.env.LDAPURL, process.env.LDAPURL]
            // });
            // client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
            //     if (err) {
            //         result += "Reader bind failed " + err;
            //         res.status(200).send({ "data": err });
            //         return;
            //     }
            //     Default.getagentdetail(agentid, function (err, rows) {
            //         if (err) {
            //             console.log(err);
            //             res.status(200).send({ "data": 'No Agent found!' });
            //         }
            //         else {
            //             //console.log(rows)
            //             var row = rows[0]
            //             var agentname = row.account_name
            //             var change = new ldap.Change({
            //                 operation: 'replace',
            //                 modification: {
            //                     userPassword: ssha.create(req.body.newpassword),
            //                 }
            //             });
            //             client.modify('mail=' + agentname + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', change, function (err) {
            //                 if (err) {
            //                     res.status(200).send({ "data": err });
            //                     return;
            //                 } else {
            //                     res.status(200).send({ "data": 'Agent password changed succesfully.' });
            //                 }
            //             });
            //         }
            //     })
            // })
            res.status(200).send({ "data": 'Agent password changed succesfully.' });
        }

    })
})
//get kyc pending data
router.get('/getAgentAssignLead/:id', authorize, function (req, res) {
    Default.getagentassignlead(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/updatewebtoken', authorize, function (req, res) {
    var id = req.query.tknuserid
    var uuid = req.body.token
    var udata = { webtoken: uuid, account_id: id }
    if (id > 0) {
        Default.updateUser(udata, function (err, rows) {
            if (err) {
                res.status(400).json(err);
            }
            else {
                res.status(200).send({ 'msg': 'updated' });
            }
        });
    } else {
        res.status(200).send({ 'msg': 'updated' });
    }
});

router.post('/getallagents/', authorize, async function (req, res) {
    //console.log(req.params.id);gethuntgroup
    var agentid = req.query.tknuserid
    var managerid = await helper.GetManagerIdByAgent(agentid)
    Default.getagents(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getnotifications/', authorize, async function (req, res) {
    //console.log(req.params.id);gethuntgroup
    var userid = req.query.tknuserid
    Default.getnotifications(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/savePlan', authorize, function (req, res) {
    //console.log(JSON.stringify(req.body));

    var name = req.body.name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var address = req.body.address;
    var state = req.body.state;
    var totalusers = req.body.totalusers;
    var amount = req.body.amount;
    var gst = req.body.gst;
    var totalamount = req.body.totalamount;
    var username = req.body.username;

    fdata = { username: username, name: name, mobile: mobile, email: email, address: address, state: state, totalusers: totalusers, amount: amount, gst: gst, totalamount: totalamount };
    Default.inserttmpuser(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("rows");
            // console.log(rows.insertId);
            res.status(200).send({ "data": rows });
        }

    })
})

router.post('/savekycuserdata', authorize, function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/tmpkyc')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'registration_certi',
                maxCount: 1
            },
            {
                name: 'gst_certificate',
                maxCount: 1
            },
            {
                name: 'agreement',
                maxCount: 1
            },
            {
                name: 'pan_card',
                maxCount: 1
            },
            {
                name: 'authorized_person_proof',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var userid = req.body.userid;

        var registration_certi = '';
        var gst_certificate = '';
        var agreement = '';
        var pan_card = '';
        var authorized_person_proof = '';

        var m = new Date();
        appadata = { userid: userid };
        if (req.files.registration_certi) {
            registration_certi = req.files.registration_certi[0].filename;
            // console.log(registration_certi);
            appadata = Object.assign({ registration_certi: registration_certi }, appadata)
        }
        if (req.files.gst_certificate) {
            gst_certificate = req.files.gst_certificate[0].filename;
            appadata = Object.assign({ gst_certificate: gst_certificate }, appadata)
        }
        if (req.files.pan_card) {
            pan_card = req.files.pan_card[0].filename;
            appadata = Object.assign({ pan_card: pan_card }, appadata)
        }
        if (req.files.authorized_person_proof) {
            authorized_person_proof = req.files.authorized_person_proof[0].filename;
            appadata = Object.assign({ authorized_person_proof: authorized_person_proof }, appadata)
        }
        if (req.files.agreement) {
            agreement = req.files.agreement[0].filename;
            //console.log(agreement);
            appadata = Object.assign({ agreement: agreement }, appadata)
        }

        Default.saveuserkyc(appadata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {
                console.log("Rows");
                console.log(JSON.stringify(rows));
                res.status(200).send({ "data": rows });

            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});

router.post('/updateuserkycformData', authorize, function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/tmpkyc')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'registration_certi',
                maxCount: 1
            },
            {
                name: 'gst_certificate',
                maxCount: 1
            },
            {
                name: 'agreement',
                maxCount: 1
            },
            {
                name: 'pan_card',
                maxCount: 1
            },
            {
                name: 'authorized_person_proof',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var kycid = req.body.kycid;
        var registration_certi = '';
        var gst_certificate = '';
        var agreement = '';
        var pan_card = '';
        var authorized_person_proof = '';

        var m = new Date();
        appadata = { kycid: kycid };
        if (req.files.registration_certi) {
            registration_certi = req.files.registration_certi[0].filename;
            //console.log(registration_certi);
            appadata = Object.assign({ registration_certi: registration_certi }, appadata)
        }
        if (req.files.gst_certificate) {
            gst_certificate = req.files.gst_certificate[0].filename;
            appadata = Object.assign({ gst_certificate: gst_certificate }, appadata)
        }
        if (req.files.pan_card) {
            pan_card = req.files.pan_card[0].filename;
            appadata = Object.assign({ pan_card: pan_card }, appadata)
        }
        if (req.files.authorized_person_proof) {
            authorized_person_proof = req.files.authorized_person_proof[0].filename;
            appadata = Object.assign({ authorized_person_proof: authorized_person_proof }, appadata)
        }
        if (req.files.agreement) {
            agreement = req.files.agreement[0].filename;
            // console.log(agreement);
            appadata = Object.assign({ agreement: agreement }, appadata)
        }
        //name = req.file.path.substring(8);

        Default.updateuserkyc(appadata, function (err, count) {

            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {

                res.status(200).send({ "data": 'KYC Document update succesfully.pending for approval..' });

            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});

router.post('/updatePlan', authorize, function (req, res) {
    var name = req.body.name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var address = req.body.address;
    var state = req.body.state;
    var totalusers = req.body.totalusers;
    var amount = req.body.amount;
    var gst = req.body.gst;
    var totalamount = req.body.totalamount;
    var username = req.body.username;
    var userid = req.body.userid;

    fdata = { userid: userid, username: username, name: name, mobile: mobile, email: email, address: address, state: state, totalusers: totalusers, amount: amount, gst: gst, totalamount: totalamount };
    Default.updateplan(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("rows");
            // console.log(rows.insertId);
            res.status(200).send({ "data": rows });
        }

    })
})

router.get('/gettempuser/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.gettempuser(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("final step");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/gettempkycdoc/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.gettempkycdoc(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("final step");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getlmsdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getleaddetails(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("final step");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getleaddetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getlmsdetails(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("final step");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getfreeagents/', authorize, async function (req, res) {
    var agentid = req.query.tknuserid
    var managerid = await helper.GetManagerIdByAgent(agentid)
    Default.getfreeagents(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getTickets/', authorize, async function (req, res) {

    var userrole = req.query.tknuserrole;
    var managerid = req.body.userid;
    var assignto = 0;
    var assigngroupagent = null;
    if (userrole == 1) {
        managerid = await helper.GetManagerIdByAgent(req.body.userid)
        if (managerid == 48) {
            assignto = req.query.tknuserid;
            assigngroupagent = await helper.AssignTicketToCurrentSalesAgent(req.query.tknuserid);
        }

    }
    var startdateObj = new Date(req.body.startdate);
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var startdateObj1 = new Date(req.body.enddate);
    req.body.enddate = startdateObj1.getFullYear() + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj1.getDate()).slice(-2);
    var statusArr = req.body.priority;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.priority = newstatusArr;
    }

    var data = { userid: req.body.account_id, userrole: userrole, managerid: managerid, startdate: req.body.startdate, enddate: req.body.enddate, priority: req.body.priority, agent: req.body.agent, assignto: assignto, assigngroupagent: assigngroupagent }
    console.log(data);
    Default.getAlltickets(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/geticketdetail/:id', authorize, async function (req, res) {
    Default.geticketdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/updateticket', authorize, function (req, res) {
    console.log(req.body);
    Default.updateticket(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var username = await helper.GetUsername(req.query.tknuserid);
            var comment = 'Reply ticket By ' + username;
            data = { ticket_id: req.body.ticket_id, account_id: req.body.account_id, agent_id: req.body.agent_id, assign_to: req.body.assign_to, notes: comment, comment: req.body.note, current_status: req.body.status, ticket_image: req.body.ticket_image, ticket_description: req.body.description }
            Default.addticketnote(data, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!!' });
                }
                else {
                    res.status(200).send({ "data": 'Ticket updated succesfully.' });
                }
            })
        }

    })
})

router.get('/getschedulelist/:id', authorize, function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");
    Default.getschedulelist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getcomingschedulelist/:id', authorize, function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");
    Default.getcomingschedulelist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getcustomerschedulelist/:id', function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");

    Default.getcustomerschedulelist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.get('/getcustomerschedulelistmeet/:id', function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");

    Default.getcustomerschedulemeetlist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.get('/getagenttime/:id', function (req, res) {
    Default.getagenthours(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getagenttimemeet/:id', function (req, res) {
    Default.getagentmeethours(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getcustomerschedulelistmanager/:id', function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");

    Default.getschedulelist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getschedulemanagerlist/:id', authorize, function (req, res) {
    var now = new Date();
    var f_date = dateFormat(now, "yyyy-mm-dd");

    Default.getschedulemanagerlist(req.params.id, f_date, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/agentupload', authorize, function (req, res) {

    console.log("step 1");
    var file_or = req.query.namm;
    console.log(file_or);
    var i = file_or.lastIndexOf('.');
    var extension = file_or.substr(i);

    var m = new Date();
    var fileid = 'CO_' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/calender/csv')

        },
        filename: function (req, file, cb) {
            cb(null, fileid + extension)
        },
    })
    var upload = multer({ storage: storage }).single('image_files');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured");
        }
        else {
            req.body.file_name = file_or;
            req.body.status = '0';
            req.body.file_path = 'calender/csv/' + fileid + extension;
            req.body.agentid = req.query.agentid
            Default.addfilerequestcalender(req.body, function (err, count) {
                console.log(err)
                if (err) {
                    res.status(400).json(err);
                }
                else {
                    res.json({ 'msg': 'File added sucessfully!' });
                }
            });

        }
    });

});
router.get('/getreportdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getreportdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveschedulereport', authorize, function (req, res) {

    var email = req.body.email;

    var report_name = req.body.report_name;
    var frequency = req.body.frequency;
    var account_id = req.body.account_id;

    fdata = { account_id: account_id, frequency: frequency, report_name: report_name, email: email };
    Default.saveschedulereport(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("rows");
            // console.log(rows.insertId);
            res.status(200).send({ "data": "schedule data save ." });
        }

    })
})
router.get('/getsechudelreportdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getsechudelreportdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getReasonData/:id', authorize, function (req, res) {

    Default.getreasondata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveHoldCallingReasonData', authorize, function (req, res) {
    Default.saveholdcallingreasondata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Hold Calling Reason saved successfully!' });
        }
    })
})
router.get('/getReasonDetailData/:id', authorize, function (req, res) {

    Default.getreasondetaildata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/updateReasonData', authorize, function (req, res) {
    Default.updatereasondata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Hold Calling Reason updated successfully!' });
        }
    })
})
router.get('/deleteReasonData/:id', authorize, function (req, res) {

    Default.deletereasondata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": 'Hold Calling Reason deleted successfully!' });
        }
    })
})
router.get('/getactiveagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getactiveagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})// login activity
router.get('/getactiveagents_2/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getactiveagents_2(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getCallReviewForm/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        req.params.id = managerid
    }
    Default.getcallreviewformdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows });
            } else {
                Default.getdefaultcallreviewformdata(0, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(200).send({ "data": rows });
                    }
                })
            }

        }
    })
})

router.get('/getManagerCallReviewForm/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        req.params.id = managerid
    }
    Default.getcallreviewformdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})


router.post('/saveCallReviewFormData', authorize, function (req, res) {
    var startdateObj = new Date(req.body.create_date);
    req.body.create_date = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) + ' ' + startdateObj.getHours() + ':' + startdateObj.getMinutes() + ':' + startdateObj.getSeconds();

    Default.savecallreviewformdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Form parameter saved successfully!' });
        }
    })
})
router.get('/getCallReviewFormDetail/:id', authorize, function (req, res) {

    Default.getcallreviewformdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/updateCallReviewFormData', authorize, function (req, res) {
    var startdateObj = new Date(req.body.update_date);
    req.body.update_date = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) + ' ' + startdateObj.getHours() + ':' + startdateObj.getMinutes() + ':' + startdateObj.getSeconds();

    Default.updatecallreviewformdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Form parameter updated successfully!' });
        }
    })
})
router.get('/deleteCallReviewFormData/:id', authorize, function (req, res) {

    Default.deletecallreviewformdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": 'Form parameter deleted successfully!' });
        }
    })
})
router.post('/savereviewrate', authorize, function (req, res) {
    //console.log(req.body);
    var reviews = req.body.reviews;
    if (reviews.length > 0) {
        for (i = 0; i < reviews.length; i++) {
            var data = { account_id: req.body.account_id, cdrid: req.body.cdrid, review_formid: reviews[i].formid, review_rate: reviews[i].rate, create_date: new Date() }
            //console.log(data);
            Default.savereviewrate(data, function (err, rows) {
                if (err) {
                    console.log(err);
                    return
                }
                else {

                }
            })
        }
    }
    res.status(200).send({ "msg": 'Your review rate saved successfully!' });
})

router.get('/getreviewrate/:cdrid', authorize, function (req, res) {
    //console.log(req.body);
    // var data = { account_id: req.body.account_id, audio_id: req.body.audioid,agent_id: req.body.agentid }
    Default.getreviewrate(req.params.cdrid, function (err, rows) {
        if (err) {
            console.log(err);
            return
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})
router.post('/saveheaderfootersetting', authorize, function (req, res) {
    console.log(req.body);
    // No error occured.
    var account_id = req.body.account_id;
    var letter_head = req.body.letter_head;
    var header_html = req.body.header_html;
    var header_image = req.body.header_image;
    var footer_html = req.body.footer_html;
    var footer_image = req.body.footer_image;
    var m = new Date();
    appadata = { account_id: account_id, letter_head: letter_head, header_html: header_html, header_image: header_image, footer_html: footer_html, footer_image: footer_image, uploaded_date: m };
    Default.saveheaderfootersetting(appadata, function (err, count) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {

            res.status(200).send({ "data": 'Header Footer setting saved successfully!!!' });

        }
        // res.json({error_code:0,err_desc:null});
    });


    // });

});

router.post('/uploadheaderimage', authorize, function (req, res) {
    //console.log(req.body);
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/header-footer/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/header-footer/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/header-footer')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'header_image',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var header_image = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.header_image) {
            header_image = req.files.header_image[0].filename;
        }
        res.status(200).send({ "data": header_image });

    });

});
router.post('/uploadfooterimage', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/header-footer/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/header-footer/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/header-footer')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'footer_image',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        // No error occured.
        var footer_image = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.footer_image) {
            footer_image = req.files.footer_image[0].filename;
        }
        res.status(200).send({ "data": footer_image });

    });

});

router.get('/getHeaderFooterSetting/:id', authorize, function (req, res) {
    Default.getheaderfootersetting(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
        // res.json({error_code:0,err_desc:null});
    });
});
router.get('/getcdrdetail/:id', authorize, function (req, res) {
    //console.log(req.body);
    if (req.params.id > 0) {
        Default.getcdrdetail(req.params.id, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": [] });
            }
            else {
                res.status(200).send({ "data": rows });
            }
        })
    } else {
        res.status(200).send({ "data": [] });
    }

})
router.get('/getmorenotification/', authorize, async function (req, res) {
    //console.log(req.params.id);gethuntgroup
    var userid = req.query.tknuserid
    Default.getmorenotification(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getsounddata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.getsounddata(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveagentconsultantdata/', authorize, function (req, res) {
    //var dateObj = new Date(req.body.joiningdate);
    //req.body.joiningdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    console.log(req.body)
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/addconsultant.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=kuf7j6n9hropneutnh8fdkk63h'
        },
        form: req.body
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.status(200).send({ 'msg': 'Consultant data saved successfully!!' });
    });
})

router.post('/getagentconsultantdata/', authorize, function (req, res) {
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getconsultantlist.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=kuf7j6n9hropneutnh8fdkk63h'
        },
        form: { parentid: req.query.tknuserid }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response.body);
        res.status(200).send({ 'data': JSON.parse(response.body) });
    });
})

router.get('/getagentconsultantdetail/:id', authorize, function (req, res) {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getconsultantlist.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            'dealerid': req.params.id
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.status(200).send({ 'data': JSON.parse(response.body) });
    });
})
router.post('/updateagentconsultantdata/', authorize, function (req, res) {
    var dateObj = new Date(req.body.joiningdate);
    req.body.joiningdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/updateconsultant.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=kuf7j6n9hropneutnh8fdkk63h'
        },
        form: req.body
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        //console.log(response.body);
        res.status(200).send({ 'msg': 'Consultant data updated successfully!!' });
    });
})
router.get('/getAssignedSupervisorAgents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getassignedsupervisoragents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/unassignsupervisoragentslist/', authorize, function (req, res) {
    //console.log(req.body);
    Default.unassignsupervisoragentslist(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/savesupervisorassignagent', authorize, function (req, res) {
    //console.log(req.body);
    /*var groupid = req.body.groupid;
    var agentid = req.body.agentid;
    var seq_no = req.body.seq_no;
    var userid = req.body.userid;
    fdata = { UserID: userid, AgentID: agentid, seq_no: seq_no, HuntGroupID: groupid };*/
    Default.savesupervisorassignagent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'User assigned to supervisor succesfully.' });
        }

    })
})
router.get('/deletesupervisorassignagent/:id', authorize, function (req, res) {
    Default.deletesupervisorassignagent(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Supervisor assign agent deleted successfully!' });
        }
    })
})
router.post('/searchSupervisorAgent', authorize, function (req, res) {
    Default.searchsupervisoragent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
router.post('/assign_group_channel', authorize, async function (req, res) {
    console.log(req.body);
    Digital.assign_chat_channels(req.body.group, req.body.channel_id, function (err, srows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            res.status(201).json({
                message: "Channel Assign For Chat",
            })
        }
    })
})
router.post('/assign_chat', authorize, function (req, res) {
    let agent_id = req.body.agent_id
    let chat_id = req.body.chat_id
    console.log('innn', req.body);
    Digital.assign_message_user(agent_id, chat_id, function (err, result) {
        if (err) {
            res.json({ 'err': err });
        } else {
            return res.status(200).json({ 'data': 'Chat Assign sucessfully.' });
        }
    })
})

router.get('/agentdeleteshoft/:id', authorize, function (req, res) {
    //console.log("abcd::"+);
    var data = {account_id:req.params.id,is_deleted:'yes',mobile:null}
    Default.updatemobilewithsoftdelete(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            Default.deleteagentfromagentgroup(req.params.id);
            Default.deleteagentfromcampaign(req.params.id);
            res.status(200).send({ "data": 'Delete sccessfull!' });
        }
    })
})
router.get('/getdeleteAgentdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getdeleteAgentdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getinactiveAgents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getinactiveAgents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/assignAgentLeadstoAgent', authorize, function (req, res) {
    console.log(req.body);
    Default.getleadsbyagentid(req.body.account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            rows.forEach(element => {
                var data = { l_id: element.l_id, agent_id: req.body.agentid }
                Default.updatelead(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": [] });

                    }
                    else {

                    }

                })
            });
            res.status(200).send({ "data": "Leads assign successfully!!" });
        }

    })

})

router.post('/Notassignsupervisior/', authorize, function (req, res) {
    console.log(req.body);
    Default.Notassignsupervisior(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/save_assign_to_supervisior', authorize, function (req, res) {
    //console.log(req.body);
    var disposition_id = req.body.groupid;
    var supervisor_id = req.body.agentid;
    var account_id = req.body.userid;
    fdata = { account_id: account_id, supervisor_id: supervisor_id, disposition_id: disposition_id };
    Default.save_assign_to_supervisior(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            res.status(200).send({ "data": 'Supervisior assigned succesfully.' });
        }

    })
})
router.get('/getassignsupervisior/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Default.getassignsupervisior(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deleteassignsupervisior/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deleteassignsupervisior(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            res.status(200).send({ "data": 'Assign supervisior deleted successfully' });
        }
    })
})
// update sms text variables
router.post('/updatesmsvariablesdata', authorize, function (req, res) {
    // console.log(req.body);
    var sms_id = req.body.sms_id;
    var var1 = req.body.var1 ? req.body.var1 : null;
    var var2 = req.body.var2 ? req.body.var2 : null;
    var var3 = req.body.var3 ? req.body.var3 : null;
    var var4 = req.body.var4 ? req.body.var4 : null;
    var var5 = req.body.var5 ? req.body.var5 : null;
    var customvar1 = req.body.customvar1 ? req.body.customvar1 : null;
    var customvar2 = req.body.customvar2 ? req.body.customvar2 : null;
    var customvar3 = req.body.customvar3 ? req.body.customvar3 : null;
    var customvar4 = req.body.customvar4 ? req.body.customvar4 : null;
    var customvar5 = req.body.customvar5 ? req.body.customvar5 : null;
    var form_id = req.body.formdata ? req.body.formdata : null;
    var link_id = req.body.link ? req.body.link : null;

    var m = new Date()
    fdata = { sms_id: sms_id, var1: var1, var2: var2, var3: var3, var4: var4, var5: var5, customvar1: customvar1, customvar2: customvar2, customvar3: customvar3, customvar4: customvar4, customvar5: customvar5, form_id: form_id, link_id: link_id, update_date: m };
    Default.updatesmsdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": 'SMS Text Variables updated succesfully.' });
        }

    })
})
router.post('/checkcontectmobile', function (req, res) {
    Default.checkcontectmobile(req.body.check, req.body.id, function (err, rows) {
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
router.post('/checkcontecteditmobile', authorize, function (req, res) {
    rdata = { mobile: req.body.check, count_id: req.body.id, userid: req.query.tknuserid }
    Default.checkcontecteditmobile(rdata, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
router.post('/checkcontactmobile', authorize, function (req, res) {
    rdata = { mobile: req.body.check, userid: req.query.tknuserid }

    Default.checkcontactmobile(rdata, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            // console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
router.get('/deleteallnotification/', authorize, function (req, res) {
    //console.log(req.params.id);
    Default.deleteallnotification(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Notification deleted successfully' });
        }
    })
})

router.post('/getdholeraagentdealdonedata', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate ? dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) : '';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate ? dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2) : '';

    Default.getdholeraagentdealdonedata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/uploadconsultantphotoimage', authorize, function (req, res) {
    //console.log(req.body);
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/consultant/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/consultant/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/consultant/photo/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/consultant/photo/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/consultant/photo/')
        },
        filename: function (req, file, cb) {
            cb(null, "PHOTO" + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'photoimage',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var photoimage = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.photoimage) {
            photoimage = req.files.photoimage[0].filename;
        }
        res.status(200).send({ "data": photoimage });

    });

});
router.post('/getticketstatuscount/', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var managerid = req.body.userid;
    var assignto = 0;
    if (userrole == 1) {
        managerid = await helper.GetManagerIdByAgent(req.body.userid)
        if (managerid == 48) {
            assignto = req.query.tknuserid;
        }
    }
    var startdateObj = new Date(req.body.startdate);
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var startdateObj1 = new Date(req.body.enddate);
    req.body.enddate = startdateObj1.getFullYear() + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj1.getDate()).slice(-2);
    var statusArr = req.body.priority;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.priority = newstatusArr;
    }

    var data = { userid: req.body.account_id, userrole: userrole, managerid: managerid, startdate: req.body.startdate, enddate: req.body.enddate, priority: req.body.priority, agent: req.body.agent, assignto: assignto }
    Default.getticketstatuscount(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})
router.get('/gettickettimeline/:id', authorize, async function (req, res) {
    Default.gettickettimeline(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getticketdetail/:id', authorize, async function (req, res) {
    Default.getticketdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})
router.post('/addticketnote/', authorize, async function (req, res) {
    var comment = '';
    if (req.body.comment_by) {
        var commentby = await helper.GetUsername(req.body.comment_by);
        comment = 'Note create By ' + commentby;
    }
    data = { ticket_id: req.body.ticket_id, account_id: req.body.account_id, agent_id: req.body.agent_id, assign_to: req.body.assign_to, notes: comment, comment: req.body.note, current_status: req.body.status }
    Default.addticketnote(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": 'Note saved successfully!!' });
        }
    })

})
router.post('/sendsmstocustomer/', authorize, function (req, res) {
    var ticketid = req.body.ticketid
    Default.getticketdetail(ticketid, function (err, ticketdata) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Ticket not found!!' });
        }
        else {
            console.log(ticketdata);
            if (ticketdata.length > 0) {
                var accountid = ticketdata[0].account_id
                var agentid = ticketdata[0].agent_id
                var ticket_id = ticketdata[0].ticket_id
                ERP.getsmsbalance(48, function (err, balancedata) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'You have not enough SMS Balance!!' });
                    }
                    else {
                        console.log(balancedata);
                        if (balancedata.length > 0) {
                            if (balancedata[0].SMS_Pr_Balance) {
                                ERP.GetSmsServerByManagerId(48, function (err, smsserverdata) {
                                    if (err) {
                                        console.log(err);
                                        res.status(200).send({ "data": 'Sms server not assigned!!' });
                                    }
                                    else {
                                        console.log(smsserverdata);
                                        if (smsserverdata.length > 0) {
                                            ERP.getsmstemplatebyid(req.body.smstemp, function (err, tempdata) {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(200).send({ "data": 'Sms template not found!!' });
                                                }
                                                else {
                                                    console.log(tempdata);
                                                    if (tempdata.length > 0) {
                                                        var serverArr = smsserverdata[0];
                                                        var templateid = tempdata[0].templateid;
                                                        var contentid = tempdata[0].contentid;
                                                        var message = req.body.message;
                                                        var space = ' '
                                                        var ticketmobile = req.body.mobileno
                                                        message = message.replace("{#var1#}", space);
                                                        message = message.replace("{#var2#}", space);
                                                        message = message.replace("{#var3#}", space);
                                                        message = message.replace("{#var4#}", space);
                                                        message = message.replace("{#var5#}", space);
                                                        var url = serverArr.server_url;
                                                        url = url.replace('{msg}', message);
                                                        url = url.replace('{mobile}', ticketmobile);
                                                        url = url.replace('{contentid}', contentid);
                                                        url = url.replace('{templateid}', templateid);
                                                        console.log(url)
                                                        request(encodeURI(url), { json: true, "rejectUnauthorized": false }, async (err, response, body) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(200).send({ "msg": "Something went wrong to send message!!" });
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
                                                                var numberdata = { account_id: 48, mobile: ticketmobile, cdr_id: ticket_id, sms_status: smsstatus, sms_uid: transactionId, sms_credit: msgcredit, sentdate: new Date(), text: message };
                                                                var smsid = await helper.InsertSmsReport(numberdata)
                                                                //Update Lead Timeline
                                                                var timeline = {}
                                                                timeline.agent_id = agentid
                                                                timeline.account_id = accountid
                                                                timeline.ticket_id = ticket_id
                                                                timeline.current_status = ticketdata[0].status
                                                                timeline.assign_to = ticketdata[0].assign_to
                                                                timeline.notes = 'SMS - ' + message
                                                                timeline.action_type = 'sms'
                                                                timeline.action_id = smsid
                                                                Default.addticketnote(timeline, function (err, rows2) { })
                                                                res.status(200).send({ "data": "Message sent successfully!!" });
                                                            }
                                                        })
                                                    } else {
                                                        res.status(200).send({ "data": 'Sms template not found!!' });
                                                    }
                                                }
                                            })
                                        } else {
                                            res.status(200).send({ "data": 'Sms server not assigned!!' });
                                        }
                                    }
                                })
                            } else {
                                res.status(200).send({ "data": 'You have not enough SMS Balance!!' });
                            }
                        } else {
                            res.status(200).send({ "data": 'You have not enough SMS Balance!!' });
                        }
                    }
                })
            } else {
                res.status(200).send({ "data": 'Ticket not found!!' });
            }
        }
    })
})
router.get('/getticketassignagentdetail/:id', authorize, async function (req, res) {
    Default.getticketassignagentdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/sendticketmail', authorize, async function (req, res) {
    //console.log(req.body)
    /*var agentid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var manager_id = 0
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(agentid)
        var user_id = managerid
        var manager_id = req.query.tknuserid
    } else {
        var user_id = req.query.tknuserid
    }*/
    //console.log(req.body);
    var ticketid = req.body.ticket_id ? req.body.ticket_id : 0
    Default.getagentdetail(req.body.agentid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'Agent not found!' });
        }
        else {
            if (rows.length > 0) {
                var adata = rows[0]
                //var SData = await helper.GetEmailServerLastData(user_id)
                //console.log(agentid+"::"+user_id);
                var SData = await helper.GetAgentEmailServerData(req.body.agentid, 48)
                if (SData.length > 0) {
                    //Own server
                    var ServerData = SData[0];
                    var transOptions = {
                        host: ServerData.smtp_server,
                        port: ServerData.smtp_port,
                        secure: false,
                        auth: {
                            user: ServerData.smtp_username,
                            pass: ServerData.smtp_password,
                        },
                    };
                    //console.log(transOptions);
                    var email = req.body.to;
                    var text = req.body.email_description
                    var subject = req.body.subject
                    var cc = req.body.cc
                    var bcc = req.body.bcc
                    var transporter = nodemailer.createTransport(transOptions);
                    var attachementfile = req.body.thumbnailfile ? req.body.thumbnailfile : ''
                    var tempattachment = req.body.emailtempattachment ? req.body.emailtempattachment : ''
                    let info = {
                        from: ServerData.server_name + " " + ServerData.smtp_username, // sender address
                        to: email, // list of receivers
                        subject: subject, // Subject line
                        html: text, // plain text body
                        cc: cc, // html body
                        bcc: bcc,
                    };
                    if (tempattachment != '' && tempattachment != null && attachementfile != '' && attachementfile != null) {
                        var filepath = 'https://app.cloudX.in/api/' + tempattachment;
                        if (fs.existsSync('./uploads/' + tempattachment)) {
                            info.attachments = [
                                {
                                    path: './uploads/' + tempattachment

                                },
                                {
                                    path: './uploads/ticket/Email/' + attachementfile
                                }
                            ]
                        } else {
                            var localpath = await helper.DownloadLiveFileToLocal(filepath, tempattachment)
                            console.log(localpath)
                            info.attachments = [
                                {
                                    path: localpath
                                },
                                {
                                    path: './uploads/ticket/Email/' + attachementfile
                                }
                            ]
                        }
                    }
                    else if (tempattachment != '' && tempattachment != null) {
                        var filepath = 'https://app.cloudX.in/api/' + tempattachment;
                        if (fs.existsSync('./uploads/' + tempattachment)) {
                            info.attachments = [
                                {
                                    path: './uploads/' + tempattachment,
                                }
                            ]
                        } else {
                            var localpath = await helper.DownloadLiveFileToLocal(filepath, tempattachment)
                            console.log(localpath)
                            info.attachments = [
                                {
                                    path: localpath,
                                }
                            ]
                        }
                    }
                    else if (attachementfile != '' && attachementfile != null) {
                        if (fs.existsSync('./uploads/ticket/Email/' + attachementfile)) {
                            info.attachments = [
                                {
                                    path: './uploads/ticket/Email/' + attachementfile
                                }
                            ]
                        }
                    }

                    //console.log(info)
                    transporter.sendMail(info, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.status(200).send({ "msg": 'Something went wrong to send email!' });
                        } else {
                            console.log(info);
                            if (info.accepted.length > 0) {
                                //Update Lead Timeline
                                Default.getticketdetail(ticketid, function (err, leadata) {
                                    if (leadata.length > 0) {
                                        var timeline = {}
                                        timeline.agent_id = leadata[0].agent_id
                                        timeline.account_id = leadata[0].account_id
                                        timeline.ticket_id = leadata[0].ticket_id
                                        timeline.assign_to = leadata[0].assign_to
                                        timeline.current_status = leadata[0].status
                                        timeline.notes = 'Email - ' + subject
                                        timeline.action_type = 'email'
                                        timeline.action_id = rows.insertId
                                        Default.addticketnote(timeline, function (err, rows2) { })
                                    }
                                })
                            }
                            res.status(200).send({ "msg": 'Email sent successfully!' });
                        }
                    })
                } else {
                    //cloudX server
                    res.status(200).send({ "msg": 'No email server found.Please try again.' });
                }
            } else {
                res.status(200).send({ "msg": 'Agent not found!' });
            }
        }
    })
})

router.post('/uploadticketemailpdf', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/ticket/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/ticket/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/ticket/Email/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/ticket/Email/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    var m = new Date();
    var fileid = 'EMAIL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/ticket/Email/')
        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).single('file');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        res.status(200).send({ "data": req.file.filename });
    });
});
router.post('/saveticketwhatsapp', authorize, function (req, res) {
    req.body.account_id = req.query.tknuserid
    var sdata = { ticket_id: req.body.ticket_id, account_id: req.query.tknuserid, message: req.body.message, mobile: req.body.mobile }
    Default.addwhatsappticket(sdata, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'msg': 'Something went wrong!!' });
        }
        else {
            Default.getticketdetail(req.body.ticket_id, function (err, ticketdata) {
                if (err) {
                    console.log(err);
                    return res.status(200).send({ 'msg': 'Something went wrong!!' });
                }
                else {
                    var timeline = {}
                    timeline.agent_id = ticketdata[0].agent_id
                    timeline.account_id = ticketdata[0].account_id
                    timeline.ticket_id = ticketdata[0].ticket_id
                    timeline.current_status = ticketdata[0].status
                    timeline.assign_to = ticketdata[0].assign_to
                    timeline.notes = 'Whatsapp - ' + req.body.message
                    timeline.action_type = 'whatsapp'
                    timeline.action_id = rows.insertId
                    Default.addticketnote(timeline, function (err, rows2) { })
                    return res.status(200).send({ 'msg': 'Whatsup message sent successfully!!' });
                }
            })
        }

    })
})

router.post('/sentticketmsgbywhatsupapi', authorize, async function (req, res) {
    req.body.account_id = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.account_id)
        req.body.account_id = managerid
    }
    req.body.setting_name = "whatsup_api";
    ERP.getwhatsupapidetail(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'msg': '' });
        }
        else {
            if (rows.length > 0) {
                //console.log('rows',rows);
                var apidata = rows[0]
                var url = apidata.api_endpoint
                var attachurl = apidata.api_endpoint
                var msg = req.body.message;
                var mobile = req.body.mobile.substr(-10)
                url = url.replace('{mobile}', mobile).replace('{text}', msg);
                var method = apidata.api_method
                var payload = apidata.api_payload != null ? apidata.api_payload.replace('{mobile}', mobile).replace('{text}', req.body.message).replace('{link}', '') : {}
                var header = apidata.api_header != null ? apidata.api_header : {}
                var headertype = apidata.api_header_type
                //console.log('payload',JSON.parse(payload));
                // console.log(header);
                var request = require('request');
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
                    var sdata = { ticket_id: req.body.ticket_id, account_id: req.body.account_id, message: req.body.message, mobile: mobile }
                    //console.log('AddWhatsappChat', sdata);

                    //await helper.AddWhatsappChat(sdata, req.query.tknuserid, userrole);
                    ERP.addwhatsappticket(sdata, function (err, rows) {
                        if (err) {
                            console.log(err);
                            return res.status(200).send({ 'msg': '' });
                        }
                        else {
                            //Update Lead Timeline
                            Default.getticketdetail(req.body.ticket_id, function (err, leadata) {
                                if (leadata.length > 0) {
                                    var timeline = {}
                                    timeline.agent_id = leadata[0].agent_id
                                    timeline.account_id = leadata[0].account_id
                                    timeline.ticket_id = leadata[0].ticket_id
                                    timeline.current_status = leadata[0].status
                                    timeline.assign_to = leadata[0].assign_to
                                    timeline.notes = 'Whatsapp - ' + req.body.message
                                    timeline.action_type = 'whatsapp'
                                    timeline.action_id = rows.insertId
                                    Default.addticketnote(timeline, function (err, rows2) { })
                                }
                            });
                            return res.status(200).send({ 'msg': 'Whatsapp message sent successfully!!' });
                        }
                    })
                });
                var attachfileArr = await helper.GetWhatsappTemplateById(req.body.email_tempid);
                if (attachfileArr.length > 0) {
                    var attachfile = attachfileArr[0].attach_file
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
                        var sdata = { ticket_id: req.body.ticket_id, account_id: req.body.account_id, message: filepath, mobile: mobile }
                        Default.addwhatsappticket(sdata, function (err, rows) {
                            if (err) {
                                console.log(err);
                                // return res.status(200).send({ 'msg': '' });
                            }
                            else {
                                // return res.status(200).send({ 'msg': 'Whatsapp message sent successfully!!' });
                            }
                        })
                    });
                }
            } else {
                return res.status(200).send({ 'msg': '' });
            }
        }
    })
})
router.get('/getactivesalesgroupagents/', authorize, async function (req, res) {
    Default.getactivesalesgroupagents(0, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/changeticketassignagent/', authorize, async function (req, res) {
    var data = { ticket_id: req.body.ticket_id, assign_to: req.body.assign_agent }
    Default.updateticket(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            Default.getticketdetail(req.body.ticket_id, async function (err, ticketdata) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!!' });
                }
                else {
                    var timeline = {}
                    timeline.agent_id = ticketdata[0].agent_id
                    timeline.account_id = ticketdata[0].account_id
                    timeline.ticket_id = req.body.ticket_id
                    timeline.current_status = ticketdata[0].status
                    timeline.assign_to = req.body.assign_agent
                    assigntoname = await helper.GetUsername(req.body.assign_agent);
                    var note = 'Ticket assign to ' + assigntoname;
                    timeline.notes = note;
                    Default.addticketnote(timeline, function (err, rows2) { })

                    res.status(200).send({ "data": "Assign Agent successfully!!" });
                }
            })

        }
    })
})
router.get('/getnotassignedticket/', authorize, async function (req, res) {
    Default.getnotassignedticket(0, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//get_admin_acitivy_log

router.post('/get_admin_acitivy_log', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Default.get_admin_acitivy_log(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }

    })
})
router.post('/checkotp', function (req, res) {
    mobile = req.body.mobile
    otp = req.body.otp
    Default.checkrequestotp(mobile, otp, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var m = new Date();
            fdata = { mobile: mobile, request_date: m };
            if (rows.length > 0) {
                res.status(200).send({ "msg": true });
            } else {
                res.status(200).send({ "msg": false });
            }
        }
    })
})
router.get('/requestotp/:mobile', function (req, res) {
    var fourdigitsrandom = Math.floor(1000 + Math.random() * 9000);
    var data = {}
    data.request_date = new Date()
    data.mobile = req.params.mobile
    data.otp = fourdigitsrandom
    console.log(data);
    if (/^\d{10}$/.test(data.mobile)) {
        Default.saverequestotp(data, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                //Send SMS
                //tonumber = req.params.mobile
                Default.getEmailSMSConfiguration(0, function (err, configdata) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'msg': 'Something went wrong!!' });
                    }
                    else {
                        if (configdata.length > 0) {
                            var smsurl = configdata[0].server_url;
                            var message = configdata[0].sms_text;
                            if (message) {
                                message = message.replace('{#var1#}', data.otp);
                            }
                            smsurl = smsurl.replace('{contentid}', configdata[0].contentid);
                            smsurl = smsurl.replace('{msg}', message);
                            smsurl = smsurl.replace('{mobile}', req.params.mobile);
                            // message = 'Your call request verification code is ' + fourdigitsrandom
                            // console.log(fourdigitsrandom);
                            console.log(smsurl);
                            urllib.request(smsurl, {
                                method: 'GET',
                                rejectUnauthorized: false,
                            }, function (error, resp) {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    //console.log(JSON.stringify(resp))
                                    res.status(200).send({ "msg": 'otp send succesfully' });
                                }
                            });
                        }else{
                            res.status(200).send({ "msg": 'Please check SMS Configuration!!' });
                        }

                    }
                })

            }
        })
    } else {
        res.status(200).send({ "msg": 'Invalid mobile' });
    }
})


router.get('/get_manager_id/', authorize, async function (req, res) {
    Default.get_manager_id(0, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/signup', function (req, res) {
    var result = "";
    // console.log(req.body)
    var data = {}
    var fname = req.body.fname
    var lname = req.body.lname
    var email = req.body.email
    var mobile = req.body.mobile
    var username = req.body.username
    var password = req.body.password
    var name = fname + '' + lname;
    if (username != '' && password != '') {
        bcrypt.genSalt(10, function (err, Salt) {
            // The bcrypt is used for encrypting password.
            bcrypt.hash(password, Salt, function (err, hash) {
                if (err) {
                    return console.log('Cannot encrypt');
                }
                var dt = new Date();
                dt.setDate(dt.getDate() + 7);
                var service = ['5', '9', '11', '13', '14', '15', '16', '17'];
                var m = new Date();
                data = { account_type: 2, account_role: 0, mobile: mobile, email: email, account_name: username, account_password: hash, current_status: 0, expiry_date: dt, services: JSON.stringify(service), user_limit: 1, is_demo: 1, created_by: 32, create_date: m }
                Default.savesignupdata(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'msg': 'Something went wrong!!' });
                    }
                    else {
                        var payload = { authkey: '74537b2d39e147d4a4b70dd2d173c71a84c213ec93c0bfb80e2ee54f21b2a727', mobile: req.body.mobile, email: req.body.email, name: req.body.fname, notes: req.body.intrest, lead_source: 'signup' }
                        API.checkauthkey(payload.authkey, async function (err, rows) {
                            if (err) {
                                res.status(200).send({ "msg": 'server error', 'status': '0' });
                            }
                            else {
                                if (rows.length > 0) {
                                    var managerid = rows[0].account_id
                                    var managername = rows[0].account_name
                                    var erp_email = rows[0].erp_email
                                    var erp_password = rows[0].erp_password
                                    payload.account_id = managerid
                                    var leadstatus = await helper.GenerateLead(payload)

                                    Default.getEmailSMSConfiguration(data, function (err, configdata) {
                                        if (err) {
                                            console.log(err);
                                            return res.status(200).send({ 'msg': 'Something went wrong!!' });
                                        }
                                        else {
                                            //console.log(configdata[0]);
                                            if (configdata.length > 0) {
                                                var transOptions = {
                                                    host: configdata[0].smtp_server,
                                                    port: configdata[0].smtp_port,
                                                    secure: false,
                                                    auth: {
                                                        user: configdata[0].smtp_username,
                                                        pass: configdata[0].smtp_password,
                                                    },
                                                };
                                                var transporter = nodemailer.createTransport(transOptions);
                                                subject = configdata[0].email_subject;
                                                emailhtml = configdata[0].email_description;
                                                emailhtml = emailhtml.replace('[username]', req.body.username);
                                                emailhtml = emailhtml.replace('[password]', req.body.password);
                                                toemail = req.body.email;
                                                // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                                var mailOptions = {
                                                    from: configdata[0].smtp_server + ' ' + configdata[0].smtp_username,
                                                    to: toemail,
                                                    subject: subject,
                                                    html: emailhtml,
                                                };
                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        console.log('Email sent: ' + info.response);
                                                        var emailstatus = info.response;
                                                    }
                                                })
                                            }
                                            return res.status(200).send({ 'msg': 'Your are registered successfully!!' });
                                        }
                                    })
                                } else {
                                    return res.status(200).send({ 'msg': 'Invalid authkey!!' });
                                }
                            }
                        })

                    }
                })
            })
        })

    } else {
        return res.status(200).send({ 'msg': 'Please enter username and password!' });
    }

})





module.exports = router;