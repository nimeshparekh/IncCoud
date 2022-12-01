var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Setting = require('../model/setting');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
var fs = require("fs");
var multer = require('multer');
const mime = require('mime');
var client = require('scp2')
client.defaults({
    port: 7576,
});
const { exec } = require('child_process');
// const { getAudioDurationInSeconds } = require('get-audio-duration');
const authorize = require("../middlewares/auth");
var Signin = require('../model/signin');
var helper = require("../helper/common");
var nodemailer = require('nodemailer');
var path = require('path');
var filepath = path.join(__dirname, '../uploads/sounds');
console.log(filepath)
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/getsoundlist/:id', authorize, function (req, res) {
    const id = req.params.id;
    Setting.getsoundlist(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getApproveSoundList/:id', authorize, function (req, res) {
    const id = req.params.id;
    Setting.getapprovesoundlist(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/uploadsound', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/sounds/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/sounds/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    var m = new Date();
    var fileid = 'SOUND' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/sounds')
        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({ storage: storage }).single('audio');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.json({ 'data': 'Something went wrong!' });
        }
        // No error occured.
        //console.log(req.file);
        var userid = req.body.userid;
        var orignalname = req.file.originalname;
        var audiofilename = req.file.filename;
        return res.send({ message: 'working fine' })
        getAudioDurationInSeconds('./uploads/sounds/' + audiofilename).then((duration) => {
            //console.log(duration);
            const fdata = { originalfilename: orignalname, filename: audiofilename, account_id: userid, fileid: fileid, addDate: m, filesize: req.file.size, duration: duration, active: 0, approved: 0, sorter: 0, updateDate: m }
            Setting.saveSound(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.json({ 'data': 'Something went wrong!' });
                }
                else {
                    
                    var filepath = path.join(__dirname, '../uploads/sounds/');
                    exec('sox ' + filepath + audiofilename + ' -r 8000 -c 1 ' + filepath + fileid + '.gsm',async (err, stdout, stderr) => {
                        if (err) {
                            //some err occurred
                            console.error(err)
                            res.json({ 'data': 'Error to convert gsm.Please install sox.' });
                        } else {
                            // the *entire* stdout and stderr (buffered)
                            //console.log(`stdout: ${stdout}`);
                            //console.log(`stderr: ${stderr}`);
                            var voiceserverdata = await helper.GetManagerVoiceServerData(userid)
                            //console.log(voiceserverdata)
                            if(voiceserverdata){
                                exec('sshpass -p  "'+voiceserverdata.server_password+'" scp -P 7576  ./uploads/sounds/' + fileid + '.gsm '+voiceserverdata.server_username+'@'+voiceserverdata.server_ip+':/home/GTFSounds/audio',async (err, stdout, stderr) => {
                                //client.scp('./uploads/sounds/' + fileid + '.gsm', voiceserverdata.server_username+':'+voiceserverdata.server_password+'@'+voiceserverdata.server_ip+':/home/GTFSounds/audio', function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.json({ 'data': 'Error in file transfer to voice server.' });
                                    } else {
                                        exec('sshpass -p "R7@hv0CGty612mj" scp -P 7576  ./uploads/sounds/' + fileid + '.gsm root@10.13.1.105:/home/GTFSounds/audio',async (err, stdout, stderr) => {
                                            if (err) {
                                                //some err occurred
                                                console.error(err)
                                                console.log('sshpass',err);
                                            } else {
                                                console.log(`stdout: ${stdout}`);
                                                console.log(`stderr: ${stderr}`);
                                            }
                                        })
                                        Setting.getEmailSMSConfiguration('sound upload', function (err, configdata) {
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
                                                    toemail = 'support@cloudX.in';
                                                    // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                                    var mailOptions = {
                                                        from: configdata[0].smtp_server + ' ' + configdata[0].smtp_username,
                                                        to: toemail,
                                                        subject: subject,
                                                        html: emailhtml,
                                                    };
                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log("Email",error);
                                                        } else {
                                                            console.log('Email sent: ' + info.response);
                                                        }
                                                    })
                                                }
                                               
                                            }
                                        })
                                        console.log('Sound file upload succesfully');
                                        res.json({ 'data': 'Sound file upload succesfully.' });
                                        // client.scp('./uploads/sounds/' + fileid + '.gsm', 'gjani:cMF6LpU<B%;ms(dM@192.168.1.23:/home/GTFSounds/audio', function (err) {
                                        //     if (err) {
                                        //         console.log(err);
                                        //     } else {
                                        //         fs.unlink('./uploads/sounds/' + fileid + '.gsm', (err) => {
                                        //             if (err) {
                                        //                 console.log(err);
                                        //             }
                                        //         });
                                        //     }
                                        // });
                                    }
                                });                            
                            }else{
                                res.json({ 'data': 'No voice server found.' });
                            }
                        }
                    });
                }
            })
        });
    });
});

