var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Admin = require('../model/admin');
var Manager = require('../model/manager');
var Signin = require('../model/signin');
var Setting = require('../model/setting');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var numeral = require('numeral');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
var path = require('path');
var urllib = require('urllib');
var pdf = require("pdf-creator-node");
var fs = require('fs');
const ldap = require('ldapjs');
const { forEach } = require('async');
ssha = require("ssha");
var dateFormat = require("dateformat");
var async = require("async");
const helper = require('../helper/common');
const { date } = require('faker/lib/locales/az');
var verifier = require('email-verify');
var nodemailer = require('nodemailer');

// Read HTML Template
var html = fs.readFileSync('invoice.html', 'utf8');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/getManagers/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getmanagers(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getManagerDetail/:id', authorize, async function (req, res) {
    //console.log(req.params.id);
    var userid = req.params.id;
    //var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.query.tknuserid)
    } else {
        var managerid = userid
    }
    Manager.getmanagerdetail(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [], "settings": [] });
        }
        else {
            var settings = await helper.GetManagerSettingById(managerid)
            res.status(200).send({ "data": rows[0], "settings": settings });
        }
    })
})

router.get('/getTempManagerDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.gettempmanagerdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.post('/saveManager', authorize, async function (req, res) {
    //console.log(req.body);
    // var string = numeral(billid).format('0,0');
    // console.log(billid);
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var alternatemobile = req.body.alternatemobile;
    var companyname = req.body.companyname;
    var pulse = req.body.pulse;
    var credits = req.body.credits;
    var balance = req.body.balance;
    var userlimit = req.body.userlimit;
    var billing_type = req.body.billing_type;
    // var incoming_channel = req.body.userlimit;
    // var outgoing_channel = req.body.userlimit;
    var incoming_channel = req.body.channels;
    var outgoing_channel = req.body.channels;
    var channels = req.body.channels;
    var current_status = req.body.status;
    var package = req.body.package;
    var authorised_person_name = req.body.authorised_person_name;
    var demo_account = req.body.demo_account;
    var voip_chargeable = req.body.voip_chargeable;
    var lead_limit = req.body.leadlimit;
    var expirydate = null;
    var voice_server = req.body.voice_server;
    var socket_server = req.body.socket_server;
    var telesmsprvalue = req.body.telesmsprvalue;
    var feedback_vales = 'Interested,Not Interested,Not Response/Busy,Requested more info,Requested call back,Invalid Number';
    var userfairminutelimit = await helper.CheckAdminSetting('user_fair_minute_limit')
    var erpuserid = null
    var renew_account_manager =req.body.renew_account_manager;
    var obd_server_id = req.body.obd_server;
    var obd_channel =req.body.obd_channels;
    if (voice_server) {
        var voiceserverdata = await Manager.getVoiceServerDetail(voice_server)
        if (voiceserverdata) {
            erpuserid = voiceserverdata.live_domain;
        }
    }

    var unlimitedminute = Number(userfairminutelimit) * userlimit
    var ip = req.body.ip;
    if (package != null) {
        var expirydate = new Date(req.body.expirydate);
    }

    if (req.body.password) {
        var password = bcrypt.hashSync(req.body.password);
    }
    var created_by = req.body.created_by;

    var m = new Date();
    var services = JSON.stringify(req.body.services);
    var accountaddress = req.body.accountaddress;
    const fdata = {
        account_type: 2, account_name: name, account_password: password, email: email, mobile: mobile, alternate_mobile: alternatemobile, created_by: created_by, create_date: m,
        company_name: companyname, pulse: pulse, credits: credits, balance: balance, current_status: current_status,
        authorised_person_name: authorised_person_name, company_address: accountaddress, expiry_date: expirydate, channels: channels, user_limit: userlimit,
        outgoing_channel: outgoing_channel, incoming_channel: incoming_channel, package_id: package, services: services, voice_server_id: voice_server, socket_url: socket_server,
        is_demo: demo_account, billing_type: billing_type, feedback_vales: feedback_vales, erp_userid: erpuserid,renew_account_manager:renew_account_manager,obd_server_id:obd_server_id,
        obd_channel:obd_channel
    };
    Manager.insertmanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            var managerid = rows.insertId;
            Manager.getlastbillid(0, function (err, bdata) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (bdata.length > 0) {
                        var billid = bdata[0].Bill_ID;
                        var a = Number(billid.replace(/^\D+/g, ''));
                        a = a + 1;
                        billid = numeral(a).format('000000000000000');
                        billid = 'TEL' + billid;
                    } else {
                        var billid = 'TEL000000000000001';
                    }

                    var mgstno = req.body.mgstno;
                    var companygstno = req.body.companygstno;
                    var discountype = req.body.discountype;
                    var discountper = null;
                    if (discountype == 0) {
                        var discountper = req.body.discountper;
                    }
                    if (req.body.packagediscount) {
                        var packagediscount = req.body.packagediscount;
                    } else {
                        var packagediscount = 0;
                    }


                    var packageprice = 0;
                    if (req.body.bestpackagemode == true) {
                        Admin.getpackagedetail(package, function (err, pdata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                packageprice = pdata[0].package_price;
                                if (pdata[0].minute_type == 1) {
                                    var plantotalvalue = (packageprice);
                                } else {
                                    var plantotalvalue = (packageprice * userlimit);
                                }

                                var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                                // var managerstatecode = mgstno.substring(0, 2);
                                var managerstatecode = req.body.accountstatecode;
                                var companystatecode = companygstno.substring(0, 2);
                                var cgst = 0;
                                var sgst = 0;
                                var igst = 0;
                                var totalgst = 0;
                                if (managerstatecode == companystatecode) {
                                    cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    totalgst = (cgst + sgst);
                                }
                                if (managerstatecode != companystatecode) {
                                    igst = Math.round(((afterdiscountvalue) * 18) / 100);
                                    totalgst = (igst);
                                }
                                var finalamount = (afterdiscountvalue + totalgst);
                                //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                                var m = new Date();
                                var accountaddress = req.body.accountaddress;
                                var packageminutes = req.body.packageminutes ? req.body.packageminutes : unlimitedminute;
                                var packagefreeminutes = req.body.packagefreeminutes;

                                billdata = {
                                    Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno, Bill_Type: 'new',
                                    Plan_Type: package, Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Discount_Type: discountype, Discount_Per: discountper, Plan_discount: packagediscount,
                                    Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
                                    Final_amount: finalamount, Created_By: created_by, Plan_expire_Date: expirydate, Account_Address: accountaddress, Account_State_Code: managerstatecode,
                                    plan_minuits: packageminutes, free_minuites: packagefreeminutes,
                                }
                                Manager.insertbilldata(billdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        var packageminutes = req.body.packageminutes ? req.body.packageminutes : unlimitedminute;
                                        var packagefreeminutes = 0;
                                        if (req.body.packagefreeminutes != null) {
                                            var packagefreeminutes = req.body.packagefreeminutes;
                                        }
                                        var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));
                                        var telestartdate = new Date(req.body.tele_startdate);

                                        const balancedata = {
                                            Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate,
                                            voip_pulse_charge: voip_chargeable, lead_limit: lead_limit
                                        }
                                        // const insterdata = {
                                        //     account_id: managerid, action: "Save Manager",action_date:new Date(),ip:ip
                                        // }
                                        // Manager.insertupdatemangerdata(insterdata, function (err, rows) {
                                        //     if (err) {}
                                        //     else{

                                        //     }
                                        // })
                                        Manager.insertaccountbalancedata(balancedata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                            }
                                        })
                                    }

                                })
                            }
                        })
                    }
                }
            })
            res.status(200).send({ "data": managerid });
        }
    })
})
router.post('/updateManager', authorize, async function (req, res) {
    var adminid = req.body.adminid;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var alternatemobile = req.body.alternatemobile;
    var created_by = req.body.created_by;
    var current_status = req.body.status;
    var companyname = req.body.companyname;
    var pulse = req.body.pulse;
    var credits = req.body.credits;
    var balance = req.body.balance;
    var userlimit = req.body.userlimit;
    var billing_type = req.body.billing_type;
    // var incoming_channel = req.body.userlimit;
    // var outgoing_channel = req.body.userlimit;
    var channels = req.body.channels;
    var authorised_person_name = req.body.authorised_person_name;
    var accountaddress = req.body.accountaddress;
    var incoming_channel = req.body.channels;
    var outgoing_channel = req.body.channels;
    var voice_server = req.body.voice_server;
    var socket_server = req.body.socket_server;
    var package = req.body.package;
    var ip = req.body.ip;
    var obd_server =req.body.obd_server;
    var obd_channels =req.body.obd_channels;
    var renew_account_manager = req.body.renew_account_manager;
    if (req.body.package != null) {
        var expirydate = new Date(req.body.expirydate);
    } else {
        var expirydate = null;
    }
    var services = JSON.stringify(req.body.services);
    var demo_account = req.body.demo_account;
    var voip_chargeable = req.body.voip_chargeable;
    var lead_limit = req.body.leadlimit;
    var erpuserid = null;
    if (voice_server) {
        var voiceserverdata = await Manager.getVoiceServerDetail(voice_server)
        if (voiceserverdata) {
            erpuserid = voiceserverdata.live_domain;
        }
    }
    var m = new Date();
    const fdata = {
        account_id: adminid, account_name: name, email: email, mobile: mobile, alternate_mobile: alternatemobile, last_modify_by: created_by, last_modify_date: m,
        company_name: companyname, pulse: pulse, credits: credits, balance: balance, current_status: current_status, expiry_date: expirydate
        , authorised_person_name: authorised_person_name, company_address: accountaddress, channels: channels, user_limit: userlimit,
        incoming_channel: incoming_channel, outgoing_channel: outgoing_channel, package_id: package, voice_server_id: voice_server,obd_channel:obd_channels,obd_server_id:obd_server,
        socket_url: socket_server, services: services, is_demo: demo_account, billing_type: billing_type, erp_userid: erpuserid,renew_account_manager:renew_account_manager
    };
    Manager.updatemanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            var managerid = adminid;
            const balancedata = {
                Account_ID: managerid, voip_pulse_charge: voip_chargeable, lead_limit: lead_limit
            }
            Manager.updateaccountbalancedata(balancedata, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!' });
                }
                else {


                    res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                }

            })
            // Manager.getuserlastbilldata(managerid, function (err, bdata) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         var billid = bdata[0].Bill_ID;
            //         var mgstno = req.body.mgstno;
            //         var companygstno = req.body.companygstno;
            //         var discountype = req.body.discountype;
            //         var discountper = null;
            //         if (discountype == 0) {
            //             var discountper = req.body.discountper;
            //         }
            //         if (req.body.packagediscount) {
            //             var packagediscount = req.body.packagediscount;
            //         } else {
            //             var packagediscount = 0;
            //         }
            //         var packageprice = 0;

            //         // if (req.body.bestpackagemode == true) { //console.log('best');
            //         Admin.getpackagedetail(package, function (err, pdata) {
            //             if (err) {
            //                 console.log(err);
            //             }
            //             else {
            //                 packageprice = pdata[0].package_price;
            //                 //var plantotalvalue = (packageprice * userlimit);

            //                 if (pdata[0].minute_type == 1) {
            //                     var plantotalvalue = (packageprice);
            //                 } else {
            //                     var plantotalvalue = (packageprice * userlimit);
            //                 }


            //                 var afterdiscountvalue = ((plantotalvalue) - packagediscount);
            //                 //var managerstatecode = mgstno.substring(0, 2);
            //                 var managerstatecode = req.body.accountstatecode;
            //                 var companystatecode = companygstno.substring(0, 2);
            //                 var cgst = 0;
            //                 var sgst = 0;
            //                 var igst = 0;
            //                 var totalgst = 0;
            //                 if (managerstatecode == companystatecode) {
            //                     cgst = Math.round(((afterdiscountvalue) * 9) / 100);
            //                     sgst = Math.round(((afterdiscountvalue) * 9) / 100);
            //                     totalgst = (cgst + sgst);
            //                 }
            //                 if (managerstatecode != companystatecode) {
            //                     igst = Math.round(((afterdiscountvalue) * 18) / 100);
            //                     totalgst = (igst);
            //                 }
            //                 var finalamount = (afterdiscountvalue + totalgst);
            //                 //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
            //                 var m = new Date();
            //                 var accountaddress = req.body.accountaddress;
            //                 var packageminutes = req.body.packageminutes;
            //                 var packagefreeminutes = req.body.packagefreeminutes;
            //                 billdata = {
            //                     Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno,
            //                     Plan_Type: package, Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Discount_Type: discountype, Discount_Per: discountper, Plan_discount: packagediscount,
            //                     Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
            //                     Final_amount: finalamount, Created_By: created_by, Plan_expire_Date: expirydate, Account_Address: accountaddress, Account_State_Code: managerstatecode, plan_minuits: packageminutes, free_minuites: packagefreeminutes
            //                 }
            //                 Manager.updatebilldata(billdata, function (err, rows) {
            //                     if (err) {
            //                         console.log(err);
            //                     }
            //                     else {

            //                         var packageminutes = req.body.packageminutes;
            //                         var packagefreeminutes = 0;
            //                         if (req.body.packagefreeminutes != null) {
            //                             var packagefreeminutes = req.body.packagefreeminutes;
            //                         }
            //                         var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));


            //                         Manager.getaccountbalancedatabyid(managerid, function (err, brows) {
            //                             if (err) {
            //                                 console.log(err);
            //                             }
            //                             else {

            //                                 //console.log("brows:::"+JSON.stringify(brows[0]));
            //                                 //if (req.body.telesmspackagemode == true && req.body.bestpackagemode == true) {
            //                                 if (brows[0].Tele_packageid != null && packageminutes != null && brows[0].Tele_packageid == package) {
            //                                     // totalpackageminutes = (Number(brows[0].Tele_Plan_Balance) + Number(totalpackageminutes));
            //                                     totalpackageminutes = (Number(brows[0].Tele_Plan_Balance));
            //                                 } else {
            //                                     var packageminutes = req.body.packageminutes;
            //                                     var packagefreeminutes = 0;
            //                                     if (req.body.packagefreeminutes != null) {
            //                                         var packagefreeminutes = req.body.packagefreeminutes;
            //                                     }
            //                                     var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));


            //                                 }

            //                                 var telestartdate = new Date(req.body.tele_startdate);

            //                                 const balancedata = {
            //                                     Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate
            //                                 }
            //                                 Manager.updateaccountbalancedata(balancedata, function (err, rows) {
            //                                     if (err) {
            //                                         console.log(err);
            //                                         res.status(200).send({ "data": 'Something went wrong!' });
            //                                     }
            //                                     else {
            //                                         res.status(200).send({ "data": 'Manager detail updated succesfully.' });
            //                                     }

            //                                 })
            //                             }

            //                         });
            //                     }
            //                 })
            //             }
            //         })

            //         //}
            //     }
            // })
            //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
        }
    })

})
/*router.post('/updateManager', authorize, function (req, res) {
    // console.log(req.body);
    var adminid = req.body.adminid;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var alternatemobile = req.body.alternatemobile;
    var created_by = req.body.created_by;
    var current_status = req.body.status;
    var companyname = req.body.companyname;
    var pulse = req.body.pulse;
    var credits = req.body.credits;
    var balance = req.body.balance;
    var userlimit = req.body.userlimit;
    var incoming_channel = req.body.userlimit;
    var outgoing_channel = req.body.userlimit;
    var channels = req.body.channels;
    var authorised_person_name = req.body.authorised_person_name;
    var accountaddress = req.body.accountaddress;

    var package = req.body.package;
    if (req.body.package != null) {
        var expirydate = new Date(req.body.expirydate);
    } else {
        var expirydate = null;
    }
    var services = JSON.stringify(req.body.services);
    var telesmsprvalue = req.body.telesmsprvalue;
    var m = new Date();
    fdata = {
        account_id: adminid, account_name: name, email: email, mobile: mobile, alternate_mobile: alternatemobile, last_modify_by: created_by, last_modify_date: m,
        company_name: companyname, pulse: pulse, credits: credits, balance: balance, current_status: current_status, expiry_date: expirydate
        , authorised_person_name: authorised_person_name, company_address: accountaddress, channels: channels, user_limit: userlimit,
        incoming_channel: incoming_channel, outgoing_channel: outgoing_channel, package_id: package,
        services: services
    };
    Manager.updatemanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var managerid = adminid;
            Manager.getuserlastbilldata(managerid, function (err, bdata) {
                if (err) {
                    console.log(err);
                }
                else {
                    var billid = bdata[0].Bill_ID;
                    var mgstno = req.body.mgstno;
                    var companygstno = req.body.companygstno;
                    var discountype = req.body.discountype;
                    var discountper = null;
                    if (discountype == 0) {
                        var discountper = req.body.discountper;
                    }
                    if (req.body.packagediscount) {
                        var packagediscount = req.body.packagediscount;
                    } else {
                        var packagediscount = 0;
                    }
                    var packageprice = 0;
                    if (req.body.bestpackagemode == true) { //console.log('best');
                        Admin.getpackagedetail(package, function (err, pdata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                packageprice = pdata[0].package_price;
                                //var plantotalvalue = (packageprice * userlimit);
                                var telesmspackage = req.body.telesmspackage;
                                var telesmspackagevalue = req.body.telesmspackagevalue;
                                var telemailpackage = req.body.telemailpackage;
                                var telemailpackagevalue = req.body.telemailpackagevalue;
                                var telemeetpackage = req.body.telemeetpackage;
                                var telemeetpackagevalue = req.body.telemeetpackagevalue;
                                var teledigitalpackage = req.body.teledigitalpackage;
                                var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                                var tollfreepackage = req.body.tollfreepackage;
                                var tollfreepackagevalue = req.body.tollfreepackagevalue;
                                var obdpackage = req.body.obdpackage;
                                var obdpackagevalue = req.body.obdpackagevalue;
                                var teledigitaladspackage = req.body.teledigitaladspackage;
                                var teledigitaladspackagevalue = req.body.teledigitaladspackagevalue;
                                
                                if (pdata[0].minute_type == 1) {
                                    var plantotalvalue = (packageprice);
                                } else {
                                    var plantotalvalue = (packageprice * userlimit);
                                }
                                if (telesmspackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
                                }
                                if (telemailpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
                                }
                                if (telemeetpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
                                }
                                if (teledigitalpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
                                }
                                if (teledigitaladspackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (teledigitaladspackagevalue));
                                }
                                if (tollfreepackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (tollfreepackagevalue))
                                }
                                if (obdpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (obdpackagevalue))
                                }


                                var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                                //var managerstatecode = mgstno.substring(0, 2);
                                var managerstatecode = req.body.accountstatecode;
                                var companystatecode = companygstno.substring(0, 2);
                                var cgst = 0;
                                var sgst = 0;
                                var igst = 0;
                                var totalgst = 0;
                                if (managerstatecode == companystatecode) {
                                    cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    totalgst = (cgst + sgst);
                                }
                                if (managerstatecode != companystatecode) {
                                    igst = Math.round(((afterdiscountvalue) * 18) / 100);
                                    totalgst = (igst);
                                }
                                var finalamount = (afterdiscountvalue + totalgst);
                                //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                                var m = new Date();
                                var accountaddress = req.body.accountaddress;
                                var packageminutes = req.body.packageminutes;
                                var packagefreeminutes = req.body.packagefreeminutes;
                                billdata = {
                                    Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno,
                                    Plan_Type: package, Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Discount_Type: discountype, Discount_Per: discountper, Plan_discount: packagediscount,
                                    Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
                                    Final_amount: finalamount, Created_By: created_by, Plan_expire_Date: expirydate, Account_Address: accountaddress, Account_State_Code: managerstatecode,
                                    SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage, Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage,
                                    Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue, plan_minuits: packageminutes, free_minuites: packagefreeminutes, SMS_Pr_No: telesmsprvalue
                                    , TFree_ID: tollfreepackage, TFree_Plan_Value: tollfreepackagevalue, OBD_ID: obdpackage, OBD_Plan_Value: obdpackagevalue,Ads_ID:teledigitaladspackage,Ads_Plan_Value:teledigitaladspackagevalue
                                }
                                Manager.updatebilldata(billdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        var trnsno = null;
                                        var promotionalno = null;
                                        var otpno = null;
                                        var mailmaxuser = null;
                                        var mailgb = null;
                                        var bulkemailno = null;
                                        var mailexpiredate = null;
                                        var meetexpiredate = null;
                                        var digitalexpiredate = null;
                                        var tollfreeno = null;
                                        var obdno = null;
                                        if (telesmspackage != null) {
                                            trnsno = req.body.transno;
                                            promotionalno = req.body.promotionalno;
                                            otpno = req.body.otpno;
                                        }
                                        if (telemailpackage != null) {
                                            mailmaxuser = req.body.mailmaxuser;
                                            mailgb = req.body.mailgb;
                                            bulkemailno = req.body.bulkmailno;
                                            var m = new Date();
                                            mailexpiredate = new Date(req.body.mailexpirydate);
                                            var newmailexpdate = mailexpiredate;
                                        }
                                        if (telemeetpackage != null) {
                                            var m = new Date();
                                            meetexpiredate = new Date(req.body.meetexpirydate);
                                            var newmeetexpdate = meetexpiredate;
                                        }
                                        if (teledigitalpackage != null) {
                                            var m = new Date();
                                            digitalexpiredate = new Date(req.body.digitalexpirydate);
                                            var newdigitalexpdate = digitalexpiredate;
                                        }
                                        if (tollfreepackage != null) {
                                            tollfreeno = req.body.tollfreeno;
                                        }
                                        if (obdpackage != null) {
                                            obdno = req.body.obdno;
                                        }

                                        var packageminutes = req.body.packageminutes;
                                        var packagefreeminutes = 0;
                                        if (req.body.packagefreeminutes != null) {
                                            var packagefreeminutes = req.body.packagefreeminutes;
                                        }
                                        var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));


                                        Manager.getaccountbalancedatabyid(managerid, function (err, brows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                if (brows.length > 0) {
                                                    //console.log("brows:::"+JSON.stringify(brows[0]));
                                                    if (req.body.telesmspackagemode == true && req.body.bestpackagemode == true) {
                                                        if (brows[0].Tele_packageid != null && packageminutes != null && brows[0].Tele_packageid == package) {
                                                            // totalpackageminutes = (Number(brows[0].Tele_Plan_Balance) + Number(totalpackageminutes));
                                                            totalpackageminutes = (Number(brows[0].Tele_Plan_Balance));
                                                        }
                                                        /*if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
                                                            trnsno = (brows[0].SMS_Tr_Balance) + (trnsno);
                                                            promotionalno = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                            otpno = (brows[0].SMS_Pr_Balance) + (otpno);
                                                        }*/
