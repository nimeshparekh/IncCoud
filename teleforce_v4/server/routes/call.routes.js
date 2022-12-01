var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Call = require('../model/call');
var Default = require('../model/default');
var Manager = require('../model/manager');
var Admin = require('../model/admin');
var Contacts = require('../model/Contacts');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
var request = require('request');
const awry = require('awry');
const { filter } = require('async');
var async = require("async");
var fs = require('fs');
var http = require('http');
var urllib = require('urllib');
const excel = require('node-excel-export');
//const exportFromJSON = require('export-from-json')
var json2xls = require('json2xls');
var path = require('path');
var helper = require("../helper/common");
var archiver = require('archiver');
var nodemailer = require('nodemailer');
var moment = require('moment')
var API = require('../model/api');
var validator = require("email-validator");
var dateFormat = require('dateformat');
var ERP = require('../model/erp');
require("dotenv").config();

const admz = require('adm-zip')
//const download = require('download');
const { Parser } = require('json2csv');


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


var APIRESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
var RESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
// var APIRESTERPNext = new APIRESTERPNext({
//     username: 'Administrator',
//     password: 'Garuda@dv1234',
//     baseUrl: 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
// })
function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

function formatDateTime(sDate, FormatType) {
    if (!sDate) return sDate;
    var lDate = new Date(sDate)

    var month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var hh = lDate.getHours() < 10 ? '0' +
        lDate.getHours() : lDate.getHours();
    var mi = lDate.getMinutes() < 10 ? '0' +
        lDate.getMinutes() : lDate.getMinutes();
    var ss = lDate.getSeconds() < 10 ? '0' +
        lDate.getSeconds() : lDate.getSeconds();

    var d = lDate.getDate();
    var dd = d < 10 ? '0' + d : d;
    var yyyy = lDate.getFullYear();
    var mon = eval(lDate.getMonth() + 1);
    var mm = (mon < 10 ? '0' + mon : mon);
    var monthName = month[lDate.getMonth()];
    var weekdayName = weekday[lDate.getDay()];

    if (FormatType == 1) {
        return mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mi;
    } else if (FormatType == 2) {
        return weekdayName + ', ' + monthName + ' ' +
            dd + ', ' + yyyy;
    } else if (FormatType == 3) {
        return mm + '/' + dd + '/' + yyyy;
    } else if (FormatType == 4) {
        var dd1 = lDate.getDate();
        return dd1 + '-' + Left(monthName, 3) + '-' + yyyy;
    } else if (FormatType == 5) {
        return mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mi + ':' + ss;
    } else if (FormatType == 6) {
        return mon + '/' + d + '/' + yyyy + ' ' +
            hh + ':' + mi + ':' + ss;
    } else if (FormatType == 7) {
        return yyyy + '-' + mm +
            '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
    }
}
//Get ALL Call Log of Manager
router.get('/getcalllog/:id', authorize, function (req, res) {
    const id = req.params.id;
    Call.getcalllog(id, function (err, rows) {
        //console.log(rows[0]);
        res.status(200).send({ 'data': rows });
    });

})

//Get Live Status
router.get('/getlivestatus/:id', authorize, function (req, res) {
    const id = req.params.id;
    Call.getlivestatus(id, function (err, rows) {
        //console.log(rows[0]);
        res.status(200).send({ 'data': rows });
    });

})

//Get On Call
router.get('/getoncall/:id', authorize, function (req, res) {
    const id = req.params.id;
    Call.getoncall(id, function (err, rows) {
        //console.log(rows[0]);
        res.status(200).send({ 'data': rows });
    });

})