router.get('/deletesound/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Setting.getsoundbyid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            filename = rows[0].filename
            fs.unlink('./uploads/sounds/' + filename, (err) => {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!' });
                } else {
                    Setting.deletesound(req.params.id, function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.status(200).send({ "data": 'Something went wrong!' });
                        }
                        else {
                            res.status(200).send({ "data": 'Sound File deleted successfully' });
                        }
                    })
                }
            });
        }
    })
})
router.get('/getuserlimit/:id', authorize, function (req, res) {
    Setting.getuserdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "data": 0 });
        }
        else {
            user_limit = rows[0].user_limit
            res.status(200).send({ "data": user_limit });
        }
    })
})
//save start break time for agent
router.get('/startAgentBreakTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var start_time = date;
    data = { account_id: userid, date: date, start_time: date, break_status: 0 };

    Setting.getagentstartbreaktime(userid, date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": 'Your Break start at ' + rows[0].startime + ' please stop break time first.', "datalength": rows.length });
            } else {
                Setting.saveagentbreaktime(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        //Signin.UpdateUser({ is_loggedin: 'no' }, userid);
                        res.status(200).send({ "data": 'Your Break Time start successfully', "datalength": 0 });
                    }
                })
            }
        }
    })

})
router.post('/startAgentBreakTimeWithReason/', authorize, function (req, res) {
    var userid = req.body.userid;
    var date = new Date();
    var start_time = date;
    data = { account_id: userid, date: date, start_time: date, break_status: 0,break_type:req.body.reason };

    Setting.getagentstartbreaktime(userid, date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": 'Your Break start at ' + rows[0].startime + ' please stop break time first.', "datalength": rows.length });
            } else {
                Setting.saveagentbreaktime(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        //Signin.UpdateUser({ is_loggedin: 'no' }, userid);
                        res.status(200).send({ "data": 'Your Break Time start successfully', "datalength": 0 });
                    }
                })
            }
        }
    })

})