/*var promotionalbalance = null;
var promotionalused = null;
if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
    promotionalno = (brows[0].SMS_Pr_No);
    promotionalbalance = (brows[0].SMS_Pr_Balance);
    promotionalused = (brows[0].SMS_Pr_Used);
} else {
    promotionalbalance = (promotionalno);
    if (brows[0].SMS_Pr_Used > 0) {
        promotionalused = null;
    }
    promotionalno = (promotionalno);
}


var tfreebalance = null;
var tollfreeused = null;
var tfreestartdate = null;
if (req.body.tollfreepackagemode == true) {
    var tfreestartdate = new Date(req.body.tollfree_startdate)
    if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
        tfreebalance = (brows[0].TFree_User_Balance);
        tollfreeused = (brows[0].TFree_User_Used);
        tollfreeno = (brows[0].TFree_No);
    } else {
        tfreebalance = (tollfreeno);
        if (brows[0].TFree_User_Used > 0) {
            tollfreeused = null;
        }
        tollfreeno = (tollfreeno);
    }
} else {
    var tfreestartdate = null;
    tollfreepackage = (brows[0].TFree_ID);
    tfreebalance = (brows[0].TFree_User_Balance);
    tollfreeused = (brows[0].TFree_User_Used);
    tollfreeno = (brows[0].TFree_No);
}
//}
var obdbalance = null;
var obdused = null;
var obdstartdate = null;
if (req.body.obdpackagemode == true) {
    var obdstartdate = new Date(req.body.obd_startdate)
    if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
        obdbalance = (brows[0].OBD_User_Balance);
        obdused = (brows[0].OBD_User_Used);
        obdno = (brows[0].OBD_No);
    } else {
        obdbalance = (obdno);
        if (brows[0].OBD_User_Used > 0) {
            obdused = null;
        }
        obdno = (obdno);
    }
} else {
    var obdstartdate = null;
    obdpackage = (brows[0].OBD_ID);
    obdbalance = (brows[0].OBD_User_Balance);
    obdused = (brows[0].OBD_User_Used);
    obdno = (brows[0].OBD_No);
}

var adsbalance = null;
var adsused = null;
var adstartdate = null;
var adsvalue = null;
if (req.body.teledigitaladspackagemode == true) {
     adstartdate = new Date(req.body.digitalads_startdate)
    if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
        adsbalance = (brows[0].Ads_User_Balance);
        adsused = (brows[0].Ads_User_Used);
        adsvalue = (brows[0].Ads_Value);
    } else {
        adsbalance = (teledigitaladspackagevalue);
        if (brows[0].Ads_User_Used > 0) {
            adsused = null;
        }
        adsvalue = (teledigitaladspackagevalue);
    }
} else {
    var adstartdate = (brows[0].Ads_Startdate);
    teledigitaladspackage = (brows[0].Ads_ID);
    adsbalance = (brows[0].Ads_User_Balance);
    adsused = (brows[0].Ads_User_Used);
    adsvalue = (brows[0].Ads_Value);
}


var telestartdate = new Date(req.body.tele_startdate);
var mailstartdate = null;
if (telemeetpackage != null) {
    var mailstartdate = new Date(req.body.mail_startdate)
}
var meetstartdate = null;
if (telemeetpackage != null) {
    var meetstartdate = new Date(req.body.meet_startdate)
}
var digitalstartdate = null;
if (teledigitalpackage != null) {
    var digitalstartdate = new Date(req.body.digital_startdate)
}
balancedata = {
    Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
    SMS_Startdate: new Date(req.body.telesms_startdate), SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, SMS_Pr_Used: promotionalused, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_No: bulkemailno, Mail_User_Balance: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
    , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance,OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, OBD_User_Used: obdused, TFree_User_Used: tollfreeused, Tele_Plusduration: req.body.obdpulserate,
    Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance,Ads_Startdate:adstartdate
}
}
else if (req.body.bestpackagemode == true) {
if (brows[0].Tele_packageid != null && packageminutes != null && brows[0].Tele_packageid == package) {
    //totalpackageminutes = (Number(brows[0].Tele_Plan_Balance) + Number(totalpackageminutes));
    totalpackageminutes = (Number(brows[0].Tele_Plan_Balance));
}
var tfreebalance = null;
var tfreestartdate = null;
if (req.body.tollfreepackagemode == true) {
    var tfreestartdate = new Date(req.body.tollfree_startdate);
    if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
        tfreebalance = (brows[0].TFree_User_Balance);
        tollfreeused = (brows[0].TFree_User_Used);
        tollfreeno = (brows[0].TFree_No);
    } else {
        tfreebalance = (tollfreeno);
        if (brows[0].TFree_User_Used > 0) {
            tollfreeused = null;
        }
        tollfreeno = (tollfreeno);
    }
} else {
    var tfreestartdate = null;
    tollfreepackage = (brows[0].TFree_ID);
    tfreebalance = (brows[0].TFree_User_Balance);
    tollfreeused = (brows[0].TFree_User_Used);
    tollfreeno = (brows[0].TFree_No);
}
//}
var obdbalance = null;
var obdused = null;
var obdstartdate = null;
if (req.body.obdpackagemode == true) {
    var obdstartdate = new Date(req.body.obd_startdate);
    if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
        obdbalance = (brows[0].OBD_User_Balance);
        obdused = (brows[0].OBD_User_Used);
        obdno = (brows[0].OBD_No);
    } else {
        obdbalance = (obdno);
        if (brows[0].OBD_User_Used > 0) {
            obdused = null;
        }
        obdno = (obdno);
    }
} else {
    var obdstartdate = null;
    obdpackage = (brows[0].OBD_ID);
    obdbalance = (brows[0].OBD_User_Balance);
    obdused = (brows[0].OBD_User_Used);
    obdno = (brows[0].OBD_No);
}

var telestartdate = new Date(req.body.tele_startdate);
var mailstartdate = null;
if (telemeetpackage != null) {
    var mailstartdate = new Date(req.body.mail_startdate)
}
var meetstartdate = null;
if (telemeetpackage != null) {
    var meetstartdate = new Date(req.body.meet_startdate)
}
var digitalstartdate = null;
if (teledigitalpackage != null) {
    var digitalstartdate = new Date(req.body.digital_startdate)
}
var adsbalance = null;
var adsused = null;
var adstartdate = null;
var adsvalue = null;
if (req.body.teledigitaladspackagemode == true) {
     adstartdate = new Date(req.body.digitalads_startdate)
    if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
        adsbalance = (brows[0].Ads_User_Balance);
        adsused = (brows[0].Ads_User_Used);
        adsvalue = (brows[0].Ads_Value);
    } else {
        adsbalance = (teledigitaladspackagevalue);
        if (brows[0].Ads_User_Used > 0) {
            adsused = null;
        }
        adsvalue = (teledigitaladspackagevalue);
    }
} else {
    var adstartdate = (brows[0].Ads_Startdate);
    teledigitaladspackage = (brows[0].Ads_ID);
    adsbalance = (brows[0].Ads_User_Balance);
    adsused = (brows[0].Ads_User_Used);
    adsvalue = (brows[0].Ads_Value);
}


balancedata = {
    Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
    Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
    , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, OBD_User_Used: obdused, TFree_User_Used: tollfreeused
    , Tele_Plusduration: req.body.obdpulserate,Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance,Ads_Startdate:adstartdate
}
}
else {

}
Manager.updateaccountbalancedata(balancedata, function (err, rows) {
if (err) {
    console.log(err);
}
else {
    //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
}

})
} else {
var telestartdate = null;
if (package != null) {
var telestartdate = new Date(req.body.tele_startdate);
}
var tfreebalance = null;
var tfreestartdate = null;
if (req.body.tollfreepackagemode == true) {
var tfreestartdate = new Date(req.body.tollfree_startdate);                                                        
tfreebalance = (tollfreeno);                                                            
tollfreeused = null;
tollfreeno = (tollfreeno);                                                        
} 
//}
var obdbalance = null;
var obdused = null;
var obdstartdate = null;
if (req.body.obdpackagemode == true) {
var obdstartdate = new Date(req.body.obd_startdate);                                                        
obdbalance = (obdno);                                                            
obdused = null;
obdno = (obdno);
} 
var smstartdate = null;
if (telesmspackage != null) {
var smstartdate = new Date(req.body.telesms_startdate);
}
var mailstartdate = null;
if (telemailpackage != null) {
var mailstartdate = new Date(req.body.mail_startdate);
}
var meetstartdate = null;
if (telemeetpackage != null) {
var meetstartdate = new Date(req.body.meet_startdate);
}
var digitalstartdate = null;
if (teledigitalpackage != null) {
var digitalstartdate = new Date(req.body.digital_startdate);
}

var adsbalance = null;
var adsused = null;
var adstartdate = null;
var adsvalue = null;
if (req.body.teledigitaladspackagemode == true) {
adstartdate = new Date(req.body.digitalads_startdate)                                                        
adsbalance = (teledigitaladspackagevalue);
adsused = null;
adsvalue = (teledigitaladspackagevalue);                                                        
} 

balancedata = {
Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
SMS_Startdate: smstartdate, SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: telesmsprvalue, SMS_Pr_Balance: telesmsprvalue, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
, TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance,
OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfree_startdate, OBD_start_date: obdstartdate, OBD_User_Used: obdused, TFree_User_Used: tollfreeused
, Tele_Plusduration: req.body.obdpulserate,Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance,Ads_Startdate:adstartdate
}
Manager.insertaccountbalancedata(balancedata, function (err, rows) {
if (err) {
    console.log(err);
}
else {
    //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
}

})
}
//res.status(200).send({ "data": 'Manager detail updated succesfully.' });
}
});

}

})
}
})
} else {//console.log('best else');
var telesmspackage = req.body.telesmspackage;
var telesmspackagevalue = req.body.telesmspackagevalue;
var telemailpackage = req.body.telemailpackage;
var telemailpackagevalue = req.body.telemailpackagevalue;
var telemeetpackage = req.body.telemeetpackage;
var telemeetpackagevalue = req.body.telemeetpackagevalue;
var teledigitalpackage = req.body.teledigitalpackage;
var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
var tollfreepackage = req.body.tollfreepackage;
var tollfreepackagevalue = req.body.tollfreepackagevalue;
var obdpackage = req.body.obdpackage;
var obdpackagevalue = req.body.obdpackagevalue;
var teledigitaladspackage = req.body.teledigitaladspackage;
var teledigitaladspackagevalue = req.body.teledigitaladspackagevalue;
 
var plantotalvalue = 0;
if (telesmspackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
}
if (telemailpackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
}
if (telemeetpackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
}
if (teledigitalpackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
}
if (teledigitaladspackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (teledigitaladspackagevalue));
}
if (tollfreepackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (tollfreepackagevalue));
}
if (obdpackagevalue != null) {
plantotalvalue = ((plantotalvalue) + (obdpackagevalue));
}

var afterdiscountvalue = ((plantotalvalue) - packagediscount);
//var managerstatecode = mgstno.substring(0, 2);
var managerstatecode = req.body.accountstatecode;
var companystatecode = companygstno.substring(0, 2);
var cgst = 0;
var sgst = 0;
var igst = 0;
var totalgst = 0;
if (managerstatecode == companystatecode) {
cgst = Math.round(((afterdiscountvalue) * 9) / 100);
sgst = Math.round(((afterdiscountvalue) * 9) / 100);
totalgst = (cgst + sgst);
}
if (managerstatecode != companystatecode) {
igst = Math.round(((afterdiscountvalue) * 18) / 100);
totalgst = (igst);
}
var finalamount = (afterdiscountvalue + totalgst);
//console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
var m = new Date();
var accountaddress = req.body.accountaddress;
billdata = {
Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno,
Plan_user: userlimit, Plan_channel: channels, Discount_Type: discountype, Discount_Per: discountper, Plan_discount: packagediscount, Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
Final_amount: finalamount, Created_By: created_by, Account_Address: accountaddress, Account_State_Code: managerstatecode,
SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage, Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage,
Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue, SMS_Pr_No: telesmsprvalue
, TFree_ID: tollfreepackage, TFree_Plan_Value: tollfreepackagevalue,
OBD_ID: obdpackage, OBD_Plan_Value: obdpackagevalue,Ads_ID:teledigitaladspackage,Ads_Plan_Value:teledigitaladspackagevalue
}
Manager.updatebilldata(billdata, function (err, rows) {
if (err) {
console.log(err);
}
else {
var trnsno = null;
var promotionalno = null;
var otpno = null;
var mailmaxuser = null;
var mailgb = null;
var bulkemailno = null;
var mailexpiredate = null;
var meetexpiredate = null;
var digitalexpiredate = null;
var obdno = null;
var tollfreeno = null;
if (telesmspackage != null) {
trnsno = req.body.transno;
promotionalno = req.body.promotionalno;
otpno = req.body.otpno;
}
if (telemailpackage != null) {
mailmaxuser = req.body.mailmaxuser;
mailgb = req.body.mailgb;
bulkemailno = req.body.bulkmailno;
var m = new Date();
mailexpiredate = new Date(req.body.mailexpirydate);
var newmailexpdate = mailexpiredate;
}
if (telemeetpackage != null) {
var m = new Date();
meetexpiredate = new Date(req.body.meetexpirydate);
var newmeetexpdate = meetexpiredate;
}
if (teledigitalpackage != null) {
var m = new Date();
digitalexpiredate = new Date(req.body.digitalexpirydate);
var newdigitalexpdate = digitalexpiredate;
}
if (tollfreepackage != null) {
tollfreeno = req.body.tollfreeno;
}
if (obdpackage != null) {
obdno = req.body.obdno;
}

Manager.getaccountbalancedatabyid(managerid, function (err, brows) {
if (err) {
console.log(err);
}
else {
if (brows.length > 0) {

if (req.body.telesmspackagemode == true) {
/*if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
trnsno = (brows[0].SMS_Tr_Balance) + (trnsno);
promotionalno = (brows[0].SMS_Pr_Balance) + (promotionalno);
otpno = (brows[0].SMS_Pr_Balance) + (otpno);

}*/
/* var promotionalbalance = null;
 var promotionalused = null;
 if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
     promotionalno = (brows[0].SMS_Pr_No);
     promotionalbalance = (brows[0].SMS_Pr_Balance);
     promotionalused = (brows[0].SMS_Pr_Used);
 } else {
     promotionalbalance = (promotionalno);
     if (brows[0].SMS_Pr_Used > 0) {
         promotionalused = null;
     }
     promotionalno = (promotionalno);
 }
 var tfreebalance = null;
 var tfreestartdate = null;
 if (req.body.tollfreepackagemode == true) {
     var tfreestartdate = new Date(req.body.tollfree_startdate);
     if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
         tfreebalance = (brows[0].TFree_User_Balance);
         tollfreeused = (brows[0].TFree_User_Used);
         tollfreeno = (brows[0].TFree_No);
     } else {
         tfreebalance = (tollfreeno);
         if (brows[0].TFree_User_Used > 0) {
             tollfreeused = null;
         }
         tollfreeno = (tollfreeno);
     }
 } else {
     var tfreestartdate = null;
     tollfreepackage = (brows[0].TFree_ID);
     tfreebalance = (brows[0].TFree_User_Balance);
     tollfreeused = (brows[0].TFree_User_Used);
     tollfreeno = (brows[0].TFree_No);
 }
 //}
 var obdbalance = null;
 var obdused = null;
 var obdstartdate = null;
 if (req.body.obdpackagemode == true) {
     var obdstartdate = new Date(req.body.obd_startdate);
     if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
         obdbalance = (brows[0].OBD_User_Balance);
         obdused = (brows[0].OBD_User_Used);
         obdno = (brows[0].OBD_No);
     } else {
         obdbalance = (obdno);
         if (brows[0].OBD_User_Used > 0) {
             obdused = null;
         }
         obdno = (obdno);
     }
 } else {
     var obdstartdate = null;
     obdpackage = (brows[0].OBD_ID);
     obdbalance = (brows[0].OBD_User_Balance);
     obdused = (brows[0].OBD_User_Used);
     obdno = (brows[0].OBD_No);
 }
 var mailstartdate = null;
 if (telemailpackage != null) {
     var mailstartdate = new Date(req.body.mail_startdate);
 }
 var meetstartdate = null;
 if (telemeetpackage != null) {
     var meetstartdate = new Date(req.body.meet_startdate);
 }
 var digitalstartdate = null;
 if (teledigitalpackage != null) {
     var digitalstartdate = new Date(req.body.digital_startdate);
 }
 var adsbalance = null;
 var adsused = null;
 var adstartdate = null;
 if (req.body.teledigitaladspackagemode == true) {
     var adstartdate = new Date(req.body.digitalads_startdate);
     if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
         adsbalance = (brows[0].Ads_User_Balance);
         adsused = (brows[0].Ads_User_Used);
         adsvalue = (brows[0].Ads_Value);
     } else {
         adsbalance = (teledigitaladspackagevalue);
         if (brows[0].Ads_User_Used > 0) {
             adsused = null;
         }
         adsvalue = (teledigitaladspackagevalue);
     }
 } else {
     var adstartdate = (brows[0].Ads_Startdate);
     adsbalance = (brows[0].Ads_User_Balance);
     adsused = (brows[0].Ads_User_Used);
     adsvalue = (brows[0].Ads_Value);
 }
 
 balancedata = {
     Account_ID: managerid, SMS_ID: telesmspackage, SMS_Startdate: new Date(req.body.telesms_startdate), SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, SMS_Pr_Used: promotionalused, Mail_ID: telemailpackage, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_ID: telemeetpackage, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate, Digital_ID: teledigitalpackage, TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate,
     OBD_User_Used: obdused, TFree_User_Used: tollfreeused,Tele_Plusduration: req.body.obdpulserate,Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance,Ads_Startdate:adstartdate
 }
} else {
 var tfreebalance = null;
 var tfreestartdate = null;
 if (req.body.tollfreepackagemode == true) {
     var tfreestartdate = new Date(req.body.tollfree_startdate);
     if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
         tfreebalance = (brows[0].TFree_User_Balance);
         tollfreeused = (brows[0].TFree_User_Used);
         tollfreeno = (brows[0].TFree_No);
     } else {
         tfreebalance = (tollfreeno);
         if (brows[0].TFree_User_Used > 0) {
             tollfreeused = null;
         }
         tollfreeno = (tollfreeno);
     }
 } else {
     var tfreestartdate = null;
     tollfreepackage = (brows[0].TFree_ID);
     tfreebalance = (brows[0].TFree_User_Balance);
     tollfreeused = (brows[0].TFree_User_Used);
     tollfreeno = (brows[0].TFree_No);
 }
 //}
 var obdbalance = null;
 var obdused = null;
 var obdstartdate=null;
 if (req.body.obdpackagemode == true) {
     var obdstartdate = new Date(req.body.obd_startdate);
     if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
         obdbalance = (brows[0].OBD_User_Balance);
         obdused = (brows[0].OBD_User_Used);
         obdno = (brows[0].OBD_No);
     } else {
         obdbalance = (obdno);
         if (brows[0].OBD_User_Used > 0) {
             obdused = null;
         }
         obdno = (obdno);
     }
 } else {
     var obdstartdate = null;
     obdpackage = (brows[0].OBD_ID);
     obdbalance = (brows[0].OBD_User_Balance);
     obdused = (brows[0].OBD_User_Used);
     obdno = (brows[0].OBD_No);
 }
 
 var mailstartdate = null;
 if (telemailpackage != null) {
     var mailstartdate = new Date(req.body.mail_startdate);
 }
 var meetstartdate = null;
 if (telemeetpackage != null) {
     var meetstartdate = new Date(req.body.meet_startdate);
 }
 var digitalstartdate = null;
 if (teledigitalpackage != null) {
     var digitalstartdate = new Date(req.body.digital_startdate);
 }
 var smstartdate = null;
 if (telesmspackage != null) {
     var smstartdate = new Date(req.body.telesms_startdate);
 }
 var adsbalance = null;
 var adsused = null;
 var adstartdate = null;
 var adsvalue = null;
 if (req.body.teledigitaladspackagemode == true) {
     adstartdate = new Date(req.body.digitalads_startdate)
     if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
         adsbalance = (brows[0].Ads_User_Balance);
         adsused = (brows[0].Ads_User_Used);
         adsvalue = (brows[0].Ads_Value);
     } else {
         adsbalance = (teledigitaladspackagevalue);
         if (brows[0].Ads_User_Used > 0) {
             adsused = null;
         }
         adsvalue = (teledigitaladspackagevalue);
     }
 } else {
     var adstartdate = (brows[0].Ads_Startdate);
     teledigitaladspackage = (brows[0].Ads_ID);
     adsbalance = (brows[0].Ads_User_Balance);
     adsused = (brows[0].Ads_User_Used);
     adsvalue = (brows[0].Ads_Value);
 }

 balancedata = {
     Account_ID: managerid, SMS_ID: telesmspackage, SMS_Startdate:smstartdate, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
     Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
     , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, OBD_User_Used: obdused, TFree_User_Used: tollfreeused
     , Tele_Plusduration: req.body.obdpulserate,Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance,Ads_Startdate:adstartdate
 }
}

Manager.updateaccountbalancedata(balancedata, function (err, rows) {
 if (err) {
     console.log(err);
 }
 else {
     //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
 }
})
} else {
var tfreebalance = null;
var tfreestartdate = null;
if (req.body.tollfreepackagemode == true) {
 var tfreestartdate = new Date(req.body.tollfree_startdate);
 tfreebalance = (tollfreeno);                                                    
 tollfreeused = null;
 tollfreeno = (tollfreeno);
} 
//}
var obdbalance = null;
var obdused = null;
var obdstartdate = null;
if (req.body.obdpackagemode == true) {  
 var obdstartdate = new Date(req.body.obd_startdate);                                             
 obdbalance = (obdno);                                                
 obdused = null;
 obdno = (obdno);
} 
var promotionalbalance = null;
var promotionalused = null;
if (telesmspackage!=null) {                                               
 promotionalbalance = (promotionalno);                                                
 promotionalused = null;
 promotionalno = (promotionalno);
}
var mailstartdate = null;
 if (telemailpackage != null) {
     var mailstartdate = new Date(req.body.mail_startdate);
 }
 var meetstartdate = null;
 if (telemeetpackage != null) {
     var meetstartdate = new Date(req.body.meet_startdate);
 }
 var digitalstartdate = null;
 if (teledigitalpackage != null) {
     var digitalstartdate = new Date(req.body.digital_startdate);
 }
 var smstartdate = null;
 if (telesmspackage != null) {
     var smstartdate = new Date(req.body.telesms_startdate);
 }
 var adsbalance = null;
 var adsused = null;
 var adstartdate = null;
 if (req.body.teledigitaladspackagemode == true) {  
     var adstartdate = new Date(req.body.digitalads_startdate);                                             
     adsbalance = (teledigitaladspackagevalue);                                                
     adsused = null;
     adsvalue = (teledigitaladspackagevalue);
 } 

balancedata = {
 Account_ID: managerid, SMS_ID: telesmspackage, SMS_Startdate: smstartdate, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
 SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, SMS_Pr_Used: promotionalused, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
 , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, OBD_User_Used: obdused, TFree_User_Used: tollfreeused
 , Tele_Plusduration: req.body.obdpulserate,Ads_ID:teledigitaladspackage,Ads_Value:adsvalue,Ads_User_Used:adsused,Ads_User_Balance:adsbalance
}
Manager.insertaccountbalancedata(balancedata, function (err, rows) {
 if (err) {
     console.log(err);
 }
 else {
     //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
 }

})
}
//res.status(200).send({ "data": 'Manager detail updated succesfully.' });
}
});

}

})
}
}
})
res.status(200).send({ "data": 'Manager detail updated succesfully.' });
}

})
})*/