//Get audio file
router.get('/audio/:id', function (req, res) {
    const recname = req.params.id
    var url = 'http://10.13.1.117/cloudXv1/' + req.params.id + '.wav';
    urllib.request(url, {
    }, function (error, resp, rescode) {
        if (error) {
            console.log(error)
        }
        else {
            //console.log(rescode.statusCode);
            if (rescode.statusCode == 404) {
                url = 'http://10.13.1.117/cloudXv1/' + req.params.id + '.mp3';
                urllib.request(url, {
                }, function (error, resp, rescode) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        //console.log(rescode.statusCode);
                        if (rescode.statusCode == 404) {
                            url = 'http://10.13.1.118/cloudXv1/' + req.params.id + '.wav';
                            //req.pipe(request(url)).pipe(res);
                            urllib.request(url, {
                            }, function (error, resp, rescode) {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    //console.log(rescode.statusCode);
                                    if (rescode.statusCode == 404) {
                                        url = 'http://10.13.1.118/cloudXv1/' + req.params.id + '.mp3';
                                        //req.pipe(request(url)).pipe(res);
                                        urllib.request(url, {
                                        }, function (error, resp, rescode) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                //console.log(rescode.statusCode);
                                                if (rescode.statusCode == 404) {
                                                    url = 'http://10.13.1.103:9091/cloudXv1/' + req.params.id + '.wav';
                                                    urllib.request(url, {
                                                    }, function (error, resp, rescode) {
                                                        if (error) {
                                                            console.log(error)
                                                        }
                                                        else {
                                                            //console.log(rescode.statusCode);
                                                            if (rescode.statusCode == 404) {
                                                                //url = 'http://192.168.1.23:8001/cloudXv1/' + req.params.id + '.wav';
                                                                url = 'http://10.13.1.103:9091/cloudXv1/' + req.params.id + '.mp3';
                                                                urllib.request(url, {
                                                                }, function (error, resp, rescode) {
                                                                    if (error) {
                                                                        console.log(error)
                                                                    }
                                                                    else {
                                                                        //console.log(rescode.statusCode);
                                                                        if (rescode.statusCode == 404) {
                                                                            url = 'http://10.13.1.120/live-recording/117/' + req.params.id + '.mp3';
                                                                            //req.pipe(request(url)).pipe(res);
                                                                            urllib.request(url, {
                                                                            }, function (error, resp, rescode) {
                                                                                if (error) {
                                                                                    console.log(error)
                                                                                }
                                                                                else {
                                                                                    //console.log(rescode.statusCode);
                                                                                    if (rescode.statusCode == 404) {
                                                                                        url = 'http://10.13.1.120/live-recording/118/' + req.params.id + '.mp3';
                                                                                        //req.pipe(request(url)).pipe(res);
                                                                                        urllib.request(url, {
                                                                                        }, function (error, resp, rescode) {
                                                                                            if (error) {
                                                                                                console.log(error)
                                                                                            }
                                                                                            else {
                                                                                                //console.log(rescode.statusCode);
                                                                                                if (rescode.statusCode == 404) {
                                                                                                    url = 'http://10.13.1.117/gvoipfiles/cloudX/' + req.params.id + '.wav';
                                                                                                    //req.pipe(request(url)).pipe(res);
                                                                                                    urllib.request(url, {
                                                                                                    }, function (error, resp, rescode) {
                                                                                                        if (error) {
                                                                                                            console.log(error)
                                                                                                        }
                                                                                                        else {
                                                                                                            //console.log(rescode.statusCode);
                                                                                                            if (rescode.statusCode == 404) {
                                                                                                                url = 'http://10.13.1.117/gvoipfiles/cloudX/' + req.params.id + '.mp3';
                                                                                                                //req.pipe(request(url)).pipe(res);
                                                                                                                urllib.request(url, {
                                                                                                                }, function (error, resp, rescode) {
                                                                                                                    if (error) {
                                                                                                                        console.log(error)
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        //console.log(rescode.statusCode);
                                                                                                                        if (rescode.statusCode == 404) {
                                                                                                                            url = 'http://10.13.1.120/live-recording/26/' + req.params.id + '.mp3';
                                                                                                                            //req.pipe(request(url)).pipe(res);
                                                                                                                            urllib.request(url, {
                                                                                                                            }, function (error, resp, rescode) {
                                                                                                                                if (error) {
                                                                                                                                    console.log(error)
                                                                                                                                }
                                                                                                                                else {
                                                                                                                                    //console.log(rescode.statusCode);
                                                                                                                                    if (rescode.statusCode == 404) {
                                                                                                                                        url = 'http://10.13.1.120/call-recording-backup/cloudXv1/' + req.params.id + '.mp3';
                                                                                                                                        //req.pipe(request(url)).pipe(res);
                                                                                                                                        urllib.request(url, {
                                                                                                                                        }, function (error, resp, rescode) {
                                                                                                                                            if (error) {
                                                                                                                                                console.log(error)
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                //console.log(rescode.statusCode);
                                                                                                                                                if (rescode.statusCode == 404) {
                                                                                                                                                    url = 'http://10.13.1.120/call-recording-backup/cloudX/' + req.params.id + '.mp3';
                                                                                                                                                    //req.pipe(request(url)).pipe(res);
                                                                                                                                                    urllib.request(url, {
                                                                                                                                                    }, function (error, resp, rescode) {
                                                                                                                                                        if (error) {
                                                                                                                                                            console.log(error)
                                                                                                                                                        }
                                                                                                                                                        else {
                                                                                                                                                            //console.log(rescode.statusCode);
                                                                                                                                                            if (rescode.statusCode == 404) {
                                                                                                                                                                url = 'https://testing.cloudX.in/api/call/oldaudio/' + req.params.id;
                                                                                                                                                                //req.pipe(request(url)).pipe(res);
                                                                                                                                                                urllib.request(url, {
                                                                                                                                                                    timeout:10000
                                                                                                                                                                }, function (error, resp, rescode) {
                                                                                                                                                                    // if (error) {
                                                                                                                                                                    //     console.log(error)
                                                                                                                                                                    // }
                                                                                                                                                                    // else {
                                                                                                                                                                        console.log(rescode.statusCode);
                                                                                                                                                                        if (rescode.statusCode == 404 || rescode.statusCode == -1) {
                                                                                                                                                                            Call.getCallLogByRecording(recname, function (err, rows) {
                                                                                                                                                                                if (err) {
                                                                                                                                                                                    console.log(err);
                                                                                                                                                                                }
                                                                                                                                                                                else {
                                                                                                                                                                                    if(rows.length>0){
                                                                                                                                                                                        const calllog = rows[0]
                                                                                                                                                                                        const accountid = calllog.accountid
                                                                                                                                                                                        const calldatetime = calllog.CallStartTime
                                                                                                                                                                                        let date_ob = new Date(calldatetime);
                                                                                                                                                                                        let callmonth = date_ob.getMonth()+1;
                                                                                                                                                                                        callmonth = String(callmonth).length==1?'0'+callmonth:callmonth;
                                                                                                                                                                                        console.log(callmonth)
                                                                                                                                                                                        var cdate = String(date_ob.getDate()).length==1?'0'+date_ob.getDate():date_ob.getDate();
                                                                                                                                                                                        let calldate = cdate+'-'+callmonth+'-'+date_ob.getFullYear();
                                                                                                                                                                                        const path1 = 'cloudXv2/'+accountid+'/'+callmonth+'/'+calldate+'/'+recname+'.wav';
                                                                                                                                                                                        const path2 = 'cloudXv2/'+accountid+'/'+callmonth+'/'+calldate+'/'+recname+'.mp3';
                                                                                                                                                                                        //console.log(path1,path2)
                                                                                                                                                                                        let audiourl = 'http://10.13.1.105/'+path1;
                                                                                                                                                                                        urllib.request(audiourl, {
                                                                                                                                                                                        }, function (error, resp, rescode) {
                                                                                                                                                                                            if (error) {
                                                                                                                                                                                                console.log(error)
                                                                                                                                                                                            }
                                                                                                                                                                                            else {
                                                                                                                                                                                                console.log(audiourl,rescode.statusCode);
                                                                                                                                                                                                req.pipe(request(audiourl)).pipe(res);
                                                                                                                                                                                            }
                                                                                                                                                                                        })
                                                                                                                                                                                    }else{

                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        }else{
                                                                                                                                                                            req.pipe(request(url)).pipe(res);
                                                                                                                                                                        }
                                                                                                                                                                    //}
                                                                                                                                                                })
                                                                                                                                                            } else {
                                                                                                                                                                req.pipe(request(url)).pipe(res);
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    })
                                                                                                                                                } else {
                                                                                                                                                    req.pipe(request(url)).pipe(res);
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                    } else {
                                                                                                                                        req.pipe(request(url)).pipe(res);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            })
                                                                                                                        } else {
                                                                                                                            req.pipe(request(url)).pipe(res);
                                                                                                                        }
                                                                                                                    }
                                                                                                                })
                                                                                                            } else {
                                                                                                                req.pipe(request(url)).pipe(res);
                                                                                                            }
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    req.pipe(request(url)).pipe(res);
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        req.pipe(request(url)).pipe(res);
                                                                                    }
                                                                                }
                                                                            })
                                                                        } else {
                                                                            req.pipe(request(url)).pipe(res);
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                req.pipe(request(url)).pipe(res);
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    req.pipe(request(url)).pipe(res);
                                                }
                                            }
                                        })
                                    } else {
                                        req.pipe(request(url)).pipe(res);
                                    }
                                }
                            })
                        } else {
                            req.pipe(request(url)).pipe(res);
                        }
                    }
                })
            } else {
                req.pipe(request(url)).pipe(res);
            }
        }
    });
});


//Get audio download
router.get('/audiodownload/:id', function (req, res) {
    var file = fs.createWriteStream("./uploads/file.wav");
    var url = 'http://192.168.1.26:8001/cloudXv1/' + req.params.id + '.wav';
    req.pipe(request(url)).pipe(res);
});

//Get Agent Call Log 
router.post('/getagentcalllog', authorize, function (req, res) {
    const id = req.body.id;
    const type = req.body.type;
    Call.getagentcalllog(id, type, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
//Get Agent Current Call 
router.post('/getagentcurrentcall', authorize, function (req, res) {
    const id = req.query.tknuserid;
    res.status(200).send({ 'total': 0 });
    //console.log(id)
    //Call.getagentcurrentcall(id, function (err, rows) {
    //  if (err) {
    //    console.log(err);
    //  res.status(200).send({ "msg": 'db error' });
    //}
    //else {
    //res.status(200).send({ 'total': rows.length, 'data': rows });
    //}
    //});
})
router.post('/getagentcurrentcall1', authorize, function (req, res) {
    const id = req.query.tknuserid;
    //console.log(id)
    //return res.status(200).send({ 'total': 0 });
    Call.getagentcurrentcall(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

router.post('/searchCallLog', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    var userrole = req.query.tknuserrole;
    if (userrole == 2) {
        Call.searchcalllogtotal(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": [] });
            }
            else {
                res.status(200).send({ "data": rows });
            }
        })
    }
    if (userrole == 1) {
        Call.searchsupervisorcalllogtotal(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": [] });
            }
            else {
                res.status(200).send({ "data": rows });
            }
        })
    }

})

// router.post('/downloadAudio', authorize, async function (req, res) {
//     const filePath = `./uploads/audio/`;
//     var flag = 0;
//     var audioArr = req.body;
//     var audio_len = req.body.length;
//     var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads/');

//     var zip = new admz();
//     var filename = Date.now();


//     await Call.getaudiofileinarray(audioArr.toString(), async function (err, rows) {
//         if (err) {
//             console.log(err);
//         } else {
//             if (rows.length > 0) {
//                 var array = rows[0]['RecPath'].split(',');
//                 await array.forEach(async (i) => {
//                     var file = 'https://agent.cloudX.in/api/call/audio/' + i;

//                     await download(file, filePath)
//                         .then(async () => {
//                             console.log(file);
//                             try {
//                                 if (await fs.existsSync(filePath+i)) {
//                                     await zip.addLocalFile(filePath+i);
//                                     var willSendthis = await zip.toBuffer();  
//                                     await zip.writeZip(DOWNLOAD_DIR + "Audio"+filename+".zip");
//                                     flag = 1;  
//                                 } 
//                             } catch (err) {
//                                 console.error(err);
//                             }
//                         })
//                 });

//             }

//         }


//     });
//     res.download("Audio"+filename+".zip");
// })

router.post('/downloadAudio', authorize, async function (req, res) {
    const filePath = `./uploads/audio/`;
    var flag = 0;
    var audioArr = req.body;
    var audio_len = req.body.length;
    var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads/');

    var zip = new admz();
    var filename = Date.now();


    await Call.getaudiofileinarray(audioArr.toString(), async function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            if (rows.length > 0) {
                var array = rows[0]['RecPath'].split(',');
                await array.forEach(async (i) => {
                    var file = 'https://agent.cloudX.in/api/call/audio/' + i;

                    await download(file, filePath)
                        .then(async () => {
                            //console.log(file);
                            try {
                                if (await fs.existsSync(filePath + i)) {
                                    await zip.addLocalFile(filePath + i);
                                    var willSendthis = await zip.toBuffer();
                                    await zip.writeZip(DOWNLOAD_DIR + "Audio" + filename + ".zip");
                                    flag = 1;
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        })
                });

            }

        }


    });
    //res.download("Audio"+filename+".zip");
})

router.post('/searchFeedback', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchfeedback(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [], "length": 0 });
        }
        else {
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})
router.get('/getAgentStatus/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getagentstatus(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

router.get('/getCallStatus/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getcallstatus(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
router.get('/getCallDID/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getagentdid(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
router.get('/getCallType/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getcalltype(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

router.get('/getDisconnectedBy/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getdisconnectedby(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

router.get('/getLastDestination/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getlastdestination(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
//Outgoing Call
router.post('/agentoutgoingcall', authorize, async function (req, res) {
    //console.log(req.body)
    var agentid = req.body.agentid;
    var mobile = req.body.mobile;
    mobile = mobile.replace(/\s+/g, "");
    var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
    console.log('secondarysip', secondarysip)
    Call.getuserdetail(agentid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "err": false, "msg": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0 && rows[0]['current_status'] == 0) {
                var adata = rows[0]
                var AgentID = adata.account_id
                var AgentShowNumberId = adata.show_no_id
                var manager_id = adata.created_by
                var AgentNumber = adata.mobile
                var callprefix = await helper.GetManagerSettingValueByName(manager_id, 'dialer_prefix')
                if (callprefix >= 0) { } else { callprefix = 0 }
                AgentNumber = AgentNumber.toString()[0] == callprefix ? AgentNumber : callprefix + AgentNumber
                var AgentName = adata.account_name
                var connectmethod = await helper.GetManagerSettingValueByName(manager_id, 'connect_agent_method')
                if (connectmethod == 1) {
                    return res.status(200).send({ "err": false, "msg": "Your account have't access to generate call on mobile." });
                }
                var did_alloted = adata.did_alloted
                Call.checkactiveamanageraccount(manager_id, async function (err, results) {
                    if (err) {
                        res.status(200).send({ "err": false, "msg": 'Something went wrong!' });
                    } else {
                        if (results.length > 0) {
                            var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                            const askrestapi = new awry.API({
                                baseUrl: voiceserverdata.ari_url,
                                username: voiceserverdata.ari_username,
                                password: voiceserverdata.ari_password,
                            });
                            Call.getLiveChannel(manager_id, async function (err, results) {
                                if (err) {
                                    res.status(200).send({ "err": false, "msg": 'Something went wrong!' });
                                } else {
                                    var chArr = results[0]
                                    if (chArr.rchannel > 0) {
                                        if (did_alloted > 0) {
                                            var did = did_alloted
                                            if (secondarysip == 'yes') {
                                                did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                            }
                                            //console.log(mobile)
                                            if (AgentShowNumberId != 0) {
                                                if (mobile.toString()[0] == 'T') {
                                                    mobile = mobile.substr(6, 3) + '' + mobile.substr(2, 3) + '' + mobile.substr(10, 3) + '' + mobile.substr(14, 3);
                                                }
                                            }
                                            mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
                                            //console.log(mobile)
                                            var contactdata = await helper.SearchContactIDByMobile(mobile, manager_id)
                                            mobile = mobile.toString()[0] == callprefix ? mobile : callprefix + mobile
                                            var params = { 'endpoint': 'PJSIP/' + AgentNumber + '@SM' + did, callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": contactdata['name'] ? contactdata['name'] : 'NoName', "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing" } };
                                            askrestapi.channels.originate(params).then(results => {
                                                //console.log(data)
                                                var chdata = results.data
                                                var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: contactdata['name'], CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING", cont_id: contactdata['cont_id'] }
                                                Call.insertcdr(cdrdata, function (err, result) {
                                                    cdrid = result.insertId
                                                })
                                                res.status(200).send({ "err": false, "msg": "Call originate succesfully." });
                                            }).catch(function (err) {
                                                console.log(err)
                                                res.status(200).send({ "err": false, "msg": "Unable to create channel" });
                                            });
                                        } else {
                                            Call.findoutgoingdid(manager_id, async function (err, results) {
                                                if (err) {
                                                    res.status(200).send({ "msg": 'db error' });
                                                } else {
                                                    if (results.length > 0) {
                                                        //console.log(mobile)
                                                        if (AgentShowNumberId != 0) {
                                                            if (mobile.toString()[0] == 'T') {
                                                                mobile = mobile.substr(6, 3) + '' + mobile.substr(2, 3) + '' + mobile.substr(10, 3) + '' + mobile.substr(14, 3);
                                                            }
                                                        }
                                                        mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
                                                        //console.log(mobile)
                                                        var contactdata = await helper.SearchContactIDByMobile(mobile, manager_id)
                                                        mobile = mobile.toString()[0] == callprefix ? mobile : callprefix + mobile
                                                        var didArr = results[0]
                                                        var did = didArr.did
                                                        if (secondarysip == 'yes') {
                                                            did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                                        }
                                                        var params = { 'endpoint': 'PJSIP/' + AgentNumber + '@SM' + did, callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": "0", "CallerNumber": mobile, "CallerName": contactdata['name'] ? contactdata['name'] : 'NoName', "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "outgoing" } };
                                                        askrestapi.channels.originate(params).then(results => {
                                                            //console.log(data)
                                                            chdata = results.data
                                                            var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, CallerType: 1, CallerName: contactdata['name'], CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3, AgentStatus: "CALLING", cont_id: contactdata['cont_id'] }
                                                            Call.insertcdr(cdrdata, function (err, result) {
                                                                if (err) return console.log(err)
                                                                cdrid = result.insertId
                                                            })
                                                            res.status(200).send({ "err": false, "msg": "Call originate succesfully." });
                                                        }).catch(function (err) {
                                                            console.log(err)
                                                        });
                                                    } else {
                                                        res.status(200).send({ "err": false, "msg": 'No Outgoing DID found!' });
                                                    }
                                                }
                                            })
                                        }
                                    } else {
                                        res.status(200).send({ "err": false, "msg": 'No free channel found for outgoing call.please try after sometime.' });
                                    }
                                }
                            })
                        } else {
                            res.status(200).send({ "err": false, "msg": 'Account not active' });
                        }
                    }
                })
            } else {
                res.status(200).send({ "err": false, "msg": 'Invalid Agent' });
            }
        }
    });
})

router.post('/updateAgentCallFeedback', authorize, function (req, res) {

    //console.log("updateAgentCallFeedback");
    //console.log(req.body);

    var id = req.body.id;
    var feedback = req.body.feedback;
    var note = req.body.note;
    var startdateObj = new Date(req.body.scheduledate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    //req.body.scheduledate = startdate;
    //console.log(startdate+req.body.starttime);
    var date = new Date(req.body.scheduledate);
    var end_date = new Date(req.body.scheduledate);
    end_date.setMinutes(end_date.getMinutes() + 5);

    var start_scheduledate = '';
    var end_scheduledate = '';

    if (req.body.scheduledate != null) {
        start_scheduledate = date;
        end_scheduledate = end_date;

        var sdata = { meeting_type: 'Call', customer_name: req.body.customer_name, Description: note, email: req.body.email, mobile: req.body.mobile, user_id: req.body.agentId, StartTime: start_scheduledate, EndTime: end_scheduledate };

        Call.insertscheduledata(sdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
        })
    }

    fdata = { id: id, feedback: feedback, note: note, scheduledate: start_scheduledate };

    Call.updateagentcallfeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})

// Get Agent Call Feedback
router.get('/getAgentCallFeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.getagentcallfeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": rows, "feedbackvalues": [] });
        }
        else {
            if (rows.length > 0) {
                var acid = rows[0].accountid
                var cont_id = rows[0].cont_id
                var accountid = rows[0].accountid
                Call.checkLeadIdByContactId(cont_id, function (err, urows) {
                    if (urows.length > 0) {
                        Call.get_lead_stage_status(accountid, function (err, lrows) {
                            if (err) {
                                res.status(200).send({ "data": rows, "feedbackvalues": [] });
                            }
                            else {
                                var rs1 = Object.keys(lrows).map(function (k) { return lrows[k].statusdb })
                                res.status(200).send({ "data": rows, "feedbackvalues": rs1 });
                            }
                        })
                    } else {
                        Call.getuserdetail(acid, function (err, urows) {
                            if (urows.length > 0) {
                                if (urows[0].feedback_vales != undefined) {
                                    var feedbackvalue = urows[0].feedback_vales.split(',');
                                } else {
                                    var feedbackvalue = [];
                                }
                                res.status(200).send({ "data": rows, "feedbackvalues": feedbackvalue });
                            } else {
                                res.status(200).send({ "data": rows, "feedbackvalues": [] });
                            }
                        })
                    }
                })
            } else {
                res.status(200).send({ "data": rows, "feedbackvalues": [] });
            }
        }
    })
})
//Get Agent top 20 Recent Call 
router.get('/getagentrecentcall/', authorize, function (req, res) {
    var id = req.query.tknuserid;
    Call.getagentrecentcall(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//Get Live Call
router.post('/searchLiveCall', authorize, async function (req, res) {
    // console.log(req.body);
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        req.body.userid = managerid
    }
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    if (req.body.agentrole == "supervisor") {
        req.body.userid = req.query.tknuserid;
        Call.searchsupervisorlivecall(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": [] });
            }
            else {
                res.status(200).send({ "data": rows });
            }

        })
    } else {
        Call.searchlivecall(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": [] });
            }
            else {
                res.status(200).send({ "data": rows });
            }

        })
    }

})

//Originate Click to Call
router.post('/tfclicktocall', function (req, res) {
    const tstagid = req.body.tstagid;
    var mobile = req.body.tfmobile;
    mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile

    const requestdomain = req.body.domain;
    if (tstagid != '') {
        Call.checkclicktocalltag(tstagid, function (err, rows) {
            if (err) {
                res.status(200).send("Invalid Tag ID");
            }
            else {
                if (rows.length > 0) {
                    var tdata = rows[0]
                    var clickid = tdata.clickid
                    var manager_id = tdata.account_id
                    var agentgroup = tdata.agentgroup
                    var registerdomain = tdata.domain
                    Call.checkactiveamanageraccount(manager_id, async function (err, results) {
                        if (err) {
                            res.status(200).send("Invalid Tag ID");
                        } else {
                            if (results.length > 0) {
                                var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                const askrestapi = new awry.API({
                                    baseUrl: voiceserverdata.ari_url,
                                    username: voiceserverdata.ari_username,
                                    password: voiceserverdata.ari_password,
                                });
                                Call.findoutgoingdid(manager_id, async function (err, results) {
                                    if (err) {
                                        res.status(200).send("Invalid Tag ID");
                                    } else {
                                        if (results.length > 0) {
                                            var didArr = results[0]
                                            var did = didArr.did
                                            var contactdata = await helper.SearchContactIDByMobile(mobile, manager_id)
                                            var params = { 'endpoint': 'PJSIP/' + mobile + '@SM' + did, callerId: did, extension: 's', context: 'cloudX_clicktocall', priority: 1, variables: { "DID": did, "AgentGroup": String(agentgroup), "CallerNumber": mobile, "CallerName": contactdata['name'], "accountid": String(manager_id), "CallType": "clicktocall", "Archive": 'yes' } };
                                            askrestapi.channels.originate(params).then(results => {
                                                //console.log(results.data)
                                                res.status(200).send("Call originate succesfully");
                                                var chdata = results.data
                                                var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 8, servicevalue: clickid, GroupID: agentgroup, CallerType: 0, CallerName: mobile, CallerNumber: mobile, CallTypeID: 2, CallType: 'clicktocall', CdrStatus: 0, cont_id: contactdata['cont_id'] }
                                                Call.insertcdr(cdrdata, function (err, result) {
                                                    cdrid = result.insertId
                                                })
                                            }).catch(function (err) {
                                                console.log(err)
                                            });
                                        } else {
                                            res.status(200).send("No Outgoing DID found.");
                                        }
                                    }
                                })
                            } else {
                                res.status(200).send("Inactive account");
                            }
                        }
                    })
                } else {
                    res.status(200).send("Invalid Tag ID");
                }
            }
        })
    } else {
        res.status(200).send("Invalid Tag ID");
    }
})

//Call Monitor
router.post('/callmonitor', authorize, function (req, res) {
    var mobile = req.body.mobile ? req.body.mobile : '';
    const uniqueid = req.body.uniqueid;
    const userid = req.body.userid;
    const monitortype = req.body.type;
    var userrole = req.query.tknuserrole;
    if (userrole == 1 && mobile == '') {
        //var managerid = await helper.GetManagerIdByAgent(userid)
        Call.getuserdetail(userid, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "msg": 'db error' });
            }
            else {
                if (rows.length > 0) {
                    var udata = rows[0]
                    Call.findcdrbyuid(uniqueid, async function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.status(200).send({ "msg": 'db error' });
                        }
                        else {
                            if (rows.length > 0) {
                                var cdata = rows[0];
                                var monitormode = 'q'
                                if (monitortype == 'whisper') {
                                    monitormode = 'qw'
                                }
                                if (monitortype == 'barge') {
                                    monitormode = 'qB'
                                }
                                var voiceserverdata = await helper.GetManagerVoiceServerData(cdata.accountid)
                                const askrestapi = new awry.API({
                                    baseUrl: voiceserverdata.ari_url,
                                    username: voiceserverdata.ari_username,
                                    password: voiceserverdata.ari_password,
                                });
                                var params = { 'endpoint': 'PJSIP/' + udata.account_name, callerId: cdata.DID, context: "cloudX_monitor", extension: 's', variables: { "MonitorChannel": cdata.channel, Monitormode: monitormode } };
                                askrestapi.channels.originate(params).then(data => {
                                    //console.log(data)
                                    res.status(200).send({ "err": false, "msg": "Call Monitor originate succesfully." });
                                }).catch(function (err) {
                                    console.log(err)
                                    res.status(200).send({ "msg": 'error' });
                                });
                            } else {
                                res.status(200).send({ "msg": 'invalid call' });
                            }
                        }
                    });
                } else {
                    res.status(200).send({ "msg": 'invalid customer' });
                }
            }
        })
    } else {
        mobile = mobile.replace(/\s/g, '');
        mobile = mobile.replace('+', '');
        mobile = mobile.replace(/-/g, '');
        mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
        mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
        if (/^\d{11}$/.test(mobile)) {
            Call.getuserdetail(userid, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "msg": 'db error' });
                }
                else {
                    if (rows.length > 0) {
                        var udata = rows[0]
                        Call.findcdrbyuid(uniqueid, async function (err, rows) {
                            if (err) {
                                console.log(err);
                                res.status(200).send({ "msg": 'db error' });
                            }
                            else {
                                if (rows.length > 0) {
                                    var cdata = rows[0];
                                    var monitormode = 'q'
                                    if (monitortype == 'whisper') {
                                        monitormode = 'qw'
                                    }
                                    if (monitortype == 'barge') {
                                        monitormode = 'qB'
                                    }
                                    var voiceserverdata = await helper.GetManagerVoiceServerData(cdata.accountid)
                                    const askrestapi = new awry.API({
                                        baseUrl: voiceserverdata.ari_url,
                                        username: voiceserverdata.ari_username,
                                        password: voiceserverdata.ari_password,
                                    });
                                    var did = String(cdata.DID)
                                    did = (did.length == 12) ? '00'+did : did
                                    var params = { 'endpoint': 'PJSIP/' + mobile + '@SM' + did, callerId: did, context: "cloudX_monitor", extension: 's', variables: { "MonitorChannel": cdata.channel, Monitormode: monitormode } };
                                    askrestapi.channels.originate(params).then(data => {
                                        //console.log(data)
                                        res.status(200).send({ "err": false, "msg": "Call Monitor originate succesfully." });
                                    }).catch(function (err) {
                                        console.log(err)
                                        res.status(200).send({ "msg": 'error' });
                                    });
                                } else {
                                    res.status(200).send({ "msg": 'invalid call' });
                                }
                            }
                        });
                    } else {
                        res.status(200).send({ "msg": 'invalid customer' });
                    }
                }
            })
        } else {
            res.status(200).send({ "msg": 'Invalid mobile number' });
        }
    }
})

//get conference call list
router.get('/getConferenceCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.getconferencecall(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getConferenceStatus/:id', authorize, function (req, res) {
    var id = req.params.id;
    //console.log("id ::"+id);
    Call.getconferencestatus(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveConferenceCall', authorize, function (req, res) {
    var userid = req.body.userid;
    var managername = '';
    Manager.getactivemanagerdetail(userid, function (err, mrows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log('msg::'+);
            if (mrows.length > 0) {
                var mdata = mrows[0]
                managername = mdata.account_name;
                var max_user = mdata.channels;
                var name = req.body.name;
                var managermobile = req.body.mobile;
                var userid = req.body.userid;
                var conftype = req.body.type;
                var membertype = req.body.membertype;
                var member = JSON.stringify(req.body.member);
                var members = req.body.member;
                var segment = req.body.segment;
                var customDetails = req.body.customDetails;
                var sendsms = req.body.sendsms;
                var smscampaign = req.body.smstemplate;
                var did = req.body.did;
                //console.log(sendsms+'---'+smstemplate)   
                var start = req.body.start;
                if (start == 0) {
                    var date = new Date();
                } else {
                    var date = new Date(req.body.date);
                }
                var pin = Math.floor(Math.random() * 10000);
                var autoid = Math.floor(Math.random() * 1000000);
                var data = { account_id: userid, conf_date: date, conf_name: name, manager_mobile: managermobile, conf_type: conftype, conf_membertype: membertype, conf_did: did, conf_start: start, conf_pin: pin, conf_autoid: autoid, conf_max_user: max_user, conf_sms_campaign: smscampaign };
                Call.saveconferencecall(data, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var conf_id = rows['insertId'];
                        //send sms
                        var msg = '';
                        var smsstatus = 'notsend'
                        var numberdata = {
                            conference_id: conf_id, account_id: userid, member_name: managername,
                            contact_no: managermobile, status: 0, sendsms_status: smsstatus
                        };
                        Call.insertbulkconfmember(numberdata, function (err, count) { })
                        if (req.body.date != null) {
                            var StartTime = req.body.date;
                            var currentDate = new Date(StartTime);
                            var EndTime_1 = new Date(currentDate.getTime() + 15 * 60000);
                            var EndTime = dateFormat(EndTime_1, "yyyy-mm-dd HH:MM:ss");
                            var schedule_data = { meeting_type: "Conference", customer_name: managername, mobile: managermobile, StartTime: StartTime, EndTime: EndTime, email_status: 3, sms_status: 3, agent_email_status: 3, agent_sms_status: 3, account_id: userid, conf_id: conf_id };
                            Call.insertintocalender(schedule_data, function (err, count) { })
                        }

                        if (membertype == '0') {
                            if (req.body.member && members.length > 0) {
                                bulknumarray = [];
                                async.forEachOf(members, async (agentid, key, callback) => {
                                    //console.log(agentid);
                                    Default.getagentdetail(agentid, function (err, rows) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            var smsstatus = 'notsend';
                                            var numberdata = {
                                                conference_id: conf_id, account_id: userid, member_name: rows[0].account_name,
                                                contact_no: rows[0].mobile, status: 0, sendsms_status: smsstatus
                                            };
                                            Call.insertbulkconfmember(numberdata, function (err, count) {
                                                if (err) {
                                                    //console.log(err);
                                                } else {
                                                    if (conftype == 1 && start == 0 && members.length == key + 1) {
                                                        originateconferencecall(managermobile, did, conf_id, max_user, mdata, autoid, userid, smscampaign)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                })
                            }
                        }
                        if (membertype == '1') {
                            if (req.body.segment && segment.length > 0) {
                                async.forEachOf(segment, async (cat, segkey, callback) => {
                                    camdata = { category: cat, id: userid };
                                    Contacts.getContactbySegment(camdata, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var cnt = 1;
                                            var total = data.length;

                                            bulknumarray = [];
                                            async.forEachOf(data, async (num, key, callback) => {
                                                var smsstatus = 'notsend';
                                                numberdata = {
                                                    conference_id: conf_id, account_id: userid, member_name: num.name,
                                                    contact_no: num.mobile, status: 0, sendsms_status: smsstatus
                                                };
                                                Call.insertbulkconfmember(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {
                                                        if (conftype == 1 && start == 0 && segment.length == segkey + 1) {
                                                            originateconferencecall(managermobile, did, conf_id, max_user, mdata, autoid, userid, smscampaign)
                                                        }
                                                    }
                                                })
                                            })
                                        }

                                    });

                                })
                            }
                        }
                        if (membertype == '2') {
                            if (customDetails.length > 0) {
                                bulknumarray = [];
                                async.forEachOf(customDetails, async (data, key, callback) => {
                                    if (data.membername != '' && data.contactno != '') {
                                        var smsstatus = 'notsend';
                                        numberdata = {
                                            conference_id: conf_id, account_id: userid, member_name: data.membername,
                                            contact_no: data.contactno, status: 0, sendsms_status: smsstatus
                                        };
                                        Call.insertbulkconfmember(numberdata, function (err, count) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                if (conftype == 1 && start == 0 && customDetails.length == key + 1) {
                                                    originateconferencecall(managermobile, did, conf_id, max_user, mdata, autoid, userid, smscampaign)
                                                }
                                            }
                                        })
                                    }

                                })
                            }
                        }
                        res.status(200).send({ "data": 'Conference created successfully !!' });
                    }
                })
            } else {
                res.status(200).send({ "data": 'Manager account is inactive or expired. Please contact administrator.' });
            }
        }
    })
})

function originateconferencecall(managermobile, did, conf_id, max_user, mdata, autoid, userid, smscampaign) {
    var mobile = managermobile.toString()[0] == 0 ? managermobile : '0' + managermobile
    var managerchannel = 'PJSIP/' + mobile + '@SM' + did
    Call.getconferencememberbyid(conf_id, async function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result.length > 0) {
                var voiceserverdata = await helper.GetManagerVoiceServerData(userid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                //console.log(result)
                //rs = Object.keys(result).map(function(k){return 'PJSIP/'+result[k].mobile+'@SM'+did}).join("&");
                async.forEachOf(result, async (obj, key, callback) => {
                    //console.log(obj)
                    var mobile = obj.mobile.toString()[0] == 0 ? obj.mobile : '0' + obj.mobile
                    var memberchannel = 'PJSIP/' + mobile + '@SM' + did
                    var params = { 'endpoint': memberchannel, callerId: did, extension: 's', context: "cloudX_conference_outgoing", variables: { "DID": did, "accountid": String(userid), "CallType": "conference", "MaxUser": String(max_user), "ConfId": String(autoid) } };
                    askrestapi.channels.originate(params).then(chresults => {
                        var chdata = chresults.data
                        var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: userid, DID: did, serviceid: 7, servicevalue: conf_id, CallerType: 0, CallerName: obj.member_name, CallerNumber: obj.mobile, CallTypeID: 0, CallType: 'outgoing', CdrStatus: 3 }
                        Call.insertcdr(cdrdata, function (err, rs) {
                            if (err) return console.log(err)
                            var cdrid = rs.insertId
                            var rdata = { confid: conf_id, memberid: obj['member_id'], cdrid: cdrid }
                            Call.insertconferencememberrecord(rdata)
                        })
                    }).catch(function (err) {
                        console.log('error==')
                    });
                })
            } else {
                //res.status(200).send({ "data": 'Conference created successfully. But no member found !!' });
            }
        }
    })
}
//update conference call data
router.get('/updateCallogData/:id', authorize, function (req, res) {
    // console.log(req.body);
    var date = new Date(req.body.date);
    var userid = req.body.userid;
    var name = req.body.name;
    var id = req.body.confid;
    data = { conf_id: id, account_id: userid, conf_date: date, conf_name: name };
    Call.updateconferencecall(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Conference Call data updated successfully !!' });
        }

    })
})
//get conference call detail by conference id
router.get('/getConferenceCallDetail/:id', authorize, function (req, res) {
    const id = req.params.id;
    Call.getconferencecalldetail(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ 'data': rows[0] });
        }
    });
})
router.get('/deleteConferenceCall/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Call.deleteconferencecall(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Conference Call data deleted successfully' });
        }
    })
})
//get total live call
router.get('/totalLiveCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.totallivecall(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total ivr call
router.get('/totalIVRCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.totalivrcall(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total Miss call service
router.get('/totalMissCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    res.status(200).send({ "data": 0 });
    //Call.totalmisscall(id, function (err, rows) {
    //  if (err) {
    //    console.log(err);
    // }
    //else {
    //  res.status(200).send({ "data": rows });
    //}
    //})
})
//get total DID Number of manager
router.get('/totalDidNumbers/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.totaldidnumber(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total Today call for manager
router.get('/totalTodayCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2);
    data = { id: id, date: currentdate };

    Call.totaltodaycall(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total Today Incoming call for manager
router.get('/totalTodayIncomingCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2);
    data = { id: id, date: currentdate };

    Call.totaltodayincomingcall(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get total Today Incoming call for manager
router.get('/totalTodayOutgoingCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2);
    data = { id: id, date: currentdate };

    Call.totaltodayoutgoingcall(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total Today Incoming call for manager
router.get('/totalTodayMissedCall/:id', authorize, function (req, res) {
    var id = req.params.id;
    var currentdate = new Date();
    currentdate = currentdate.getFullYear() + '-' + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2);
    data = { id: id, date: currentdate };
    Call.totaltodaymissedcall(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//Get Agent assign Lead
router.post('/getagentassignlead', authorize, function (req, res) {
    var id = req.body.id;
    var userid = req.query.tknuserid;
    Call.getagentlead(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//Call to assign Lead
router.post('/agentleadcall', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var numid = req.body.numid;
    Call.getuserdetail(userid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'Something went wrong!' });
        }
        else {
            if (rows.length > 0) {
                var adata = rows[0]
                var AgentID = adata.account_id
                var AgentNumber = adata.mobile
                var AgentName = adata.account_name
                var manager_id = adata.created_by
                var did_alloted = adata.did_alloted
                var connectmethod = await helper.GetManagerSettingValueByName(manager_id, 'connect_agent_method')
                if (connectmethod == 1) {
                    return res.status(200).send({ "msg": "Your account have't access to generate call on mobile." });
                }
                var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
                Call.checkactiveamanageraccount(manager_id, function (err, results) {
                    if (err) {
                        res.status(200).send({ "msg": 'Something went wrong!' });
                    } else {
                        if (results.length > 0) {
                            Call.findoutgoingdid(manager_id, async function (err, results) {
                                if (err) {
                                    res.status(200).send({ "msg": 'Something went wrong!' });
                                } else {
                                    if (results.length > 0) {
                                        var didArr = results[0]
                                        if (did_alloted > 0) {
                                            var did = did_alloted
                                        } else {
                                            var did = didArr.did
                                        }
                                        if (secondarysip == 'yes') {
                                            did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                        }
                                        var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                        const askrestapi = new awry.API({
                                            baseUrl: voiceserverdata.ari_url,
                                            username: voiceserverdata.ari_username,
                                            password: voiceserverdata.ari_password,
                                        });
                                        Call.getagentleadbyid(numid, async function (err, ndata) {
                                            if (err) {
                                                res.status(200).send({ "msg": 'Something went wrong!' });
                                            } else {
                                                if (ndata.length > 0) {
                                                    var ldata = ndata[0]
                                                    var camid = ldata.cam_id
                                                    var mobile = ldata.mobile
                                                    mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
                                                    mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
                                                    var agentnum = AgentNumber.toString()[0] == 0 ? AgentNumber : '0' + AgentNumber
                                                    var params = { 'endpoint': 'PJSIP/' + agentnum + '@SM' + did, callerId: did, extension: AgentNumber, context: "cloudX_outgoing_manual", variables: { "DID": did, "NUMID": String(numid), "CallerNumber": mobile, "CallerName": ldata.name, "AgentID": String(AgentID), "AgentName": AgentName, "AgentNumber": AgentNumber, "accountid": manager_id, "MemberChannel": "PJSIP/" + mobile + "@SM" + did, "CallType": "dialer" } };
                                                    var contactdata = await helper.SearchContactIDByMobile(mobile, manager_id)
                                                    askrestapi.channels.originate(params).then(results => {
                                                        // console.log(daeultstta)
                                                        chdata = results.data
                                                        var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9, servicevalue: camid, CallerType: 1, CallerName: ldata.name, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 1, CallType: 'dialer', CdrStatus: 3, AgentStatus: "CALLING", cont_id: contactdata['cont_id'], auto_numid: numid }
                                                        Call.insertcdr(cdrdata, function (err, result) {
                                                            cdrid = result.insertId
                                                        })
                                                        Call.updatecamnumber({ status: 1, totaltry: 1 }, numid)
                                                        res.status(200).send({ "err": false, "msg": "Call originate succesfully." });
                                                    }).catch(function (err) {
                                                        console.log(err)
                                                        res.status(200).send({ "msg": 'Call not originate.please try again!' });
                                                    });
                                                } else {
                                                    res.status(200).send({ "msg": 'Invalid Data' });
                                                }
                                            }
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
                res.status(200).send({ "msg": 'Invalid Agent' });
            }
        }
    });
})

//Get interested, not interested ,schedule feedback from manager id
router.post('/getmanagerlead', authorize, function (req, res) {
    var id = req.body.userid
    var feedback = req.body.feedback
    Call.getmanagerlead(id, feedback, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
router.post('/getmanagerleadwithfilter', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    Call.getmanagerleadfilter(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            // console.log(rows);
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
router.post('/getagentleadfilter', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    Call.getagentleadfilter(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            // console.log(rows);
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})


//get total Today Incoming call for manager
router.get('/getfeedbacklist/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getfeedbacklist(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get total Today Incoming call for manager
router.get('/getcallfeedback/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    var uid = req.query.tknuserid
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getcallfeedback(id, uid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


//Get ALL Miss Call Log of Manager
router.post('/searchMissCallLog/', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchmisscalllog(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })

})

// call log

router.post('/', authorize, function (req, res) {
    user_id = req.body.user_id;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    const filter = req.body.filter;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    findmatch.customer_id = filter.customer_id;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    var startdateObj = new Date(filter.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    findmatch.startdate = startdate;
    var enddateObj = new Date(filter.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    findmatch.enddate = enddate
    findmatch.status = filter.status;
    findmatch.status = filter.status;
    findmatch.agentstatus = filter.agentstatus;
    findmatch.did = filter.did;
    findmatch.agentid = filter.agentid;
    findmatch.callerno = filter.callerno;
    findmatch.calltype = filter.calltype;
    findmatch.disconnected_by = filter.disconnected_by;
    findmatch.lastdestination = filter.lastdestination;
    findmatch.extension = filter.extension;
    findmatch.service = filter.service;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    Call.searchcalllog(findmatch, function (err, contacts_data) {
        if (err) {
            res.status(200).send({ 'payload': [] });
        } else {
            res.status(200).send({ 'payload': contacts_data });
        }
    })

});

//Get today call status to show in pie chart dashboard
router.get('/todayCallStatus/:id', authorize, function (req, res) {
    var id = req.params.id;
    var startdateObj = new Date();
    var todaydate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    //console.log(id);
    Call.todaycallstatus(id, todaydate, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//Get today call status to show in pie chart dashboard
router.post('/todayCallStatusSummary/', authorize, function (req, res) {
    var id = req.body.userid;
    var startdateObj = new Date(req.body.startdate);
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    //console.log(req.body);
    var enddateObj = new Date(req.body.enddate);
    req.body.enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    res.status(200).send({ "data": {} });
    // Call.todaycallstatusummary(req.body, function (err, rows) {
    //   if (err) {
    console.log(err);
    // }
    //else {
    //  res.status(200).send({ "data": rows });
    //}
    //})
})


router.post('/searchLiveAllCall', authorize, function (req, res) {

    Call.getagentliveallcalllog(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})


router.post('/liveagent', function (req, res) {
    Call.getliveagentcalllog(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
//Get today call status to show in pie chart dashboard
router.get('/todayCallType/:id', authorize, function (req, res) {
    var id = req.params.id;
    var startdateObj = new Date();
    var todaydate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    //console.log(id);
    Call.todaycalltype(id, todaydate, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/master', authorize, function (req, res) {
    const filter = req.body.filter;
    // console.log(filter)
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    // findmatch.customer_id = filter.customer_id;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.city = filter.city;
    //console.log(position)
    //console.log(pageSize)
    Call.searchmaster(findmatch, function (err, contacts_data) {
        if (err) {
        }
        // console.log(contacts_data)

        res.status(200).send({ 'payload': contacts_data });
    })

});


router.post('/masterdata', authorize, function (req, res) {
    Call.searchmasterall(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
//get conference members with conference id
router.get('/getConferenceMembers/:id', authorize, function (req, res) {
    Call.getconferencemembers(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})


router.post('/searchCallLogforexcel', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    if (req.body.agentrole == 'supervisor') {
        Call.supervisor_calllogexcel(req.body, function (err, results) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": '' });
            }
            else {
                //console.log("log"+JSON.stringify(rows.length))            
                jsonArray = [];
                async.forEachOf(results, async (rows, key, callback) => {
                    var path='';
                    if(rows['RecPath']){
                        path='https://app.cloudX.in/api/call/audio/'+rows['RecPath'];
                    }else{
                        path='';
                    }
                    var tempArry = {
                        'DID': rows['DID'],
                        'Agent_Name': rows['AgentName'],
                        'Call_Time': rows['CallStartTime'],
                        'Caller_Name': rows['CallerName'],
                        'Caller_Number': rows['CallerNumber'],
                        'TalkTime': rows['CallTalkTime'],
                        'Call_Type': rows['CallType'],
                        'AgentTalkTime': rows['AgentTalkTime'],
                        'DisconnectedBy': rows['DisconnectedBy'],
                        'Call_Pluse': rows['CallPluse'],
                        'Status': rows['CallStatus'],
                        'AgentStatus': rows['AgentStatus'],
                        'Group': rows['GroupName'],
                        'Recording':path
                    }
                    jsonArray.push(tempArry);
                })
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(jsonArray);
                //var xls = json2xls(jsonArray);
                fs.writeFileSync('./uploads/calllog-' + req.body.customer_id + '.csv', csv, 'binary');
                res.status(200).send({ "data": 'calllog-' + req.body.customer_id + '.csv' });
            }

        })
    } else {
        Call.calllogexcel(req.body, function (err, results) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": '' });
            }
            else {
                //console.log("log"+JSON.stringify(rows.length))            
                jsonArray = [];
                if (req.body.customer_id == 2307) {
                    async.forEachOf(results, async (rows, key, callback) => {
                        var path='';
                        if(rows['RecPath']){
                            path='https://app.cloudX.in/api/call/audio/'+rows['RecPath'];
                        }else{
                            path='';
                        }
                        var tempArry = {
                            'DID': rows['DID'],
                            'Agent_Name': rows['AgentName'],
                            'Call_Time': rows['CallStartTime'],
                            'Caller_Name': rows['CallerName'],
                            'Caller_Number': rows['CallerNumber'],
                            'TalkTime': rows['CallTalkTime'],
                            'Queue_time': rows['queue_time'],
                            'Call_Type': rows['CallType'],
                            'AgentTalkTime': rows['AgentTalkTime'],
                            'DisconnectedBy': rows['DisconnectedBy'],
                            'Call_Pluse': rows['CallPluse'],
                            'Status': rows['CallStatus'],
                            'AgentStatus': rows['AgentStatus'],
                            'Group': rows['GroupName'],
                            'Recording':path
                        }
                        jsonArray.push(tempArry);
                    })
                } else {
                    async.forEachOf(results, async (rows, key, callback) => {
                        var path='';
                        if(rows['RecPath']){
                            path='https://app.cloudX.in/api/call/audio/'+rows['RecPath'];
                        }else{
                            path='';
                        }
                        var tempArry = {
                            'DID': rows['DID'],
                            'Agent_Name': rows['AgentName'],
                            'Call_Time': rows['CallStartTime'],
                            'Caller_Name': rows['CallerName'],
                            'Caller_Number': rows['CallerNumber'],
                            'TalkTime': rows['CallTalkTime'],
                            'Call_Type': rows['CallType'],
                            'AgentTalkTime': rows['AgentTalkTime'],
                            'DisconnectedBy': rows['DisconnectedBy'],
                            'Call_Pluse': rows['CallPluse'],
                            'Status': rows['CallStatus'],
                            'AgentStatus': rows['AgentStatus'],
                            'Group': rows['GroupName'],
                            'Recording':path

                        }
                        jsonArray.push(tempArry);
                    })
                }

                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(jsonArray);
                //var xls = json2xls(jsonArray);
                fs.writeFileSync('./uploads/calllog-' + req.body.customer_id + '.csv', csv, 'binary');
                res.status(200).send({ "data": 'calllog-' + req.body.customer_id + '.csv' });
            }

        })
    }

})
//update conference call data
router.post('/updateCallogData/', authorize, function (req, res) {
    Call.updateagentcallfeedback(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": '' });
        }

    })
})
//get agent lead data 
router.post('/getagentdatalead', authorize, function (req, res) {
    Call.getagentdatalead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
//get data in agent lead Management

router.get('/getAgentleadFeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Call.getAgentleadFeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//updatefeedback  lead data in agent
router.post('/updateAgentleadFeedback', authorize, function (req, res) {
    var id = req.body.id;
    var feedback = req.body.feedback;
    var note = req.body.note;
    var scheduledate = null;
    //console.log(req.body.scheduledate);
    if (req.body.scheduledate) {
        var scheduledate = new Date(req.body.scheduledate);
    }
    fdata = { id: id, feedback: feedback, note: note, scheduledate: scheduledate };
    Call.updateAgentleadFeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})
router.post('/getAgentcallSchedule', authorize, function (req, res) {
    var id = req.body.id;
    var feedback = req.body.feedback
    //console.log(req.body);
    Call.getAgentcallSchedule(req.body, function (err, rows) {
        if (err) {
            console.log("err");
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    })
})
//get call history by number
router.get('/getCalldetailhistory/:id', authorize, function (req, res) {
    Call.getCalldetailhistory(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
//get number by call history in manager
router.get('/getCallloghistory/:id', authorize, function (req, res) {
    //console.log("od" + req.params.id);
    Call.getCallloghistory(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }

    })
})

router.get('/get_Call_feedback_data/:id', authorize, function (req, res) {
    Call.get_Call_feedback_data(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})



router.get('/getextension/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    var id = req.params.id;
    //console.log(userrole);
    if (userrole == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    Call.getcallextension(id, function (err, rows) {
        //console.log(rows[0]);
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
//get Agent Call Log Data with pagination
router.post('/getAgentCallLogData', authorize, function (req, res) {
    userid = req.body.userid;
    var type = req.body.type;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    findmatch.userid = userid;
    findmatch.type = type;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    Call.getagentcalllogdata(findmatch, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send({ 'data': rows });
        }

    })

});
//Get Agent assign Lead With pagination
router.post('/getagentassignleaddata', function (req, res) {
    var id = req.body.id;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    var findmatch = {}
    findmatch.id = id;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    Call.getagentleaddata(findmatch, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//next one hour data
router.post('/getNextcallSchedule', authorize, function (req, res) {
    //console.log(req.body);
    req.body.userid = req.query.tknuserid
    //console.log(req.body);
    Call.getNextcallSchedule(req.body, function (err, rows) {
        if (err) {
            console.log("err");
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            //console.log(rows);
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    })
})
//Update call feedback
router.post('/updatecallresult', authorize, function (req, res) {
    var agentid = req.query.tknuserid
    var callrefid = req.body.callrefid;
    var callleadid = req.body.callleadid ? req.body.callleadid : 0;
    var callresult = req.body.callresult;
    var calldesc = req.body.calldesc;
    var scheduledate = '';
    //console.log(req.body.scheduledate);
    //console.log(scheduledate)
    if (callrefid > 0) {
        if (req.body.callscheduledate != '') {
            var scheduledate = new Date(req.body.callscheduledate);
            var start_scheduledate = scheduledate;
            var end_scheduledate = scheduledate;
            //end_scheduledate.setMinutes(end_scheduledate.getMinutes() + 5);
            Call.findcdr(callrefid, function (err, rows) {
                var cdrData = rows[0]
                var sdata = { meeting_type: 'Call', customer_name: cdrData.CallerName, Description: calldesc, mobile: cdrData.CallerNumber, user_id: agentid, StartTime: start_scheduledate, EndTime: end_scheduledate };
                Call.insertscheduledata(sdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                })
            })
        }
        var fdata = { feedback: callresult, note: calldesc };
        if (scheduledate) {
            Object.assign(fdata, { scheduledate: scheduledate });
        }
        Call.updateCallResult(fdata, callrefid, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": 'Call result updated succesfully.' });
            }
            else {
                if (callleadid > 0) {
                    var timeline = {}
                    timeline.agent_id = agentid
                    ERP.get_lead_by_id(callleadid, function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (rows.length > 0) {
                                timeline.account_id = rows[0].User_id
                                timeline.previous_status = rows[0].status
                                timeline.lead_id = rows[0].l_id
                            } else {
                                console.log("NO DATA FOUND");
                            }
                            timeline.current_status = callresult
                            timeline.notes = 'Change Lead Status By ' + req.query.tknuid
                            var ldata = { status: callresult, l_id: callleadid }
                            var now = new Date();
                            ldata.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                            ldata.modified_by = req.query.tknuid
                            ERP.updatelead(ldata, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (timeline.current_status != timeline.previous_status) {
                                        ERP.add_timeline_lead(timeline, function (err, rows2) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                    }
                                }
                            })
                            if (calldesc != '') {
                                var cdata = { lead_id: callleadid, comment: calldesc, comment_by: req.query.tknuid };
                                var now = new Date();
                                cdata['c_date'] = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                cdata['is_sync'] = 'yes';
                                ERP.add_lead_comment(cdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        }
                    })
                }
                res.status(200).send({ "data": 'Call result updated succesfully.' });
            }
        })
    } else {
        res.status(200).send({ "data": 'Invalid Call ID.' });
    }
})
//Get Agent call summary
router.post('/agentcallanalytics', authorize, function (req, res) {
    var agentid = req.query.tknuserid;
    Call.getagentcallanalytics(agentid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": {} });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//Get Specific Call history of manager 
router.post('/singlecallhistory', authorize, async function (req, res) {
    var agentid = req.query.tknuserid;
    var id = req.body.id
    var managerid = await helper.GetManagerIdByAgent(agentid)
    Call.findcdr(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                var mobile = rows[0].CallerNumber;
                var contid = rows[0].cont_id != '' ? rows[0].cont_id : '';
                Call.getsinglecallhistory(mobile, contid, managerid, async function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        //console.log(rows)
                        //rows = await helper.calldatadividebydate(rows)
                        res.status(200).send({ "data": rows });
                    }
                })
            } else {
                res.status(200).send({ "data": [] });
            }
        }
    })
})

router.post('/getagentqueuecall', authorize, async function (req, res) {
    var agentid = req.query.tknuserid;
    Call.getagentqueuecall(agentid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/updatequeuecall', authorize, async function (req, res) {
    var agentid = req.query.tknuserid;
    var data = { action: req.body.action, transfer_agent: req.body.transfer_agent, cdrid: req.body.cdrid }
    Call.updatequeuecall(data, agentid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'Something went wrong!!' });
        }
        else {
            //console.log(rows.length)
            res.status(200).send({ "msg": 'updated' });
        }
    })
})
router.post('/savefeedbackdata', authorize, async function (req, res) {
    var agentid = req.query.tknuserid;
    //var data = {action:req.body.action,transfer_agent:req.body.transfer_agent,cdrid:req.body.cdrid}
    var extraitems = req.body.items
    if (extraitems != undefined && extraitems.length > 0) {
        extraitems.forEach(item => {
            //console.log(item.formtitle + "====" + item.formtype + "====" + item.formvalue)
            var mdata = { fmetaid: item.formmetaid, fid: item.formid, form_title: item.formtitle, form_value: item.formvalue, cdrid: item.cdrid }
            if (item.formtitle != '') {
                Call.savefeedbackformmeta(mdata)
            }
        });
        if (extraitems[0].cdrid > 0) {
            Call.getcdrwithleadid(extraitems[0].cdrid, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": [] });
                }
                else {
                    if (rows.length > 0) {
                        if (rows[0].lead_id > 0) {
                            var timeline = {}
                            timeline.agent_id = agentid;
                            timeline.form_id = extraitems[0].formid;
                            ERP.get_lead_by_id(rows[0].lead_id, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (rows.length > 0) {
                                        timeline.account_id = rows[0].User_id
                                        //timeline.previous_status = rows[0].status
                                        timeline.current_status = rows[0].status
                                        timeline.lead_id = rows[0].l_id
                                    } else {
                                        console.log("NO DATA FOUND");
                                    }
                                    //timeline.current_status = callresult
                                    timeline.notes = 'Save Feedback Form By ' + req.query.tknuid
                                    ERP.add_timeline_lead(timeline, function (err, rows2) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })

                                }
                            })
                        }
                        // console.log(rows[0]);
                        if (rows[0].cont_id.length > 0) {
                            //console.log(extraitems[0].cdrid+'::::'+ extraitems[0].formid);
                            Call.getcdrfeedbackformdata(extraitems[0].cdrid, extraitems[0].formid, function (err, frows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (frows.length > 0) {
                                        for (let index = 0; index < frows.length; index++) {
                                            const element = frows[index];
                                            Call.checkformmetatocontactmeta(element.form_title, rows[0].cont_id, function (err, mrows) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (mrows.length > 0) {

                                                    } else {
                                                        mdata = { account_id: req.query.tknuserid, cont_id: rows[0].cont_id, meta_key: element.form_title, meta_value: element.form_value }
                                                        Call.savecontactmeta(mdata, function (err, cmsrows) {
                                                            if (err) {
                                                                console.log(err);
                                                            } else {

                                                            }
                                                        })
                                                    }
                                                }
                                            })

                                        }

                                    }
                                }
                            })
                        }
                    }

                }
            })
        }
        res.status(200).send({ "msg": 'Forms created sucessfully!' });
    } else {
        res.status(200).send({ "msg": 'Forms created sucessfully!' });
    }
})
//search Agent Call Log 
router.post('/searchagentcalllog', authorize, function (req, res) {
    if (req.body.startdate != '') {
        var startdateObj = new Date(req.body.startdate);
        var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
        req.body.startdate = startdate;
    }
    if (req.body.enddate != '') {
        var enddateObj = new Date(req.body.enddate);
        var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
        req.body.enddate = enddate;
    }

    Call.searchagentcalllog(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            //console.log('data:'+JSON.stringify(rows.length));           
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
//search Agent Call Log 
router.post('/searchagentmissedcalllog', authorize, function (req, res) {
    if (req.body.startdate != '') {
        var startdateObj = new Date(req.body.startdate);
        var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
        req.body.startdate = startdate;
    }
    if (req.body.enddate != '') {
        var enddateObj = new Date(req.body.enddate);
        var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
        req.body.enddate = enddate;
    }

    Call.searchagentmissedcalllog(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            for (var i = 0; i < rows.length; i++) {

                var idata = await helper.GetIncomingCallbackCount(rows[i].callernumber, rows[i].misscalldate);
                rows[i].callbackcount = (idata);

            }
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

router.post('/saveScheduleMeeting', authorize, async function (req, res) {

    var lead_id = req.body.lead_id
    var agent_id = req.body.agent_id;
    var email = req.body.email;
    var meetlink = req.body.meetlink ? req.body.meetlink : '';
    var customer_name = req.body.customer_name;

    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var event_type = req.body.event_type;
    var mobile = req.body.mobile;

    var sharesms = req.body.sharesms;
    var sharemail = req.body.sharemail;
    var shareWhatsapp = req.body.shareWhatsapp;

    var dateObj = new Date(startdate);
    var m_startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

    var dateObj_1 = new Date(enddate);
    var m_enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

    var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

    var message = '';
    var text_link = '';

    var short_link = await helper.CreateShortLink(meetlink);
    var meeting_link = "https://slss.in/" + short_link;


    var fdata = { agent_id: agent_id, email: email, link: meeting_link, mobile: mobile, customer_name: customer_name, startdate: m_startdate, enddate: m_enddate, event_type: event_type, customer_id: req.body.customer_id };

    var status = validator.validate(req.body.email);

    if (sharesms == true) {
        fdata['sms_status'] = 1;
    }

    if (sharemail == true) {
        fdata['email_status'] = 1;
    }

    if (req.body.meet_type == 'Shared Link') {
        await Call.schedulemeeting(fdata, async function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                var meeting_id = rows.insertId;
                var m_link = 'https://auth.cloudX.in/cust-appointment/' + meeting_id;
                var m_short_link = await helper.CreateShortLink(m_link);
                var m_meeting_link = "https://slss.in/" + m_short_link;
                var mdata = { shared_link: m_meeting_link, meetingid: meeting_id }
                await Call.updatemeetingid(mdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "msg": err });
                    }
                    else {
                        Call.get_lead_by_id(lead_id, async function (err, data) {
                            if (data.length > 0) {
                                var agent_id = req.query.tknuserid
                                var timeline = {}
                                timeline.agent_id = agent_id
                                timeline.account_id = data[0].User_id
                                timeline.lead_id = data[0].l_id
                                timeline.current_status = data[0].status
                                timeline.notes = 'Shared Meeting Link  BY ' + req.query.tknuid + ''
                                Call.add_timeline_lead(timeline, function (err, rows2) { })
                                //
                                var now = new Date();
                                var ldata = { l_id: lead_id }
                                ldata.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                ldata.modified_by = req.query.tknuid
                                ERP.updatelead(ldata, function (err, rows) { })
                            }
                        })
                        res.status(200).send({ "msg": message, "text": "Link is shared successfully !!" });
                    }
                })
            }
        });
    } else {
        //calender schedule
        var sdata = { original_meeting_link: (event_type == 'Video') ? meetlink : '', email: email, mobile: mobile, StartTime: m_startdate, EndTime: m_enddate, user_id: agent_id, meeting_link: (event_type == 'Video') ? meeting_link : '', meeting_type: event_type, customer_name: customer_name, Description: (event_type == 'Video') ? '<a href="' + meeting_link + '">' + meeting_link + '</a>' : '', email: email, mobile: mobile, StartTime: m_startdate, EndTime: m_enddate, user_id: agent_id, meeting_link: (event_type == 'Video') ? meeting_link : '', customer_id: req.body.customer_id };
        Call.insertscheduledata(sdata, async function (err, rows) {
            if (err) {
                res.status(200).send({ "msg": err });
            }
            else {
                Call.get_lead_by_id(lead_id, async function (err, data) {
                    if (data.length > 0) {
                        var agent_id = req.query.tknuserid
                        var timeline = {}
                        timeline.agent_id = agent_id
                        timeline.account_id = data[0].User_id
                        timeline.lead_id = data[0].l_id
                        timeline.current_status = data[0].status
                        timeline.notes = 'Schedule ' + event_type + ' Meeting BY ' + req.query.tknuid + ' (' + meetlink + ')'
                        Call.add_timeline_lead(timeline, function (err, rows2) { })
                        //
                        var now = new Date();
                        var ldata = { l_id: lead_id }
                        ldata.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        ldata.modified_by = req.query.tknuid
                        ERP.updatelead(ldata, function (err, rows) { })
                    }
                })
                res.status(200).send({ "msg": message, "text": "Your Meeting is scheduled successfully !!" });
            }
        });
    }
})


//Call Monitor
router.post('/conferencecallwithmanager', authorize, async function (req, res) {
    const cdrid = req.body.cdrid;
    const agentid = req.query.tknuserid;
    var managerid = await helper.GetManagerIdByAgent(agentid)
    Call.getuserdetail(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            if (rows.length > 0) {
                var voiceserverdata = await helper.GetManagerVoiceServerData(managerid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                var udata = rows[0]
                var mobile = udata['mobile']
                mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
                mobile = mobile.toString()[0] == 0 ? mobile : '0' + mobile
                Call.findcdr(cdrid, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "msg": 'db error' });
                    }
                    else {
                        if (rows.length > 0) {
                            var cdata = rows[0];
                            var monitormode = 'qB'
                            var params = { 'endpoint': 'PJSIP/' + mobile + '@SM' + cdata.DID, callerId: cdata.DID, context: "cloudX_monitor", extension: 's', variables: { "MonitorChannel": cdata.channel, Monitormode: monitormode } };
                            askrestapi.channels.originate(params).then(data => {
                                //console.log(data)
                                res.status(200).send({ "err": false, "msg": "Conference call originate succesfully." });
                            }).catch(function (err) {
                                console.log(err)
                                res.status(200).send({ "msg": 'Invalid request' });
                            });
                        } else {
                            res.status(200).send({ "msg": 'Invalid call' });
                        }
                    }
                });
            } else {
                res.status(200).send({ "msg": 'Invalid manager' });
            }
        }
    })
})

router.post('/searchMissedcall', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    var timezone = req.body.timezone;
    var result = timezone.replace("UTC ", "");
    req.body.timezone = result;

    Call.searchmissedcalldata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("rows");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})

router.post('/getConferenceDID', authorize, function (req, res) {
    var id = req.query.tknuserid;
    Call.findconferencedid(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(200).json(err);
        }
        res.send({ 'data': data });
    });
});

router.get('/findconferencechart/:id', authorize, function (req, res) {
    Call.findconferencechart(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }

    })
})

//Get Agent Call Log 
router.post('/getagentmissedcalllog', authorize, function (req, res) {
    const id = req.body.id;
    const type = req.body.type;
    Call.getagentmissedcalllog(id, type, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})

//Get Queue Call
router.post('/searchQueueCall', authorize, async function (req, res) {
    // console.log(req.body);
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        req.body.userid = managerid
    }
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchqueueCall(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})

//Search Call Pulse
router.post('/searchCallPulse', authorize, async function (req, res) {
    // console.log(req.body);
    var userid = req.query.tknuserid;
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchcallpulse(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
//Get Queue Call
router.get('/hangupqueuecall/', authorize, async function (req, res) {
    // console.log(req.body);
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        userid = managerid
    }
    //console.log(req.query.tknuserid);
    Call.getmaxtimequeuecall(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                //console.log(rows);
                var cdrid = rows[0].cdrid;
                cdata = { in_queue: 0, id: rows[0].cdrid }
                qdata = { status: '1', qid: rows[0].qid }
                Call.hangupqueuecall(qdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": [] });
                    }
                    else {
                        Call.hangupcalldata(cdata, function (err, rows) {
                            if (err) {
                                console.log(err);
                                res.status(200).send({ "data": [] });
                            }
                            else {
                                res.status(200).send({ "data": "call hangup successfully!!" });
                            }
                        })
                    }
                })
            } else {
                res.status(200).send({ "data": "data not found!!" });
            }

        }
    })

})

router.post('/calldisconnect', function (req, res) {
    //console.log(req.body)
    const cdrid = req.body.callrefid;
    if (cdrid > 0) {
        Call.findcdr(cdrid, async function (err, result) {
            console.log(err)
            if (err) return res.status(200).send({ "msg": 'Invalid Call' });
            //console.log(result)
            if (result.length > 0) {
                var row = result[0]
                var voiceserverdata = await helper.GetManagerVoiceServerData(row.accountid)
                const askrestapi = new awry.API({
                    baseUrl: voiceserverdata.ari_url,
                    username: voiceserverdata.ari_username,
                    password: voiceserverdata.ari_password,
                });
                var params = { 'channelId': row.uniqueid, reason: 'no_answer' };
                //console.log(params)
                askrestapi.channels.hangup(params).then(data => {
                    //console.log(data)
                }).catch(function (err) {
                    //console.log(err)
                    if (row.channel != '') {
                        params = { 'channelId': row.channel, reason: 'no_answer' };
                        askrestapi.channels.hangup(params).then(data => {
                            //console.log(data)
                        }).catch(function (err) {
                            //console.log(err)
                        });
                    }
                });
                var currentchannel = row.channelid
                var params = { 'channelId': currentchannel, reason: 'no_answer' };
                //console.log(params)
                askrestapi.channels.hangup(params).then(data => {
                    //console.log(data)
                    // res.status(200).send("success");
                }).catch(function (err) {
                    //console.log(err)
                    if (row.channel != '') {
                        var params = { 'channelId': row.channel, reason: 'no_answer' };
                        askrestapi.channels.hangup(params).then(data => {
                            //console.log(data)
                        }).catch(function (err) {
                            //console.log(err)
                        });
                    }
                    //res.status(200).send("invalid");
                });
                Call.updateCallResult({ CdrStatus: 0 }, cdrid, function (err, rows) {

                })
                res.status(200).send({ "msg": 'Call disconnect successfully.' });
            } else {
                res.status(200).send({ "msg": 'Invalid Call' });
            }
        })
    } else {
        res.status(200).send({ "msg": 'Invalid Call' });
    }
})
router.get('/getagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Call.getagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/supervisor_call_log/', authorize, function (req, res) {
    user_id = req.body.user_id;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    const filter = req.body.filter;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    findmatch.customer_id = filter.customer_id;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    //console.log(position)
    //console.log(pageSize)
    var startdateObj = new Date(filter.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    findmatch.startdate = startdate;
    var enddateObj = new Date(filter.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    findmatch.enddate = enddate
    findmatch.status = filter.status;
    findmatch.status = filter.status;
    findmatch.agentstatus = filter.agentstatus;
    findmatch.did = filter.did;
    findmatch.agentid = filter.agentid;
    findmatch.callerno = filter.callerno;
    findmatch.calltype = filter.calltype;
    findmatch.disconnected_by = filter.disconnected_by;
    findmatch.lastdestination = filter.lastdestination;
    findmatch.extension = filter.extension;
    findmatch.service = filter.service;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    //findmatch.LastDestination = req.body.LastDestination;
    // console.log("findmatch");
    // console.log(JSON.stringify(findmatch));
    Call.searchsupervisorcalllog(findmatch, function (err, contacts_data) {
        if (err) {
        }
        res.status(200).send({ 'payload': contacts_data });
    })

});
router.post('/searchsupervisiorCallPulse', authorize, async function (req, res) {
    // console.log(req.body);
    var userid = req.query.tknuserid;
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchsupervisiorCallPulse(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
router.post('/search_supervisior_MissedCallData', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    var timezone = req.body.timezone;
    var result = timezone.replace("UTC ", "");
    req.body.timezone = result;

    Call.search_supervisior_MissedCallData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [], "length": 0 });
        }
        else {
            // console.log("rows");
            // console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})
router.post('/search_supervisior_feedback', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.search_supervisior_feedback(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [], "length": 0 });
        }
        else {
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})

router.get('/oldaudio/:id', function (req, res) {
    var recname = req.params.id
    var url = 'http://192.168.1.129/call-recording-backup/cloudX/' + req.params.id + '.mp3';
    urllib.request(url, {
    }, function (error, resp, rescode) {
        if (error) {
            console.log(error)
        }
        else {
            if (rescode.statusCode == 404) {
                url = 'http://192.168.1.129/call-recording-backup/' + req.params.id + '.mp3';
                urllib.request(url, {
                }, function (error, resp, rescode) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        req.pipe(request(url)).pipe(res);
                    }
                })
            } else {
                req.pipe(request(url)).pipe(res);
            }
        }
    })
})
//get call routing detail by call id in manager
router.get('/getcallroutingdetail/:id', authorize, function (req, res) {
    //console.log("od" + req.params.id);
    Call.getcallroutingdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }

    })
})
router.post('/scheduleagentcall', authorize, function (req, res) {
    var id = req.body.id;
    var startdateObj = new Date(req.body.scheduledate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var date = new Date(req.body.scheduledate);
    var end_date = new Date(req.body.scheduledate);
    end_date.setMinutes(end_date.getMinutes() + 5);
    var start_scheduledate = '';
    var end_scheduledate = '';

    if (req.body.scheduledate != null) {
        start_scheduledate = date;
        end_scheduledate = end_date;
        var sdata = { meeting_type: 'Call', customer_name: req.body.customer_name, mobile: req.body.mobile, user_id: req.body.agentId, StartTime: start_scheduledate, EndTime: end_scheduledate };
        Call.insertscheduledata(sdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
        })
    }

    fdata = { id: id, scheduledate: start_scheduledate };

    Call.updateagentcallfeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Call schedule succesfully.' });
        }
        else {
            res.status(200).send({ "data": 'Call schedule succesfully.' });
        }
    })
})

router.post('/change_feedback_view_card_data', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    Call.change_feedback_view_card_data(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'total': 0, 'data': [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ 'total': rows.length, 'data': rows });
        }
    });
})
router.post('/searchFeedback', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Call.searchfeedback(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [], "length": 0 });
        }
        else {
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})
router.get('/getivrroutingdetail/:id', authorize, function (req, res) {
    //console.log("od" + req.params.id);
    Call.getivrroutingdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }

    })
})
router.post('/singlecallhistorybymobile', authorize, async function (req, res) {
    var agentid = req.query.tknuserid;
    var mobile = req.body.mobile
    var managerid = await helper.GetManagerIdByAgent(agentid)
    Call.getcallhistorybymobile(mobile,  managerid, async function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
module.exports = router;