//GET start break time for agent
router.get('/getAgentStartBreakTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var date1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    Setting.getagentstartbreaktime(userid, date1, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
//update stop break time for agent
router.post('/stopAgentBreakTime', authorize,async function (req, res) {
    var userid = req.body.user_id;
    var breakid = req.body.breakid;
    var date = new Date();
    var stop_time = date;
    var dif_time = await Setting.getbreakdiff(breakid,stop_time)
    data = { account_id: userid, break_id: breakid, stop_time: stop_time, break_status: 1,dif_time:dif_time };

    Setting.updateagentbreaktime(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            //Signin.UpdateUser({ is_loggedin: 'yes' }, userid);
            res.status(200).send({ "data": 'Your Break Time stop successfully' });
        }
    })
})
router.post('/saveSMSConfig', authorize, function (req, res) {
    var serverid = req.body.serverid;
    var user_id = req.body.user_id;

    var m = new Date();
    var configDetail = req.body.configDetail;
    valuearray = []
    for (var i = 0; i < ((configDetail).length); i++) {
        var detail = configDetail[i];
        if (detail['event'] != '') {
            agent_smstemp = detail['agent_smstemp'];
            use_in = detail['event'];
            caller_smstemp = detail['caller_smstemp'];
            data = [user_id, serverid, agent_smstemp, use_in, caller_smstemp, m];
            valuearray.push(data);
        }
    }
    Setting.getsmsconfigdetail(user_id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                Setting.updatesmsconfiguration(valuearray, user_id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        res.status(200).send({ "data": 'SMS Configuration updated succesfully.' });
                    }
                })
            } else {
                Setting.savesmsconfiguration(valuearray, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        res.status(200).send({ "data": 'SMS Configuration saved succesfully.' });
                    }
                })
            }
        }
    })

})
router.get('/getSMSConfigDetail/:id', authorize, function (req, res) {
    const id = req.params.id;
    Setting.getsmsconfigdetail(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get agent today break time list
router.get('/getAgentTodayBreakTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var date1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    Setting.getagenttodaybreaktime(userid, date1, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get email and sms config data for super admin
router.post('/saveEmailSMSConfig', authorize, function (req, res) {
    var serverid = req.body.serverid;
    var emailserverid = req.body.emailserverid;
    var user_id = req.body.user_id;

    var m = new Date();
    var configDetail = req.body.configDetail;
    valuearray = []
    for (var i = 0; i < ((configDetail).length); i++) {
        var detail = configDetail[i];
        if (detail['event'] != '') {
            smstempid = detail['smstempid'];
            use_in = detail['event'];
            emailtempid = detail['emailtempid'];
            data = [user_id, serverid, emailserverid, smstempid, use_in, emailtempid, m];
            valuearray.push(data);
        }
    }
    Setting.getemailsmsconfigdetail(user_id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                Setting.updatemailsmsconfiguration(valuearray, user_id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        res.status(200).send({ "data": 'Email & SMS Configuration updated succesfully.' });
                    }
                })
            } else {
                Setting.savemailsmsconfiguration(valuearray, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        res.status(200).send({ "data": 'Email & SMS Configuration saved succesfully.' });
                    }
                })
            }
        }
    })

})
router.get('/getEmailSMSConfigDetail/:id', authorize, function (req, res) {
    const id = req.params.id;
    Setting.getemailsmsconfigdetail(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getCallStopTime/', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    Setting.getagentcallstoptime(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": {} });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": {} });
            }
        }
    })
})

router.post('/startstopAgentHoldTime/', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var status = req.body.status;
    var holdreason = req.body.status.holdreason;
    var date = new Date();
    var data = { account_id: userid, date: date, start_time: date, status: 0,reason_id:holdreason };
    //console.log(data);
    Setting.getagentcallstoptime(userid,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
        }
        else {
            if (rows.length > 0) {
                var dif_time = await Setting.getholddiff(rows[0].pause_id,date)
                var udata = { stop_time: date, status: 1,dif_time:dif_time };
                Setting.updateagentholdtime(udata, rows[0].pause_id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
                    }
                    else {
                        res.status(200).send({ "data": 'Call hold release successfully', "datalength": 0 });
                    }
                })
            } else {
                Setting.saveagentholdtime(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
                    }
                    else {
                        res.status(200).send({ "data": 'Call hold start successfully', "datalength": 0 });
                    }
                })
            }
        }
    })
})

router.post('/createfeedbackform', authorize, async function (req, res) {
    var m = new Date();
    var userid = req.query.tknuserid;
    var fdata = { form_name: req.body.name, manager_id: userid, created_date: m }
    //console.log(req.body);
    Setting.savefeedbackforms(fdata, function (err, result) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            var fid = result.insertId
            var extraitems = req.body.items
            console.log(fid,extraitems);
            if (extraitems != undefined && extraitems.length > 0) {
                extraitems.forEach(item => {
                    console.log(item.formtitle + "====" + item.formtype + "====" + item.formvalue)
                    var mdata = { form_id: fid, form_title: item.formtitle, form_type: item.formtype, form_value: item.formvalue, manager_id: userid }
                    if (item.formtitle != '') {
                        Setting.savefeedbackformmeta(mdata)
                    }
                });
                res.status(200).send({ "msg": 'Forms created sucessfully!' });
            }
        }
    })
})