router.post('/updateErpManager', authorize, function (req, res) {
    // console.log("here i am sonali");
    // console.log(JSON.stringify(req.body));
    var erp_userid = req.body.erp_userid;
    var erp_username = req.body.erp_username;
    var erp_password = req.body.erp_password;
    var id = req.body.id;

    var fdata = { erp_userid: erp_userid, erp_username: erp_username, erp_password: erp_password, account_id: id };
    Manager.updatemanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send({ "data": 'Manager created successfully !!' });
        }
    });

})

router.get('/deleteManager/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    return res.status(200).send({ "data": "" });
    // Manager.getagentdetail(req.params.id, function (err, rows) {
    //     if (err) {
    //         console.log(err);
    //         res.status(200).send({ "data": 'No Agent found!' });
    //     }
    //     else {
    //         var row = rows[0]
    //         var agentname = row.account_name
    //         Manager.deletemanager(req.params.id, function (err, rows) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 var result = "";
    //                 var client = ldap.createClient({
    //                     url: [process.env.LDAPURL, process.env.LDAPURL]
    //                 });
    //                 client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function (err) {
    //                     if (err) {
    //                         result += "Reader bind failed " + err;
    //                         res.status(200).send({ "data": err });
    //                         return;
    //                     }
    //                     client.del('mail=' + agentname + '@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', function (err) {
    //                         if (err) {
    //                             res.status(200).send({ "data": err });
    //                             return;
    //                         } else {
    //                             res.status(200).send({ "data": 'Manager detail deleted succesfully.' });
    //                         }
    //                     });
    //                 })
    //                 //res.status(200).send({ "data": 'Manager detail deleted successfully' });
    //             }
    //         })
    //     }
    // })
})
router.get('/getManagerChannels/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getmanagerchannels(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getAssignChannel/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getassignChannel(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveManagerChannel', authorize, function (req, res) {
    // console.log(req.body.userid);
    for (var i = 0; i < req.body.channelForm.length; i++) {
        var m = new Date();
        c_data = { did: req.body.channelForm[i], account_id: req.body.userid, active: 0, assginDate: m, unassignDate: m };
        Manager.savemanagerchannel(c_data, function (err, count) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.status(200).send({ "data": 'Channel assigned succesfully.' });
})
router.post('/changeStatus', authorize, function (req, res) {
    //console.log(req.body);
    var status = req.body.status;
    if (status == 1) {
        var active = 0;
    }
    if (status == 0) {
        var active = 1;
    }
    var id = req.body.id;
    fdata = { id: id, active: active };
    Manager.updateassignchannelstatus(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'status updated succesfully.' });
        }

    })
})
// get sound data
router.get('/getsounddata', authorize, function (req, res) {
    Manager.getsounddata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//pending data
router.get('/Pendingsounddata', authorize, function (req, res) {
    Manager.Pendingsounddata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//get sound approve status
router.get('/getsoundapprovestatus/:id', authorize, function (req, res) {
    Manager.getsoundapprovestatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/savesoundstatus', authorize, function (req, res) {
    //console.log(req.body);
    var id = req.body.id;
    // var approved_by = req.body.approved_by;
    var m = new Date()
    var status = req.body.status;
    var note = req.body.note;
    if (status == 1) {
        fdata = {
            id: id,
            approved_date: m, status: status, note: note, updateDate: m
        };
        // console.log(fdata);
        Manager.savesoundstatus(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.body.status == 1) {
                    Setting.getEmailSMSConfiguration('sound approval',async function (err, configdata) {
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
                                var toemailid = await Manager.getSoundUserEmailid(req.body.id);
                                toemail = toemailid;
                                // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                verifier.verify(toemailid, function (err, info) {
                                    if (err) console.log(err);
                                    else {
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
                                            }
                                        })
                                    }
                                })                                
                            }
                        }
                    })
                }

                res.status(200).send({ "data": 'status successfully...' });
            }
        })
    }
    else {
        fdata = { id: id, status: status, note: note, updateDate: m };
        //console.log(fdata);
        Manager.savesoundstatus(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": 'status successfully...' });
            }
        })

    }
})
//DELETE Assign Channel
router.get('/deleteAssignChannel/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.deleteassignchannel(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Assigned Channel deleted successfully' });
        }
    })
})
router.post('/updateManagerService', authorize, function (req, res) {
    //console.log(req.body);
    var userid = req.body.userid;
    var ip = req.body.ip;
    var data = [];
    if (req.body.ivr) {
        data.push('0');
    }
    if (req.body.misscall) {
        data.push('1');
    }
    if (req.body.conference) {
        data.push('2');
    }
    if (req.body.dialer) {
        data.push('3');
    }
    if (req.body.clicktocall) {
        data.push('4');
    }
    if (req.body.campaigns) {
        data.push('5');
    }
    if (req.body.progressivedialer) {
        data.push('6');
    }
    if (req.body.bulksms) {
        data.push('7');
    }
    if (req.body.dialpad) {
        data.push('8');
    }
    if (req.body.obd) {
        data.push('9');
    }
    if (req.body.zoho) {
        data.push('10');
    }
    if (req.body.lms) {
        data.push('11');
    }
    if (req.body.voicemail) {
        data.push('12');
    }
    if (req.body.sms) {
        data.push('13');
    }
    if (req.body.email) {
        data.push('14');
    }
    if (req.body.chat) {
        data.push('15');
    }
    if (req.body.digital) {
        data.push('16');
    }
    if (req.body.media_libaray) {
        data.push('17');
    }
    if (req.body.custom_api) {
        data.push('18');
    }
    if (req.body.did_routing) {
        data.push('19');
    }
    fdata = { account_id: userid, services: JSON.stringify(data) };
    Manager.updatemanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // const insterdata = {
            //     account_id: userid, action: "Update Module Access televocie ",action_date:new Date(),ip:ip
            // }
            // Manager.insertupdatemangerdata(insterdata, function (err, rows) {
            //     if (err) {}
            //     else{

            //     }
            // })


            res.status(200).send({ "data": 'Manager Service updated succesfully.' });
        }
    })
})
//check duplicate Manager mobile no
router.post('/checkmanagermobile', function (req, res) {
    Manager.findManagerMobile(req.body.check, function (err, rows) {
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
//check duplicate Manager mobile no
router.post('/checkmanagereditmobile', function (req, res) {
    Manager.findManagerEditMobile(req.body.check, req.body.id, function (err, rows) {
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



router.get('/getexpire/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.getexpire(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/expire/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.expire(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//renew manager package data and insert bill data
router.post('/renewManagerPackage', authorize, async function (req, res) {
    //console.log(req.body);
    var adminid = req.body.adminid;
    var userlimit = req.body.userlimit;
    var incoming_channel = req.body.userlimit;
    var outgoing_channel = req.body.userlimit;
    var channels = req.body.channels;
    var package = req.body.package;
    var expirydate = new Date(req.body.expirydate);
    var created_by = req.body.created_by;
    var m = new Date();
    var packageprice = 0;
    var services = JSON.stringify(req.body.services);
    var accountaddress = req.body.accountaddress;
    var totalrenew = ++(req.body.totalrenew);
    var ip = req.body.ip;
    var telesmsprvalue = req.body.telesmsprvalue;
    var userfairminutelimit = await helper.CheckAdminSetting('user_fair_minute_limit')
    var unlimitedminute = Number(userfairminutelimit) * userlimit
    if (req.body.bestpackagemode == true) {
        Admin.getpackagedetail(package, function (err, pdata) {
            if (err) {
                console.log(err);
            }
            else {
                var newexpdate = expirydate;
                const fdata = {
                    account_id: adminid, last_modify_by: created_by, last_modify_date: m, expiry_date: newexpdate,
                    channels: channels, user_limit: userlimit, incoming_channel: incoming_channel, outgoing_channel: outgoing_channel,
                    package_id: package, services: services, total_renew: totalrenew
                };
                Manager.updatemanager(fdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var managerid = adminid;
                        Manager.getlastbillid(0, function (err, bdata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (bdata.length > 0) {
                                    var billid = bdata[0].Bill_ID;
                                    var a = Number(billid.replace(/^\D+/g, ''));
                                    a = a + 1;
                                    billid = numeral(a).format('000000000000000');
                                    billid = 'TEL' + billid;
                                } else {
                                    var billid = 'TEL000000000000001';
                                }

                                var mgstno = req.body.mgstno;
                                var companygstno = req.body.companygstno;
                                var discountype = req.body.discountype;
                                var discountper = null;
                                if (discountype == 0) {
                                    var discountper = req.body.discountper;
                                }
                                if (req.body.packagediscount) {
                                    var packagediscount = req.body.packagediscount;
                                } else {
                                    var packagediscount = 0;
                                }
                                packageprice = pdata[0].package_price;
                                if (pdata[0].minute_type == 1) {
                                    var plantotalvalue = (packageprice);
                                } else {
                                    var plantotalvalue = (packageprice * userlimit);
                                }

                                var telesmspackage = null;
                                var telesmspackagevalue = null;
                                var telemailpackage = null;
                                var telemailpackagevalue = null;
                                var telemeetpackage = null;
                                var telemeetpackagevalue = null;
                                var teledigitalpackage = null;
                                var teledigitalpackagevalue = null;
                                var tollfreepackage = null;
                                var tollfreepackagevalue = null;
                                if (req.body.telesmspackagemode == true) {
                                    var telesmspackage = req.body.telesmspackage;
                                    var telesmspackagevalue = req.body.telesmspackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
                                }
                                if (req.body.telemailpackagemode == true) {
                                    var telemailpackage = req.body.telemailpackage;
                                    var telemailpackagevalue = req.body.telemailpackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
                                }
                                if (req.body.telemeetpackagemode == true) {
                                    var telemeetpackage = req.body.telemeetpackage;
                                    var telemeetpackagevalue = req.body.telemeetpackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
                                }
                                if (req.body.teledigitalpackagemode == true) {
                                    var teledigitalpackage = req.body.teledigitalpackage;
                                    var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
                                }
                                if (req.body.teledigitaladspackagemode == true) {
                                    var teledigitaladspackage = req.body.teledigitaladspackage;
                                    var teledigitaladspackagevalue = req.body.teledigitaladspackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (teledigitaladspackagevalue));
                                }
                                if (req.body.tollfreepackagemode == true) {
                                    var tollfreepackage = req.body.tollfreepackage;
                                    var tollfreepackagevalue = req.body.tollfreepackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (tollfreepackagevalue));
                                }
                                if (req.body.obdpackagemode == true) {
                                    var obdpackage = req.body.obdpackage;
                                    var obdpackagevalue = req.body.obdpackagevalue;
                                    plantotalvalue = ((plantotalvalue) + (obdpackagevalue));
                                }

                                var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                                //var managerstatecode = mgstno.substring(0, 2);
                                var managerstatecode = req.body.accountstatecode;
                                var companystatecode = companygstno.substring(0, 2);
                                var cgst = 0;
                                var sgst = 0;
                                var igst = 0;
                                var totalgst = 0;
                                if (managerstatecode == companystatecode) {
                                    cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    totalgst = (cgst + sgst);
                                }
                                if (managerstatecode != companystatecode) {
                                    igst = Math.round(((afterdiscountvalue) * 18) / 100);
                                    totalgst = (igst);
                                }
                                var finalamount = (afterdiscountvalue + totalgst);
                                //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                                var m = new Date();

                                Manager.getuserlastbilldata(managerid, function (err, userbdata) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        if (userbdata.length > 0) {
                                            var previousplan = userbdata[0].Plan_Type;
                                            var previousplanexpiry = new Date(userbdata[0].Plan_expire_Date);
                                        } else {
                                            var previousplan = null;
                                            var previousplanexpiry = null;
                                        }
                                        var packageminutes = req.body.packageminutes;
                                        var packagefreeminutes = req.body.packagefreeminutes;

                                        var billdata = {
                                            Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno, Bill_Type: 'renew',
                                            Plan_Type: package, Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Plan_discount: packagediscount, Discount_Type: discountype, Discount_Per: discountper,
                                            Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
                                            Final_amount: finalamount, Created_By: created_by, Plan_expire_Date: newexpdate, Previous_expire_date: previousplanexpiry, Previous_plan: previousplan
                                            , Account_Address: accountaddress, Account_State_Code: managerstatecode, SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage, Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage,
                                            Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue, Ads_ID: teledigitaladspackage, Ads_Plan_Value: teledigitaladspackagevalue, plan_minuits: packageminutes, free_minuites: packagefreeminutes, SMS_Pr_No: telesmsprvalue,
                                            TFree_ID: tollfreepackage, TFree_Plan_Value: tollfreepackagevalue, OBD_ID: obdpackage, OBD_Plan_Value: obdpackagevalue
                                        }
                                        Manager.insertbilldata(billdata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                var trnsno = null;
                                                var promotionalno = null;
                                                var otpno = null;
                                                var mailmaxuser = null;
                                                var mailgb = null;
                                                var bulkemailno = null;
                                                var mailexpiredate = null;
                                                var meetexpiredate = null;
                                                var digitalexpiredate = null;
                                                var obdno = null;
                                                var tollfreeno = null;
                                                var adsvalue = null;
                                                var telesmspackage = req.body.telesmspackage;
                                                var telesmspackagevalue = req.body.telesmspackagevalue;
                                                var telemailpackage = req.body.telemailpackage;
                                                var telemailpackagevalue = req.body.telemailpackagevalue;
                                                var telemeetpackage = req.body.telemeetpackage;
                                                var telemeetpackagevalue = req.body.telemeetpackagevalue;
                                                var teledigitalpackage = req.body.teledigitalpackage;
                                                var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                                                var teledigitaladspackage = req.body.teledigitaladspackage;
                                                var tollfreepackage = req.body.tollfreepackage;
                                                var obdpackage = req.body.obdpackage;

                                                if (telesmspackage != null) {
                                                    trnsno = req.body.transno;
                                                    promotionalno = req.body.promotionalno;
                                                    otpno = req.body.otpno;
                                                }
                                                if (telemailpackage != null) {
                                                    mailmaxuser = req.body.mailmaxuser;
                                                    mailgb = req.body.mailgb;
                                                    bulkemailno = req.body.bulkmailno;
                                                    mailexpiredate = new Date(req.body.mailexpirydate);
                                                }
                                                if (telemeetpackage != null) {
                                                    meetexpiredate = new Date(req.body.meetexpirydate);
                                                }
                                                if (teledigitalpackage != null) {
                                                    digitalexpiredate = new Date(req.body.digitalexpirydate);
                                                }
                                                var adstartdate = null;
                                                if (teledigitaladspackage != null) {
                                                    var adstartdate = new Date(req.body.digitalads_startdate);
                                                }
                                                if (tollfreepackage != null) {
                                                    tollfreeno = req.body.tollfreeno;
                                                }
                                                if (obdpackage != null) {
                                                    obdno = req.body.obdno;
                                                }
                                                var totalpackageminutes = 0;
                                                var packageminutes = req.body.packageminutes > 0 ? req.body.packageminutes : unlimitedminute;
                                                //console.log('packageminutes', packageminutes)
                                                var packagefreeminutes = 0;
                                                if (req.body.packagefreeminutes != null) {
                                                    var packagefreeminutes = req.body.packagefreeminutes;
                                                    // var totalpackageminutes = ((packageminutes) + parseFloat(packagefreeminutes));
                                                }
                                                if (req.body.packageminutes != null) {
                                                    var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));
                                                } else {
                                                    var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));
                                                }
                                                //console.log(totalpackageminutes)
                                                Manager.getaccountbalancedatabyid(managerid, function (err, brows) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        if (brows.length > 0) {
                                                            var mailstartdate = brows[0].Mail_Startdate;
                                                            if (telemailpackage != null) {
                                                                var mailstartdate = new Date(req.body.mail_startdate);
                                                                mailmaxuser = req.body.mailmaxuser;
                                                                mailgb = req.body.mailgb;
                                                                bulkemailno = req.body.bulkmailno;
                                                                var m = new Date();
                                                                mailexpiredate = new Date(req.body.mailexpirydate);
                                                                var newmailexpdate = mailexpiredate;
                                                                if (brows[0].Mail_ID != null && req.body.telemailpackagemode == true) {
                                                                }

                                                            }
                                                            var meetstartdate = brows[0].Meet_Startdate;
                                                            if (telemeetpackage != null) {
                                                                var meetstartdate = new Date(req.body.meet_startdate);
                                                                var m = new Date();
                                                                meetexpiredate = new Date(req.body.meetexpirydate);
                                                                var newmeetexpdate = meetexpiredate;
                                                                if (brows[0].Meet_ID != null && req.body.telemeetpackagemode == true) {

                                                                }
                                                            }
                                                            var digitalstartdate = brows[0].Digital_Startdate;
                                                            if (teledigitalpackage != null) {
                                                                var digitalstartdate = new Date(req.body.digital_startdate);
                                                                var m = new Date();
                                                                digitalexpiredate = new Date(req.body.digitalexpirydate);
                                                                var newdigitalexpdate = digitalexpiredate;
                                                                if (brows[0].Digital_ID != null && req.body.teledigitalpackagemode == true) {

                                                                }
                                                            }
                                                            var packageminutesbalance = Number(brows[0].Tele_Plan_Balance);
                                                            if (req.body.telesmspackagemode == true && req.body.bestpackagemode == true) {
                                                                if (brows[0].Tele_packageid != null && packageminutes != null && brows[0].Tele_packageid == package) {
                                                                    totalpackageminutes = (Number(totalpackageminutes));
                                                                    packageminutesbalance = Number(totalpackageminutes);
                                                                    //totalpackageminutes = (Number(brows[0].Tele_Plan_Balance) + Number(totalpackageminutes))
                                                                }
                                                                if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
                                                                    //trnsno = (brows[0].SMS_Tr_Balance) + (trnsno);
                                                                    promotionalbalance = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                                    promotionalno = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                                    promotionalused = 0;
                                                                    //otpno = (brows[0].SMS_Pr_Balance) + (otpno);
                                                                } else {
                                                                    promotionalno = (promotionalno);
                                                                    if (brows[0].SMS_Pr_Used > 0) {
                                                                        promotionalused = null;
                                                                    }
                                                                    promotionalbalance = (promotionalno);
                                                                }

                                                                var mailbalance = null;

                                                                if (req.body.telemailpackagemode == true && brows[0].Mail_ID != null && brows[0].Mail_ID == req.body.telemailpackage) {

                                                                    bulkemailno = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                    mailbalance = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                } else {
                                                                    bulkemailno = (brows[0].Mail_No);
                                                                    mailbalance = (brows[0].Mail_User_Balance);
                                                                }
                                                                //if (req.body.telesmspackagemode == true){
                                                                var tfreebalance = null;
                                                                var tfreestartdate = brows[0].TFree_Startdate;
                                                                if (req.body.tollfreepackagemode == true) {
                                                                    var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                                    if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
                                                                        tfreebalance = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                        tollfreeused = 0;
                                                                        tollfreeno = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                    } else {
                                                                        tfreebalance = (tollfreeno);
                                                                        if (brows[0].TFree_User_Used > 0) {
                                                                            tollfreeused = null;
                                                                        }
                                                                        tollfreeno = (tollfreeno);
                                                                    }
                                                                } else {
                                                                    var tfreestartdate = brows[0].TFree_Startdate;
                                                                    tollfreepackage = (brows[0].TFree_ID);
                                                                    tfreebalance = (brows[0].TFree_User_Balance);
                                                                    tollfreeused = (brows[0].TFree_User_Used);
                                                                    tollfreeno = (brows[0].TFree_No);
                                                                }
                                                                //}
                                                                var obdbalance = null;
                                                                var obdused = null;
                                                                var obdstartdate = brows[0].OBD_start_date;
                                                                if (req.body.obdpackagemode == true) {
                                                                    var obdstartdate = new Date(req.body.obd_startdate);
                                                                    if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
                                                                        obdbalance = (brows[0].OBD_User_Balance) + (obdno);
                                                                        obdused = 0;
                                                                        obdno = (brows[0].OBD_User_Balance) + (obdno);
                                                                    } else {
                                                                        obdbalance = (obdno);
                                                                        if (brows[0].OBD_User_Used > 0) {
                                                                            obdused = null;
                                                                        }
                                                                        obdno = (obdno);
                                                                    }
                                                                } else {
                                                                    var obdstartdate = brows[0].OBD_start_date;
                                                                    obdpackage = (brows[0].OBD_ID);
                                                                    obdbalance = (brows[0].OBD_User_Balance);
                                                                    obdused = (brows[0].OBD_User_Used);
                                                                    obdno = (brows[0].OBD_No);
                                                                }

                                                                var adsbalance = null;
                                                                var adstartdate = brows[0].Ads_Startdate;
                                                                if (req.body.teledigitaladspackagemode == true) {
                                                                    var adstartdate = new Date(req.body.digitalads_startdate);
                                                                    if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
                                                                        adsbalance = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                        adsused = 0;
                                                                        teledigitaladspackagevalue = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                    } else {
                                                                        adsbalance = (teledigitaladspackagevalue);
                                                                        if (brows[0].Ads_User_Used > 0) {
                                                                            Adsused = null;
                                                                        }
                                                                        teledigitaladspackagevalue = (teledigitaladspackagevalue);
                                                                    }
                                                                } else {
                                                                    var adstartdate = brows[0].Ads_Startdate;
                                                                    teledigitaladspackage = (brows[0].Ads_ID);
                                                                    adsbalance = (brows[0].Ads_User_Balance);
                                                                    adsused = (brows[0].Ads_User_Used);
                                                                    teledigitaladspackagevalue = (brows[0].Ads_Value);
                                                                }



                                                                var telestartdate = new Date(req.body.tele_startdate);
                                                                var balancedata = {
                                                                    Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: packageminutesbalance, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                                    SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, Max_User_No: mailmaxuser, Mail_User_Balance: mailbalance, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate,
                                                                    TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, TFree_User_Used: tollfreeused, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, OBD_User_Used: obdused, SMS_Startdate: new Date(req.body.telesms_startdate), TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate,
                                                                    Ads_ID: teledigitaladspackage, Ads_Value: teledigitaladspackagevalue, Ads_User_Used: adsused, Ads_User_Balance: adsbalance, Ads_Startdate: adstartdate
                                                                }
                                                                //console.log('balancedata',balancedata)
                                                            }
                                                            else if (req.body.bestpackagemode == true) {
                                                                // console.log("best");
                                                                var packageminutesbalance = Number(brows[0].Tele_Plan_Balance);
                                                                if (brows[0].Tele_packageid != null && packageminutes != null && brows[0].Tele_packageid == package) {
                                                                    totalpackageminutes = (Number(totalpackageminutes));
                                                                    packageminutesbalance = Number(totalpackageminutes);
                                                                    //totalpackageminutes = (Number(brows[0].Tele_Plan_Balance) + Number(totalpackageminutes));

                                                                }
                                                                var mailbalance = null;
                                                                if (req.body.telemailpackagemode == true && brows[0].Mail_ID != null && brows[0].Mail_ID == req.body.telemailpackage) {
                                                                    bulkemailno = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                    mailbalance = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                } else {
                                                                    bulkemailno = (brows[0].Mail_No);
                                                                    mailbalance = (brows[0].Mail_User_Balance);
                                                                }

                                                                var tfreebalance = null;
                                                                var tfreestartdate = brows[0].TFree_Startdate;
                                                                if (req.body.tollfreepackagemode == true) { //console.log("tollmode");
                                                                    var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                                    if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
                                                                        tfreebalance = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                        tollfreeused = 0;
                                                                        tollfreeno = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                        //console.log("toll if in");
                                                                    } else {
                                                                        // console.log("toll else in");
                                                                        tfreebalance = (tollfreeno);
                                                                        if (brows[0].TFree_User_Used > 0) {
                                                                            tollfreeused = null;
                                                                        }
                                                                        tollfreeno = (tollfreeno);
                                                                    }
                                                                } else {
                                                                    // console.log("tollmode else");
                                                                    var tfreestartdate = brows[0].TFree_Startdate;
                                                                    tollfreepackage = (brows[0].TFree_ID);
                                                                    tfreebalance = (brows[0].TFree_User_Balance);
                                                                    tollfreeused = (brows[0].TFree_User_Used);
                                                                    tollfreeno = (brows[0].TFree_No);
                                                                }
                                                                //}
                                                                var obdbalance = null;
                                                                var obdused = null;
                                                                var obdstartdate = brows[0].OBD_start_date;
                                                                if (req.body.obdpackagemode == true) {
                                                                    var obdstartdate = new Date(req.body.obd_startdate);
                                                                    if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
                                                                        obdbalance = (brows[0].OBD_User_Balance) + (obdno);
                                                                        obdused = 0;
                                                                        obdno = (brows[0].OBD_User_Balance) + (obdno);
                                                                    } else {
                                                                        //console.log("obd else in");
                                                                        obdbalance = (obdno);
                                                                        if (brows[0].OBD_User_Used > 0) {
                                                                            obdused = null;
                                                                        }
                                                                        obdno = (obdno);
                                                                    }
                                                                } else {
                                                                    // console.log("obdmode else");
                                                                    var obdstartdate = brows[0].OBD_start_date;
                                                                    obdpackage = (brows[0].OBD_ID);
                                                                    obdbalance = (brows[0].OBD_User_Balance);
                                                                    obdused = (brows[0].OBD_User_Used);
                                                                    obdno = (brows[0].OBD_No);
                                                                }
                                                                var adsbalance = null;
                                                                var adstartdate = brows[0].Ads_Startdate;
                                                                if (req.body.teledigitaladspackagemode == true) {
                                                                    var adstartdate = new Date(req.body.digitalads_startdate);
                                                                    if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
                                                                        adsbalance = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                        adsused = 0;
                                                                        teledigitaladspackagevalue = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                    } else {
                                                                        adsbalance = (teledigitaladspackagevalue);
                                                                        if (brows[0].Ads_User_Used > 0) {
                                                                            Adsused = null;
                                                                        }
                                                                        teledigitaladspackagevalue = (teledigitaladspackagevalue);
                                                                    }
                                                                } else {
                                                                    var adstartdate = brows[0].Ads_Startdate;
                                                                    teledigitaladspackage = (brows[0].Ads_ID);
                                                                    adsbalance = (brows[0].Ads_User_Balance);
                                                                    adsused = (brows[0].Ads_User_Used);
                                                                    teledigitaladspackagevalue = (brows[0].Ads_Value);
                                                                }
                                                                var telestartdate = new Date(req.body.tele_startdate);
                                                                var balancedata = {
                                                                    Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: packageminutesbalance, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                                    Max_User_No: mailmaxuser, Mail_User_Balance: mailbalance, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate,
                                                                    TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, TFree_User_Used: tollfreeused, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, OBD_User_Used: obdused, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate,
                                                                    Ads_ID: teledigitaladspackage, Ads_Value: teledigitaladspackagevalue, Ads_User_Used: adsused, Ads_User_Balance: adsbalance, Ads_Startdate: adstartdate
                                                                }
                                                            }
                                                            else {
                                                                //console.log("else");
                                                                if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
                                                                    //trnsno = (brows[0].SMS_Tr_Balance) + (trnsno);
                                                                    // promotionalno = (promotionalno) ;
                                                                    promotionalused = 0;
                                                                    promotionalbalance = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                                    promotionalno = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                                    //otpno = (brows[0].SMS_Pr_Balance) + (otpno);
                                                                } else {
                                                                    promotionalno = (promotionalno);
                                                                    if (brows[0].SMS_Pr_Used > 0) {
                                                                        promotionalused = null;
                                                                    }
                                                                    promotionalbalance = (promotionalno);
                                                                }

                                                                var mailbalance = null;
                                                                //console.log("hiiiiiii");
                                                                if (req.body.telemailpackagemode == true && brows[0].Mail_ID != null && brows[0].Mail_ID == req.body.telemailpackage) {
                                                                    bulkemailno = (brows[0].Mail_User_Balance) + (bulkemailno);
                                                                    mailbalance = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                } else {
                                                                    bulkemailno = (brows[0].Mail_No);
                                                                    mailbalance = (brows[0].Mail_User_Balance);
                                                                }
                                                                //console.log(bulkemailno+"hiiiiiii"+mailbalance);

                                                                var tfreebalance = null;
                                                                var tfreestartdate = brows[0].TFree_Startdate;
                                                                if (req.body.tollfreepackagemode == true) {
                                                                    var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                                    if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
                                                                        tfreebalance = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                        tollfreeused = 0;
                                                                        tollfreeno = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                    } else {
                                                                        tfreebalance = (tollfreeno);
                                                                        if (brows[0].TFree_User_Used > 0) {
                                                                            tollfreeused = null;
                                                                        }
                                                                        tollfreeno = (tollfreeno);
                                                                    }
                                                                } else {
                                                                    var tfreestartdate = brows[0].TFree_Startdate;
                                                                    tollfreepackage = (brows[0].TFree_ID);
                                                                    tfreebalance = (brows[0].TFree_User_Balance);
                                                                    tollfreeused = (brows[0].TFree_User_Used);
                                                                    tollfreeno = (brows[0].TFree_No);
                                                                }
                                                                //}
                                                                var obdbalance = null;
                                                                var obdused = null;
                                                                var obdstartdate = brows[0].OBD_start_date;
                                                                if (req.body.obdpackagemode == true) {
                                                                    var obdstartdate = new Date(req.body.obd_startdate);
                                                                    if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
                                                                        obdbalance = (brows[0].OBD_User_Balance) + (obdno);
                                                                        obdused = (brows[0].OBD_User_Used);
                                                                        obdno = (brows[0].OBD_User_Balance) + (obdno);
                                                                    } else {
                                                                        obdbalance = (obdno);
                                                                        if (brows[0].OBD_User_Used > 0) {
                                                                            obdused = null;
                                                                        }
                                                                        obdno = (obdno);
                                                                    }
                                                                } else {
                                                                    var obdstartdate = brows[0].OBD_start_date;
                                                                    obdpackage = (brows[0].OBD_ID);
                                                                    obdbalance = (brows[0].OBD_User_Balance);
                                                                    obdused = (brows[0].OBD_User_Used);
                                                                    obdno = (brows[0].OBD_No);
                                                                }
                                                                var adsbalance = null;
                                                                var adstartdate = brows[0].Ads_Startdate;
                                                                if (req.body.teledigitaladspackagemode == true) {
                                                                    var adstartdate = new Date(req.body.digitalads_startdate);
                                                                    if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
                                                                        adsbalance = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                        adsused = 0;
                                                                        teledigitaladspackagevalue = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                    } else {
                                                                        adsbalance = (teledigitaladspackagevalue);
                                                                        if (brows[0].Ads_User_Used > 0) {
                                                                            Adsused = null;
                                                                        }
                                                                        teledigitaladspackagevalue = (teledigitaladspackagevalue);
                                                                    }
                                                                } else {
                                                                    var adstartdate = brows[0].Ads_Startdate;
                                                                    teledigitaladspackage = (brows[0].Ads_ID);
                                                                    adsbalance = (brows[0].Ads_User_Balance);
                                                                    adsused = (brows[0].Ads_User_Used);
                                                                    teledigitaladspackagevalue = (brows[0].Ads_Value);
                                                                }
                                                                var telestartdate = brow[0].Tele_Startdate;;
                                                                var packageminutesbalance = brow[0].Tele_Plan_Balance;
                                                                var balancedata = {
                                                                    Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                                    SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_User_Balance: mailbalance, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate,
                                                                    TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tfreebalance, TFree_User_Used: tollfreeused, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, OBD_User_Used: obdused, SMS_Startdate: new Date(req.body.telesms_startdate), TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate,
                                                                    Ads_ID: teledigitaladspackage, Ads_Value: teledigitaladspackagevalue, Ads_User_Used: adsused, Ads_User_Balance: adsbalance, Ads_Startdate: adstartdate
                                                                }
                                                            }

                                                            Manager.updateaccountbalancedata(balancedata, function (err, rows) {
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                else {
                                                                    //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                                }

                                                            })
                                                        } else {
                                                            var smstartdate = null;
                                                            if (telesmspackage != null) {
                                                                trnsno = req.body.transno;
                                                                promotionalno = req.body.promotionalno;
                                                                otpno = req.body.otpno;
                                                                var smstartdate = new Date(req.body.telesms_startdate);
                                                            }
                                                            var mailstartdate = null;
                                                            if (telemailpackage != null) {
                                                                mailmaxuser = req.body.mailmaxuser;
                                                                mailgb = req.body.mailgb;
                                                                bulkemailno = req.body.bulkmailno;
                                                                var m = new Date();
                                                                mailexpiredate = new Date(req.body.mailexpirydate);
                                                                var newmailexpdate = mailexpiredate;
                                                                var mailstartdate = new Date(req.body.mail_startdate);
                                                                /*if (req.body.mailvalidity == 0) {
                                                                    if (mailexpiredate.getTime() < m.getTime()) {
                                                                        var newmailexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                    }
                                                                    if (mailexpiredate.getTime() > m.getTime()) {
                                                                        var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 1));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                    }
                                                                }
                                                                if (req.body.mailvalidity == 1) {
                                                                    if (mailexpiredate.getTime() < m.getTime()) {
                                                                        var newmailexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (mailexpiredate.getTime() > m.getTime()) {
                                                                        var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 12));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.mailvalidity == 2) {
                                                                    if (mailexpiredate.getTime() < m.getTime()) {
                                                                        var newmailexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (mailexpiredate.getTime() > m.getTime()) {
                                                                        var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 3));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.mailvalidity == 3) {
                                                                    if (mailexpiredate.getTime() < m.getTime()) {
                                                                        var newmailexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (mailexpiredate.getTime() > m.getTime()) {
                                                                        var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 6));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }*/

                                                            }
                                                            var meetstartdate = null;
                                                            if (telemeetpackage != null) {
                                                                var m = new Date();
                                                                meetexpiredate = new Date(req.body.meetexpirydate);
                                                                var newmeetexpdate = meetexpiredate;
                                                                var meetstartdate = new Date(req.body.meet_startdate);
                                                                /*if (req.body.meetvalidity == 0) {
                                                                    if (meetexpiredate.getTime() < m.getTime()) {
                                                                        var newmeetexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                    }
                                                                    if (meetexpiredate.getTime() > m.getTime()) {
                                                                        var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 1));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                    }
                                                                }
                                                                if (req.body.meetvalidity == 1) {
                                                                    if (meetexpiredate.getTime() < m.getTime()) {
                                                                        var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (meetexpiredate.getTime() > m.getTime()) {
                                                                        var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 12));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.meetvalidity == 2) {
                                                                    if (meetexpiredate.getTime() < m.getTime()) {
                                                                        var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (meetexpiredate.getTime() > m.getTime()) {
                                                                        var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 3));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.meetvalidity == 3) {
                                                                    if (meetexpiredate.getTime() < m.getTime()) {
                                                                        var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (meetexpiredate.getTime() > m.getTime()) {
                                                                        var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 6));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }*/

                                                            }
                                                            var digitalstartdate = null;
                                                            if (teledigitalpackage != null) {
                                                                var m = new Date();
                                                                digitalexpiredate = new Date(req.body.digitalexpirydate);
                                                                var newdigitalexpdate = digitalexpiredate;
                                                                var digitalstartdate = new Date(req.body.digital_startdate);
                                                                /*if (req.body.digitalvalidity == 0) {
                                                                    if (digitalexpiredate.getTime() < m.getTime()) {
                                                                        var newdigitalexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                    }
                                                                    if (digitalexpiredate.getTime() > m.getTime()) {
                                                                        var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 1));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                    }
                                                                }
                                                                if (req.body.digitalvalidity == 1) {
                                                                    if (digitalexpiredate.getTime() < m.getTime()) {
                                                                        var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (digitalexpiredate.getTime() > m.getTime()) {
                                                                        var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 12));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.digitalvalidity == 2) {
                                                                    if (digitalexpiredate.getTime() < m.getTime()) {
                                                                        var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (digitalexpiredate.getTime() > m.getTime()) {
                                                                        var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 3));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }
                                                                if (req.body.digitalvalidity == 3) {
                                                                    if (digitalexpiredate.getTime() < m.getTime()) {
                                                                        var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                        //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                    }
                                                                    if (digitalexpiredate.getTime() > m.getTime()) {
                                                                        var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 6));
                                                                        //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                    }
                                                                }*/
                                                            }
                                                            var tfreestartdate = null;
                                                            if (tollfreepackage != null) {
                                                                tollfreeno = req.body.tollfreeno;
                                                                var tfreestartdate = new Date(req.body.tollfree_startdate);;
                                                            }
                                                            var obdstartdate = null;
                                                            if (obdpackage != null) {
                                                                obdno = req.body.obdno;
                                                                var obdstartdate = new Date(req.body.obd_startdate);
                                                            }
                                                            var telestartdate = null;
                                                            if (package != null) {
                                                                var telestartdate = new Date(req.body.tele_startdate);
                                                            }

                                                            var balancedata = {
                                                                Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                                SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: telesmsprvalue, SMS_Pr_Balance: telesmsprvalue, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
                                                                , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tollfreeno, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdno, SMS_Startdate: smstartdate, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate, Ads_ID: teledigitaladspackage, Ads_Value: adsvalue, Ads_User_Balance: adsvalue, Ads_Startdate: adstartdate
                                                            }
                                                            Manager.insertaccountbalancedata(balancedata, function (err, rows) {
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                else {
                                                                    //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                                }

                                                            })
                                                        }
                                                        //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                    }
                                                });

                                            }

                                        })
                                    }



                                })
                            }
                        })
                    }
                })
                // const insterdata = {
                //     account_id: adminid, action: "Renew Package ",action_date:new Date(),ip:ip
                // }
                // Manager.insertupdatemangerdata(insterdata, function (err, rows) {
                //     if (err) {}
                //     else{

                //     }
                // })
                res.status(200).send({ "data": 'Package Renew succesfully.' });
            }
        })
    } else {
        var fdata = {
            account_id: adminid, last_modify_by: created_by, last_modify_date: m, channels: channels, user_limit: userlimit, incoming_channel: incoming_channel,
            outgoing_channel: outgoing_channel, total_renew: totalrenew
        };
        Manager.updatemanager(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                var managerid = adminid;
                Manager.getlastbillid(0, function (err, bdata) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (bdata.length > 0) {
                            var billid = bdata[0].Bill_ID;
                            var a = Number(billid.replace(/^\D+/g, ''));
                            a = a + 1;
                            billid = numeral(a).format('000000000000000');
                            billid = 'TEL' + billid;
                        } else {
                            var billid = 'TEL000000000000001';
                        }

                        var mgstno = req.body.mgstno;
                        var companygstno = req.body.companygstno;
                        var discountype = req.body.discountype;
                        var discountper = null;
                        if (discountype == 0) {
                            var discountper = req.body.discountper;
                        }
                        if (req.body.packagediscount) {
                            var packagediscount = req.body.packagediscount;
                        } else {
                            var packagediscount = 0;
                        }
                        var plantotalvalue = 0;
                        var telesmspackage = null;
                        var telesmspackagevalue = null;
                        var telemailpackage = null;
                        var telemailpackagevalue = null;
                        var telemeetpackage = null;
                        var telemeetpackagevalue = null;
                        var teledigitalpackage = null;
                        var teledigitalpackagevalue = null;
                        var teledigitaladspackage = null;
                        var teledigitaladspackagevalue = null;
                        var tollfreepackage = null;
                        var tollfreepackagevalue = null;
                        var obdpackage = null;
                        var obdpackagevalue = null;

                        if (req.body.telesmspackagemode == true) {
                            var telesmspackage = req.body.telesmspackage;
                            var telesmspackagevalue = req.body.telesmspackagevalue;
                            plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
                        }
                        if (req.body.telemailpackagemode == true) {
                            var telemailpackage = req.body.telemailpackage;
                            var telemailpackagevalue = req.body.telemailpackagevalue;
                            plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
                        }
                        if (req.body.telemeetpackagemode == true) {
                            var telemeetpackage = req.body.telemeetpackage;
                            var telemeetpackagevalue = req.body.telemeetpackagevalue;
                            plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
                        }
                        if (req.body.teledigitalpackagemode == true) {
                            var teledigitalpackage = req.body.teledigitalpackage;
                            var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                            plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
                        }
                        if (req.body.teledigitaladspackagemode == true) {
                            var teledigitaladspackage = req.body.teledigitaladspackage;
                            var teledigitaladspackagevalue = req.body.teledigitaladspackagevalue;
                            plantotalvalue = ((plantotalvalue) + (teledigitaladspackagevalue));
                        }
                        if (req.body.tollfreepackagemode == true) {
                            var tollfreepackage = req.body.tollfreepackage;
                            var tollfreepackagevalue = req.body.tollfreepackagevalue;
                            plantotalvalue = ((plantotalvalue) + (tollfreepackagevalue));
                        }

                        var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                        //var managerstatecode = mgstno.substring(0, 2);
                        var managerstatecode = req.body.accountstatecode;
                        var companystatecode = companygstno.substring(0, 2);
                        var cgst = 0;
                        var sgst = 0;
                        var igst = 0;
                        var totalgst = 0;
                        if (managerstatecode == companystatecode) {
                            cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                            sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                            totalgst = (cgst + sgst);
                        }
                        if (managerstatecode != companystatecode) {
                            igst = Math.round(((afterdiscountvalue) * 18) / 100);
                            totalgst = (igst);
                        }
                        var finalamount = (afterdiscountvalue + totalgst);
                        //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                        var m = new Date();

                        Manager.getuserlastbilldata(managerid, function (err, userbdata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                billdata = {
                                    Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno, Bill_Type: 'renew', Plan_user: userlimit, Plan_channel: channels, Plan_discount: packagediscount, Discount_Type: discountype, Discount_Per: discountper, Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue,
                                    Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst, Final_amount: finalamount, Created_By: created_by, Account_Address: accountaddress, Account_State_Code: managerstatecode, SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage,
                                    Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage, Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue, SMS_Pr_No: telesmsprvalue, TFree_ID: tollfreepackage, TFree_Plan_Value: tollfreepackagevalue, OBD_ID: obdpackage, OBD_Plan_Value: obdpackagevalue,
                                    Ads_ID: teledigitaladspackage, Ads_Plan_Value: teledigitaladspackagevalue
                                }
                                Manager.insertbilldata(billdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        var trnsno = null;
                                        var promotionalno = null;
                                        var otpno = null;
                                        var obdno = null;
                                        var tollfreeno = null;
                                        var mailmaxuser = null;
                                        var mailgb = null;
                                        var bulkemailno = null;
                                        var mailexpiredate = null;
                                        var meetexpiredate = null;
                                        var digitalexpiredate = null;
                                        var telesmspackage = req.body.telesmspackage;
                                        var telesmspackagevalue = req.body.telesmspackagevalue;
                                        var telemailpackage = req.body.telemailpackage;
                                        var telemailpackagevalue = req.body.telemailpackagevalue;
                                        var telemeetpackage = req.body.telemeetpackage;
                                        var telemeetpackagevalue = req.body.telemeetpackagevalue;
                                        var teledigitalpackage = req.body.teledigitalpackage;
                                        var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                                        var teledigitaladspackage = req.body.teledigitaladspackage;
                                        var tollfreepackage = req.body.tollfreepackage;
                                        var obdpackage = req.body.obdpackage;
                                        if (telesmspackage != null) {
                                            promotionalno = req.body.promotionalno;
                                        }
                                        if (tollfreepackage != null) {
                                            tollfreeno = req.body.tollfreeno;
                                        }
                                        if (obdpackage != null) {
                                            obdno = req.body.obdno;
                                        }

                                        Manager.getaccountbalancedatabyid(managerid, function (err, brows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                if (brows.length > 0) {
                                                    if (telemailpackage != null) {
                                                        mailmaxuser = req.body.mailmaxuser;
                                                        mailgb = req.body.mailgb;
                                                        bulkemailno = req.body.bulkmailno;
                                                        var m = new Date();
                                                        mailexpiredate = new Date(req.body.mailexpirydate);
                                                        var newmailexpdate = mailexpiredate;
                                                        if (brows[0].Mail_ID != null && req.body.telemailpackagemode == true) {
                                                            /* if (req.body.mailvalidity == 0) {
                                                                 if (mailexpiredate.getTime() < m.getTime()) {
                                                                     var newmailexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                 }
                                                                 if (mailexpiredate.getTime() > m.getTime()) {
                                                                     var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 1));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                 }
                                                             }
                                                             if (req.body.mailvalidity == 1) {
                                                                 if (mailexpiredate.getTime() < m.getTime()) {
                                                                     var newmailexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (mailexpiredate.getTime() > m.getTime()) {
                                                                     var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 12));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }
                                                             if (req.body.mailvalidity == 2) {
                                                                 if (mailexpiredate.getTime() < m.getTime()) {
                                                                     var newmailexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (mailexpiredate.getTime() > m.getTime()) {
                                                                     var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 3));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }
                                                             if (req.body.mailvalidity == 3) {
                                                                 if (mailexpiredate.getTime() < m.getTime()) {
                                                                     var newmailexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (mailexpiredate.getTime() > m.getTime()) {
                                                                     var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 6));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }*/

                                                        }

                                                    }
                                                    if (telemeetpackage != null) {
                                                        var m = new Date();
                                                        meetexpiredate = new Date(req.body.meetexpirydate);
                                                        var newmeetexpdate = meetexpiredate;
                                                        if (brows[0].Meet_ID != null && req.body.telemeetpackagemode == true) {
                                                            // console.log('meetid:::'+brows[0].Meet_ID+'-----'+req.body.meetvalidity);

                                                            /* if (req.body.meetvalidity == 0) {
                                                                 if (meetexpiredate.getTime() < m.getTime()) {
                                                                     var newmeetexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                 }
                                                                 if (meetexpiredate.getTime() > m.getTime()) {
                                                                     var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 1));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                 }
                                                             }
                                                             if (req.body.meetvalidity == 1) {
                                                                 if (meetexpiredate.getTime() < m.getTime()) {
                                                                     var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (meetexpiredate.getTime() > m.getTime()) {
                                                                     var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 12));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }
                                                             if (req.body.meetvalidity == 2) {
                                                                 if (meetexpiredate.getTime() < m.getTime()) {
                                                                     var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (meetexpiredate.getTime() > m.getTime()) {
                                                                     var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 3));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }
                                                             if (req.body.meetvalidity == 3) {
                                                                 if (meetexpiredate.getTime() < m.getTime()) {
                                                                     var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                     //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                 }
                                                                 if (meetexpiredate.getTime() > m.getTime()) {
                                                                     var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 6));
                                                                     //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                 }
                                                             }*/
                                                        }

                                                    }
                                                    if (teledigitalpackage != null) {
                                                        var m = new Date();
                                                        digitalexpiredate = new Date(req.body.digitalexpirydate);
                                                        var newdigitalexpdate = digitalexpiredate;
                                                        if (brows[0].Digital_ID != null && req.body.teledigitalpackagemode == true) {
                                                            /*if (req.body.digitalvalidity == 0) {
                                                                if (digitalexpiredate.getTime() < m.getTime()) {
                                                                    var newdigitalexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                                }
                                                                if (digitalexpiredate.getTime() > m.getTime()) {
                                                                    var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 1));
                                                                    //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                                }
                                                            }
                                                            if (req.body.digitalvalidity == 1) {
                                                                if (digitalexpiredate.getTime() < m.getTime()) {
                                                                    var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                    //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                }
                                                                if (digitalexpiredate.getTime() > m.getTime()) {
                                                                    var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 12));
                                                                    //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                }
                                                            }
                                                            if (req.body.digitalvalidity == 2) {
                                                                if (digitalexpiredate.getTime() < m.getTime()) {
                                                                    var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                    //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                }
                                                                if (digitalexpiredate.getTime() > m.getTime()) {
                                                                    var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 3));
                                                                    //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                }
                                                            }
                                                            if (req.body.digitalvalidity == 3) {
                                                                if (digitalexpiredate.getTime() < m.getTime()) {
                                                                    var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                    //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                                }
                                                                if (digitalexpiredate.getTime() > m.getTime()) {
                                                                    var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 6));
                                                                    //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                                }
                                                            }*/
                                                        }
                                                    }
                                                    //var smstartdate = brows[0].SMS_Startdate;
                                                    if (req.body.telesmspackagemode == true) {
                                                        //console.log(promotionalno +" "+brows[0].SMS_Pr_Balance);
                                                        //console.log(promotionalno+":::"+brows[0].SMS_Pr_Balance);
                                                        var smstartdate = new Date(req.body.telesms_startdate);
                                                        if (brows[0].SMS_ID != null && brows[0].SMS_ID == req.body.telesmspackage) {
                                                            //trnsno = (brows[0].SMS_Tr_Balance) + (trnsno);
                                                            promotionalbalance = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                            promotionalno = (brows[0].SMS_Pr_Balance) + (promotionalno);
                                                            promotionalused = 0;

                                                            //otpno = (brows[0].SMS_Pr_Balance) + (otpno);
                                                        } else {
                                                            promotionalno = (promotionalno);
                                                            if (brows[0].SMS_Pr_Used > 0) {
                                                                promotionalused = null;
                                                            }
                                                            promotionalbalance = (promotionalno);
                                                        }
                                                        //console.log(promotionalbalance + ":::" + promotionalno);
                                                        var tfreebalance = null;
                                                        var tfreestartdate = brows[0].TFree_Startdate;
                                                        if (req.body.tollfreepackagemode == true) {
                                                            var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                            var tfreebalance = null;
                                                            if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
                                                                //console.log(brows[0]);
                                                                tfreebalance = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                // console.log(tfreebalance+"::"+brows[0].TFree_User_Balance+"::"+tollfreeno);
                                                                tollfreeused = 0;
                                                                tollfreeno = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                            } else {
                                                                tfreebalance = (tollfreeno);
                                                                if (brows[0].TFree_User_Used > 0) {
                                                                    tollfreeused = null;
                                                                }
                                                                tollfreeno = (tollfreeno);
                                                            }
                                                        } else {
                                                            var tfreestartdate = brows[0].TFree_Startdate;
                                                            tollfreepackage = (brows[0].TFree_ID);
                                                            tfreebalance = (brows[0].TFree_User_Balance);
                                                            tollfreeused = (brows[0].TFree_User_Used);
                                                            tollfreeno = (brows[0].TFree_No);
                                                        }
                                                        //}
                                                        var obdbalance = null;
                                                        var obdused = null;
                                                        var obdstartdate = brows[0].OBD_start_date;
                                                        if (req.body.obdpackagemode == true) {
                                                            var obdstartdate = new Date(req.body.obd_startdate);
                                                            if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
                                                                obdbalance = (brows[0].OBD_User_Balance) + (obdno);
                                                                obdused = (brows[0].OBD_User_Used);
                                                                obdno = (brows[0].OBD_User_Balance) + (obdno);
                                                            } else {
                                                                obdbalance = (obdno);
                                                                if (brows[0].OBD_User_Used > 0) {
                                                                    obdused = null;
                                                                }
                                                                obdno = (obdno);
                                                            }

                                                        } else {
                                                            var obdstartdate = brows[0].OBD_start_date;
                                                            obdpackage = (brows[0].OBD_ID);
                                                            obdbalance = (brows[0].OBD_User_Balance);
                                                            obdused = (brows[0].OBD_User_Used);
                                                            obdno = (brows[0].OBD_No);
                                                        }

                                                        var mailbalance = null;
                                                        //console.log("hiiiiiii");
                                                        if (req.body.telemailpackagemode == true && brows[0].Mail_ID != null && brows[0].Mail_ID == req.body.telemailpackage) {
                                                            var mailstartdate = new Date(req.body.mail_startdate);
                                                            bulkemailno = (brows[0].Mail_User_Balance) + (bulkemailno);
                                                            mailbalance = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                        } else {
                                                            var mailstartdate = brows[0].Mail_Startdate;
                                                            bulkemailno = (brows[0].Mail_No);
                                                            mailbalance = (brows[0].Mail_User_Balance);
                                                        }
                                                        var meetstartdate = brows[0].Meet_Startdate;
                                                        if (telemeetpackage != null) {
                                                            var meetstartdate = new Date(req.body.meet_startdate);
                                                        }
                                                        var digitalstartdate = brows[0].Digital_Startdate;
                                                        if (teledigitalpackage != null) {
                                                            var digitalstartdate = new Date(req.body.digital_startdate);
                                                        }

                                                        var adsbalance = null;
                                                        var adstartdate = brows[0].Ads_Startdate;
                                                        if (req.body.teledigitaladspackagemode == true) {
                                                            var adstartdate = new Date(req.body.digitalads_startdate);
                                                            if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
                                                                adsbalance = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                adsused = 0;
                                                                teledigitaladspackagevalue = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                            } else {
                                                                adsbalance = (teledigitaladspackagevalue);
                                                                if (brows[0].Ads_User_Used > 0) {
                                                                    Adsused = null;
                                                                }
                                                                teledigitaladspackagevalue = (teledigitaladspackagevalue);
                                                            }
                                                        } else {
                                                            var adstartdate = brows[0].Ads_Startdate;
                                                            teledigitaladspackage = (brows[0].Ads_ID);
                                                            adsbalance = (brows[0].Ads_User_Balance);
                                                            adsused = (brows[0].Ads_User_Used);
                                                            teledigitaladspackagevalue = (brows[0].Ads_Value);
                                                        }

                                                        balancedata = {
                                                            Account_ID: managerid, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                            SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalbalance, Max_User_No: mailmaxuser, Mail_User_Balance: mailbalance, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate
                                                            , TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Used: tollfreeused, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, OBD_User_Used: obdused,
                                                            SMS_Startdate: smstartdate, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate
                                                            , Ads_ID: teledigitaladspackage, Ads_Value: teledigitaladspackagevalue, Ads_User_Used: adsused, Ads_User_Balance: adsbalance, Ads_Startdate: adstartdate
                                                        }
                                                        //console.log(balancedata);
                                                    } else {
                                                        var mailbalance = null;
                                                        //console.log('hi');
                                                        if (req.body.telemailpackagemode == true) {//console.log('mailmode');
                                                            if (brows[0].Mail_ID != null && brows[0].Mail_ID == req.body.telemailpackage) {
                                                                bulkemailno = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                                mailbalance = (brows[0].Mail_User_Balance) + (req.body.bulkmailno);
                                                            } else {//console.log('mailmode else');
                                                                bulkemailno = (bulkemailno);
                                                                mailbalance = (req.body.bulkmailno);
                                                            }
                                                        } else {
                                                            //console.log('else mailmode');
                                                            bulkemailno = (brows[0].Mail_No);
                                                            mailbalance = (brows[0].Mail_User_Balance);
                                                        }


                                                        var tfreebalance = null;
                                                        var tfreestartdate = brows[0].TFree_Startdate;
                                                        if (req.body.tollfreepackagemode == true) {
                                                            var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                            var tfreebalance = null;
                                                            if (brows[0].TFree_ID != null && brows[0].TFree_ID == req.body.tollfreepackage) {
                                                                //console.log(brows[0]);
                                                                tfreebalance = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                                // console.log(tfreebalance+"::"+brows[0].TFree_User_Balance+"::"+tollfreeno);
                                                                tollfreeused = 0;
                                                                tollfreeno = (brows[0].TFree_User_Balance) + (tollfreeno);
                                                            } else {
                                                                tfreebalance = (tollfreeno);
                                                                if (brows[0].TFree_User_Used > 0) {
                                                                    tollfreeused = null;
                                                                }
                                                                tollfreeno = (tollfreeno);
                                                            }
                                                        } else {
                                                            var tfreestartdate = brows[0].TFree_Startdate;
                                                            tollfreepackage = (brows[0].TFree_ID);
                                                            tfreebalance = (brows[0].TFree_User_Balance);
                                                            tollfreeused = (brows[0].TFree_User_Used);
                                                            tollfreeno = (brows[0].TFree_No);
                                                        }
                                                        //}
                                                        var obdbalance = null;
                                                        var obdused = null;
                                                        var obdstartdate = brows[0].OBD_start_date;
                                                        if (req.body.obdpackagemode == true) {
                                                            var obdstartdate = new Date(req.body.obd_startdate);
                                                            if (brows[0].OBD_ID != null && brows[0].OBD_ID == req.body.obdpackage) {
                                                                obdbalance = (brows[0].OBD_User_Balance) + (obdno);
                                                                obdused = (brows[0].OBD_User_Used);
                                                                obdno = (brows[0].OBD_User_Balance) + (obdno);
                                                            } else {
                                                                obdbalance = (obdno);
                                                                if (brows[0].OBD_User_Used > 0) {
                                                                    obdused = null;
                                                                }
                                                                obdno = (obdno);
                                                            }

                                                        } else {
                                                            var obdstartdate = brows[0].OBD_start_date;
                                                            obdpackage = (brows[0].OBD_ID);
                                                            obdbalance = (brows[0].OBD_User_Balance);
                                                            obdused = (brows[0].OBD_User_Used);
                                                            obdno = (brows[0].OBD_No);
                                                        }
                                                        var smstartdate = brows[0].SMS_Startdate
                                                        if (telesmspackage != null) {
                                                            var smstartdate = new Date(req.body.tele_startdate);
                                                        }
                                                        var meetstartdate = brows[0].Meet_Startdate
                                                        if (telemeetpackage != null) {
                                                            var meetstartdate = new Date(req.body.meet_startdate);
                                                        }
                                                        var digitalstartdate = brows[0].Digital_Startdate
                                                        if (teledigitalpackage != null) {
                                                            var digitalstartdate = new Date(req.body.digital_startdate);
                                                        }
                                                        var adsbalance = null;
                                                        var adstartdate = brows[0].Ads_Startdate;
                                                        if (req.body.teledigitaladspackagemode == true) {
                                                            var adstartdate = new Date(req.body.digitalads_startdate);
                                                            if (brows[0].Ads_ID != null && brows[0].Ads_ID == req.body.teledigitaladspackage) {
                                                                adsbalance = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                                adsused = 0;
                                                                teledigitaladspackagevalue = (brows[0].Ads_User_Balance) + (teledigitaladspackagevalue);
                                                            } else {
                                                                adsbalance = (teledigitaladspackagevalue);
                                                                if (brows[0].Ads_User_Used > 0) {
                                                                    Adsused = null;
                                                                }
                                                                teledigitaladspackagevalue = (teledigitaladspackagevalue);
                                                            }
                                                        } else {
                                                            var adstartdate = brows[0].Ads_Startdate;
                                                            teledigitaladspackage = (brows[0].Ads_ID);
                                                            adsbalance = (brows[0].Ads_User_Balance);
                                                            adsused = (brows[0].Ads_User_Used);
                                                            teledigitaladspackagevalue = (brows[0].Ads_Value);
                                                        }


                                                        //  console.log(tollfreeno);
                                                        balancedata = {
                                                            Account_ID: managerid, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                            Max_User_No: mailmaxuser, Mail_User_Balance: mailbalance, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate,
                                                            TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Used: tollfreeused, TFree_User_Balance: tfreebalance, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdbalance, OBD_User_Used: obdused,
                                                            SMS_Startdate: smstartdate, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate,
                                                            Ads_ID: teledigitaladspackage, Ads_Value: teledigitaladspackagevalue, Ads_User_Used: adsused, Ads_User_Balance: adsbalance, Ads_Startdate: adstartdate
                                                        }
                                                    }
                                                    //console.log(balancedata);
                                                    Manager.updateaccountbalancedata(balancedata, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {
                                                            //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                        }

                                                    })
                                                } else {
                                                    var smstartdate = null;
                                                    if (telesmspackage != null) {
                                                        trnsno = req.body.transno;
                                                        promotionalno = req.body.promotionalno;
                                                        otpno = req.body.otpno;
                                                        var smstartdate = new Date(req.body.telesms_startdate);
                                                    }
                                                    var mailstartdate = null;
                                                    if (telemailpackage != null) {
                                                        var mailstartdate = new Date(req.body.mail_startdate);
                                                        mailmaxuser = req.body.mailmaxuser;
                                                        mailgb = req.body.mailgb;
                                                        bulkemailno = req.body.bulkmailno;
                                                        var m = new Date();
                                                        mailexpiredate = new Date(req.body.mailexpirydate);
                                                        /*if (req.body.mailvalidity == 0) {
                                                            if (mailexpiredate.getTime() < m.getTime()) {
                                                                var newmailexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                            }
                                                            if (mailexpiredate.getTime() > m.getTime()) {
                                                                var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 1));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                            }
                                                        }
                                                        if (req.body.mailvalidity == 1) {
                                                            if (mailexpiredate.getTime() < m.getTime()) {
                                                                var newmailexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (mailexpiredate.getTime() > m.getTime()) {
                                                                var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 12));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }
                                                        if (req.body.mailvalidity == 2) {
                                                            if (mailexpiredate.getTime() < m.getTime()) {
                                                                var newmailexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (mailexpiredate.getTime() > m.getTime()) {
                                                                var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 3));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }
                                                        if (req.body.mailvalidity == 3) {
                                                            if (mailexpiredate.getTime() < m.getTime()) {
                                                                var newmailexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (mailexpiredate.getTime() > m.getTime()) {
                                                                var newmailexpdate = new Date(mailexpiredate.setMonth(mailexpiredate.getMonth() + 6));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }*/

                                                    }
                                                    var meetstartdate = null;
                                                    if (telemeetpackage != null) {
                                                        var meetstartdate = new Date(req.body.meet_startdate);
                                                        var m = new Date();
                                                        meetexpiredate = new Date(req.body.meetexpirydate);
                                                        /*if (req.body.meetvalidity == 0) {
                                                            if (meetexpiredate.getTime() < m.getTime()) {
                                                                var newmeetexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                            }
                                                            if (meetexpiredate.getTime() > m.getTime()) {
                                                                var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 1));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                            }
                                                        }
                                                        if (req.body.meetvalidity == 1) {
                                                            if (meetexpiredate.getTime() < m.getTime()) {
                                                                var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (meetexpiredate.getTime() > m.getTime()) {
                                                                var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 12));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }
                                                        if (req.body.meetvalidity == 2) {
                                                            if (meetexpiredate.getTime() < m.getTime()) {
                                                                var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (meetexpiredate.getTime() > m.getTime()) {
                                                                var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 3));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }
                                                        if (req.body.meetvalidity == 3) {
                                                            if (meetexpiredate.getTime() < m.getTime()) {
                                                                var newmeetexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                            }
                                                            if (meetexpiredate.getTime() > m.getTime()) {
                                                                var newmeetexpdate = new Date(meetexpiredate.setMonth(meetexpiredate.getMonth() + 6));
                                                                //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                            }
                                                        }*/

                                                    }
                                                    var digitalstartdate = null;
                                                    if (teledigitalpackage != null) {
                                                        var m = new Date();
                                                        var digitalstartdate = new Date(req.body, digital_startdate);
                                                        digitalexpiredate = new Date(req.body.digitalexpirydate);
                                                        /* if (req.body.digitalvalidity == 0) {
                                                             if (digitalexpiredate.getTime() < m.getTime()) {
                                                                 var newdigitalexpdate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                                                             }
                                                             if (digitalexpiredate.getTime() > m.getTime()) {
                                                                 var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 1));
                                                                 //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 30));
                                                             }
                                                         }
                                                         if (req.body.digitalvalidity == 1) {
                                                             if (digitalexpiredate.getTime() < m.getTime()) {
                                                                 var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 12));
                                                                 //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                             }
                                                             if (digitalexpiredate.getTime() > m.getTime()) {
                                                                 var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 12));
                                                                 //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                             }
                                                         }
                                                         if (req.body.digitalvalidity == 2) {
                                                             if (digitalexpiredate.getTime() < m.getTime()) {
                                                                 var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 3));
                                                                 //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                             }
                                                             if (digitalexpiredate.getTime() > m.getTime()) {
                                                                 var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 3));
                                                                 //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                             }
                                                         }
                                                         if (req.body.digitalvalidity == 3) {
                                                             if (digitalexpiredate.getTime() < m.getTime()) {
                                                                 var newdigitalexpdate = new Date(m.setMonth(m.getMonth() + 6));
                                                                 //var newexpdate = new Date(m.setDate(m.getDate() + 365));
                                                             }
                                                             if (digitalexpiredate.getTime() > m.getTime()) {
                                                                 var newdigitalexpdate = new Date(digitalexpiredate.setMonth(digitalexpiredate.getMonth() + 6));
                                                                 //var newexpdate = new Date(expirydate.setDate(expirydate.getDate() + 365));
                                                             }
                                                         }*/
                                                    }
                                                    var adstartdate = null
                                                    adsvalue = null
                                                    if (teledigitaladspackage != null) {
                                                        adsvalue = req.body.teledigitaladspackagevalue;
                                                        var adstartdate = new Date(req.body.digitalads_startdate);
                                                    }
                                                    var tfreestartdate = null
                                                    if (tollfreepackage != null) {
                                                        tollfreeno = req.body.tollfreeno;
                                                        var tfreestartdate = new Date(req.body.tollfree_startdate);
                                                    }
                                                    var obdstartdate = null;
                                                    if (obdpackage != null) {
                                                        obdno = req.body.obdno;
                                                        var obdstartdate = new Date(req.body.obd_startdate);;
                                                    }


                                                    balancedata = {
                                                        Account_ID: managerid, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                                        SMS_Pr_No: telesmsprvalue, SMS_Pr_Balance: telesmsprvalue, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: newmailexpdate, Mail_Startdate: mailstartdate, Meet_Expire: newmeetexpdate, Meet_Startdate: meetstartdate, Digital_Expire: newdigitalexpdate, Digital_Startdate: digitalstartdate,
                                                        TFree_ID: tollfreepackage, TFree_No: tollfreeno, TFree_User_Balance: tollfreeno, OBD_ID: obdpackage, OBD_No: obdno, OBD_User_Balance: obdno,
                                                        SMS_Startdate: smstartdate, TFree_Startdate: tfreestartdate, OBD_start_date: obdstartdate, Tele_Plusduration: req.body.obdpulserate, Ads_ID: teledigitaladspackage,
                                                        Ads_Startdate: adstartdate, Ads_Value: adsvalue, Ads_User_Balance: adsvalue
                                                    }
                                                    Manager.insertaccountbalancedata(balancedata, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {
                                                            //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                        }

                                                    })
                                                }
                                                //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                            }
                                        });

                                    }

                                })
                            }

                        })
                    }
                })
            }
            // const insterdata = {
            //     account_id: adminid, action: "Renew Package ",action_date:new Date(),ip:ip
            // }
            // Manager.insertupdatemangerdata(insterdata, function (err, rows) {
            //     if (err) {}
            //     else{

            //     }
            // })
            res.status(200).send({ "data": 'Package Renew succesfully.' });
        })
    }
})
router.get('/getBillingData/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.getbillingdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getsubscriptionData/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.getsubscriptiondata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

function NumInWords(number) {
    const first = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
    let word = '';

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i));
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word;
            } else {
                word = tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] + '-' + first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] + mad[i] + ' ' + word;
            }
        }

        tempNumber = number % (Math.pow(1000, i + 1));
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0) word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hunderd ' + word;
    }
    return word;
}
router.get('/generateinvoice/:id', function (req, res1) {
    //console.log(req.params.id);
    Manager.generateinvoice(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            str = rows[0].Company_GST_ID;
            str = str.substring(0, str.length - 3);
            str = str.substring(2);
            rows[0].panno = str;
            rows[0].plan_total = (rows[0].Plan_TotalValue - rows[0].Plan_discount)
            rows[0].plan_total = (rows[0].plan_total).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            if (rows[0].Plan_discount == 0) {
                rows[0].discountmode = false;
            } else {
                rows[0].discountmode = true;
                rows[0].Plan_discount = (rows[0].Plan_discount).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            if (rows[0].Plan_CGST == 0) {
                rows[0].cgstmode = false;
            } else {
                rows[0].cgstmode = true;
                rows[0].Plan_CGST = (rows[0].Plan_CGST).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
                rows[0].Plan_SGST = (rows[0].Plan_SGST).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            //console.log(rows[0].Plan_IGST);
            if (rows[0].Plan_IGST != 0) {
                rows[0].igstmode = true;
                rows[0].Total_GST = (rows[0].Total_GST).toLocaleString('en-US', { style: 'currency', currency: 'INR' })

            } else {
                rows[0].igstmode = false;
            }
            var srno1 = 1;
            rows[0].checkbestpackage = true;
            if (rows[0].Plan_Type != null) {
                rows[0].srno1 = srno1;
                rows[0].checkbestpackage = true;
                rows[0].Plan_uservalue = (rows[0].Plan_Value * rows[0].Plan_user).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
                rows[0].Plan_Value = (rows[0].Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            rows[0].Plan_TotalValue = (rows[0].Plan_TotalValue).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].Total_GST = (rows[0].Total_GST).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].inwords = NumInWords(rows[0].Final_amount);
            rows[0].Final_amount = (rows[0].Final_amount).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].checkmeetpackage = false;
            var srno2 = srno1;
            if (rows[0].Meet_ID != null) {
                srno2 = ((srno2) + (1));
                rows[0].srno2 = srno2;
                rows[0].checkmeetpackage = true;
                rows[0].Meet_Plan_Value = (rows[0].Meet_Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            rows[0].checksmspackage = false;
            var srno3 = srno2;
            if (rows[0].SMS_ID != null) {
                srno3 = ((srno3) + (1));
                rows[0].srno3 = srno3;
                rows[0].checksmspackage = true;
                rows[0].SMS_Plan_Value = (rows[0].SMS_Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            rows[0].checkmailpackage = false;
            var srno4 = srno3;
            if (rows[0].Mail_ID != null) {
                srno4 = ((srno4) + (1));
                rows[0].srno4 = srno4;
                rows[0].checkmailpackage = true;
                rows[0].Mail_Plan_Value = (rows[0].Mail_Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }
            rows[0].checkdigitalpackage = false;
            var srno5 = srno4;
            if (rows[0].Digital_ID != null) {
                srno5 = ((srno5) + (1));
                rows[0].srno5 = srno5;
                rows[0].checkdigitalpackage = true;
                rows[0].Digital_Plan_Value = (rows[0].Digital_Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            }


            var document = {
                html: html,
                data: {
                    detail: rows[0],
                },
                path: "./uploads/invoice" + (rows[0].Bill_ID) + ".pdf"
            };
            var options = {
                format: "A4",
                border: "5mm",
                header: {
                    height: "0mm",
                },
                margin: { top: 0, left: 0, right: 0, bottom: 0 },
                footer: {

                }
            };
            pdf.create(document, options)
                .then(res => {
                    //res1.status(200).send({ "data": res });
                    //console.log(res)
                    var file = path.join(__dirname, '../uploads/invoice' + rows[0].Bill_ID + '.pdf');
                    //console.log(file)
                    res1.download(file, function (err) {
                        if (err) {
                            //console.log("Error");
                            console.log(err);
                        } else {
                            console.log("Success");
                        }
                    });
                })
                .catch(error => {
                    console.error(error)
                });
            //res.status(200).send({ "data": rows });

        }
    })
})
//get vendor data
router.get('/getVendordata', authorize, function (req, res) {
    //console.log(req.params);
    Manager.getVendordata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get vendor data by id
router.get('/getVenderByid/:id', authorize, function (req, res) {
    //console.log(req.params);
    Manager.getVenderByid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//Upadate vendor data
router.post('/updateVenderData', authorize, function (req, res) {
    //console.log(req.body);
    var ven_id = req.body.ven_id;
    var account_id = req.body.account_id;
    var ven_name = req.body.ven_name;
    var ven_email = req.body.ven_email;
    var ven_mobile = req.body.ven_mobile;
    var ven_city = req.body.ven_city;
    var ven_pincode = req.body.ven_pincode;
    var ven_state = req.body.ven_state;
    var ven_address = req.body.ven_address;
    var ven_status = req.body.ven_status;
    fdata = { ven_id: ven_id, account_id: account_id, ven_name: ven_name, ven_email: ven_email, ven_mobile: ven_mobile, ven_city: ven_city, ven_pincode: ven_pincode, ven_state: ven_state, ven_address: ven_address, ven_status: ven_status };
    Manager.updateVenderData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'updated succesfully.' });
        }

    })
})
//save vendor data
router.post('/saveVendorData', authorize, function (req, res) {
    //console.log(req.body);
    var account_id = req.body.account_id;
    var ven_name = req.body.ven_name;
    var ven_email = req.body.ven_email;
    var ven_mobile = req.body.ven_mobile;
    var ven_city = req.body.ven_city;
    var ven_pincode = req.body.ven_pincode;
    var ven_state = req.body.ven_state;
    var ven_address = req.body.ven_address;
    var ven_status = req.body.ven_status;
    fdata = { account_id: account_id, ven_name: ven_name, ven_email: ven_email, ven_mobile: ven_mobile, ven_city: ven_city, ven_pincode: ven_pincode, ven_state: ven_state, ven_address: ven_address, ven_status: ven_status };

    Manager.saveVendorData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' data saved succesfully.' });
        }

    })
})
// delete vendor data
router.get('/deleteVendorData/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.deleteVendorData(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted successfully' });
        }
    })
})