router.post('/updatefeedbackform', authorize, async function (req, res) {
    var m = new Date();
    var userid = req.query.tknuserid;
    var fdata = { form_name: req.body.name, manager_id: userid, created_date: m, fid: req.body.fid }
    //console.log(req.body);
    Setting.updatefeedbackforms(fdata, function (err, result) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            var fid = req.body.fid;
            var extraitems = req.body.items
            if (extraitems != undefined && extraitems.length > 0) {
                extraitems.forEach(item => {
                    //console.log(item);
                    //console.log(item.formtitle + "====" + item.formtype + "====" + item.formvalue + "====" + item.formid)
                    if (item.formid > 0) {
                        var mdata = {form_id:fid,mid:item.formid,form_title:item.formtitle,form_type:item.formtype,form_value:item.formvalue,manager_id:userid}
                        if(item.formtitle!=''){
                            Setting.updatefeedbackformmeta(mdata)
                        }
                    }else{
                        var mdata = {form_id:fid,form_title:item.formtitle,form_type:item.formtype,form_value:item.formvalue,manager_id:userid}
                        if(item.formtitle!=''){
                            Setting.savefeedbackformmeta(mdata)
                        }    
                    }

                });
                res.status(200).send({ "msg": 'Forms created sucessfully!' });
            }
        }
    })
})

router.get('/getformdata/', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        userid = await helper.GetManagerIdByAgent(userid)
    }
    Setting.getfeedbackforms(userid, function (err, rows) {
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
router.get('/getformdatabyid/:id', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        userid = await helper.GetManagerIdByAgent(userid)
    }
    const id = req.params.id;
    Setting.getfeedbackformbyid(userid, id, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": {} });
        }
        else {
            if (rows.length > 0) {
                var metadata = await Setting.getfeedbackformmeta(id)
                res.status(200).send({ "data": rows, "metadata": metadata });
            } else {
                res.status(200).send({ "data": {} });
            }
        }
    })
})

//save start shift time for agent
router.get('/startAgentShiftTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var start_time = date;
    data = { account_id: userid, date: date, start_time: date, shift_status: 0 };

    Setting.getagentstartsifttime(userid, date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": 'Your Shift start at ' + rows[0].startime + ' please stop shift time first.', "datalength": rows.length });
            } else {
                Setting.saveagentshifttime(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!' });
                    }
                    else {
                        Signin.UpdateUser({ is_loggedin: 'yes' }, userid);
                        res.status(200).send({ "data": 'Your Shift Time start successfully', "datalength": 0 });
                    }
                })
            }
        }
    })

})

//update stop shift time for agent
router.post('/stopAgentShiftTime', authorize, function (req, res) {
    // console.log("body");
    // console.log(JSON.stringify(req.body));
    var userid = req.body.user_id;
    var shiftid = req.body.shiftid;
    var date = new Date();
    var stop_time = date;
    data = { account_id: userid, shift_id: shiftid, stop_time: stop_time, shift_status: 1 };

    Setting.updateagentshifttime(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            Signin.UpdateUser({ is_loggedin: 'no' }, userid);
            res.status(200).send({ "data": 'Your Shift Time stop successfully' });
        }
    })
})

//GET start break time for agent
router.get('/getAgentStartShiftTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var date1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    Setting.getagentstartshifttime(userid, date1, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})

//get agent today shift time list
router.get('/getAgentTodayShiftTime/:id', authorize, function (req, res) {
    var userid = req.params.id;
    var date = new Date();
    var date1 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    Setting.getagenttodayshifttime(userid, date1, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get email server data
router.get('/getemailserverdata/:id', authorize, function (req, res) {
    //console.log(req.params);
    Setting.getemailserverdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get email server by id
router.get('/getemailserverdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Setting.getemailserverdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
//Upadate email server
router.post('/updateemailserverdata', authorize, function (req, res) {
     console.log(req.body);
    var server_id = req.body.server_id;
    var account_id = req.body.account_id;
    var smtp_server = req.body.smtp_server;
    var smtp_port = req.body.smtp_port;
    var smtp_username = req.body.smtp_username;
    var smtp_password = req.body.smtp_password;
    var server_name = req.body.server_name;
    var perday_limit = req.body.perday_limit;
    var attachment_size = req.body.attachment_size;

    var imap_server = req.body.imap_server;
    var imap_port = req.body.imap_port;
    var imap_username = req.body.imap_username;
    var imap_password = req.body.imap_password;

    var transOptions = {
        host: smtp_server,
        port: smtp_port,
        secure: false,
        auth: {
            user: smtp_username,
            pass: smtp_password,
        },
    };
    var transporter = nodemailer.createTransport(transOptions);
    var frommail = smtp_username
    let info = {
        from: frommail, // sender address
        to: smtp_username, // list of receivers
        subject: "Test", // Subject line
        text: "", // plain text body
        html: "Test", // html body
    };
    transporter.sendMail(info, function (error, info) {
        if (error) {
            console.log("error");
            console.log(JSON.stringify(error));
            res.status(200).send({ "data": 'Email server not Authorized.' });

        } else {
            console.log("resp data");
            console.log(JSON.stringify(info));
            if (info) {
                var response = info.response;
                var transactionId = info.messageId;

    fdata = {
        server_id: server_id, account_id: account_id, smtp_server: smtp_server, smtp_port: smtp_port, server_name: server_name, smtp_username: smtp_username, smtp_password: smtp_password, perday_limit: perday_limit, attachment_size: attachment_size,
        imap_server: imap_server, imap_port: imap_port, imap_username: imap_username, imap_password: imap_password
    };
    Setting.updateemailserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            //res.status(200).send({ "data": 'Email server not Authorized.' });
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Email server data updated succesfully.' });
        }

    })}
}
})
})
router.post('/saveemailserverdata', authorize, function (req, res) {
    console.log(req.body);
    var account_id = req.body.account_id;
    var smtp_server = req.body.smtp_server;
    var smtp_port = req.body.smtp_port;
    var smtp_username = req.body.smtp_username;
    var smtp_password = req.body.smtp_password;
    var perday_limit = req.body.perday_limit;
    var attachment_size = req.body.attachment_size;
    var imap_server = req.body.imap_server;
    var imap_port = req.body.imap_port;
    var imap_username = req.body.imap_username;
    var imap_password = req.body.imap_password;
    var server_name = req.body.server_name;

    var transOptions = {
        host: smtp_server,
        port: smtp_port,
        secure: false,
        auth: {
            user: smtp_username,
            pass: smtp_password,
        },
    };

    var transporter = nodemailer.createTransport(transOptions);
    var frommail = smtp_username
    let info = {
        from: server_name+" "+frommail, // sender address
        to: smtp_username, // list of receivers
        subject: "Test", // Subject line
        text: "", // plain text body
        html: "Test", // html body
    };

    transporter.sendMail(info, function (error, info) {
        if (error) {
            console.log("error");
            console.log(error);
            res.status(200).send({ "data": 'Email server not Authorized.' });

        } else {
            console.log("resp data");
            console.log(JSON.stringify(info));
            if (info) {
                var response = info.response;
                var transactionId = info.messageId;
                fdata = {
                    server_name: server_name, account_id: account_id, smtp_server: smtp_server, smtp_port: smtp_port, smtp_username: smtp_username, smtp_password: smtp_password, perday_limit: perday_limit, attachment_size: attachment_size,
                    imap_server: imap_server, imap_port: imap_port, imap_username: imap_username, imap_password: imap_password
                };

                Setting.saveemailserverdata(fdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Email server not Authorized.' });

                    }
                    else {
                        res.status(200).send({ "data": 'Email server data saved succesfully.' });
                    }

                })
            }


        }
    });

})
// delete sms server data
router.get('/deleteemailserverdata/:id', authorize, function (req, res) {
    Setting.deleteemailserverdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Email server data deleted successfully' });
        }
    })
})

//Save Configuration
router.post('/saveConfiguration', authorize, function (req, res) {
    var data = req.body
    var managerid = data.user_id
    delete data.user_id
    console.log(data)
    Object.keys(data).map(function(metakey, index) {
        var metavalue = data[metakey]
        helper.SaveConfugurationMeta(metakey,metavalue,managerid)
    });
    res.status(200).send({ "data": 'Data saved successfully' });
})