router.post('/searchVendor', authorize, function (req, res) {
    //console.log(req.body);
    Manager.searchVendor(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
router.get('/getagentdetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getagentdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            router.get('/getagentdetail/:id', authorize, function (req, res) {
                //console.log(req.params.id);
                Manager.getagentdetail(req.params.id, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(200).send({ "data": rows[0] });
                    }
                })
            })
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.get('/getVendorList/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getVendorList(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchVendorlist', authorize, function (req, res) {
    // console.log(req.body);
    Manager.searchVendorlist(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})

//get manager and package detil when renew package
router.get('/getManagerRenewPackageDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getmanagerrenewpackagedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
//get not assign sms server for manager
router.get('/getAssignSmsServer/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getassignsmserver(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveManagerSmsServer', authorize, function (req, res) {
    // console.log(req.body.userid);
    for (var i = 0; i < req.body.serverForm.length; i++) {
        var m = new Date();
        c_data = { server_id: req.body.serverForm[i], account_id: req.body.userid, status: 0, assign_date: m };
        Manager.savemanagersmserver(c_data, function (err, count) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.status(200).send({ "data": 'SMS Server assigned succesfully.' });
})
//ASSIGN sms server list for manager
router.get('/getManagerSmsServer/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getmanagersmserver(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//DELETE Assign sms server
router.get('/deleteAssignSmsServer/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.deleteassignsmserver(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Assigned SMS Server deleted successfully' });
        }
    })
})
router.post('/directLogin', authorize, function (req, res) {
    const username = req.body.managername;
    const password = req.body.password;
    const isadmin = req.body.isadmin ? req.body.isadmin : false;
    var result = false;
    if (isadmin) {
        Signin.findUser(username, function (err, user) {
            if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
            if (user && user.length > 0) {
                if (user[0].account_type == 2 || user[0].account_type == 1) {
                    // const result = bcrypt.compareSync(password, user[0].account_password);//bcrypt.compareSync(password, user.password);
                    //console.log("result::"+user);
                    //if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });
                    const expiresIn = 24 * 60 * 60;
                    const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type, uid: username }, SECRET_KEY, {
                        expiresIn: expiresIn
                    });
                    //console.log(accessToken);
                    loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status };
                    Signin.UpdateUser({ is_loggedin: 'yes', login_token: accessToken }, user[0].account_id);
                    res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
                } else {
                    return res.status(200).send({ 'islogin': false, 'msg': 'Access not valid!' });
                }
            } else {
                return res.status(200).send({ 'islogin': false, 'msg': 'User not found!' });
            }
        });
    } else {
        Manager.getsettingbyname('directloginpassword', function (err, data) {
            if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
            if (data && data.length > 0 && password == data[0]['setting_value']) {
                Signin.findUser(username, function (err, user) {
                    if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
                    if (user && user.length > 0) {
                        if (user[0].account_type == 2 || user[0].account_type == 1) {
                            // const result = bcrypt.compareSync(password, user[0].account_password);//bcrypt.compareSync(password, user.password);
                            //console.log("result::"+user);
                            //if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });
                            const expiresIn = 24 * 60 * 60;
                            const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type, uid: username }, SECRET_KEY, {
                                expiresIn: expiresIn
                            });
                            //console.log(accessToken);
                            loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status };
                            Signin.UpdateUser({ is_loggedin: 'yes', login_token: accessToken }, user[0].account_id);
                            res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
                        } else {
                            return res.status(200).send({ 'islogin': false, 'msg': 'Access not valid!' });
                        }
                    } else {
                        return res.status(200).send({ 'islogin': false, 'msg': 'User not found!' });
                    }
                });
            } else {
                return res.status(200).send({ 'islogin': false, 'msg': 'Invalid password' });
            }
        })
    }
})