router.post('/SaveCalenderConfugurationMeta', authorize, function (req, res) {
    var data = req.body
    var managerid = data.user_id
    delete data.user_id
    console.log(data)
    Object.keys(data).map(function(metakey, index) {
        var metavalue = data[metakey]
        helper.SaveCalenderConfugurationMeta(metakey,metavalue,managerid)
    });
    res.status(200).send({ "data": 'Data saved successfully' });
})

// Get Configuration
router.get('/getConfiguration/:id', authorize, function (req, res) {
    Setting.getConfiguration(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows});
        }
    })
})

router.get('/getCalenderConfiguration/:id', authorize, function (req, res) {
    Setting.getCalenderConfiguration(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows});
        }
    })
})

//
router.post('/acwAgentHoldTime/', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var status = req.body.status;
    var holdreason = req.body.status.holdreason;
    var holdcall = req.body.status.holdcall;
    console.log('holdcall=>',holdcall);
    var date = new Date();
    var data = { account_id: userid, date: date, start_time: date, status: 0,reason_id:holdreason };
    //console.log(data);
    Setting.getagentcallstoptime(userid,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
        }
        else {
            if (rows.length > 0) {
                if(rows[0].reason_id==17){
                    if(holdcall==true){
                        return res.status(200).send({ "data": 'Call hold release successfully', "datalength": 0 });
                    }
                    var dif_time = await Setting.getholddiff(rows[0].pause_id,date)
                    var udata = { stop_time: date, status: 1 ,dif_time:dif_time};
                    Setting.updateagentholdtime(udata, rows[0].pause_id, function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
                        }
                        else {
                            res.status(200).send({ "data": 'Call hold release successfully', "datalength": 0 });
                        }
                    })
                }else{
                    res.status(200).send({ "data": 'Call hold start successfully', "datalength": 0 });
                }
            } else {
                Setting.saveagentholdtime(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!', "datalength": 0 });
                    }
                    else {
                        res.status(200).send({ "data": 'Call hold start successfully', "datalength": 0 });
                    }
                })
            }
        }
    })
})
router.get('/getagentaccesssetting/:id', authorize, function (req, res) {
   
    Setting.getagentaccesssetting(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "data": [] });
        }
        else {            
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveagentleadaccesssetting/', authorize, function (req, res) {
    //console.log(req.body);
    var userid = req.body.userid;
    var date = new Date();
   // var data = { account_id: userid, date: date, setting_name: "lead_access", setting_value: setting };
    //console.log(data);
    var settingDetail = req.body.settingDetail;
    valuearray = []
    for (var i = 0; i < ((settingDetail).length); i++) {
        var detail = settingDetail[i];
        if (detail['setting_name'] != '') {
            setting_name = detail['setting_name'];
            setting_value = detail['setting_value'];
            //data = {account_id:userid,setting_name:setting_name,setting_value:setting_value}
            //console.log(data);
            data = [userid,setting_name,setting_value];
            valuearray.push(data);
        }        
    }
    Setting.saveagentleadaccesssetting(valuearray,userid, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "msg": 'Something went wrong!' });
        }
        else {            
            res.status(200).send({ "msg": 'Access setting saved successfully!!!' });
        }
    })  
})
// delete feedback form  data
router.get('/deletefeedbackform/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Setting.deletefeedbackform(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!" });
        }
        else {
            res.status(200).send({ "data": 'Feedback Form data deleted successfully' });
        }
    })
})
router.get('/accesssetting/:id', authorize, function (req, res) {
   
    Setting.accesssetting(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {            
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadtags/:id', authorize,async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        userid = managerid
    }
    Setting.getleadtags(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveleadtagdata', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var account_id = req.query.tknuserid;
    fdata = { account_id: account_id,tag_name:name};
    Setting.saveleadtagdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": 'Lead Tag data saved succesfully.' });
        }
    })
})
router.post('/updateleadtagdata', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var account_id = req.query.tknuserid;
    var tag_id = req.body.tag_id;
    fdata = { account_id: account_id,tag_name:name,tag_id:tag_id};
    Setting.updateleadtagdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": 'Lead Tag data updated succesfully.' });
        }
    })
})
router.get('/getleadtagbyid/:id', authorize, function (req, res) {
    var userid = req.params.id;
    Setting.getleadtagbyid(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deleteleadtagdata/:id', authorize, function (req, res) {
    Setting.deleteleadtagdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Lead Tag data deleted successfully' });
        }
    })
})
router.get('/getleadtagassignagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Setting.getleadtagassignagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/unassignleadtagagentslist/', authorize, function (req, res) {
    //console.log(req.body);
    Setting.unassignleadtagagentslist(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveleadtagassignagent', authorize, function (req, res) {
    //console.log(req.body);
    /*var groupid = req.body.groupid;
    var agentid = req.body.agentid;
    var seq_no = req.body.seq_no;
    var userid = req.body.userid;
    fdata = { UserID: userid, AgentID: agentid, seq_no: seq_no, HuntGroupID: groupid };*/
    Setting.saveleadtagassignagent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Lead Tag assigned to supervisor succesfully.' });
        }

    })
})
router.get('/deleteleadtagassignagent/:id', authorize, function (req, res) {
    Setting.deleteleadtagassignagent(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Lead Tag assign supervisor deleted successfully!' });
        }
    })
})