//check duplicate Manager mobile no
router.post('/findmanagermobile', function (req, res) {
    Manager.findManagerMobile(req.body.check, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(rows.length);
            if (rows.length > 0) {
                var otp = Math.floor(Math.random() * 1000000);

                tonumber = req.body.check;
                //rows[0].mobile = '8160013293';
                //tonumber = rows[0].mobile;
                message = 'Dear ' + rows[0].account_name + ', your reset password verification OTP is ' + otp;
                urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                    method: 'GET',
                    rejectUnauthorized: false,
                }, function (error, resp) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        var result = JSON.parse(resp);
                        smsstatus = result.STATUS;
                        data = {
                            account_id: rows[0].account_id, mobile: rows[0].mobile,
                            otp: otp, sendsms_status: smsstatus
                        };
                        Manager.savemanagerotp(data, function (err, count) {
                            if (err) {
                                console.log(err);
                            } else {

                            }
                        })
                    }
                });
                res.json({ 'isexist': true, 'username': rows[0].account_name, 'userid': rows[0].account_id });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
//check manager otp 
router.post('/checkMobileOTP/', function (req, res) {
    //console.log(req.params.id);
    Manager.checkmobileotp(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//change manager account password
router.post('/changeManagerPassword/', function (req, res) {
    //console.log(req.params.id);
    if (req.body.password) {
        var password = bcrypt.hashSync(req.body.password);
    }
    data = { account_id: req.body.userid, account_password: password }
    Manager.updatemanager(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            Manager.deletemanagerotp(req.body.userid, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(200).send({ "data": 'Your password reset successfully' });
                }
            })
        }
    })
})
router.get('/gettempuser', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.gettempuser(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/gettempkycformdata/:id', function (req, res) {
    //console.log(req.params.id)
    Manager.getkycformdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

router.get('/gettempusernamebyid/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.gettempusernamebyid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.get('/gettemptransctiondata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.gettemptransctiondata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//save temp manager data to account table
router.post('/saveTempManager', authorize, function (req, res) {
    //console.log(req.body);
    // var string = numeral(billid).format('0,0');
    // console.log(billid);
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var alternatemobile = req.body.alternatemobile;
    var companyname = req.body.companyname;
    var pulse = req.body.pulse;
    var credits = req.body.credits;
    var balance = req.body.balance;
    var userlimit = req.body.userlimit;
    var incoming_channel = req.body.userlimit;
    var outgoing_channel = req.body.userlimit;
    var channels = req.body.channels;
    var current_status = req.body.status;
    var package = req.body.package;
    var authorised_person_name = req.body.authorised_person_name;
    var expirydate = null;
    if (package != null) {
        var expirydate = new Date(req.body.expirydate);
    }

    if (req.body.password) {
        var password = bcrypt.hashSync(req.body.password);
    }
    var created_by = req.body.created_by;

    var m = new Date();
    var services = JSON.stringify(req.body.services);
    var accountaddress = req.body.accountaddress;
    fdata = {
        account_type: 2, account_name: name, account_password: password, email: email, mobile: mobile, alternate_mobile: alternatemobile, created_by: created_by, create_date: m,
        company_name: companyname, pulse: pulse, credits: credits, balance: balance, current_status: current_status,
        authorised_person_name: authorised_person_name, company_address: accountaddress, expiry_date: expirydate, channels: channels, user_limit: userlimit,
        outgoing_channel: outgoing_channel, incoming_channel: incoming_channel, package_id: package, services: services
    };
    Manager.insertmanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var managerid = rows.insertId;
            Manager.getlastbillid(0, function (err, bdata) {
                if (err) {
                    console.log(err);
                }
                else {

                    if (bdata.length > 0) {
                        var billid = bdata[0].Bill_ID;
                        var a = Number(billid.replace(/^\D+/g, ''));
                        a = a + 1;
                        billid = numeral(a).format('000000000000000');
                        billid = 'TEL' + billid;
                    } else {
                        var billid = 'TEL000000000000001';
                    }

                    var mgstno = req.body.mgstno;
                    var companygstno = req.body.companygstno;
                    var discountype = req.body.discountype;
                    var discountper = null;
                    if (discountype == 0) {
                        var discountper = req.body.discountper;
                    }
                    if (req.body.packagediscount) {
                        var packagediscount = req.body.packagediscount;
                    } else {
                        var packagediscount = 0;
                    }


                    var packageprice = 0;
                    if (req.body.bestpackagemode == true) {
                        Admin.getpackagedetail(package, function (err, pdata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                // console.log(pdata);
                                packageprice = pdata[0].package_price;
                                var telesmspackage = req.body.telesmspackage;
                                var telesmspackagevalue = req.body.telesmspackagevalue;
                                var telemailpackage = req.body.telemailpackage;
                                var telemailpackagevalue = req.body.telemailpackagevalue;
                                var telemeetpackage = req.body.telemeetpackage;
                                var telemeetpackagevalue = req.body.telemeetpackagevalue;
                                var teledigitalpackage = req.body.teledigitalpackage;
                                var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                                if (pdata[0].minute_type == 1) {
                                    var plantotalvalue = (packageprice);
                                } else {
                                    var plantotalvalue = (packageprice * userlimit);
                                }

                                if (telesmspackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
                                }
                                if (telemailpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
                                }
                                if (telemeetpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
                                }
                                if (teledigitalpackagevalue != null) {
                                    plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
                                }

                                var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                                // var managerstatecode = mgstno.substring(0, 2);
                                var managerstatecode = req.body.accountstatecode;
                                var companystatecode = companygstno.substring(0, 2);
                                var cgst = 0;
                                var sgst = 0;
                                var igst = 0;
                                var totalgst = 0;
                                if (managerstatecode == companystatecode) {
                                    cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                                    totalgst = (cgst + sgst);
                                }
                                if (managerstatecode != companystatecode) {
                                    igst = Math.round(((afterdiscountvalue) * 18) / 100);
                                    totalgst = (igst);
                                }
                                var finalamount = (afterdiscountvalue + totalgst);
                                //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                                var m = new Date();
                                var accountaddress = req.body.accountaddress;
                                var packageminutes = req.body.packageminutes;
                                var packagefreeminutes = req.body.packagefreeminutes;

                                billdata = {
                                    Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno, Bill_Type: 'new',
                                    Plan_Type: package, Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Discount_Type: discountype, Discount_Per: discountper, Plan_discount: packagediscount,
                                    Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
                                    Final_amount: finalamount, Created_By: created_by, Plan_expire_Date: expirydate, Account_Address: accountaddress, Account_State_Code: managerstatecode,
                                    SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage, Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage,
                                    Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue, plan_minuits: packageminutes, free_minuites: packagefreeminutes
                                }
                                Manager.insertbilldata(billdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        //console.log(rows);
                                        var trnsno = null;
                                        var promotionalno = null;
                                        var otpno = null;
                                        var mailmaxuser = null;
                                        var mailgb = null;
                                        var bulkemailno = null;
                                        var mailexpiredate = null;
                                        var meetexpiredate = null;
                                        var digitalexpiredate = null;
                                        if (telesmspackage != null) {
                                            trnsno = req.body.transno;
                                            promotionalno = req.body.promotionalno;
                                            otpno = req.body.otpno;
                                        }
                                        if (telemailpackage != null) {
                                            mailmaxuser = req.body.mailmaxuser;
                                            mailgb = req.body.mailgb;
                                            bulkemailno = req.body.bulkmailno;
                                            mailexpiredate = new Date(req.body.mailexpirydate);
                                        }
                                        if (telemeetpackage != null) {
                                            meetexpiredate = new Date(req.body.meetexpirydate);
                                        }
                                        if (teledigitalpackage != null) {
                                            digitalexpiredate = new Date(req.body.digitalexpirydate);
                                        }
                                        var packageminutes = req.body.packageminutes;
                                        var packagefreeminutes = 0;
                                        if (req.body.packagefreeminutes != null) {
                                            var packagefreeminutes = req.body.packagefreeminutes;
                                        }
                                        var totalpackageminutes = (Number(packageminutes) + Number(packagefreeminutes));
                                        var telestartdate = new Date(req.body.tele_startdate);
                                        balancedata = {
                                            Account_ID: managerid, Tele_packageid: package, Tele_Plan_Minuites: totalpackageminutes, Tele_Plan_Balance: totalpackageminutes, Tele_Expire: expirydate, Tele_Startdate: telestartdate, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage,
                                            SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: promotionalno, SMS_Pr_Balance: promotionalno, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: mailexpiredate, Mail_Startdate: new Date(req.body.mail_startdate), Meet_Expire: meetexpiredate, Meet_Startdate: new Date(req.body.meet_startdate), Digital_Expire: digitalexpiredate, Digital_Startdate: new Date(req.body.digital_startdate)
                                        }
                                        Manager.insertaccountbalancedata(balancedata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                tempuserdata = {
                                                    isconvert: 1, userid: req.body.userid
                                                }
                                                Manager.updatetempuser(tempuserdata, function (err, rows) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                                    }

                                                })
                                            }

                                        })
                                    }

                                })
                            }
                        })
                    } else {
                        var telesmspackage = req.body.telesmspackage;
                        var telesmspackagevalue = req.body.telesmspackagevalue;
                        var telemailpackage = req.body.telemailpackage;
                        var telemailpackagevalue = req.body.telemailpackagevalue;
                        var telemeetpackage = req.body.telemeetpackage;
                        var telemeetpackagevalue = req.body.telemeetpackagevalue;
                        var teledigitalpackage = req.body.teledigitalpackage;
                        var teledigitalpackagevalue = req.body.teledigitalpackagevalue;
                        var plantotalvalue = 0;
                        if (telesmspackagevalue != null) {
                            plantotalvalue = ((plantotalvalue) + (telesmspackagevalue));
                        }
                        if (telemailpackagevalue != null) {
                            plantotalvalue = ((plantotalvalue) + (telemailpackagevalue));
                        }
                        if (telemeetpackagevalue != null) {
                            plantotalvalue = ((plantotalvalue) + (telemeetpackagevalue));
                        }
                        if (teledigitalpackagevalue != null) {
                            plantotalvalue = ((plantotalvalue) + (teledigitalpackagevalue));
                        }

                        var afterdiscountvalue = ((plantotalvalue) - packagediscount);
                        // var managerstatecode = mgstno.substring(0, 2);
                        var managerstatecode = req.body.accountstatecode;
                        var companystatecode = companygstno.substring(0, 2);
                        var cgst = 0;
                        var sgst = 0;
                        var igst = 0;
                        var totalgst = 0;
                        if (managerstatecode == companystatecode) {
                            cgst = Math.round(((afterdiscountvalue) * 9) / 100);
                            sgst = Math.round(((afterdiscountvalue) * 9) / 100);
                            totalgst = (cgst + sgst);
                        }
                        if (managerstatecode != companystatecode) {
                            igst = Math.round(((afterdiscountvalue) * 18) / 100);
                            totalgst = (igst);
                        }
                        var finalamount = (afterdiscountvalue + totalgst);
                        //console.log(cgst+'--'+sgst+'--'+igst+'--'+packageprice+'---'+packagediscount);
                        var m = new Date();
                        var accountaddress = req.body.accountaddress;

                        billdata = {
                            Bill_ID: billid, Bill_Date: m, Account_ID: managerid, Account_GST_NO: mgstno, Company_GST_ID: companygstno, Bill_Type: 'new',
                            Plan_user: userlimit, Plan_channel: channels, Plan_Value: packageprice, Plan_discount: packagediscount, Discount_Type: discountype, Discount_Per: discountper,
                            Plan_TotalValue: plantotalvalue, Value_afterdiscount: afterdiscountvalue, Plan_CGST: cgst, Plan_SGST: sgst, Plan_IGST: igst, Total_GST: totalgst,
                            Final_amount: finalamount, Created_By: created_by, Account_Address: accountaddress, Account_State_Code: managerstatecode,
                            SMS_ID: telesmspackage, SMS_Plan_Value: telesmspackagevalue, Mail_ID: telemailpackage, Mail_Plan_Value: telemailpackagevalue, Meet_ID: telemeetpackage,
                            Meet_Plan_Value: telemeetpackagevalue, Digital_ID: teledigitalpackage, Digital_Plan_Value: teledigitalpackagevalue
                        }
                        Manager.insertbilldata(billdata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                var trnsno = null;
                                var promotionalno = null;
                                var otpno = null;
                                var mailmaxuser = null;
                                var mailgb = null;
                                var bulkemailno = null;
                                var mailexpiredate = null;
                                var meetexpiredate = null;
                                var digitalexpiredate = null;
                                if (telesmspackage != null) {
                                    trnsno = req.body.transno;
                                    promotionalno = req.body.promotionalno;
                                    otpno = req.body.otpno;
                                }
                                if (telemailpackage != null) {
                                    mailmaxuser = req.body.mailmaxuser;
                                    mailgb = req.body.mailgb;
                                    bulkemailno = req.body.bulkssmailno;
                                    mailexpiredate = new Date(req.body.mailexpirydate);
                                }
                                if (telemeetpackage != null) {
                                    meetexpiredate = new Date(req.body.meetexpirydate);
                                }
                                if (teledigitalpackage != null) {
                                    digitalexpiredate = new Date(req.body.digitalexpirydate);
                                }
                                balancedata = {
                                    Account_ID: managerid, SMS_ID: telesmspackage, Mail_ID: telemailpackage, Meet_ID: telemeetpackage, Digital_ID: teledigitalpackage, SMS_Tr_No: trnsno, SMS_Tr_Balance: trnsno, SMS_Pr_No: promotionalno,
                                    SMS_Pr_Balance: promotionalno, SMS_Otp_No: otpno, SMS_Otp_Balance: otpno, Max_User_No: mailmaxuser, Mail_User_Balance: bulkemailno, Mail_No: bulkemailno, Mail_Gb: mailgb, Mail_Expire: mailexpiredate, Mail_Startdate: new Date(req.body.mail_startdate), Meet_Expire: meetexpiredate, Meet_Startdate: new Date(req.body.meet_startdate), Digital_Expire: digitalexpiredate, Digital_Startdate: new Date(req.body.digital_startdate)
                                }
                                Manager.insertaccountbalancedata(balancedata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                        tempuserdata = {
                                            isconvert: 1, userid: req.body.userid
                                        }
                                        Manager.updatetempuser(tempuserdata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                //res.status(200).send({ "data": 'Manager detail updated succesfully.' });
                                            }

                                        })
                                    }

                                })
                            }

                        })
                    }
                }
            })
            /*var result = "";
            var client = ldap.createClient({
                url: [process.env.LDAPURL, process.env.LDAPURL]
            });
            client.bind("cn=vmailadmin,dc=cloudX,dc=in", "nvha4DRb7SPI2dD5A45J6qy5Ss7dZyoU", function(err) {
                if (err) {
                    result += "Reader bind failed " + err;
                    res.status(200).send({ "data": err});
                    return;
                }
                
                result += "Reader bind succeeded\n";
                var entry = {
                    accountStatus: 'active',
                    uid: req.body.name,
                    cn: req.body.name,
                    sn: req.body.name,
                    userPassword: ssha.create(req.body.password),
                    mail: [req.body.name+'@cloudX.in'],
                    objectclass: ["inetOrgPerson","mailUser","shadowAccount","amavisAccount"],
                    enabledService: ["internal","doveadm","lib-storage","indexer-worker","dsync","quota-status","mail","smtp","smtpsecured","smtptls","pop3","pop3secured","pop3tls","imap","imapsecured","imaptls","managesieve","managesievesecured","managesievetls","sieve","sievesecured","sievetls","deliver","lda","lmtp","recipientbcc","senderbcc","forward","shadowaddress","displayedInGlobalAddressBook","sogo"],
                    amavisLocal: "TRUE",
                    mailboxFormat: "maildir",
                    mailboxFolder: "Maildir",
                    mailQuota: "1073741824",
                    preferredLanguage: "en_US",
                    mobile : req.body.mobile?req.body.mobile:'',
                    givenName: req.body.authorised_person_name,
                    homeDirectory:"/var/vmail/vmail1/cloudX.in/"+req.body.name
                  };
                client.add('mail='+req.body.name+'@cloudX.in,ou=Users,domainName=cloudX.in,o=domains,dc=cloudX,dc=in', entry, function(err) {
                        if (err) {
                            res.status(200).send({ "data": err});
                            return;
                        }else{
                            res.status(200).send({ "data": 'Manager detail saved succesfully.' });
                        }
                });
            })*/
            res.status(200).send({ "data": 'Manager detail saved succesfully.' });
        }
    })
})
router.post('/updateDigitalAccess', authorize, function (req, res) {
    var userid = req.body.userid;
    var ip = req.body.ip;
    var data = [];
    if (req.body.post) {
        data.push('post');
    }
    if (req.body.members) {
        data.push('members');
    }
    if (req.body.monitor) {
        data.push('monitor');
    }
    if (req.body.groups) {
        data.push('groups');
    }
    if (req.body.store) {
        data.push('store');
    }
    if (req.body.medialibrary) {
        data.push('medialibrary');
    }
    if (req.body.leads) {
        data.push('leads');
    }
    if (req.body.audience) {
        data.push('audience');
    }
    if (req.body.hashtag) {
        data.push('hashtag');
    }

    fdata = { account_id: userid, digital_access: JSON.stringify(data) };
    //console.log((fdata));
    Manager.updatemanager(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // const insterdata = {
            //     account_id: userid, action: "Update Module Access Digital ",action_date:new Date(),ip:ip
            // }
            // Manager.insertupdatemangerdata(insterdata, function (err, rows) {
            //     if (err) {}
            //     else{

            //     }
            // })
            res.status(200).send({ "data": 'Manager tele digital access updated succesfully.' });
        }
    })
})