router.post('/uploadticketfile', authorize, function (req, res) {
    
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
    var m = new Date();
    var fileid = 'IMG' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/ticket/')
        },
        filename: function (req, file, cb) {
            cb(null, fileid)
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
                name: 'ticketimg',
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
        var ticketimg = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.ticketimg) {
            ticketimg = req.files.ticketimg[0].filename;
        }
        res.status(200).send({ "data": ticketimg });
    })

});


router.get('/getissuetypes/:id', authorize,async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        userid = managerid
    }
    Setting.getissuetypes(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveissuetypedata', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var account_id = req.query.tknuserid;
    fdata = { account_id: account_id,issue_name:name};
    Setting.saveissuetypedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": 'Issue Type saved succesfully.' });
        }
    })
})
router.post('/updateissuetypedata', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var account_id = req.query.tknuserid;
    var issue_id = req.body.issue_id;
    fdata = { account_id: account_id,issue_name:name,issue_id:issue_id};
    Setting.updateissuetypedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": 'Issue Type updated succesfully.' });
        }
    })
})
router.get('/getissuetypebyid/:id', authorize, function (req, res) {
    var userid = req.params.id;
    Setting.getissuetypebyid(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deleteissuetypedata/:id', authorize, function (req, res) {
    Setting.deleteissuetypedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Issue type deleted successfully' });
        }
    })
})

router.post('/save_admin_setting/', authorize, function (req, res) {
    //console.log(req.body);
    var userid = req.body.userid;
    var date = new Date();
   // var data = { account_id: userid, date: date, setting_name: "lead_access", setting_value: setting };
    //console.log(data);
    var settingDetail = req.body.settingDetail;
    valuearray = []
    for (var i = 0; i < ((settingDetail).length); i++) {
        var detail = settingDetail[i];
        if (detail['setting_name'] != '') {
            setting_name = detail['setting_name'];
            setting_value = detail['setting_value'];
            //data = {account_id:userid,setting_name:setting_name,setting_value:setting_value}
            //console.log(data);
            data = [userid,setting_name,setting_value];
            valuearray.push(data);
        }        
    }
    Setting.save_admin_setting(valuearray,userid, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "msg": 'Something went wrong!' });
        }
        else {            
            res.status(200).send({ "msg": 'setting saved successfully!!!' });
        }
    })  
})
router.get('/getadminaccesssetting/:id', authorize, function (req, res) {
   
    Setting.getadminaccesssetting(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);

            res.status(200).send({ "data": [] });
        }
        else {            
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_supervisior_FormsData/:id', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
   
    Setting.get_supervisior_FormsData(req.params.id, function (err, rows) {
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
module.exports = router;