router.post('/create_subscription', authorize, async function (req, res) {
    //console.log(req.body);
    var managerid = req.body.adminid
    var array = req.body
    var item = []
    if (array.bestpackagemode == true) {
        let best_pack = await helper.best_package(array.package)
        item.push({ 'package_name': 'Best Package', 'value': array.packageminutes, 'package': array.package, 'amount': best_pack.package_price, 'plans_discription': best_pack.package_name, 'services': array.services, 'startdate': dateFormat(array.tele_startdate, "yyyy-mm-dd HH:MM:ss"), 'enddate': dateFormat(array.expirydate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.telesmspackagemode == true) {
        let sms_pack = await helper.sms_package(array.telesmspackage)
        item.push({ 'package_name': 'Tele SMS Package', 'package': array.telesmspackage, 'plans_discription': sms_pack.SMS_Plan, 'amount': sms_pack.SMS_Plan_Value, 'value': array.telesmsprvalue, 'startdate': dateFormat(array.telesms_startdate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.telemailpackagemode == true) {
        let mail_pack = await helper.mail_package(array.telemailpackage)
        item.push({ 'package_name': 'Tele Email Package', 'plans_discription': mail_pack.Mail_Plan, 'amount': mail_pack.Mail_Plan_Value, 'package': array.telemailpackage, 'value': array.telemailpackagevalue, 'startdate': dateFormat(array.mail_startdate, "yyyy-mm-dd HH:MM:ss"), 'enddate': dateFormat(array.mailexpirydate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.telemeetpackagemode == true) {
        let meet_pack = await helper.meet_package(array.telemeetpackage)
        item.push({ 'package_name': 'Tele Meet Package', 'plans_discription': meet_pack.Meet_Plan, 'amount': meet_pack.Meet_Plan_Value, 'package': array.telemeetpackage, 'value': array.telemeetpackagevalue, 'startdate': dateFormat(array.meet_startdate, "yyyy-mm-dd HH:MM:ss"), 'enddate': dateFormat(array.meetexpirydate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.teledigitalpackagemode == true) {
        let digital_pack = await helper.digital_package(array.teledigitalpackage)
        item.push({ 'package_name': 'Tele Digital Package', 'plans_discription': digital_pack.Digital_Plan, 'amount': digital_pack.Package_Value, 'package': array.teledigitalpackage, 'value': array.teledigitalpackagevalue, 'startdate': dateFormat(array.digital_startdate, "yyyy-mm-dd HH:MM:ss"), 'enddate': dateFormat(array.digitalexpirydate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.teledigitaladspackagemode == true) {
        let digitalads_pack = await helper.digitalads_package(array.teledigitaladspackage)
        item.push({ 'package_name': 'Tele Digital Ads Package', 'plans_discription': digitalads_pack.Adspackage_name, 'amount': digitalads_pack.Adspackage_value, 'package': array.teledigitaladspackage, 'value': array.teledigitaladspackagevalue, 'startdate': dateFormat(array.digitalads_startdate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.tollfreepackagemode == true) {
        let tollfree_pack = await helper.tollfree_package(array.tollfreepackage)
        item.push({ 'package_name': 'Toll Free Package', 'plans_discription': tollfree_pack.TFree_Plan, 'amount': tollfree_pack.TFree_Value, 'package': array.tollfreepackage, 'value': array.tollfreepackagevalue, 'startdate': dateFormat(array.tollfree_startdate, "yyyy-mm-dd HH:MM:ss") })
    }
    if (array.obdpackagemode == true) {
        let obd_pack = await helper.obd_package(array.obdpackage)
        item.push({ 'package_name': 'OBD Package', 'plans_discription': obd_pack.OBD_Plan, 'amount': obd_pack.OBD_Value, 'package': array.obdpackage, 'value': array.obdpackagevalue, 'startdate': dateFormat(array.obd_startdate, "yyyy-mm-dd HH:MM:ss") })
    }
    async.forEachOf(item, async (stage, key, callback) => {
        let data = {}
        data.name = stage.package_name
        data.start_date = stage.startdate
        data.plans = stage.package
        data.manager_id = managerid
        data.created_by = req.body.created_by
        if (stage.enddate) {
            data.end_date = stage.enddate
        }
        if (stage.services) {
            data.services = JSON.stringify(stage.services)
        }
        if (stage.value) {
            data.plan_value = stage.value
        }
        if (stage.plans_discription) {
            data.plans_discription = stage.plans_discription
        }
        if (stage.amount) {
            data.amount = stage.amount
        }
        let check = { 'manager_id': managerid, 'name': stage.package_name, 'plans': stage.package }
        Manager.check_subscription(check, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                if (rows.length == 0) {
                    Manager.save_subscription(data, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Data Save");
                        }
                    })
                } else {
                    data.s_id = rows[0].s_id
                    Manager.update_subscription(data, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Subscription Update");
                        }
                    })
                }
            }
        })

    })
    res.status(200).send({ "data": 'Subscription created succesfully.' });
})


router.post('/change_subscription', authorize, function (req, res) {
    let data = {}
    data.s_id = req.body.s_id
    data.status = req.body.status
    Manager.change_subscription(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": 'Subscription updated succesfully.' });
        }
    })
})
router.post('/getcustomapi', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getcustomapi(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/savecustomapi', authorize, function (req, res) {
    var api_name = req.body.name;
    var api_endpoint = req.body.endpoint;
    var api_payload = req.body.payload;
    var api_header = req.body.header;
    var api_method = req.body.method;
    var status = req.body.status;
    var created_date = req.body.currentdate;
    var account_id = req.query.tknuserid;
    data = {
        account_id: account_id, created_date: created_date, status: status, api_method: api_method, api_header: api_header,
        api_payload: api_payload, api_endpoint: api_endpoint, api_name: api_name
    }
    Manager.savecustomapi(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong" });
        }
        else {
            res.status(200).send({ "data": "ADD successfully.." });
        }
    })
})
router.post('/updatecustomapi', authorize, function (req, res) {
    var api_id = req.body.api_id;
    var api_name = req.body.name;
    var api_endpoint = req.body.endpoint;
    var api_payload = req.body.payload;
    var api_header = req.body.header;
    var api_method = req.body.method;
    var status = req.body.status;
    var updated_date = new Date();
    var account_id = req.query.tknuserid;
    data = {
        api_id: api_id, account_id: account_id, updated_date: updated_date, status: status, api_method: api_method, api_header: api_header,
        api_payload: api_payload, api_endpoint: api_endpoint, api_name: api_name
    }
    Manager.updatecustomapi(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "Update successfully" });
        }
    })
})
router.get('/getcustomapibyids/:id', authorize, function (req, res) {
    Manager.getcustomapibyid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/deletecustomapi', authorize, function (req, res) {
    Manager.deletecustomapi(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "Delete Successfully..." });
        }
    })
})
router.post('/searchcustomapi', authorize, function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    Manager.searchcustomapi(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//searchmanagaerdata
router.post('/searchmanagaerdata', authorize, function (req, res) {
    //console.log(req.body);

    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '';
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '';
    req.body.enddate = enddate;
    var createdstartObj = new Date(req.body.createdstart);
    var createdstart = req.body.createdstart ? createdstartObj.getFullYear() + '-' + ('0' + (createdstartObj.getMonth() + 1)).slice(-2) + '-' + ('0' + createdstartObj.getDate()).slice(-2) : '';
    req.body.createdstart = createdstart;
    var createdendObj = new Date(req.body.createdend);
    var createdend = req.body.createdend ? createdendObj.getFullYear() + '-' + ('0' + (createdendObj.getMonth() + 1)).slice(-2) + '-' + ('0' + createdendObj.getDate()).slice(-2) : '';
    req.body.createdend = createdend;
    Manager.searchmanagaerdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/supervisiordirectLogin', authorize, function (req, res) {
    const username = req.body.managername;
    const password = req.body.password;
    const isadmin = req.body.isadmin ? req.body.isadmin : false;
    var result = false;
    if (isadmin) {
        Signin.findUser(username, function (err, user) {
            if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
            if (user && user.length > 0) {
                if (user[0].account_type == 2 || user[0].account_type == 1) {
                    // const result = bcrypt.compareSync(password, user[0].account_password);//bcrypt.compareSync(password, user.password);
                    //console.log("result::"+user);
                    //if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });
                    const expiresIn = 24 * 60 * 60;
                    const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type, agentrole: user[0].account_role, uid: username }, SECRET_KEY, {
                        expiresIn: expiresIn
                    });
                    //console.log(accessToken);
                    loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status, agentrole: user[0].account_role ,supervisior_role : user[0].supervisor_only};
                    console.log(loggeduser)
                    Signin.UpdateUser({ is_loggedin: 'yes', login_token: accessToken }, user[0].account_id);
                    res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
                } else {
                    return res.status(200).send({ 'islogin': false, 'msg': 'Access not valid!' });
                }
            } else {
                return res.status(200).send({ 'islogin': false, 'msg': 'User not found!' });
            }
        });
    } else {
        Manager.getsettingbyname('directloginpassword', function (err, data) {
            if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
            if (data && data.length > 0 && password == data[0]['setting_value']) {
                Signin.findUser(username, function (err, user) {
                    if (err) return res.status(200).send({ 'islogin': false, 'msg': 'Server error!' });
                    if (user && user.length > 0) {
                        if (user[0].account_type == 2 || user[0].account_type == 1) {
                            // const result = bcrypt.compareSync(password, user[0].account_password);//bcrypt.compareSync(password, user.password);
                            //console.log("result::"+user);
                            //if (!result) return res.status(200).send({ 'islogin': false, 'msg': 'Password not valid!' });
                            const expiresIn = 24 * 60 * 60;
                            const accessToken = jwt.sign({ id: user[0].account_id, role: user[0].account_type, agentrole: user[0].account_role, uid: username }, SECRET_KEY, {
                                expiresIn: expiresIn
                            });
                            //console.log(accessToken);
                            loggeduser = { id: user[0].account_id, name: user[0].account_name, mobile: user[0].mobile, mobileverify: user[0].is_mobile_verify, voip_status: user[0].voip_status, agentrole: user[0].account_role };
                            Signin.UpdateUser({ is_loggedin: 'yes', login_token: accessToken }, user[0].account_id);
                            res.status(200).send({ 'islogin': true, "user": loggeduser, "access_token": accessToken, "expires_in": expiresIn });
                        } else {
                            return res.status(200).send({ 'islogin': false, 'msg': 'Access not valid!' });
                        }
                    } else {
                        return res.status(200).send({ 'islogin': false, 'msg': 'User not found!' });
                    }
                });
            } else {
                return res.status(200).send({ 'islogin': false, 'msg': 'Invalid password' });
            }
        })
    }
})
router.post('/savedispotiondata', authorize, function (req, res) {
    var disposition = req.body.name;
    var account_id = req.query.tknuserid;
    var sub_disposition = req.body.sub_disposition;
    data = {
        account_id: account_id, disposition: disposition, sub_disposition: sub_disposition
    }
    Manager.savedispotiondata(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "ADD successfully.." });
        }
    })
})
router.post('/updatedispotiondata', authorize, async function (req, res) {
    //console.log(req.body);
    var disposition = req.body.name;
    var id = req.body.id;
    var account_id = req.query.tknuserid;
    var sub_disposition = req.body.sub_disposition
    data = {
        account_id: account_id, disposition: disposition, id: id, sub_disposition: sub_disposition
    }
    Manager.updatedispotiondata(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "Update successfully" });
        }
    })

});
router.post('/getdispotion', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.getdispotion(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getdispositionbyid/:id', authorize, function (req, res) {
    Manager.getdispositionbyid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/deletedispositon', authorize, function (req, res) {
    Manager.deletedispositon(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "Delete Successfully..." });
        }
    })

})

router.post('/get_ip_for_instert_data', authorize, function (req, res) {
    console.log(req.body);
    const insterdata = {
        account_id: req.body.account_id, action: req.body.action, action_date: new Date(), ip: req.body.ip,old_req : req.body.old_req,new_req:req.body.new_req
    }
    Manager.insertupdatemangerdata(insterdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "" });
        }
    })

})
router.get('/get_all_managers_account_status/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Manager.get_all_managers_account_status(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/active_user_account_status/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.active_user_account_status(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/expire_user_account_status/:id', function (req, res) {
    //console.log(req.params.id);
    Manager.expire_user_account_status(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

module.exports = router;