// var APIRESTERPNext = require('restapi-erpnext');
const bcrypt = require('bcryptjs');

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const authorize = require("../middlewares/auth");
var ERP = require('../model/erp');
var Default = require('../model/default');
var APIRESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
var Products = require('../model/products');
// const { delete } = require('request');
var APIRESTERPNext = new APIRESTERPNext({
    username: 'Administrator',
    password: 'Garuda@dv1234',
    baseUrl: 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
})
var helper = require("../helper/common");
var dateFormat = require("dateformat");
const mime = require('mime');
var async = require("async");
var nodemailer = require('nodemailer');
var fs = require('fs');
var json2xls = require('json2xls');
var pdf = require('html-pdf');
var options = { format: 'Letter' };
var API = require('../model/api');
var multer = require('multer');
const { agent } = require('urllib');
var converter = require('number-to-words');
const Erp = require('../model/erp');
var Contacts = require('../model/Contacts');
var requestify = require('requestify');
var urllib = require('urllib');
const { Parser } = require('json2csv');
var pdf = require('html-pdf');
var request = require('request');
var path = require('path');
//const environment = require('../../src/environments/environment');

// var APIRESTERPNext = new APIRESTERPNext({
//     username: 'sales@cloudX.in',
//     password: 'cloudX@321',
// })


// APIRESTERPNext.sainterpnext('/api/resource/Lead', 'GET', null).then(function (res) {
//     console.log('Resultado', res);
//   })

// var lead = {"doctype": "Lead", "lead_name": "nimesh","email_id":"nimesh.garuda@gmail.com","mobile_no":"9044524218"}


// APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (res) {
//     console.log('Resultado', res);
//   })
// var transOptions = {
//     host: 'mail.cloudX.in',
//     port: 587,
//     secure: false,
//     auth: {
//         user: '',
//         pass: '',
//     },
// };
// var transporter = nodemailer.createTransport(transOptions);
// var frommail = "cloudX<no-reply@cloudX.in>"

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

router.post('/lead_create', authorize, function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var lead = { "doctype": "Lead", "lead_name": name, "email_id": email, "mobile_no": mobile }

    APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', req.body).then(function (response) {
        if (response) {
            res.status(200).send({ "msg": 'Create Lead Succesfully' });
        }
    })

})

router.post('/saveissue', authorize, async function (req, res) {    //console.log(req.body);
    console.log(req.body);
    req.body.assign_to = null;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        if (req.body.managerid == 48) {
            req.body.assign_to = await helper.AssignTicketToCurrentSalesAgent(req.body.raised_by);
            if (req.body.assign_to) {
                console.log('Already Assign');
            } else {
                req.body.assign_to = await helper.AssignTicketToAgent();
            }
        }
        if (req.body.managerid != 48) {
            var managerid = await helper.GetManagerIdByAgent(req.body.account_id)
            req.body.account_id = managerid
            req.body.agent_id = req.body.raised_by
        }
    }
    if (req.body.assign_to) {
        console.log("Alreay Assign");
    } else {
        req.body.assign_to = await helper.AssignTicketToAgent();
    }
    delete req.body.managerid;
    if (req.body.agent_id) {
        req.body.agent_id = req.body.agent_id
    } else {
        req.body.agent_id = null;
    }
    ERP.addissue(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': 'Something went wrong!!' });
        }
        else {
            //console.log(rows)
            var raisedbyname = await helper.GetUsername(req.body.raised_by);
            var note = 'Create Ticket By ' + raisedbyname;
            var data = { ticket_id: rows.insertId, account_id: req.body.account_id, agent_id: req.body.agent_id, current_status: 'Open', notes: note, ticket_image: req.body.ticket_image, ticket_description: req.body.description }
            ERP.addtickettimeline(data, async function (err, rows1) {
                if (err) {
                    console.log(err);
                    return res.status(200).send({ 'data': 'Something went wrong!!' });
                }
                else {
                    var assigntoname = '';
                    var note = '';
                    if (req.body.assign_to) {
                        assigntoname = await helper.GetUsername(req.body.assign_to);
                        var note = 'Ticket assign to ' + assigntoname;
                    }

                    var data = { ticket_id: rows.insertId, account_id: req.body.account_id, agent_id: req.body.agent_id, current_status: 'Open', assign_to: req.body.assign_to, notes: note }
                    ERP.addtickettimeline(data, function (err, rows) {
                        if (err) {
                            console.log(err);
                            return res.status(200).send({ 'data': 'Something went wrong!!' });
                        }
                        else {
                            return res.status(200).send({ 'data': 'Ticket generated Succesfully' });
                        }

                    })
                }
            })

        }

    })
})

router.post('/count_lead', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_lead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_lead_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    console.log(req.body.startdate)
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_lead_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_Junk_lead', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_Junk_lead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_Junk_lead_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    console.log(req.body)
    ERP.count_Junk_lead_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})


router.post('/count_Junk_need_analysis', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_Junk_need_analysis(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})


router.post('/count_Junk_need_analysis_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    console.log(req.body.startdate)
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_Junk_need_analysis_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})


router.post('/count_proposal', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_proposal(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_proposal_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    console.log(req.body.startdate)
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_proposal_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_negotiation', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_negotiation(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_negotiation_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    console.log(req.body.startdate)
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_negotiation_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})


router.post('/count_won', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_won(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/count_won_date', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    console.log(req.body.startdate)
    var startdate1 = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate1;
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate1;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    ERP.count_won_date(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})


router.post('/get_lead', authorize, async function (req, res) {
    // var page_number = req.body.page_number;
    // var data_count = req.body.data_count;
    // var lead_page = { "limit_start": 0, "limit_page_length": 10 }
    // APIRESTERPNext.getLead(lead_page).then(function (resp) {
    //     return res.status(200).send({ 'data': resp });
    // })
    // console.log('here');
    // console.log(req.params.id);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;

    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var agentrole = req.body.agentrole;
    console.log("role::" + agentrole);
    if (agentrole == 'supervisor') {
        ERP.get_supervisor_lead_list(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                return res.status(200).send({ 'data': [] });
            }
            else {
                // console.log(rows)
                return res.status(200).send({ 'data': rows });
            }
        })
    } else {
        ERP.get_lead_list_api(req.body, function (err, rows) {
            if (err) {
                console.log(err);
                return res.status(200).send({ 'data': [] });
            }
            else {
                // console.log(rows)
                return res.status(200).send({ 'data': rows });
            }
        })
    }

})

/*router.post('/get_lead_status_lead', function (req, res) {
    var page_number = req.body.page_number;
    var data_count = req.body.data_count;
    var lead_page = { "limit_start": 0, "limit_page_length": 10 }
    APIRESTERPNext.get_lead_status_lead(lead_page).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})*/

router.post('/update_lead', authorize, function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var lead = { "doctype": "Lead", "assign_to:": email }

    APIRESTERPNext.updateLeadByName(name, lead).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })

})


router.post('/get_DocType', function (req, res) {
    APIRESTERPNext.getDocType().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



router.post('/get_Opportunity', function (req, res) {
    APIRESTERPNext.getOpportunity().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/get_Opportunity_Type', function (req, res) {
    APIRESTERPNext.getOpportunity_typeName().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

router.post('/get_user_list_filter', function (req, res) {
    APIRESTERPNext.getUserName().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

router.post('/get_sales_stage', function (req, res) {
    APIRESTERPNext.get_sales_stage().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

//ERP CURRENCY

// router.post('/get_Currency', function (req, res) {
//     APIRESTERPNext.get_Currency().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })

//DATABASE CURRENCY

router.post('/get_Currency', function (req, res) {
    ERP.get_currency({}, function (err, rows) {
        if (err) {
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


router.post('/get_lead_Source', function (req, res) {
    APIRESTERPNext.get_lead_source().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



router.post('/get_Salutation', function (req, res) {
    APIRESTERPNext.get_Salutation().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/get_Designation', function (req, res) {
    console.log("data")
    APIRESTERPNext.get_Designation().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


// router.post('/get_Gender', function (req, res) {
//     APIRESTERPNext.get_Gender().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })


router.post('/get_Campaign', function (req, res) {
    APIRESTERPNext.get_Campaign().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


//  Data Base Country

router.post('/get_Country', function (req, res) {
    ERP.get_country({}, function (err, rows) {
        if (err) {
            res.status(500).send({ "ERROR": err });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send("COUNTRY DATA NOT FOUNT");
            }
        }
    })
})

//ERP Country

// router.post('/get_Country', function (req, res) {
//     APIRESTERPNext.get_Country().then(function (resp) {
//         return  res.status(200).send({'data':resp}); 
//     })
// })


router.post('/get_Company', function (req, res) {
    APIRESTERPNext.get_Company().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

//ERP Segment

// router.post('/get_market_segment', function (req, res) {
//     APIRESTERPNext.get_market_segment().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })

// DATA BASE SEGMENT
router.post('/get_market_segment', function (req, res) {
    ERP.get_market_segment({}, function (err, rows) {
        if (err) {
            res.status(500).send({ "data": [] });
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


router.post('/get_industry_type', function (req, res) {
    APIRESTERPNext.get_industry_type().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



router.post('/get_customer_list', function (req, res) {
    APIRESTERPNext.get_customer_list().then(function (resp) {
        console.log(resp.length);
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/test', function (req, res) {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://erp.cloudX.in/api/method/login?usr=khodu.garuda@gmail.com&pwd=Ps@78143',
        'headers': {

        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        return res.status(200).send(response.headers['set-cookie']);
    });
})

// router.post('/post_Opportunity', function (req, res) {
//     APIRESTERPNext.createOpportunity(req.body).then(function (resp) {
//         console.log(resp)
//         return res.status(200).send({ 'data': resp });
//     })
// })

// router.post('/post_Lead', function (req, res) {
//     var array = req.body
//     APIRESTERPNext.post_Lead(array).then(function (resp) {
//         console.log(resp)
//         return  res.status(200).send({'data':resp}); 
//     })
// })

router.post('/get_lead_search', async function (req, res) {
    console.log(req.body)
    var search_name = req.body.search_name
    APIRESTERPNext.getLeadSearchfun(search_name).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


// router.post('/get_system_user_assign_lead', function (req, res) {
//     APIRESTERPNext.getUserList_status_lead().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })


// router.post('/assign_lead', function (req, res) {
//     console.log(req.body)
//     var data = { 'assign_to': ["khodu.garuda@gmail.com"] }
//     APIRESTERPNext.updateLeadByName_assign(req.body.id, data).then(function (resp) {
//         console.log(resp)
//         return res.status(200).send({ 'data': resp });
//     })
// })

router.post('/get_system_user_assign_without_lead', function (req, res) {
    var page_number = req.body.page_number;
    var data_count = req.body.data_count;
    var lead_page = { "limit_start": 0, "limit_page_length": 100 }
    APIRESTERPNext.get_lead_status_not_lead(lead_page).then(function (resp) {
        console.log(resp.length)
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/get_Salutation_list', function (req, res) {
    APIRESTERPNext.get_Salutation_list().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


// router.post('/updateLeadAll', function (req, res) {
//     var name = req.body.id_change
//     APIRESTERPNext.updateLeadAll(name, req.body).then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })

router.get('/get_customers', function (req, res) {
    APIRESTERPNext.getCustomersName().then(function (resp) {
        console.log('Resultado', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_issue', function (req, res) {
    APIRESTERPNext.get_issue().then(function (resp) {
        console.log('Resultado', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_projects', function (req, res) {
    APIRESTERPNext.get_projects().then(function (resp) {
        console.log('Resultado', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_contacts', function (req, res) {
    APIRESTERPNext.get_contacts().then(function (resp) {
        console.log('Resultado', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/getCompany', function (req, res) {
    APIRESTERPNext.get_Company().then(function (resp) {
        console.log('Resultado1', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/getEmailAccount', function (req, res) {
    APIRESTERPNext.get_emailaccount().then(function (resp) {
        console.log('Resultado1', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_ServiceLevelAgreement', function (req, res) {
    APIRESTERPNext.get_servicelevelagreement().then(function (resp) {
        console.log('Resultado', resp.length);
        return res.status(200).send({ 'data': resp });
    })
})
// router.post('/getOpportunity_status_not_Quotation', function (req, res) {
//     APIRESTERPNext.getOpportunity_status_not_Quotation().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })


// router.post('/update_Opportunity', function (req, res) {
//     var name = req.body.id_change
//     APIRESTERPNext.update_Opportunity(name, req.body).then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })


// router.post('/getOpportunity_status_Quotation', function (req, res) {
//     APIRESTERPNext.getOpportunity_status_Quotation().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })


router.post('/get_Item', authorize, async function (req, res) {
    var account_id = req.query.tknuserid
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        account_id = managerid
    }
    ERP.getitem(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
    // APIRESTERPNext.getItem().then(function (resp) {
    //     console.log('Resultado', resp.length);
    //     return res.status(200).send({ 'data': resp });
    // })
})
router.post('/getactiveproduct', authorize, async function (req, res) {
    var account_id = req.query.tknuserid
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        account_id = managerid
    }
    ERP.getactiveproduct(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
    // APIRESTERPNext.getItem().then(function (resp) {
    //     console.log('Resultado', resp.length);
    //     return res.status(200).send({ 'data': resp });
    // })
})



router.post('/database_Item', function (req, res) {
    APIRESTERPNext.getItem().then(async function (resp) {
        var i;
        for (i = 0; i < resp.length; i++) {
            console.log(resp[i].price_list_rate);
            await helper.getsaveitems(resp[i])
        }
    })
})


function getsaveitems(i) {
    console.log(i.name)

}

router.post('/getQuotation_status_order', function (req, res) {
    APIRESTERPNext.getQuotation_status_order().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


// router.post('/create_Customer', function (req, res) {
//     APIRESTERPNext.create_Customer(req.body).then(function (resp) {
//         console.log(resp)
//         return res.status(200).send({ 'data': resp });
//     })
// })

router.post('/create_User', function (req, res) {
    APIRESTERPNext.createUSers(req.body).then(function (resp) {
        console.log(resp)
        return res.status(200).send({ 'data': resp });
    })
})

// with erp create product

// router.post('/create_Item', async function (req, res) {
//     console.log("body");
//     // console.log(JSON.stringify(req.body));
//     var now = new Date();

//     var item_code = await helper.randomString(8);
//     //console.log("item_code :::"+ item_code);

//     APIRESTERPNext.checkProduct(item_code).then(async function (resp) {
//         if (resp.name && resp.name != '') {
//             item_code += await helper.randomString(3);
//         }
//         var item_data_erp = {
//             "docstatus": 0,
//             "doctype": "Item",
//             "__islocal": 1,
//             "__unsaved": 1,
//             "naming_series": "STO-ITEM-.YYYY.-",
//             "is_item_from_hub": 0,
//             "stock_uom": "Nos",
//             "disabled": 0,
//             "allow_alternative_item": 0,
//             "is_stock_item": 0,
//             "include_item_in_manufacturing": 1,
//             "is_fixed_asset": 0,
//             "auto_create_assets": 0,
//             "end_of_life": "2099-12-31",
//             "default_material_request_type": "Purchase",
//             "valuation_method": "",
//             "has_batch_no": 0,
//             "create_new_batch": 0,
//             "has_expiry_date": 0,
//             "retain_sample": 0,
//             "has_serial_no": 0,
//             "has_variants": 0,
//             "variant_based_on": "Item Attribute",
//             "is_purchase_item": 1,
//             "min_order_qty": 0,
//             "is_customer_provided_item": 0,
//             "delivered_by_supplier": 0,
//             "country_of_origin": "India",
//             "is_sales_item": 1,
//             "enable_deferred_revenue": 0,
//             "enable_deferred_expense": 0,
//             "inspection_required_before_purchase": 0,
//             "inspection_required_before_delivery": 0,
//             "is_sub_contracted_item": 0,
//             "show_in_website": 0,
//             "show_variant_in_website": 0,
//             "publish_in_hub": 0,
//             "synced_with_hub": 0,
//             "__run_link_triggers": 1,
//             "item_code": item_code,
//             "item_name": req.body.name,
//             "item_group": "Products",
//             "create_variant": 0
//         };

//         APIRESTERPNext.createAnItem(item_data_erp).then(function (resp) {
//             var prod_code_name = resp.name;

//             var item_price_obj = {
//                 "doctype": "Item Price",
//                 "__islocal": 1,
//                 "__unsaved": 1,
//                 "packing_unit": 0,
//                 "buying": 0,
//                 "selling": 1,
//                 "currency": "INR",
//                 "valid_from": dateFormat(now, "yyyy-mm-dd"),
//                 "lead_time_days": 0,
//                 "item_code": prod_code_name,
//                 "brand": null,
//                 "item_name": req.body.name,
//                 "item_description": req.body.description,
//                 "uom": "Nos",
//                 "price_list": "Standard Selling",
//                 "price_list_rate": req.body.price
//             }

//             APIRESTERPNext.createItemPrice(item_price_obj).then(function (respo) {
//                 var item_price_id = respo.name;

//                 var name = req.body.name;
//                 var description = req.body.description;
//                 var longdescription = req.body.longdescription;
//                 var emailtemplate = req.body.emailtemplate;
//                 var smstemplate = req.body.smstemplate;
//                 var whatsapptemplate = req.body.whatsapptemplate;
//                 var status = req.body.status;
//                 var price = req.body.price;
//                 var unit = req.body.unit;
//                 var thumbnailfile = req.body.thimage;
//                 var userid = req.body.userid;

//                 var actual_qty = req.body.actual_qty;
//                 var amount = req.body.amount;
//                 var item_name = req.body.name;
//                 var p_item_code = prod_code_name;
//                 var is_sync = 'yes';

//                 fdata = {
//                     item_price_id: item_price_id, amount: amount, actual_qty: actual_qty, item_name: item_name, item_code: p_item_code, is_sync: is_sync, product_name: name, product_desc: description, product_long_desc: longdescription, sms_template: smstemplate, email_template: emailtemplate, product_status: status, account_id: userid, whatsapp_template: whatsapptemplate, unit: unit, price: price, product_thumbnail: thumbnailfile
//                 };
//                 //fdata = { account_type: 1, account_name: name, account_password: password, email: email, mobile: mobile, created_by: created_by, create_date: m };
//                 Products.insertproduct(fdata, function (err, rows) {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         res.status(200).send({ "data": 'Product saved succesfully.' });
//                     }

//                 })

//             })

//         })

//     })


// })

// without erp system create product
router.post('/create_Item', authorize, async function (req, res) {
    console.log("body");
    // console.log(JSON.stringify(req.body));
    var now = new Date();
    var account_id = req.query.tknuserid
    var item_code = await helper.randomString(8);
    //console.log("item_code :::"+ item_code);


    var name = req.body.name;
    var description = req.body.description;
    // var longdescription = req.body.longdescription;
    var status = req.body.status;
    var price = req.body.price;
    var unit = req.body.unit;
    var thumbnailfile = req.body.thimage;
    var userid = req.body.userid;

    var actual_qty = req.body.actual_qty;
    var amount = req.body.amount;
    var p_item_code = item_code;

    fdata = {
        User_id: account_id, group_id: req.body.group_id, product_name: name, hsn: req.body.hsn, amount: amount, actual_qty: actual_qty, product_code: p_item_code, product_desc: description, product_status: status, account_id: userid, unit: unit, price: price, product_thumbnail: thumbnailfile
    };
    Products.insertproduct(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Product saved succesfully.' });
        }

    })


})

//with erp system update product

// router.post('/update_Item', async function (req, res) {
//     console.log("body");
//     console.log(JSON.stringify(req.body));

//     var item_code = req.body.item_code;
//     var item_price_id = req.body.item_price_id;

//     var item_data_erp = {
//         "docstatus": 0,
//         "doctype": "Item",
//         "name": item_code,
//         "item_code": item_code,
//         "item_name": req.body.name,
//         "item_group": "Products",
//         "create_variant": 0,
//         "description": req.body.description
//     };

//     APIRESTERPNext.updateItemByName(item_code, item_data_erp).then(function (resp) {
//         // console.log("update data");
//         // console.log(JSON.stringify(resp));

//         if (resp && resp.name != '') {
//             var item_price_erp = {
//                 "docstatus": 0,
//                 "doctype": "Item Price",
//                 "name": item_price_id,
//                 "item_code": resp.name,
//                 "item_name": req.body.name,
//                 "price_list_rate": req.body.price,
//                 "item_description": req.body.description
//             };

//             // var item_price_erp = {"name":"f3b9f0c23b","owner":"Administrator","creation":"2021-05-15 18:31:24.764838","modified":"2021-05-15 18:31:24.764838","modified_by":"Administrator","idx":0,"docstatus":0,"item_code":"TELE2vcROR5I","uom":"Nos","packing_unit":0,"item_name":"ERP PRODUCT 2","item_description":"ERP PRODUCT 2 by GARUDA ADV","price_list":"Standard Selling","buying":0,"selling":1,"currency":"INR","price_list_rate":1000,"valid_from":"2021-05-15","lead_time_days":0,"doctype":"Item Price","__last_sync_on":"2021-05-15T13:08:05.559Z","__unsaved":1};

//             APIRESTERPNext.updateItemPriceByName(item_price_id, item_price_erp).then(function (respo) {
//                 var productid = req.body.productid;
//                 var name = req.body.name;
//                 var description = req.body.description;
//                 var longdescription = req.body.longdescription;
//                 var emailtemplate = req.body.emailtemplate;
//                 var smstemplate = req.body.smstemplate;
//                 var whatsapptemplate = req.body.whatsapptemplate;
//                 var status = req.body.status;
//                 var price = req.body.price;
//                 var unit = req.body.unit;
//                 var thumbnailfile_1 = req.body.thimage;
//                 var p_thumbnail = req.body.product_thumbnail;

//                 var actual_qty = req.body.actual_qty;
//                 var amount = req.body.amount;
//                 var item_name = req.body.name;
//                 var is_sync = 'yes';

//                 if (typeof (thumbnailfile_1) == 'undefined') {

//                     var thumbnailfile = p_thumbnail;
//                 } else {
//                     const path = './uploads/products/thumbnail/' + p_thumbnail;
//                     fs.unlinkSync(path);
//                     var thumbnailfile = thumbnailfile_1;
//                 }

//                 var userid = req.body.userid;

//                 fdata = {
//                     actual_qty: actual_qty, amount: amount, item_name: item_name, productid: productid, product_name: name, product_desc: description, product_long_desc: longdescription, sms_template: smstemplate, email_template: emailtemplate, product_status: status, account_id: userid, whatsapp_template: whatsapptemplate, unit: unit, price: price, product_thumbnail: thumbnailfile
//                 };

//                 Products.updateproduct(fdata, function (err, rows) {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         res.status(200).send({ "data": 'Product updated succesfully.' });
//                     }
//                 })

//             })
//         }
//     })

// });


router.post('/update_Item', authorize, async function (req, res) {
    var productid = req.body.productid;
    var name = req.body.name;
    var description = req.body.description;
    // var longdescription = req.body.longdescription;
    var status = req.body.status;
    var price = req.body.price;
    var unit = req.body.unit;
    var thumbnailfile_1 = req.body.thimage;
    var p_thumbnail = req.body.product_thumbnail;

    var actual_qty = req.body.actual_qty;
    var amount = req.body.amount;
    if (typeof (thumbnailfile_1) == 'undefined') {

        var thumbnailfile = p_thumbnail;
    } else {
        const path = p_thumbnail;
        fs.unlinkSync(path);
        var thumbnailfile = thumbnailfile_1;
    }

    var userid = req.body.userid;

    fdata = {
        actual_qty: actual_qty, amount: amount, productid: productid, hsn: req.body.hsn, product_name: name, product_desc: description, product_status: status, account_id: userid, unit: unit, price: price, product_thumbnail: thumbnailfile
    };

    Products.updateproduct(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Product updated succesfully.' });
        }
    })


});

// router.post('/get_Customer_list_api', function (req, res) {
//     APIRESTERPNext.get_Customer_list_api().then(function (resp) {
//         return res.status(200).send({ 'data': resp });
//     })
// })

router.get('/getissuetype', authorize, async function (req, res) {
    var role = req.query.tknuserrole
    var id = req.query.tknuserid
    if (role == 1) {
        id = await helper.GetManagerIdByAgent(id)
    }
    ERP.getissuetype(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_PriceList', function (req, res) {
    APIRESTERPNext.get_pricelist().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_Warehouse', function (req, res) {
    APIRESTERPNext.get_warehouse().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_SellingShippingRule', function (req, res) {
    APIRESTERPNext.get_sellingshippingrule().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})

router.get('/get_salestaxesandchargestemplate', function (req, res) {
    APIRESTERPNext.get_salestaxesandchargestemplate().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_couponcode', function (req, res) {
    APIRESTERPNext.get_couponcode().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_paymentermstemplate', function (req, res) {
    APIRESTERPNext.get_paymentermstemplate().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_termsconditions', function (req, res) {
    APIRESTERPNext.get_termsconditions().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_purchaseorder', function (req, res) {
    APIRESTERPNext.get_purchaseorder().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_leadsource', function (req, res) {
    APIRESTERPNext.get_leadsource().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_letterhead', function (req, res) {
    APIRESTERPNext.get_letterhead().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_salespartner', function (req, res) {
    APIRESTERPNext.get_salespartner().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})
router.get('/get_autorepeat', function (req, res) {
    APIRESTERPNext.get_autorepeat().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



// router.post('/post_Lead', authorize, async function (req, res) {
//     var array = req.body
//     console.log(array);
//     var account_id = req.query.tknuserid
//     var role = req.query.tknuserrole
//     var agentid = ''
//     if (role == 1) {
//         agentid = account_id
//         account_id = await helper.GetManagerIdByAgent(account_id)
//     }
//     ERP.get_username(account_id, function (err, rows) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(rows[0].erp_email);
//             var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
//             APIRESTERPNext.post_Lead(id, array).then(function (resp) {
//                 console.log(resp);
//                 if (resp.name) {
//                     resp.is_sync = "yes"
//                     resp.User_id = account_id;
//                     if (agentid > 0) {
//                         resp.agent_id = agentid;
//                     }
//                     resp.currency = req.body.currency
//                     resp.probability = req.body.probability
//                     resp.opportunity_amount = req.body.opportunity_amount
//                     //Address
//                     resp.address_type = req.body.address_type
//                     resp.address_title = req.body.address_title
//                     resp.state = req.body.state
//                     resp.country = req.body.country
//                     resp.address_line1 = req.body.address_line1
//                     resp.address_line2 = req.body.address_line2
//                     resp.pincode = req.body.pincode
//                     resp.city = req.body.city

//                     ERP.addlead_db(resp, function (err, rows) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             console.log(rows)
//                             return res.status(200).send({ 'data': rows });
//                         }

//                     })

//                 } else {
//                     let date_ob = new Date();
//                     var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
//                     req.body.creation = a
//                     req.body.User_id = account_id;
//                     req.body.is_sync = "no"
//                     if (agentid > 0) {
//                         resp.agent_id = agentid;
//                     }
//                     ERP.addlead_db(req.body, function (err, rows) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             return res.status(200).send({ 'data': rows });
//                         }

//                     })
//                 }
//             })
//         }
//     })

// })


router.post('/updateLeadAll_address', authorize, async function (req, response) {
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    var agentid = ''
    var address_type = req.body.address_type
    var address_title = req.body.address_title
    var state = req.body.state
    var country = req.body.country
    var address_line1 = req.body.address_line1
    var address_line2 = req.body.address_line2
    var pincode = req.body.pincode
    var city = req.body.city
    var county = req.body.county
    let res = {}
    res.address_type = address_type,
        res.address_title = address_title,
        res.state = state
    res.country = country
    res.address_line1 = address_line1
    res.address_line2 = address_line2
    res.pincode = pincode
    res.city = city
    res.county = county
    res.name = req.body.name
    ERP.updatelead(res, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log("Done");
        }
    })
})

// router.post('/updateLeadAll', authorize, async function (req, res) {
//     var account_id = req.query.tknuserid
//     var role = req.query.tknuserrole
//     var agentid = ''
//     if (role == 1) {
//         agentid = account_id
//         account_id = await helper.GetManagerIdByAgent(account_id)
//     }
//     ERP.get_username(account_id,async function (err, rows) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(rows[0].erp_email);
//             var ob = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
//             delete req.body.address_type,
//             delete req.body.address_title,
//             delete req.body.state
//             delete req.body.country
//             delete req.body.address_line1
//             delete req.body.address_line2
//             delete req.body.pincode
//             delete req.body.city
//             delete req.body.county
//             console.log(req.body)
//             APIRESTERPNext.updateLeadAll(ob, req.body.name, req.body).then(function (resp) {
//                 if (resp.name) {
//                     console.log("start");
//                     resp.is_sync = "yes"
//                     resp.currency = req.body.currency
//                     resp.probability = req.body.probability
//                     resp.opportunity_amount = req.body.opportunity_amount
//                     delete resp.address_type,
//                     delete resp.address_title,
//                     delete resp.state
//                     delete resp.country
//                     delete resp.address_line1
//                     delete resp.address_line2
//                     delete resp.pincode
//                     delete resp.city
//                     delete resp.county
//                     ERP.updatelead(resp, function (err, rows) {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             // console.log("Done");
//                             return res.status(200).send({ 'data': rows });
//                         }
//                     })
//                 } else {
//                     console.log(err);
//                 }
//             })


//         }
//     })
// })


router.get('/get_lead_status_lead', authorize, async function (req, res) {
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    ERP.get_lead_status_lead(account_id, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_lead_status_notlead', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    ERP.get_lead_status_notlead(account_id, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/post_Opportunity', authorize, function (req, res) {
    var array = req.body
    var account_id = req.query.tknuserid
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            APIRESTERPNext.createOpportunity(id, array).then(function (resp) {
                if (resp.name) {
                    resp.User_id = req.query.tknuserid;
                    resp.is_sync = "yes"
                    delete resp.lost_reasons
                    delete resp.items
                    ERP.addopp_db(resp, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(rows)
                            return res.status(200).send({ 'data': rows });
                        }

                    })

                } else {
                    let date_ob = new Date();
                    var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                    req.body.creation = a
                    req.body.User_id = req.query.tknuserid;
                    req.body.is_sync = "no"
                    ERP.addopp_db(req.body, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            return res.status(200).send({ 'data': rows });
                        }

                    })
                }
            })
        }
    })
})



router.post('/update_Opportunity', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    console.log(account_id)
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var ob = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            APIRESTERPNext.update_Opportunity(ob, req.body.name, req.body).then(function (resp) {
                if (resp.name) {
                    console.log("start");
                    resp.is_sync = "yes"
                    delete resp.lost_reasons
                    delete resp.items
                    resp.is_sync = "yes"
                    ERP.updateopp(resp, function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Done");
                            return res.status(200).send({ 'data': rows });
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        }
    })
})



router.post('/getOpportunity_status_not_Quotation', authorize, function (req, res) {
    var account_id = req.query.tknuserid;
    var role = req.query.tknuserrole
    console.log("start")
    console.log(account_id, role)
    ERP.getOpportunity_status_not_Quotation(account_id, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/getOpportunity_status_Quotation', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    ERP.getOpportunity_status_Quotation(account_id, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getLeadDetail/:id', authorize, async function (req, res) {
    //console.log(req.params.id);
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    console.log(account_id);
    if (role == 1) {
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    ERP.getleadetailbyid_role(req.params.id, account_id, req.query.tknuserid, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadagentdetail/:id', authorize, async function (req, res) {
    //console.log(req.params.id);
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    console.log(account_id);
    if (role == 1) {
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    ERP.getleadagentdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/save_leadnote', function (req, res) {
    APIRESTERPNext.saveLeadNote(req.body).then(function (resp) {
        if (resp) {
            return res.status(200).send({ 'data': 'Create Note Succesfully' });
        }
    })
})


// erp comment

// router.post('/save_leadcomment', function (req, res) {
//     console.log("data report");
//     console.log(JSON.stringify(req.body));
//     //var title = req.body.title;
//     var comment = req.body.note;
//     var lead_id = req.body.lead_id;
//     var lead_name = req.body.name;
//     var comment_by = req.body.comment_by;

//     var cdata = {
//         "docstatus": 0,
//         "doctype": "Comment",
//         "__islocal": 1,
//         "__unsaved": 1,
//         "comment_type": "Comment",
//         "published": 0,
//         "seen": 0,
//         "content": comment,
//         "reference_doctype": "Lead",
//         "link_doctype": "Lead",
//         "reference_name": lead_name,
//         "link_name": lead_name,
//         //"subject":title,
//         "comment_by": comment_by
//     }
//     var fdata = { lead_id: lead_id, comment: comment, comment_by: comment_by };
//     APIRESTERPNext.saveLeadComment(cdata).then(function (resp) {
//         if (resp) {

//             // console.log("data");
//             // console.log(JSON.stringify(resp));

//             if (resp.statusCode && resp.statusCode > 0) {
//                 var is_sync = 'no';

//             } else {
//                 var is_sync = 'yes';
//                 var lead_com_id = resp.name;
//                 fdata['lead_com_id'] = lead_com_id;
//             }
//             var now = new Date();
//             fdata['c_date'] = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
//             fdata['is_sync'] = is_sync;
//             ERP.add_lead_comment(fdata, function (err, rows) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     return res.status(200).send({ 'data': 'Comment sent Succesfully' });
//                 }
//             })


//         }
//     })
// })





router.post('/create_Customer', authorize, function (req, res) {
    var array = req.body
    var account_id = req.query.tknuserid
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            APIRESTERPNext.create_Customer(id, array).then(function (resp) {
                console.log(resp);
                if (resp.name) {
                    resp.User_id = req.query.tknuserid;
                    resp.is_sync = "yes"
                    delete resp.sales_team
                    delete resp.credit_limits
                    delete resp.accounts
                    delete resp.companies
                    ERP.addcustomer_db(resp, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(rows)
                            return res.status(200).send({ 'data': rows });
                        }

                    })

                } else {
                    let date_ob = new Date();
                    var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                    req.body.creation = a
                    req.body.User_id = req.query.tknuserid;
                    req.body.is_sync = "no"
                    ERP.addcustomer_db(req.body, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            return res.status(200).send({ 'data': rows });
                        }

                    })
                }
            })
        }
    })
})


router.post('/get_Customer_list_api', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    console.log(account_id)
    ERP.get_Customer_list_api(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            console.log()
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/get_system_user_assign_lead', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    ERP.get_Agent_list_api(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/assign_lead', authorize, function (req, res) {
    var account_id = req.query.tknuserid;

    req.body.User_id = account_id;
    var now = new Date();
    req.body.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    req.body.modified_by = req.query.tknuid
    req.body.lead_owner = req.query.tknuid
    
    ERP.assign_lead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': 'Something went wrong!!' });
        } else {
            return res.status(200).send({ 'data': 'Assign Agent Succesfully' });
        }
    })
})

router.get('/get_lead_status_won', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    ERP.get_lead_status_won(account_id, role, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_lead_status_lost', authorize, function (req, res) {
    var account_id = req.query.tknuserid

    ERP.get_lead_status_lost(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getLeadComments/:id', authorize, function (req, res) {
    var account_id = req.query.tknuserid;
    var lead_id = req.params.id;
    //console.log('lead_id ::'+lead_id);
    ERP.get_lead_comments(lead_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_lead_status_lost', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    ERP.get_lead_status_lost(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/sales_taxes_api', function (req, res) {
    APIRESTERPNext.sales_taxes_api().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/Tax_Category', function (req, res) {
    APIRESTERPNext.Tax_Category().then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



// router.post('/post_quotation', authorize, function (req, res) {
//     var array = req.body
//     var account_id = req.query.tknuserid
//     console.log(req.body.lead_serial);
//     ERP.get_username(account_id, function (err, rows) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(rows[0].erp_email);
//             var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
//             APIRESTERPNext.post_quotation(id, array).then(function (resp) {
//                 console.log(resp);
//                 if (resp.name) {
//                     console.log("start:::::::::::::::::::::::::::::::")

//                     resp.item = JSON.stringify(resp.item)
//                     resp.items = JSON.stringify(resp.items)
//                     resp.taxes = JSON.stringify(resp.taxes)
//                     resp.payment_schedule = JSON.stringify(resp.payment_schedule)
//                     resp.lost_reasons = JSON.stringify(resp.lost_reasons)
//                     resp.pricing_rules = JSON.stringify(resp.pricing_rules)
//                     resp.User_id = account_id
//                     resp.is_sync = "yes"
//                     // delete resp.credit_limits
//                     // delete resp.accounts
//                     // delete resp.companies
//                     resp.party_name = req.body.lead_serial
//                     console.log(resp)
//                     ERP.addquotation_db(resp, function (err, rows) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             console.log(rows)
//                             return res.status(200).send({ 'data': rows });
//                         }

//                     })

//                 } else {
//                     console.log("END::::::::::::::::::::::::::::::::::::")
//                     let date_ob = new Date();
//                     var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
//                     req.body.creation = a
//                     req.body.User_id = req.query.tknuserid;
//                     req.body.is_sync = "no"
//                     delete req.body.item
//                     ERP.addquotation_db(req.body, function (err, rows) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             return res.status(200).send({ 'data': rows });
//                         }

//                     })
//                 }
//             })
//         }
//     })
// })




router.post('/create_Customer_salesOrder', authorize, function (req, res) {
    var array = { 'customer_name': req.body.customer_name1, 'lead_name': req.body.lead_name }
    var account_id = req.query.tknuserid
    delete req.body.customer_name1;
    delete req.body.lead_name;
    var array2 = req.body
    console.log(array)
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            APIRESTERPNext.create_Customer(id, array).then(function (resp) {
                console.log(resp);
                if (resp.name) {
                    let date_ob = new Date();
                    var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                    req.body.delivery_date = a
                    req.body.customer_name = resp.name;
                    req.body.customer = resp.name;
                    console.log(req.body)
                    APIRESTERPNext.post_Sales_order(id, req.body).then(function (resp1) {
                        console.log(resp1);
                        if (resp1.name) {
                            console.log("start:::::::::::::::::::::::::::::::")
                            var data = { 'name': array.lead_name, 'sales_order_id': resp1.name, 'sales_order_name': resp.name }
                            ERP.updatelead(data, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Done");
                                    return res.status(200).send({ 'data': rows });
                                }
                            })

                        }
                    })
                    // resp.User_id = req.query.tknuserid;
                    // resp.is_sync = "yes"
                    // delete resp.sales_team
                    // delete resp.credit_limits
                    // delete resp.accounts
                    // delete resp.companies
                    // ERP.addcustomer_db(resp, function (err, rows) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    //     else {
                    //         console.log(rows)
                    //         return res.status(200).send({ 'data': rows });
                    //     }

                    // })

                }
                // else {
                //     let date_ob = new Date();
                //     var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                //     req.body.creation = a
                //     req.body.User_id = req.query.tknuserid;
                //     req.body.is_sync = "no"
                //     ERP.addcustomer_db(req.body, function (err, rows) {
                //         if (err) {
                //             console.log(err);
                //         }
                //         else {
                //             return res.status(200).send({ 'data': rows });
                //         }

                //     })
                // }
            })
        }
    })
})

router.post('/post_Sales_order', authorize, function (req, res) {
    var array = req.body
    var account_id = req.query.tknuserid
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            APIRESTERPNext.post_Sales_order(id, array).then(function (resp) {
                console.log(resp);
                // if (resp.name) {
                //     console.log("start:::::::::::::::::::::::::::::::")

                //     delete resp.item
                //     delete resp.items
                //     delete resp.taxes
                //     delete resp.payment_schedule
                //     delete resp.lost_reasons
                //     delete resp.pricing_rules
                //     resp.User_id = req.query.tknuserid;
                //     resp.is_sync = "yes"
                //     // delete resp.credit_limits
                //     // delete resp.accounts
                //     // delete resp.companies
                //     console.log(resp)
                //     ERP.addquotation_db(resp, function (err, rows) {
                //         if (err) {
                //             console.log(err);
                //         }
                //         else {
                //             console.log(rows)
                //             return res.status(200).send({ 'data': rows });
                //         }

                //     })

                // } else {
                //     console.log("END::::::::::::::::::::::::::::::::::::")
                //     let date_ob = new Date();
                //     var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                //     req.body.creation = a
                //     req.body.User_id = req.query.tknuserid;
                //     req.body.is_sync = "no"
                //     delete req.body.item
                //     ERP.addquotation_db(req.body, function (err, rows) {
                //         if (err) {
                //             console.log(err);
                //         }
                //         else {
                //             return res.status(200).send({ 'data': rows });
                //         }

                //     })
                // }
            })
        }
    })
})

router.post('/getquotation_db', authorize, async function (req, res) {
    var User_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var party_name = req.body.name
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(User_id)
        User_id = managerid
    }
    console.log(req.body)
    console.log(User_id)
    ERP.getquotation_db({ User_id, party_name }, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadquotation/:leadid', authorize, async function (req, res) {
    var User_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var leadid = req.params.leadid
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(User_id)
        User_id = managerid
    }
    ERP.getleadquotation({ User_id, leadid }, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadquotationdetail/:quotationid', authorize, async function (req, res) {
    var User_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var quotationid = req.params.quotationid
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(User_id)
        User_id = managerid
    }
    ERP.getleadquotationdetail({ User_id, quotationid }, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                rows[0]['items'] = await ERP.getleadquotationitembyid(quotationid);
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})


/*router.post('/getLeadTimeline', function (req, res) {
    var account_id = req.query.tknuserid
    var lid = req.body.lid
    ERP.get_lead_timeline(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getLeadTimeline_whatsapp', function (req, res) {
    var lid = req.body.lid
    ERP.get_lead_timeline_whatsapp(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
*/

router.post('/getLeadTimeline_email', function (req, res) {
    var lid = req.body.lid
    ERP.get_lead_timeline_email(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getLeadTimeline_appointment', function (req, res) {
    var lid = req.body.lid
    ERP.get_lead_timeline_appointment(lid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/get_lead_stage_status', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(lid)
        lid = managerid
    }
    ERP.get_lead_stage_status(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/get_lead_stage_source', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(lid)
        lid = managerid
    }
    ERP.get_lead_stage_source(lid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_pdf', function (req, res) {
    APIRESTERPNext.get_pdf().then(function (resp) {
        console.log(resp)
        //  var html = fs.readFileSync(resp, 'utf8');
        pdf.create(resp, options).toFile('./uploads/businesscard.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
        // if (resp) {
        // fs.writeFileSync('./uploads/quotation-' + 42 + '.pdf', resp,'binary');
        // fs.writeFile('./uploads/quotation.pdf', resp, 'binary', function(err) {})
        // res.status(200).send(resp);

        // resp.pipe(fs.createWriteStream('./uploads/filename_to_save.pdf'));
        // }
    })
})



//erp quotation

// router.post('/get_qt', function (req, res) {
//     console.log(req.body)
//     APIRESTERPNext.getQuotationByName(req.body.name).then(function (resp) {
//         res.status(200).send({ "data": resp });
//     })
// })

router.post('/send_mail', authorize, async function (req, res) {
    //console.log(req.body)
    var agentid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var manager_id = 0
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(agentid)
        var user_id = managerid
        var manager_id = req.query.tknuserid
    } else {
        var user_id = req.query.tknuserid
    }
    //console.log(req.body);
    var leadid = req.body.lead_name ? req.body.lead_name : 0
    API.getuserdetail(agentid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'Agent not found!' });
        }
        else {
            if (rows.length > 0) {
                var adata = rows[0]
                //var SData = await helper.GetEmailServerLastData(user_id)
                //console.log(agentid+"::"+user_id);
                var SData = await helper.GetAgentEmailServerData(req.body.agentid, user_id)
                console.log(SData);
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
                                    path: './uploads/LMS/Email/' + attachementfile
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
                                    path: './uploads/LMS/Email/' + attachementfile
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
                        if (fs.existsSync('./uploads/LMS/Email/' + attachementfile)) {
                            info.attachments = [
                                {
                                    path: './uploads/LMS/Email/' + attachementfile
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
                            //console.log(info);
                            if (info.accepted.length > 0) {
                                info.email_to = email
                                info.text_description = text
                                info.subject = subject
                                info.frommail = ServerData.smtp_username
                                info.User_id = user_id
                                info.agent_id = agentid
                                console.log(info)
                                delete info.accepted
                                delete info.rejected
                                info.lead_name = leadid
                                info.attachment_file = attachementfile
                                ERP.addleadsemail_db(info, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //Update Lead Timeline
                                        ERP.get_lead_id_details(leadid, function (err, leadata) {
                                            if (leadata.length > 0) {
                                                var timeline = {}
                                                timeline.agent_id = leadata[0].agent_id
                                                timeline.account_id = leadata[0].User_id
                                                timeline.lead_id = leadata[0].l_id
                                                timeline.current_status = leadata[0].status
                                                timeline.notes = 'Email - ' + subject
                                                timeline.action_type = 'email'
                                                timeline.action_id = rows.insertId
                                                ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                            }
                                        })
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
router.get('/getagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    ERP.getagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getstatus/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    ERP.getstatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getsource/:id', authorize, async function (req, res) {
    //console.log(req.params.id);gethuntgroup
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        req.params.id = await helper.GetManagerIdByAgent(req.params.id)
    }
    ERP.getsource(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

function checkidactive(account_id) {
    ERP.check_id(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows[0].AgentID)
            res.status(200).send({ "data": rows });
        }
    })
}

router.post('/sync_old_lead', function (req, res) {
    console.log("start")
    ERP.check_old_leak(0, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows[0].AgentID)
            ERP.check_id(rows[0].AgentID, function (err, rows2) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (rows2[0].current_status == 0) {
                        console.log(rows2[0].current_status)
                        console.log(rows[0].AgentID)
                    }
                }
            })
        }
    })
})


router.post('/save_whatsapp', authorize, function (req, res) {
    req.body.account_id = req.query.tknuserid
    /*if(req.body.cdrid){
        var sdata = {cdrid:req.body.cdrid,account_id:req.query.tknuserid,message:req.body.message,mobile:req.body.mobile}
    }
    if(req.body.lead_id){
        var sdata = {lead_id:req.body.lead_id,account_id:req.query.tknuserid,message:req.body.message,mobile:req.body.mobile}
    }*/
    var sdata = { lead_id: req.body.lead_id, cdrid: req.body.cdrid, account_id: req.query.tknuserid, message: req.body.message, mobile: req.body.mobile }

    ERP.addwhatsapp_db(sdata, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'msg': err });
        }
        else {
            return res.status(200).send({ 'msg': 'Whatsup message sent successfully!!' });
        }

    })
})

router.post('/get_lead_excel', authorize, async function (req, res) {
    // var page_number = req.body.page_number;
    // var data_count = req.body.data_count;
    // var lead_page = { "limit_start": 0, "limit_page_length": 10 }
    // APIRESTERPNext.getLead(lead_page).then(function (resp) {
    //     return res.status(200).send({ 'data': resp });
    // })
    // console.log('here');
    // console.log(req.params.id);var startdateObj = new Date(req.body.filter.startdate);
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : null;
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : null;
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;
    req.body.account_id = req.body.userid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name;
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id;
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }

    var user_id = req.query.tknuserid;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    //console.log(req.body);
    if (req.body.agentrole == "supervisor") {
        ERP.get_sup_lead_list_api_excel(req.body, function (err, results) {
            if (err) {
                console.log(err);
                return res.status(200).send({ 'msg': 'Something went wrong! Please try again.' });
            }
            else {
                // return res.status(200).send({ 'data': results });
                jsonArray = [];
                //console.log(results.length);
                if (results.length > 0) {
                    async.forEachOf(results, async (rows, key, callback) => {
                        var addresstitle = '';
                        var addressline1 = '';
                        var addresscity = '';
                        var addresspincode = '';
                        var note = '';
                        var emailid = '';
                        //console.log(rows['address_title']+', '+rows['address_line1']+', '+rows['city']+', '+rows['pincode']);
                        if (rows['address'] != null) {
                            addresstitle = rows['address'];
                        }
                        if (rows['city'] != null) {
                            addresscity = rows['city'];
                        }
                        if (rows['state'] != null) {
                            addresspincode = rows['state'];
                        }
                        if (rows['note'] != null) {
                            note = rows['note'];
                        }
                        if (rows['show_no_id'] != 1) {
                            emailid = rows['email_id'];
                        } else {
                            emailid = '';
                        }
                        ERP.get_lead_contactsmeta(rows['l_id'], rows['User_id'], function (err, mrows) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                //console.log(mrows);
                                var other = '';
                                if (mrows.length > 0) {
                                    for (var i = 0; i < mrows.length; i++) {
                                        if (mrows[i]['meta_value']) {
                                            other = (mrows[i]['meta_key'] + ":" + mrows[i]['meta_value'] + ',  ' + other);
                                        } else {
                                            other = (' , ' + other);
                                        }
                                    }
                                }
                                var tempArry = {
                                    'Assign_agent': rows['agent'],
                                    'Lead_id': rows['name'],
                                    'Lead_owner': rows['lead_owner'],
                                    'Lead_name': rows['lead_name'],
                                    'Lead_number': rows['mobile_no'],
                                    'Lead_email': emailid,
                                    'Create_date': formatDateTime(rows['creation'], 7),
                                    'Last_modified_date': formatDateTime(rows['modified'], 7),
                                    'Last_modified_by': rows['modified_by'],
                                    'Status': rows['newstatus'],
                                    'Source': rows['source'],
                                    'Ads': rows['ads_name'],
                                    'Address': addresstitle + ' ' + addresscity + ' ' + addresspincode,
                                    'Pin_code': rows['pincode'],
                                    'company': rows['company'],
                                    'Note': note,
                                    'Other Detail': other
                                }
                                jsonArray.push(tempArry);
                                if (results.length == key + 1) {
                                    const json2csvParser = new Parser();
                                    const csv = json2csvParser.parse(jsonArray);
                                    // var xls = json2xls(jsonArray);
                                    fs.writeFileSync('./uploads/lead-' + user_id + '.csv', csv, 'binary');
                                    res.status(200).send({ "data": 'lead-' + user_id + '.csv' });
                                }

                            }
                        })


                    })
                } else {
                    return res.status(200).send({ 'msg': 'No record found.' });
                }
            }
        })
    } else {
        ERP.get_lead_list_api_excel(req.body, function (err, results) {
            if (err) {
                console.log(err);
                return res.status(200).send({ 'msg': 'Something went wrong! Please try again.' });
            }
            else {
                console.log(req.body);
                // return res.status(200).send({ 'data': results });
                jsonArray = [];
                //console.log(results.length);
                if (results.length > 0) {
                    async.forEachOf(results, async (rows, key, callback) => {
                        var addresstitle = '';
                        var addressline1 = '';
                        var addresscity = '';
                        var addresspincode = '';
                        var note = '';
                        var emailid = '';
                        //console.log(rows['address_title']+', '+rows['address_line1']+', '+rows['city']+', '+rows['pincode']);
                        if (rows['address_title'] != null) {
                            addresstitle = rows['address_title'];
                        }
                        if (rows['address_line1'] != null) {
                            addressline1 = rows['address_line1'];
                        }
                        if (rows['city'] != null) {
                            addresscity = rows['city'];
                        }
                        if (rows['pincode'] != null) {
                            addresspincode = rows['pincode'];
                        }
                        if (rows['note'] != null) {
                            note = rows['note'];
                        }
                        if (rows['show_no_id'] != 1) {
                            emailid = rows['email_id'];
                        } else {
                            emailid = '';
                        }
                        console.log("sjhdjhf", rows);
                        ERP.get_lead_contactsmeta(rows['l_id'], rows['User_id'], function (err, mrows) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                //console.log(mrows);
                                var other = '';
                                if (mrows.length > 0) {
                                    for (var i = 0; i < mrows.length; i++) {
                                        if (mrows[i]['meta_value']) {
                                            other = (mrows[i]['meta_key'] + ":" + mrows[i]['meta_value'] + ',  ' + other);
                                        } else {
                                            other = (' , ' + other);
                                        }
                                    }
                                }
                                var tempArry = {
                                    'Assign_agent': rows['agent'],
                                    'Lead_id': rows['name'],
                                    'Lead_owner': rows['lead_owner'],
                                    'Lead_name': rows['lead_name'],
                                    'Lead_number': rows['mobile_no'],
                                    'Lead_email': emailid,
                                    'Create_date': formatDateTime(rows['creation'], 7),
                                    'Last_modified_date': formatDateTime(rows['modified'], 7),
                                    'Last_modified_by': rows['modified_by'],
                                    'Status': rows['newstatus'],
                                    'Source': rows['source'],
                                    'Ads': rows['ads_name'],
                                    'Address': addresstitle + ' ' + addressline1 + ' ' + addresscity + ' ' + addresspincode,
                                    'Pin_code': rows['pincode'],
                                    'company': rows['company'],
                                    'Note': note,
                                    'Other Detail': other
                                }
                                jsonArray.push(tempArry);
                                if (results.length == key + 1) {
                                    const json2csvParser = new Parser();
                                    const csv = json2csvParser.parse(jsonArray);
                                    // var xls = json2xls(jsonArray);
                                    fs.writeFileSync('./uploads/lead-' + user_id + '.csv', csv, 'binary');
                                    res.status(200).send({ "data": 'lead-' + user_id + '.csv' });
                                }

                            }
                        })
                    })
                } else {
                    return res.status(200).send({ 'msg': 'No record found.' });
                }
            }
        })
    }

})


router.post('/post_Lead_name', authorize, async function (req, res) {
    var account_id = 48
    // var agentid = ''
    // if (role == 1) {
    //     agentid = account_id
    //     account_id = await helper.GetManagerIdByAgent(account_id)
    // }
    ERP.get_username(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows[0].erp_email);
            var id = { 'username': rows[0].erp_email, 'password': rows[0].erp_password }
            var array = "CRM-LEAD-2021-01241"
            APIRESTERPNext.getLeadByName(id, array).then(function (resp) {
                if (resp.name) {
                    resp.is_sync = "yes"
                    resp.User_id = account_id;
                    // if (agentid > 0) {
                    //     resp.agent_id = agentid;
                    // }
                    // resp.currency = req.body.currency
                    // resp.probability = req.body.probability
                    // resp.opportunity_amount = req.body.opportunity_amount
                    ERP.addlead_db(resp, function (err, rows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(rows)
                            return res.status(200).send({ 'data': rows });
                        }

                    })

                }
                //  else {
                //     let date_ob = new Date();
                //     var a = (date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2) + " " + date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds() + "." + date_ob.getMilliseconds() + "000");
                //     req.body.creation = a
                //     req.body.User_id = account_id;
                //     req.body.is_sync = "no"
                //     if (agentid > 0) {
                //         resp.agent_id = agentid;
                //     }
                //     ERP.addlead_db(req.body, function (err, rows) {
                //         if (err) {
                //             console.log(err);
                //         }
                //         else {
                //             return res.status(200).send({ 'data': rows });
                //         }

                //     })
                // }
            })
        }
    })

})


router.post('/saveStage', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var price = req.body.price;
    var validity = req.body.validity;
    var userlimit = req.body.userlimit;
    var channels = req.body.channels;
    var type = req.body.type;
    var service = JSON.stringify(req.body.service);
    var packagetype = req.body.packagetype;
    if (packagetype == 1) {
        var minutes = req.body.minutes;
    } else {
        var minutes = 0;
    }
    var m = new Date();
    fdata = {
        package_name: name, package_price: price, package_validity: validity,
        package_userlimit: userlimit, package_channels: channels, package_type: type,
        package_service: service, add_date: m, minutes: minutes, minute_type: packagetype
    };
    Admin.savepackage(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Package detail saved succesfully.' });
        }
    })
})

router.get('/getstages/:id', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    console.log("account_id" + account_id);
    ERP.getstages(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/updatestages/:id', function (req, res) {
    ERP.updatestages(req.params.id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});
router.post('/saveleadstageData', authorize, function (req, res) {
    console.log(req.body);
    var stage_name = req.body.name;
    var User_id = req.query.tknuserid;
    fdata = {
        stage_name: stage_name, User_id: User_id, color_id: req.body.color_id
    };
    ERP.saveleadstageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' saved succesfully.' });
        }
    })
})
router.post('/updateleadstageData', authorize, function (req, res) {
    console.log(req.body);
    var stage_name = req.body.name;
    var User_id = req.query.tknuserid;
    var s_id = req.body.s_id;
    fdata = {
        stage_name: stage_name, User_id: User_id, s_id: s_id, color_id: req.body.color_id
    };
    ERP.updatestageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' Updated succesfully.' });
        }
    })
})
router.get('/deleteleadstages/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    ERP.deleteleadstages(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' data deleted successfully' });
        }
    })
})
router.get('/getStagesstatus/:id', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    console.log("account_id" + account_id);
    ERP.getstagesstatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getstagestatusbyid/:id', function (req, res) {
    ERP.getstagestatusbyid(req.params.id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});
router.post('/savestagestatus', authorize, function (req, res) {
    console.log(req.body);
    var stage_status = req.body.name;
    var stage_id = req.body.stage_id;
    var status = req.body.status
    fdata = {
        stage_status: stage_status, stage_id: stage_id, status_master: status
    };
    ERP.savestagestatus(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' saved succesfully.' });
        }
    })
})
router.post('/updatestagestatus', authorize, function (req, res) {
    console.log("update" + req.body);
    var stage_status = req.body.name;
    var stage_id = req.body.stage_id;
    var St_id = req.body.St_id;
    fdata = {
        stage_status: stage_status, stage_id: stage_id, St_id: St_id
    };
    ERP.updatestagestatus(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' Updated succesfully.' });
        }
    })
})
router.get('/deleteleadstagesstatus/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    ERP.deleteleadstagesstatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' data deleted successfully' });
        }
    })
})
router.get('/getsmstemplate/:id', authorize, async function (req, res) {
    req.params.id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.query.tknuserid)
    } else {
        var managerid = req.query.tknuserid;
    }
    ERP.getsmstemplate(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    }
    )
})

router.post('/master_status', authorize, function (req, res) {
    ERP.get_master_status(0, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getemailtemplate/:id', authorize, function (req, res) {
    ERP.getemailtemplate(req.params.id, req.query.tknuserrole, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/dynamic_lead_lists', authorize, async function (req, res) {
    //console.log("update");
    var pagerecord = req.body.pagerecord
    console.log(pagerecord)
    if (pagerecord == 'all') {
        pagerecord = 5000
    }
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    //console.log('role:'+req.body.agentrole);
    ERP.stage_status(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            var i;
            var stageArr = []
            if (rows.length > 0) {
                //console.log(rows)
                var cnt = 1
                // rows.forEach(async stage => {
                async.forEachOf(rows, async (stage, key, callback) => {
                    //console.log(stage.stage_name)
                    var statusdata = await helper.get_stage_staus(stage.s_id);
                    if (req.body.agentrole == "supervisor") {
                        var data = await helper.get_sup_stage_staus_erp(userid, stage.s_id, userrole, pagerecord);
                    } else {
                        var data = await helper.get_stage_staus_erp(userid, stage.s_id, userrole, pagerecord);
                    }
                    if (req.body.agentrole == "supervisor") {
                        var totaldata = await helper.get_sup_stage_staus_erp_total(userid, stage.s_id, userrole);
                    } else {
                        var totaldata = await helper.get_stage_staus_erp_total(userid, stage.s_id, userrole);
                    }
                    if (req.body.agentrole == "supervisor") {
                        var total = await helper.sup_opportunity_amount_total(userid, stage.s_id, userrole);
                    } else {
                        var total = await helper.opportunity_amount_total(userid, stage.s_id, userrole);
                    }


                    stageArr[key] = { 'stage_name': stage.stage_name, 'stage_color': stage.color_id, 'status': statusdata, 'data': data, 'totaldata': totaldata, 'opportunity_amount_total': total }
                    //console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                    if (rows.length == cnt) {
                        console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                        //console.log(stageArr)
                        res.status(200).send({ "data": stageArr });
                    }
                    cnt = cnt + 1
                });
            } else {
                res.status(200).send({ "data": [] });
            }
        }
    })
})


router.post('/dynamic_lead_lists_unassign', authorize, async function (req, res) {
    //console.log("update");
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    ERP.stage_status(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            var i;
            var stageArr = []
            if (rows.length > 0) {
                //console.log(rows)
                var cnt = 1
                // rows.forEach(async stage => {
                async.forEachOf(rows, async (stage, key, callback) => {
                    //console.log(stage.stage_name)
                    var statusdata = await helper.get_stage_staus(stage.s_id);
                    var data = await helper.get_stage_staus_erp_null(managerid, stage.s_id);
                    var total = await helper.opportunity_amount_total_agent_null(managerid, stage.s_id);
                    stageArr[key] = { 'stage_name': stage.stage_name, 'stage_color': stage.color_id, 'status': statusdata, 'data': data, 'opportunity_amount_total': total }
                    console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                    if (rows.length == cnt) {
                        console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                        //console.log(stageArr)
                        res.status(200).send({ "data": stageArr });
                    }
                    cnt = cnt + 1
                });
            }
        }
    })
})


router.post('/change_view_card_data', authorize, async function (req, res) {
    var startdateObj = new Date(Date.now());
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    console.log(req.query)
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    ERP.stage_status(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            var i;
            var stageArr = []
            if (rows.length > 0) {
                var cnt = 1
                async.forEachOf(rows, async (stage, key, callback) => {
                    console.log(stage.s_id)
                    var statusdata = await helper.get_stage_staus(stage.s_id);
                    var data = await helper.get_stage_staus_daily(startdate, userid, stage.s_id, userrole);
                    stageArr[key] = { 'stage_name': stage.stage_name, 'stage_color': stage.color_id, 'status': statusdata, 'data': data }
                    console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                    if (rows.length == cnt) {
                        console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                        res.status(200).send({ "data": stageArr });
                    }
                    cnt = cnt + 1
                });
            }
        }
    })
})




router.post('/change_view_card_data_search', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate1 = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '';
    var enddateObj = new Date(req.body.enddate);
    var enddate1 = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '';
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    var statusArr = req.body.status?req.body.status:[];
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source?req.body.source:[];
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name?req.body.ads_name:[];
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id?req.body.tag_id:[];
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }
    console.log(req.body);
    ERP.stage_status(managerid, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            var i;
            var stageArr = []
            if (rows.length > 0) {
                var cnt = 1
                async.forEachOf(rows, async (stage, key, callback) => {
                    var statusdata = await helper.get_stage_staus(stage.s_id);
                    if (req.body.agentrole == 'supervisor') {
                        var data = await helper.get_sup_stage_staus_date_format(startdate1, enddate1, userid, stage.s_id, userrole, req.body);
                    } else {
                        var data = await helper.get_stage_staus_date_format(startdate1, enddate1, userid, stage.s_id, userrole, req.body);
                    }
                    stageArr[key] = { 'stage_name': stage.stage_name, 'stage_color': stage.color_id, 'status': statusdata, 'data': data }
                    if (rows.length == cnt) {
                        console.log(rows.length + "==" + cnt + "--" + stage.stage_name)
                        res.status(200).send({ "data": stageArr });
                    }
                    cnt = cnt + 1
                });
            }
        }
    })
})


router.post('/uploadpdf', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/LMS/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/LMS/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/LMS/Email/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/LMS/Email/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    var m = new Date();
    var fileid = 'EMAIL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/LMS/Email/')
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
router.post('/uploadcsv', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/LMS/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/LMS/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/LMS/CSV/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/LMS/CSV/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var m = new Date();
    var fileid = 'CSV' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/LMS/CSV/')
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
    }).fields(
        [
            {
                name: 'attach_file',
                maxCount: 1
            }
        ]
    );
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        //console.log(req);
        var file_or = req.files.attach_file[0].filename;
        req.body.file_name = file_or;
        req.body.file_status = '0';
        req.body.file_path = 'uploads/LMS/CSV/' + file_or;
        if (req.body.agentrole == "supervisor") {
            req.body.upload_by = req.query.tknuserid;
            var userrole = req.query.tknuserrole;
            if (userrole == 1) {
                req.body.user_id = await helper.GetManagerIdByAgent(req.body.user_id)
            }
        }
        delete req.body.agentrole;
        //console.log(req.body);
        //var sdata={user_id:req.body.user_id,agentgroup_id:req.body.agentgroup_id,agent_id:req.body.agent_id,}
        ERP.addfilerequest(req.body, function (err, count) {
            console.log(err)
            if (err) {
                //console.log(err);
                res.status(400).json(err);
            }
            else {
                console.log(count);
                res.json({ 'msg': 'File added sucessfully!' });
            }
        });
    });
});




router.get('/filedata/:id', authorize, function (req, res) {
    ERP.BulkFiledatabycustomer(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        }
        var i;
        var temp1 = [];
        for (i = 0; i < data.length; i++) {
            temp1.push(data[i]["finish_time"]);

        }
        res.send({ 'data': data, 'count': temp1 });
    });
});



router.post('/check_lead_by_number', authorize, async function (req, res) {
    req.body.account_id = req.query.tknuserid
    console.log(req.body)
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var mobile_no = req.body.mobile_no ? req.body.mobile_no : ''
    mobile_no = mobile_no.substr(-10)
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    ERP.check_lead_by_number(mobile_no, managerid, userid, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': '' });
        }
        else {
            console.log(rows.length)
            if (rows.length > 0) {
                return res.status(200).send({ 'data': rows[0] });
            } else {
                return res.status(200).send({ 'data': '' });
            }
        }

    })
})

router.post('/get_lead_timeline_excel', authorize, async function (req, res) {
    // var user_id = req.query.tknuserid
    // var startdateObj = req.body.startdate ? new Date(req.body.startdate) : new Date();
    // var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    // req.body.startdate = startdate;
    // var enddateObj = req.body.enddate ? new Date(req.body.enddate) : new Date();
    // var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    // req.body.enddate = enddate;
    // req.body.userid = req.query.tknuserid;
    // var userrole = req.query.tknuserrole;
    // req.body.role = userrole
    // var mstartdateObj = new Date(req.body.modifiedstartdate);
    // var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    // req.body.modifiedstartdate = req.body.modifiedstartdate ? mstartdate : '';
    // var menddateObj = new Date(req.body.modifiedenddate);
    // var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    // req.body.modifiedenddate = req.body.modifiedenddate ? menddate : '';

    // if (userrole == 1) {
    //     var managerid = await helper.GetManagerIdByAgent(req.body.userid)
    //     req.body.account_id = managerid
    // }
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : null;
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : null;
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;
    req.body.account_id = req.body.userid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name;
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id;
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }

    var user_id = req.query.tknuserid;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }

    if (req.body.agentrole == 'supervisor') {
        ERP.get_sup_lead_list_api_excel(req.body, function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                jsonArray = [];
                var cnt = 0
                var agentname = ''
                var attemptdata = ''
                async.forEachOf(results, async (rows, key, callback) => {
                    var leadid = rows['l_id'];
                    var notes = '';
                    var leadcomments = await helper.getLeadComment(leadid)
                    for (let index = 0; index < leadcomments.length; index++) {
                        const element = leadcomments[index];
                        notes = element['comment'] + ', ' + notes;
                    }

                    var calltimeline = await helper.getLeadTimeline(leadid)
                    if (calltimeline.length > 0) {
                        async.forEachOf(calltimeline, async (call, key, callback) => {
                            var callArray = {
                                'Lead_id': '',
                                'Lead_name': rows['lead_name'],
                                'Lead_number': rows['mobile_no'],
                                'Lead_email': rows['email_id'],
                                'Create_date': formatDateTime(rows['creation'], 7),
                                'Status': rows['newstatus'],
                                'CallerNumber': call['CallerNumber'],
                                'CallType': call['CallType'],
                                'CallTime': formatDateTime(call['CallStartTime'], 7),
                                'CallStatus': call['CallStatus'],
                                'CallDuration': call['CallTalkTime'],
                                'Agent': call['AgentName'],
                                'TotalCall': ''
                            }
                            if (key == 0) {
                                attemptdata = formatDateTime(call['CallStartTime'], 7) + ' (' + call['CallType'] + ' - ' + call['CallTalkTime'] + ')'
                            } else {
                                attemptdata = attemptdata + ',' + formatDateTime(call['CallStartTime'], 7) + ' (' + call['CallType'] + ' - ' + call['CallTalkTime'] + ')'
                            }
                            if (calltimeline.length == key + 1) {
                                var tempArry = {
                                    'Lead_id': rows['name'],
                                    'Lead_Create_date': formatDateTime(rows['creation'], 7),
                                    'Status': rows['newstatus'],
                                    'Lead_name': rows['lead_name'],
                                    'Lead_number': rows['mobile_no'],
                                    'Lead_email': rows['email_id'],
                                    'Agent': rows['agent'],
                                    'Attempt': attemptdata,
                                    'TotalCall': calltimeline.length,
                                    'Note': notes,
                                }
                                jsonArray.push(tempArry);
                                cnt = cnt + 1
                            }
                        })
                    } else {
                        //jsonArray.push(tempArry);
                        var callArray = {
                            'Lead_id': rows['name'],
                            'Lead_Create_date': formatDateTime(rows['creation'], 7),
                            'Status': rows['newstatus'],
                            'Lead_name': rows['lead_name'],
                            'Lead_number': rows['mobile_no'],
                            'Lead_email': rows['email_id'],
                            'Agent': rows['agent'],
                            'Attempt': '',
                            'TotalCall': 0,
                            'Note': notes,
                        }
                        jsonArray.push(callArray);
                        cnt = cnt + 1
                    }
                    //console.log(cnt)
                    //console.log(jsonArray)
                    if (results.length == cnt) {
                        // var xls = json2xls(jsonArray);
                        const json2csvParser = new Parser();
                        const csv = json2csvParser.parse(jsonArray);
                        fs.writeFileSync('./uploads/leadtimeline-' + user_id + '.csv', csv, 'binary');
                        res.status(200).send({ "data": 'leadtimeline-' + user_id + '.csv' });
                    }
                })
                //res.status(200).send({ "data": 'lead-' + user_id + '.xlsx' });
            }
        })
    } else {
        ERP.get_lead_list_api_excel(req.body, function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                jsonArray = [];
                var cnt = 0
                var agentname = ''
                var attemptdata = ''
                async.forEachOf(results, async (rows, key, callback) => {
                    var leadid = rows['l_id'];
                    var notes = '';
                    //var leadcomments = await helper.getLeadComment(leadid)
                    var leadcomments = await helper.getLeadComment(leadid)
                    for (let index = 0; index < leadcomments.length; index++) {
                        const element = leadcomments[index];
                        notes = element['comment'] + ', ' + notes;
                    }
                    var calltimeline = await helper.getLeadTimeline(leadid)
                    //console.log(calltimeline)
                    if (calltimeline.length > 0) {
                        async.forEachOf(calltimeline, async (call, key, callback) => {
                            var callArray = {
                                'Lead_id': '',
                                'Lead_name': rows['lead_name'],
                                'Lead_number': rows['mobile_no'],
                                'Lead_email': rows['email_id'],
                                'Create_date': formatDateTime(rows['creation'], 7),
                                'Status': rows['newstatus'],
                                'CallerNumber': call['CallerNumber'],
                                'CallType': call['CallType'],
                                'CallTime': formatDateTime(call['CallStartTime'], 7),
                                'CallStatus': call['CallStatus'],
                                'CallDuration': call['CallTalkTime'],
                                'Agent': call['AgentName'],
                                'TotalCall': ''
                            }
                            if (key == 0) {
                                attemptdata = formatDateTime(call['CallStartTime'], 7) + ' (' + call['CallType'] + ' - ' + call['CallTalkTime'] + ')'
                            } else {
                                attemptdata = attemptdata + ',' + formatDateTime(call['CallStartTime'], 7) + ' (' + call['CallType'] + ' - ' + call['CallTalkTime'] + ')'
                            }
                            if (calltimeline.length == key + 1) {
                                var tempArry = {
                                    'Lead_id': rows['name'],
                                    'Lead_Create_date': formatDateTime(rows['creation'], 7),
                                    'Status': rows['newstatus'],
                                    'Lead_name': rows['lead_name'],
                                    'Lead_number': rows['mobile_no'],
                                    'Lead_email': rows['email_id'],
                                    'Agent': rows['agent'],
                                    'Attempt': attemptdata,
                                    'TotalCall': calltimeline.length,
                                    'Note': notes,
                                }
                                jsonArray.push(tempArry);
                                cnt = cnt + 1
                            }
                        })
                    } else {
                        //jsonArray.push(tempArry);
                        var callArray = {
                            'Lead_id': rows['name'],
                            'Lead_Create_date': formatDateTime(rows['creation'], 7),
                            'Status': rows['newstatus'],
                            'Lead_name': rows['lead_name'],
                            'Lead_number': rows['mobile_no'],
                            'Lead_email': rows['email_id'],
                            'Agent': rows['agent'],
                            'Attempt': '',
                            'TotalCall': 0,
                            'Note': notes,
                        }
                        jsonArray.push(callArray);
                        cnt = cnt + 1
                    }
                    //console.log(cnt)
                    //console.log(jsonArray)
                    if (results.length == cnt) {
                        // var xls = json2xls(jsonArray);
                        const json2csvParser = new Parser();
                        const csv = json2csvParser.parse(jsonArray);
                        fs.writeFileSync('./uploads/leadtimeline-' + user_id + '.csv', csv, 'binary');
                        res.status(200).send({ "data": 'leadtimeline-' + user_id + '.csv' });
                    }
                })
                //res.status(200).send({ "data": 'lead-' + user_id + '.xlsx' });
            }
        })
    }

})

router.post('/unassign_master_status', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    ERP.get_unassign_master_status(userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getLeadContacts/:id', authorize, async function (req, res) {
    var account_id = req.query.tknuserid;
    var lead_id = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var account_id = await helper.GetManagerIdByAgent(account_id)
    }
    //console.log('lead_id ::'+lead_id);
    ERP.get_lead_contacts_meta(lead_id, account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/updateotherdetail', authorize, async function (req, res) {
    var data = { meta_value: req.body.value, meta_id: req.body.meta_id }
    ERP.updateotherdetail(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "msg": "Contact other detail update successfully!!" });
        }
    })
})


router.post('/subscription', function (req, res) {
    console.log('start')
    APIRESTERPNext.createSubscription(req.body).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/subscription', function (req, res) {
    console.log('start')
    APIRESTERPNext.createSubscription(req.body).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})


router.post('/subscription_plan', function (req, res) {
    console.log('start')
    APIRESTERPNext.createSubscription_plan(req.body).then(function (resp) {
        return res.status(200).send({ 'data': resp });
    })
})



// lead create without erp system

router.post('/post_Lead', authorize, async function (req, res) {
    var array = req.body
    var timeline = {}
    console.log(array);
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    var agentid = 0
    if (role == 1) {
        agentid = account_id
        timeline.agent_id = account_id
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    timeline.account_id = account_id
    array.is_sync = "yes"
    array.User_id = account_id;
    if (agentid > 0) {
        array.agent_id = agentid;
    }
    array.is_deleted='no'
    array.lead_owner = req.query.tknuid
    array.tag_id = req.body.tag_id
    array.address = req.body.address_line1
    var now = new Date();
    array.creation = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    ERP.check_lead_by_mobile(account_id, req.body.mobile_no, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': 'Something went wrong!' });
        }
        else {
            if (rows.length == 0) {
                ERP.addlead_db(array, async function (err, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'data': 'Something went wrong!' });
                    }
                    else {
                        console.log(rows)
                        console.log(rows.insertId)
                        let year = new Date().getFullYear()
                        let month = new Date().getMonth()
                        let lead_name = {}
                        lead_name.name = 'CRM-LEAD-' + year + '-' + (month + 1) + (rows.insertId)
                        console.log(lead_name);
                        timeline.lead_id = rows.insertId
                        timeline.current_status = req.body.status
                        timeline.notes = 'Create Lead BY ' + req.query.tknuid
                        var m = new Date();
                        var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                        var category = await API.GetConfigBykey('category', account_id);
                        var data = { cont_id: cont_id, customer_id: account_id, created_date: m, name: array.lead_name, email: array.email_id, mobile: array.mobile_no, address: array.address_line1, lead_source: array.source, category: category, created_by: account_id, lead_id: rows.insertId }
                        Contacts.createcontact(data, function (err, result) {
                            console.log(err)
                            console.log(result)
                        })
                        helper.PushZohoLead(rows.insertId, agentid)
                        ERP.updat_lead_name(lead_name, rows.insertId, function (err, rows2) {
                            if (err) {
                                return res.status(200).send({ 'data': 'Something went wrong!' });
                            }
                            else {
                                ERP.add_timeline_lead(timeline, function (err, rows2) {
                                    if (err) {
                                        return res.status(200).send({ 'data': 'Something went wrong!' });
                                    } else {
                                        return res.status(200).send({ 'data': 'Lead added successfully.' });
                                    }
                                })
                            }

                        })
                    }

                })
            }
            else {
                return res.status(200).send({ 'data': 'Lead Already Exist .' });
            }
        }
    })

})



// lead update without erp system
router.post('/updateLeadAll', authorize, async function (req, res) {
    var timeline = {}
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    var agentid = ''
    if (role == 1) {
        agentid = account_id
        timeline.agent_id = account_id
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    timeline.account_id = account_id
    //console.log(req.body)
    ERP.get_lead_id_details(req.body.l_id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': err });
        } else {
            if (rows.length > 0) {
                var leaddata = rows[0]
                timeline.previous_status = rows[0].status
                timeline.lead_id = req.body.l_id
                timeline.current_status = req.body.status
                timeline.notes = 'Change Lead Status By ' + req.query.tknuid
                var now = new Date();
                req.body.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                req.body.modified_by = req.query.tknuid
                req.body.address = req.body.address_line1
                var modiledata = { lead_id: req.body.l_id, mobile: req.body.mobile_no, account_id: account_id }
                ERP.get_leadby_contacs(modiledata, async function (err, shows) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'data': 'Something went wrong!' });
                    } else {
                        if (shows.length > 0) {
                            console.log(shows, "contacts details");
                            var arr = shows[0]
                            var data = { cont_id: arr.cont_id, name: req.body.lead_name, email: req.body.email_id, mobile: req.body.mobile_no, address: req.body.address_line1, lead_source: arr.source, city: req.body.city, state: req.body.state, lead_source: req.body.lead_source }
                            ERP.update_leadyby_contacts(data, function (err, result) {
                                console.log(err)
                                console.log(result)
                            })
                        }
                    }

                })
                ERP.updatelead(req.body, async function (err, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'data': 'Something went wrong!' });
                    } else {
                        console.log("4");
                        helper.PushZohoLead(leaddata.l_id, leaddata.agent_id)
                        if (timeline.current_status != timeline.previous_status) {
                        } else {
                            timeline.notes = 'Modified by ' + req.query.tknuid
                        }
                        ERP.add_timeline_lead(timeline, function (err, rows2) {
                            if (err) {
                                return res.status(200).send({ 'data': 'Something went wrong!' });
                            } else {
                                return res.status(200).send({ 'data': 'Lead updated successfully.' });
                            }
                        })
                    }
                })
            } else {
                return res.status(200).send({ 'data': 'Something went wrong!' });
            }
        }
    })

})



// comment in lead without erp system

router.post('/save_leadcomment', authorize, function (req, res) {
    console.log(JSON.stringify(req.query));
    //var title = req.body.title;
    var comment = req.body.note;
    var lead_id = req.body.lead_id;
    var lead_name = req.body.name;
    var comment_by = req.query.tknuid
    var fdata = { lead_id: lead_id, comment: comment, comment_by: comment_by };
    var now = new Date();
    fdata['c_date'] = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    fdata['is_sync'] = 'yes';
    ERP.add_lead_comment(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            return res.status(200).send({ 'data': 'Comment sent Succesfully' });
        }
    })

})

//get qoutation database
router.post('/get_qt', authorize, function (req, res) {
    console.log(req.body)
    // APIRESTERPNext.getQuotationByName(req.body.name).then(function (resp) {
    //     res.status(200).send({ "data": resp });
    // })
    ERP.get_tf_quotation(req.query.tknuserid, req.body.name, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).send({ "data": rows });
        }
    })
})


//create quotation without erp
router.post('/saveleadquotation', authorize, async function (req, res) {
    // var array = req.body
    var account_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var created_by = req.query.tknuserid;
    if (userrole == 1) {
        account_id = await helper.GetManagerIdByAgent(req.query.tknuserid)
    }
    var in_words = 'INR ' + converter.toWords(req.body.grandtotal) + ' only.'
    var data = { account_id: account_id, lead_id: req.body.lead_id, total_quantity: req.body.totalquantity, grand_total: req.body.grandtotal, created_by: created_by, grand_total_inword: in_words, total_discount: req.body.totaldiscount, total_gstamount: req.body.totalgstamount, validity: req.body.validity, total_amount: req.body.total }
    ERP.saveleadquotation(data, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': "Something went wrong!!" });
        }
        else {
            //console.log(rows)
            let year = new Date().getFullYear()
            ERP.updatleadquotation({ quotation_name: 'SAL-QTN-' + year + '-' + (rows.insertId) }, rows.insertId, async function (err, rows2) {
                if (err) {
                    return res.status(200).send({ 'data': "Something went wrong!!" });
                }
                else {
                    if (req.body.items.length > 0) {
                        bulknumarray = [];
                        async.forEachOf(req.body.items, async (data, key, callback) => {
                            var data = { quotation_id: rows.insertId, product_id: data.product_id, quantity: data.quantity, discount: data.discount, product_price: data.rate, product_amount: data.amount, gst: data.gst, gst_amount: data.gstamount }
                            ERP.insertquotationitems(data, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                    return res.status(200).send({ 'data': "Something went wrong!!" });
                                }
                                else {
                                }
                            })
                        })
                    }
                    //update opportunity amount with quotation without GST Amount
                    var updatedata = await ERP.updateopportunityamount(0, req.body.lead_id, req.body.total);
                    if (updatedata == 1) {
                        return res.status(200).send({ 'data': "Lead Quotation data saved successfully!!" });
                    } else {
                        return res.status(200).send({ 'data': "Something went worng!!" });
                    }

                }

            })
        }

    })

})


//get timeline change ead status
router.post('/getLeadTimeline_status', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    var lid = req.body.lid
    ERP.get_lead_timeline_status(lid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get timeline change ead status
router.post('/get_lead_timeline_feedback', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    var lid = req.body.lid
    ERP.get_lead_timeline_feedback(lid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/create_source', authorize, function (req, res) {
    console.log(req.body.name, "hello");
    let data = {}
    data.name = req.body.name
    data.customer_id = req.query.tknuserid
    Erp.addsource_db(data, function (err, count) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Source added sucessfully!' });
        }
    });
})


router.get('/delete_source/:s_id', authorize, function (req, res) {
    Erp.deleteSource(req.params.s_id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Source deleted successfully!' });
        }
    });
});

router.post('/update_source', authorize, function (req, res) {
    let data = req.body;
    let s_id = req.body.s_id;
    delete data.s_id;
    Erp.updateSource(data, s_id, function (err, count) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Source Updated sucessfully!' });
        }

    });

});


router.post('/source_list', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(lid)
        lid = managerid
    }
    Erp.get_source(lid, function (err, count) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'data': count });
        }
    });
})

router.post('/generatecampaign', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status?req.body.status:[];
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }

    var sourceArr = req.body.source?req.body.source:[];
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent?req.body.agent:[];
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name?req.body.ads_name:[];
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id?req.body.tag_id:[];
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }
    ERP.get_lead_agents(req.body, function (err, rows) {
        console.log(err)
        console.log(rows)
        if(err){
            console.log(err)
        }else {
            if (rows.length > 0) {
                async.forEachOf(rows, async (row, key, callback) => {
                    var agentid = row['agent_id']
                    var accountid = row['User_id']
                    ERP.get_agent_campaign(agentid, accountid, async function (err, crows) {
                        if (crows.length > 0) {
                            var voicecamid = crows[0]['camid']
                            console.log(voicecamid)
                        } else {
                            var voicecamid = await helper.CreateAgentLMSCampaign(agentid, accountid)
                            console.log(voicecamid + '@@')
                        }
                        //console.log(voicecamid);
                        if (rows.length == key + 1) {
                            ERP.get_lead_with_contacts(req.body, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                    return res.status(200).send({ 'msg': 'Something went wrong!' });
                                }
                                else {
                                    //console.log(rows.length)
                                    var camArr = {}
                                    rows.forEach(async row => {
                                        var agentid = row['agent_id']
                                        var accountid = row['User_id']
                                        var contid = row['cont_id']
                                        var category = row['category']
                                        if (contid != '' && contid != null) {
                                            ERP.get_agent_campaign(agentid, accountid, async function (err, crows) {
                                                if (crows.length > 0) {
                                                    var voicecamid = crows[0]['camid']
                                                    console.log(voicecamid)
                                                    if (voicecamid > 0) {
                                                        helper.UpdateCampaignNumbers(voicecamid, accountid, contid, category)
                                                    }
                                                }
                                            })
                                        } else {

                                        }
                                    })
                                    return res.status(200).send({ 'msg': 'Campaign generated succesfully.' });
                                }
                            })
                        }
                    })
                })
            } else {
                return res.status(200).send({ 'msg': 'Something went wrong!' });
            }
        }
    })
})
router.post('/getleadfeedback', authorize, async function (req, res) {
    console.log(req.body);
    ERP.getleadfeedback(req.body.formid, req.body.cdrid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get timeline change ead status
router.get('/getactiveagentgroup', authorize, async function (req, res) {
    var account_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        account_id = await helper.GetManagerIdByAgent(req.query.tknuserid)
    }
    ERP.getactiveagentgroup(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/lead_assign_agent', authorize, async function (req, res) {
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    ERP.getagentgroupdetail(req.body.agentgroupid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            if (rows.length > 0) {
                var startdateObj = new Date(req.body.startdate);
                var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
                req.body.startdate = startdate;
                var enddateObj = new Date(req.body.enddate);
                var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
                req.body.enddate = enddate;
                var mstartdateObj = new Date(req.body.modifiedstartdate);
                var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
                req.body.modifiedstartdate = mstartdate;
                var menddateObj = new Date(req.body.modifiedenddate);
                var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
                req.body.modifiedenddate = menddate;
                var statusArr = req.body.status;
                if (statusArr.length > 0) {
                    var newstatusArr = [];
                    statusArr.forEach(element => {
                        if (element != '') {
                            newstatusArr.push("'" + element + "'");
                        }
                    });
                    req.body.status = newstatusArr;
                }
                var sourceArr = req.body.source;
                if (sourceArr.length > 0) {
                    var newsourceArr = [];
                    sourceArr.forEach(element => {
                        if (element != '') {
                            newsourceArr.push("'" + element + "'");
                        }
                    });
                    req.body.source = newsourceArr;
                }
                var agentArr = req.body.agent;
                if (agentArr) {
                    var newagentArr = []
                    agentArr.forEach(element => {
                        if (element != '') {
                            newagentArr.push(element);
                        }
                    });
                    req.body.agent = newagentArr;
                }
                var adsnameArr = req.body.ads_name;
                if (adsnameArr.length > 0) {
                    var newadsnameArr = [];
                    adsnameArr.forEach(element => {
                        if (element != '') {
                            newadsnameArr.push("'" + element + "'");
                        }
                    });
                    req.body.ads_name = newadsnameArr;
                }
                var tagArr = req.body.tag_id;
                if (tagArr) {
                    var newtagArr = []
                    tagArr.forEach(element => {
                        if (element != '') {
                            newtagArr.push(element);
                        }
                    });
                    req.body.tag_id = newtagArr;
                }

                /* ERP.get_lead_list_api(req.body, function (err, leadata) {
                     if (err) {
                         console.log(err);
                     }
                     else {*/
                var leadata = req.body.leadArr;

                //console.log(leadata.length);
                if (leadata.length > 0) {
                    if (req.body.agentid && req.body.agentid[0] != null) {
                        var agentleadlength = Math.round(leadata.length / req.body.agentid.length);

                        var devidelength = agentleadlength;
                        var agentlength = 0;
                        for (let index = 0; index < leadata.length; index++) {
                            ERP.get_lead_id_details(leadata[index], function (err, ldata) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    const element = ldata[0];
                                    if (index < devidelength) {
                                        //console.log(index+':'+agentlength);
                                    } else {
                                        devidelength = (devidelength) + (agentleadlength);
                                        if (((agentlength) + 1) != req.body.agentid.length) {
                                            agentlength = agentlength + 1;
                                        }
                                        //console.log(index+':'+agentlength);
                                    }
                                    ERP.getagentdetail(req.body.agentid[agentlength], function (err, agentdata) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            if (agentdata.length > 0) {
                                                udata = { l_id: element.l_id, agent_id: req.body.agentid[agentlength] }
                                                console.log(udata);
                                                ERP.updatelead(udata, function (err, rows) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {

                                                    }
                                                })
                                                note = 'Assign Lead to ' + agentdata[0].account_name + ' by ' + req.query.tknuid;
                                                timeline = { lead_id: element.l_id, agent_id: req.body.agentid[[agentlength]], account_id: req.body.userid, notes: note, current_status: element.status }
                                                //console.log(agentdata);
                                                ERP.add_timeline_lead(timeline, function (err, rows) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {

                                                    }
                                                })
                                            }

                                        }
                                    })
                                }
                            })

                        }

                    } else {
                        console.log("else");
                        Default.getassignedagents(req.body.agentgroupid, function (err, arows) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                var agentleadlength = Math.round(leadata.length / arows.length);
                                console.log(arows[0]);
                                if (arows.length > 1) {
                                    //console.log(arows);
                                    var devidelength = agentleadlength;
                                    var agentlength = 0;
                                    for (let index = 0; index < leadata.length; index++) {
                                        //const element = leadata[index];
                                        if (index < devidelength) {
                                            //console.log(index+':'+agentlength);
                                        } else {
                                            devidelength = (devidelength) + (agentleadlength);
                                            if (((agentlength) + 1) != arows.length) {
                                                agentlength = agentlength + 1;
                                            }
                                            //console.log(index+':'+agentlength);
                                        }
                                        //console.log(index + ':' + agentlength);
                                        udata = { l_id: leadata[index], agent_id: arows[agentlength].AgentID }
                                        console.log(udata);
                                        ERP.updatelead(udata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {

                                            }
                                        })


                                        //console.log(leadata[index]+':'+agentlength);


                                        note = 'Assign Lead to ' + arows[agentlength].agentname + ' by ' + req.query.tknuid;
                                        timeline = { lead_id: leadata[index], agent_id: arows[agentlength].AgentID, account_id: req.body.userid, notes: note, current_status: '' }
                                        console.log(timeline);
                                        ERP.add_timeline_lead(timeline, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                var insertid = rows['insertId'];
                                                //console.log(insertid);
                                                ERP.get_lead_timeline_details(insertid, function (err, tdata) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        ERP.get_lead_id_details(tdata[0].lead_id, function (err, ldata) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                //console.log(insertid);
                                                                var tudata = { t_id: insertid, current_status: ldata[0].status };
                                                                ERP.update_lead_timeline(tudata, function (err, ldata) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    }
                                                                    else {

                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })

                                            }
                                        })
                                    }
                                } else {
                                    for (let index = 0; index < leadata.length; index++) {
                                        //const element = leadata[index];
                                        if (index < devidelength) {
                                            //console.log(index+':'+agentlength);
                                        } else {
                                            devidelength = (devidelength) + (agentleadlength);
                                            if (((agentlength) + 1) != arows.length) {
                                                agentlength = agentlength + 1;
                                            }
                                            //console.log(index+':'+agentlength);
                                        }
                                        console.log(index + ':' + agentlength);
                                        udata = { l_id: leadata[index], agent_id: arows[0].AgentID }
                                        console.log(udata);
                                        ERP.updatelead(udata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {

                                            }
                                        })


                                        //console.log(leadata[index]+':'+agentlength);


                                        note = 'Assign Lead to ' + arows[0].agentname + ' by ' + req.query.tknuid;
                                        timeline = { lead_id: leadata[index], agent_id: arows[0].AgentID, account_id: req.body.userid, notes: note, current_status: '' }
                                        console.log(timeline);
                                        ERP.add_timeline_lead(timeline, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                var insertid = rows['insertId'];
                                                //console.log(insertid);
                                                ERP.get_lead_timeline_details(insertid, function (err, tdata) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        ERP.get_lead_id_details(tdata[0].lead_id, function (err, ldata) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                //console.log(insertid);
                                                                var tudata = { t_id: insertid, current_status: ldata[0].status };
                                                                ERP.update_lead_timeline(tudata, function (err, ldata) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    }
                                                                    else {

                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })

                                            }
                                        })
                                    }
                                }

                            }
                        })
                    }
                } else {
                    ERP.get_lead_list_api(req.body, function (err, leadata) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            //console.log('agentlength:'+leadata.length);
                            if (leadata.length > 0) {
                                if (req.body.agentid && req.body.agentid[0] != null) {
                                    var agentleadlength = Math.round(leadata.length / req.body.agentid.length);

                                    var devidelength = agentleadlength;
                                    var agentlength = 0;
                                    //console.log(leadata)
                                    for (let index = 0; index < leadata.length; index++) {
                                        const element = leadata[index];
                                        if (index < devidelength) {
                                            //console.log(index+':'+agentlength);
                                        } else {
                                            devidelength = (devidelength) + (agentleadlength);
                                            if (((agentlength) + 1) != req.body.agentid.length) {
                                                agentlength = agentlength + 1;
                                            }
                                            //console.log(index+':'+agentlength);
                                        }
                                        ERP.getagentdetail(req.body.agentid[agentlength], function (err, agentdata) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                if (agentdata.length > 0) {
                                                    udata = { l_id: element.l_id, agent_id: req.body.agentid[agentlength] }
                                                    console.log(udata);
                                                    ERP.updatelead(udata, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {

                                                        }
                                                    })
                                                    note = 'Assign Lead to ' + agentdata[0].account_name + ' by ' + req.query.tknuid;
                                                    timeline = { lead_id: element.l_id, agent_id: req.body.agentid[agentlength], account_id: req.body.userid, notes: note, current_status: element.status }
                                                    //console.log(agentdata);
                                                    ERP.add_timeline_lead(timeline, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {

                                                        }
                                                    })
                                                }

                                            }
                                        })
                                    }

                                } else {
                                    console.log("else");
                                    Default.getassignedagents(req.body.agentgroupid, function (err, arows) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            var agentleadlength = Math.round(leadata.length / arows.length);
                                            if (arows.length > 0) {
                                                //console.log(arows);
                                                var devidelength = agentleadlength;
                                                var agentlength = 0;
                                                for (let index = 0; index < leadata.length; index++) {
                                                    //const element = leadata[index];
                                                    if (index < devidelength) {
                                                        //console.log(index+':'+agentlength);
                                                    } else {
                                                        devidelength = (devidelength) + (agentleadlength);
                                                        if (((agentlength) + 1) != arows.length) {
                                                            agentlength = agentlength + 1;
                                                        }
                                                        //console.log(index+':'+agentlength);
                                                    }
                                                    const element = leadata[index];
                                                    // console.log(arows[0]);

                                                    udata = { l_id: element.l_id, agent_id: arows[agentlength].AgentID }
                                                    //console.log(udata);
                                                    ERP.updatelead(udata, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {

                                                        }
                                                    })
                                                    note = 'Assign Lead to ' + arows[agentlength].agentname + ' by ' + req.query.tknuid;
                                                    timeline = { lead_id: element.l_id, agent_id: arows[agentlength].AgentID, account_id: req.body.userid, notes: note, current_status: element.status }
                                                    //console.log(timeline);
                                                    ERP.add_timeline_lead(timeline, function (err, rows) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        else {

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

                //}
                //})

            }
            // return res.status({ 'data': 'Lead assign to agent successfully!!' })
            res.status(200).send({ 'data': 'Lead assign to agent successfully!!' });
        }
    })

})


router.post('/get_module_access_generate_campaign', authorize, async function (req, res) {
    var account_id = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        account_id = await helper.GetManagerIdByAgent(req.query.tknuserid)
    }
    ERP.get_module_access_generate_campaign(account_id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deleteleadsreq/:id', function (req, res) {
    ERP.deleteleadsreq(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows[0] });
        }

    })
})

router.post('/getaccessettingbyname', authorize, async function (req, res) {
    req.body.account_id = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.account_id)
        req.body.account_id = managerid
    }

    ERP.getaccessettingbyname(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows[0] });
        }

    })
})
router.post('/sentmsgbywhatsupapi', authorize, async function (req, res) {
    req.body.account_id = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.account_id)
        req.body.account_id = managerid
    }
    req.body.setting_name = "whatsup_api";
    console.log(req.body);
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
                    var sdata = { lead_id: req.body.lead_id, cdrid: 0, account_id: req.body.account_id, message: req.body.message, mobile: mobile }
                    console.log('AddWhatsappChat', sdata);

                    await helper.AddWhatsappChat(sdata, req.query.tknuserid, userrole);
                    ERP.addwhatsapp_db(sdata, function (err, rows) {
                        if (err) {
                            console.log(err);
                            return res.status(200).send({ 'msg': '' });
                        }
                        else {
                            //Update Lead Timeline
                            ERP.get_lead_id_details(req.body.lead_id, function (err, leadata) {
                                if (leadata.length > 0) {
                                    var timeline = {}
                                    timeline.agent_id = leadata[0].agent_id
                                    timeline.account_id = leadata[0].User_id
                                    timeline.lead_id = leadata[0].l_id
                                    timeline.current_status = leadata[0].status
                                    timeline.notes = 'Whatsapp - ' + req.body.message
                                    timeline.action_type = 'whatsapp'
                                    timeline.action_id = rows.insertId
                                    ERP.add_timeline_lead(timeline, function (err, rows2) { })
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
                        var sdata = { lead_id: req.body.lead_id, cdrid: req.body.cdrid, account_id: req.body.account_id, message: filepath, mobile: mobile }
                        ERP.addwhatsapp_db(sdata, function (err, rows) {
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
router.post('/sendsmstoagent/', authorize, function (req, res) {
    var leadid = req.body.leadid
    ERP.get_lead_id_details(leadid, function (err, leadata) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Lead not found!!' });
        }
        else {
            if (leadata.length > 0) {
                var accountid = leadata[0].User_id
                var agentid = leadata[0].agent_id
                var l_id = leadata[0].l_id
                ERP.getsmsbalance(accountid, function (err, balancedata) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "msg": 'You have not enough SMS Balance!!' });
                    }
                    else {
                        if (balancedata.length > 0) {
                            if (balancedata[0].SMS_Pr_Balance) {
                                ERP.GetSmsServerByManagerId(accountid, function (err, smsserverdata) {
                                    if (err) {
                                        console.log(err);
                                        res.status(200).send({ "msg": 'Sms server not assigned!!' });
                                    }
                                    else {
                                        if (smsserverdata.length > 0) {
                                            ERP.getsmstemplatebyid(req.body.smstemp, function (err, tempdata) {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(200).send({ "msg": 'Sms template not found!!' });
                                                }
                                                else {
                                                    if (tempdata.length > 0) {
                                                        var serverArr = smsserverdata[0];
                                                        var templateid = tempdata[0].templateid;
                                                        var contentid = tempdata[0].contentid;
                                                        var message = req.body.message;
                                                        var space = ' '
                                                        var leadmobile = req.body.mobileno
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
                                                                var numberdata = { account_id: accountid, mobile: leadmobile, cdr_id: l_id, sms_status: smsstatus, sms_uid: transactionId, sms_credit: msgcredit, sentdate: new Date(), text: message };
                                                                var smsid = await helper.InsertSmsReport(numberdata)
                                                                //Update Lead Timeline
                                                                var timeline = {}
                                                                timeline.agent_id = agentid
                                                                timeline.account_id = accountid
                                                                timeline.lead_id = l_id
                                                                timeline.current_status = leadata[0].status
                                                                timeline.notes = 'SMS - ' + message
                                                                timeline.action_type = 'sms'
                                                                timeline.action_id = smsid
                                                                ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                                                res.status(200).send({ "msg": "Message sent successfully!!" });
                                                            }
                                                        })
                                                    } else {
                                                        res.status(200).send({ "msg": 'Sms template not found!!' });
                                                    }
                                                }
                                            })
                                        } else {
                                            res.status(200).send({ "msg": 'Sms server not assigned!!' });
                                        }
                                    }
                                })
                            } else {
                                res.status(200).send({ "msg": 'You have not enough SMS Balance!!' });
                            }
                        } else {
                            res.status(200).send({ "msg": 'You have not enough SMS Balance!!' });
                        }
                    }
                })
            } else {
                res.status(200).send({ "data": 'Lead not found!!' });
            }
        }
    })
})
router.get('/getdholeracompany', function (req, res) {
    ERP.getdholeracompany('', function (err, data) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'data not found!!' });
        }
        else {
            res.status(200).send({ "data": {data:data} });
        }
    })
    return
    var url = "https://dholerasir.co/api/getcompany.php"
    var method = "GET"
    var data = {}
    var fdata = { url: url, method: method, data: data }
    urllib.request(url, {
        method: 'POST',
        data: fdata,
        rejectUnauthorized: false,
    }, function (error, resp) {
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            var respdata = JSON.parse(resp);
            if (respdata.data) {
                respdata.data.forEach(element => {
                    var data = { id: element.id, name: element.name }
                    ERP.savedholeracompany(data, function (err, rows2) { })
                });
            }

            res.status(200).send({ "data": JSON.parse(resp) });
        }
    })
})

router.post('/getdholeraprojects', function (req, res) {
    console.log(req.body);
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getproject.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            'companyid': req.body.companyid
        }
    };
    request(options, function (error, response) {
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            //console.log(response.body);
            var respdata = JSON.parse(response.body);
            if (respdata.data) {
                respdata.data.forEach(element => {
                    var data = { id: element.id, projectname: element.projectname, company: element.company }
                    ERP.savedholeracompanyproject(data, function (err, rows2) { })
                });
            }


            res.status(200).send({ "data": JSON.parse(response.body) });
        }
    });

    // urllib.request("https://dholerasir.co/api/getproject.php", {
    //     method: 'POST',
    //     data: { companyid: req.body.companyid },
    //     rejectUnauthorized: false,
    // }, function (error, resp) {
    //     if (error) {
    //         console.log(error)
    //         res.status(200).send({ "data": {} });
    //     }
    //     else {
    //         //console.log(JSON.parse(resp).data)
    //         res.status(200).send({ "data": JSON.parse(resp) });
    //     }
    // })
})

router.post('/getdholeraplotnumber', function (req, res) {
    console.log(req.body);
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getplot.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            'projectid': req.body.id
        }
    };
    request(options, function (error, response) {
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            res.status(200).send({ "data": JSON.parse(response.body) });
        }
    });
    //  urllib.request("https://dholerasir.co/api/getplot.php", {
    //      method: 'POST',
    //      data: { projectid: req.body.id },
    //      rejectUnauthorized: false,
    //  }, function (error, resp) {
    //      if (error) {
    //          console.log(error)
    //         res.status(200).send({ "data": {} });
    //      }
    //      else {
    //          //console.log(JSON.parse(resp).data)
    //          res.status(200).send({ "data": JSON.parse(resp) });
    //      }
    //  })
})
// save email temaplate data

router.post('/saveleaddealdonedata', authorize, function (req, res) {
    console.log(req.body);
    var startdateObj = new Date(req.body.dob);
    req.body.birthdate = req.body.dob ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '';
    var startdateObj1 = new Date(req.body.paymentdate);
    req.body.paymentdate = req.body.paymentdate ? startdateObj1.getFullYear() + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj1.getDate()).slice(-2) : '';
    var startdateObj2 = new Date(req.body.dealdonedate);
    req.body.dealdonedate = req.body.dealdonedate ? startdateObj2.getFullYear() + '-' + ('0' + (startdateObj2.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj2.getDate()).slice(-2) : '';

    var fdata = { account_id: req.query.tknuserid, lead_id: req.body.lead_id, deal_date: req.body.dealdonedate, name: req.body.name, email: req.body.email, address: req.body.address, city: req.body.city, country: req.body.country, pincode: req.body.pincode, company: req.body.company, project: req.body.project, proposal: req.body.proposal, plot_number: req.body.plotnumber, plot_area: req.body.plotarea, plot_rate: req.body.plotrate, plot_value: req.body.plotvalue, discount_value: req.body.discountvalue, booking_amount: req.body.bookingamount, payment_mode: req.body.paymentmode, nominee_name: req.body.nomineename, nominee_relation: req.body.nomineerelation, nominee_phoneno: req.body.nomineephoneno, payment_date: req.body.paymentdate, birthdate: req.body.birthdate, phaseno: req.body.phaseno, dealerid: req.body.dealerid, refclient: req.body.refclient };
    //console.log(fdata);
    ERP.saveleaddealdonedata(fdata, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": {} });
        }
        else {
            var leadata = await helper.getleadetail(req.body.lead_id);
            var project = req.body.project
            var projectArr = project.split('-')
            var projectid = projectArr[0]
            var data = {
                employeeid: leadata[0].agent_id,
                name: req.body.name,
                email: req.body.email,
                mobile: leadata[0].mobile_no,
                dob: req.body.birthdate,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                country: req.body.country,
                dealerid: req.body.dealerid ? req.body.dealerid : 0,
                refclient: req.body.refclient ? req.body.refclient : 0,
                project_name: req.body.projectname,
                project_id: projectid,
                plotno: req.body.plotnumber,
                investment_proposal: req.body.proposal,
                scheme: req.body.scheme,
                phaseno: req.body.phaseno,
                plot_area: req.body.plotarea ? req.body.plotarea : 0,
                plot_rate: req.body.plotrate ? req.body.plotrate : 0,
                plot_value: req.body.plotvalue ? req.body.plotvalue : 0,
                discount_value: req.body.discountvalue ? req.body.discountvalue : 0,
                bookingamount: req.body.bookingamount ? req.body.bookingamount : 0,
                payment_mode: req.body.paymentmode,
                nominee_name: req.body.nomineename ? req.body.nomineename : '',
                relation: req.body.nomineerelation ? req.body.nomineerelation : '',
                nominee_phone: req.body.nomineephoneno ? req.body.nomineephoneno : '',
                date_of_pay: req.body.paymentdate,
                emifor: req.body.emifor ? req.body.emifor : '',//3,5,10
            };

            console.log(data)
            //return res.status(200).send({ "data": {} });
            // return res.status(200).send({ "data": 'Deal Done Status saved successfully!!' });
            var url = "https://dholerasir.co/api/createbooking.php"
            var method = "POST"
            var fdata = { url: url, method: method, data: data }
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': 'https://dholerasir.co/api/createbooking.php',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                form: data
            };
            request(options, async function (error, response) {
                if (error) {
                    console.log('err:' + error)
                    res.status(200).send({ "data": {} });
                }
                else {
                    console.log(response.body);
                    // var responsebody = response.body.split("\n");
                    // if(responsebody.count>0){
                    //     var resp = JSON.parse(responsebody[1])
                    //     var resp = response.body    
                    // }
                    var resp = response.body
                    //var resp = {error:'',errormsg:'',success:''}
                    //console.log();
                    // let resp = { "error": true, "errormsg": "Name should be compulsory.", "success": false, "successmsg": "" }
                    var sdata = { error: resp.error ? resp.error : '', errormsg: resp.errormsg ? resp.errormsg : '', success: resp.success ? resp.success : '' }

                    ERP.updateleaddealdonedata(sdata, rows.insertId, async function (err, srows) {
                        if (err) {
                            console.log(err);
                            res.status(200).send({ "data": {} });
                        }
                        else {
                            res.status(200).send({ "data": 'Deal Done Status saved successfully!!' });
                        }
                    })
                    //res.status(200).send({ "data": JSON.parse(resp)});

                    //Send Whatsapp
                    var whatsappapi = await helper.GetManagerSettingValueByName(leadata[0].User_id, 'whatsup_api')
                    if (whatsappapi > 0) {
                        console.log('whatsappapi', whatsappapi);
                        var apiArr = await helper.GetAPIDataById(whatsappapi)
                        if (apiArr.length > 0) {
                            var apidata = apiArr[0]
                            var tempid = 32
                            var tempdata = await helper.GetWhatsappTemplateById(tempid)
                            var attachfile = tempdata[0].attach_file
                            //
                            var url = apidata.api_endpoint
                            var attachurl = apidata.api_endpoint
                            var msg = tempdata[0].wtemp_description;
                            var mobile = leadata[0].mobile_no.substr(-10)
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
                                var sdata = { lead_id: leadata[0].l_id, cdrid: 0, account_id: leadata[0].User_id, message: msg, mobile: mobile }
                                await helper.AddWhatsappChat(sdata, leadata[0].agent_id, 1);
                                ERP.addwhatsapp_db(sdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        //Update Lead Timeline
                                        var timeline = {}
                                        timeline.agent_id = leadata[0].agent_id
                                        timeline.account_id = leadata[0].User_id
                                        timeline.lead_id = leadata[0].l_id
                                        timeline.current_status = leadata[0].status
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
                        }
                    }
                }
            })
            //res.status(200).send({ "data": 'Deal Done Status saved successfully!!' });
        }

    })
})

router.get('/getagentdealerdata/', authorize, async function (req, res) {
    console.log(req.body);
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var agentid = 0
    if (userrole == 1) {
        agentid = userid
        var managerid = await helper.GetManagerIdByAgent(userid)
    }
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getconsultantlist.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: { parentid: agentid }
    };
    request(options, function (error, response) {
        //if (error) throw new Error(error);
        //console.log(response.body);
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            //console.log(response.body);
            var respdata = JSON.parse(response.body);
            if (respdata.data) {
                respdata.data.forEach(element => {
                    var data = { id: element.id, name: element.name, email: element.email, mobile: element.mobile, officialmobile: element.officialmobile, area: element.area, city: element.city, gender: element.gender, username: element.username, password: element.password, joiningdate: element.joiningdate, status: element.status, parent: element.parent, state: element.state }
                    ERP.savedholeradealers(data, function (err, rows2) { })
                });
            }
            res.status(200).send({ "data": JSON.parse(response.body) });
        }
    });

})
router.get('/dholerafiledata/:id', authorize, function (req, res) {
    ERP.BulkFiledatabydholeracustomer(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        }
        var i;
        var temp1 = [];
        for (i = 0; i < data.length; i++) {
            temp1.push(data[i]["finish_time"]);

        }
        res.send({ 'data': data, 'count': temp1 });
    });
});
router.get('/getdealdonedatabyleadid/:id', authorize, async function (req, res) {

    ERP.getdealdonedatabyleadid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getemailtemplatedetail/:id', authorize, async function (req, res) {
    ERP.getemailtemplatedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getsegmentnamebyleadid/:id', authorize, async function (req, res) {
    ERP.getsegmentnamebyleadid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/geerateHtmltoPDF', authorize, async function (req, res) {
    //console.log(req.body.html);
    var html = req.body.html;
    var config = { format: 'A4' }; // or format: 'letter' - see https://github.com/marcbachmann/node-html-pdf#options
    // Create the PDF
    pdf.create(html, config).toFile('uploads/generated.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/pathtooutput/generated.pdf' }
    });
})
router.post('/send_quotationmail', authorize, async function (req, res) {
    console.log(req.body)
    var agentid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(agentid)
        var user_id = managerid
        var manager_id = req.query.tknuserid
    } else {
        var user_id = req.query.tknuserid
    }
    API.getuserdetail(agentid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'db error' });
        }
        else {
            if (rows.length > 0) {
                var adata = rows[0]
                //var emailserverid = adata['emailserver_alloted']
                //var emailserverid = 1;
                // console.log('data::' + emailserverid);
                var SData = await helper.GetAgentEmailServerData(req.body.agentid, user_id)
                var ServerData = SData[0];
                //console.log(ServerData);
                if (SData.length > 0) {
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
                    //console.log("req.::"+JSON.stringify(req.body))
                    //console.log(transOptions)
                    var tempattachment = req.body.emailtempattachment;
                    var transporter = nodemailer.createTransport(transOptions);
                    if (req.body.thumbnailfile) {
                        //console.log('hi');
                        if (fs.existsSync('./uploads/generated.pdf')) {
                            let info = {
                                from: ServerData.server_name + " " + transOptions.auth.user, // sender address
                                to: email, // list of receivers
                                subject: subject, // Subject line
                                //text: text,
                                html: text, // plain text body
                                cc: cc, // html body
                                bcc: bcc,
                                attachments: [
                                    {
                                        path: './uploads/LMS/Email/' + req.body.thumbnailfile
                                    },
                                    {
                                        path: './uploads/generated.pdf'
                                    }
                                ]
                            };
                            transporter.sendMail(info, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.status(200).send({ "msg": 'Something went wrong.' });
                                } else {
                                    //console.log(info);
                                    if (info.accepted.length > 0) {
                                        info.email_to = email
                                        info.text_description = text
                                        info.subject = subject
                                        info.frommail = ServerData.server_name + " " + ServerData.smtp_username
                                        info.User_id = user_id
                                        info.agent_id = manager_id
                                        //console.log(info)
                                        delete info.accepted
                                        delete info.rejected
                                        info.cc = cc
                                        info.bcc = bcc
                                        info.lead_name = req.body.lead_name
                                        info.attachment_file = req.body.thumbnailfile + "-generated.pdf";
                                        ERP.addleadsemail_db(info, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                return res.status(200).send({ 'msg': 'Email sent successfully.' });
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            let info = {
                                from: ServerData.server_name + " " + transOptions.auth.user, // sender address
                                to: email, // list of receivers
                                subject: subject, // Subject line
                                //text: text,
                                html: text, // plain text body
                                cc: cc, // html body
                                bcc: bcc,
                                attachments: [
                                    {
                                        path: './uploads/LMS/Email/' + req.body.thumbnailfile
                                    }
                                ]
                            };
                            transporter.sendMail(info, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.status(200).send({ "msg": 'Something went wrong.' });
                                } else {
                                    console.log(info);
                                    if (info.accepted.length > 0) {
                                        info.email_to = email
                                        info.text_description = text
                                        info.subject = subject
                                        info.frommail = ServerData.server_name + " " + ServerData.smtp_username
                                        info.User_id = user_id
                                        info.agent_id = manager_id
                                        //console.log(info)
                                        delete info.accepted
                                        delete info.rejected
                                        info.cc = cc
                                        info.bcc = bcc
                                        info.lead_name = req.body.lead_name
                                        info.attachment_file = req.body.thumbnailfile
                                        ERP.addleadsemail_db(info, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                return res.status(200).send({ 'msg': 'Email sent successfully.' });
                                            }
                                        })
                                    }

                                }
                            })
                        }
                        //console.log(info);

                    } else {
                        var email = req.body.to;
                        var text = req.body.email_description
                        var subject = req.body.subject
                        var cc = req.body.cc
                        var bcc = req.body.bcc
                        if (fs.existsSync('./uploads/generated.pdf')) {
                            let info = {
                                from: ServerData.server_name + " " + transOptions.auth.user, // sender address
                                to: email, // list of receivers
                                subject: subject, // Subject line
                                //text: text,
                                html: text, // plain text body
                                cc: cc, // html body
                                bcc: bcc,
                                attachments: [
                                    {
                                        path: './uploads/generated.pdf'
                                    }
                                ]
                            };
                            //console.log("info");
                            //console.log(req.body);
                            transporter.sendMail(info, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.status(200).send({ "msg": 'Something went wrong.' });
                                } else {
                                    // console.log(info);
                                    if (info.accepted.length > 0) {
                                        info.email_to = email
                                        info.text_description = text
                                        info.subject = subject
                                        info.frommail = ServerData.server_name + " " + ServerData.smtp_username
                                        info.User_id = user_id
                                        info.agent_id = manager_id
                                        //console.log(info)
                                        delete info.accepted
                                        delete info.rejected
                                        info.cc = cc
                                        info.bcc = bcc
                                        info.lead_name = req.body.lead_name
                                        info.attachment_file = "generated.pdf";
                                        ERP.addleadsemail_db(info, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                return res.status(200).send({ 'msg': 'Email sent successfully.' });
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            let info = {
                                from: ServerData.server_name + " " + transOptions.auth.user, // sender address
                                to: email, // list of receivers
                                subject: subject, // Subject line
                                //text: text, // plain text body
                                html: text, // plain text body
                                cc: cc, // html body
                                bcc: bcc
                            };
                            transporter.sendMail(info, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.status(200).send({ "msg": 'Something went wrong.' });
                                } else {
                                    //console.log(info);
                                    if (info.accepted.length > 0) {
                                        info.email_to = email
                                        info.text_description = text
                                        info.subject = subject
                                        info.frommail = ServerData.server_name + " " + ServerData.smtp_username
                                        info.User_id = user_id
                                        info.agent_id = manager_id
                                        //console.log(info)
                                        delete info.accepted
                                        delete info.rejected
                                        info.cc = cc
                                        info.bcc = bcc
                                        info.lead_name = req.body.lead_name
                                        ERP.addleadsemail_db(info, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                return res.status(200).send({ 'msg': 'Email sent successfully.' });
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                } else {
                    res.status(200).send({ "msg": 'No email server found.Please try again.' });
                }
            }
        }
    })
})

router.post('/get_lead_status', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(lid)
        lid = managerid
    }
    ERP.get_lead_status(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/get_action_Value', authorize, async function (req, res) {
    var action = req.body.action
    var lid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(lid)
        lid = managerid
    }
    console.log(lid)
    if (action == 'call') {
        res.status(200).send({ "data": [{ id: 0, name: 'agent' }] });
    } else if (action == 'sms') {
        ERP.getsmstemplate(lid, function (err, rows) {
            if (err) {
                res.status(200).send({ "data": [] });
            }
            else {
                var data = rows.map((element, i) => {
                    return {
                        id: element.sms_id,
                        name: element.sms_title,
                    }
                });
                res.status(200).send({ "data": data });
            }
        })
    } else if (action == 'email') {
        ERP.getemailtemplate(lid, userrole, function (err, rows) {
            console.log(err)
            if (err) {
                res.status(200).send({ "data": [] });
            }
            else {
                console.log(rows)
                var data = rows.map((element, i) => {
                    return {
                        id: element.email_id,
                        name: element.email_title,
                    }
                });
                res.status(200).send({ "data": data });
            }
        })
    } else if (action == 'whatsapp') {
        ERP.getwhatsapptemplate(lid, userrole, function (err, rows) {
            console.log(err)
            console.log(rows)
            if (err) {
                res.status(200).send({ "data": [] });
            }
            else {
                var data = rows.map((element, i) => {
                    return {
                        id: element.wtemp_id,
                        name: element.wtemp_title,
                    }
                });
                res.status(200).send({ "data": data });
            }
        })
    } else if (action == 'api') {
        ERP.get_api_data(lid, function (err, rows) {
            if (err) {
                res.status(200).send({ "data": [] });
            }
            else {
                var data = rows.map((element, i) => {
                    return {
                        id: element.api_id,
                        name: element.api_name,
                    }
                });
                res.status(200).send({ "data": data });
            }
        })
    } else {
        res.status(200).send({ "data": [] });
    }
})


router.post('/create_trigger', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    var data = { account_id: lid, column_name: req.body.column, condition_name: req.body.condition, condition_value: req.body.conditionvalue, action_name: req.body.action, action_value: req.body.actionvalue }
    ERP.create_trigger(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Trigger created successfully.' });
        }
    })
})

router.post('/get_trigger_list', authorize, async function (req, res) {
    var lid = req.query.tknuserid
    ERP.get_trigger_list(lid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/get_supervisor_Stages/:id', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    ERP.get_supervisor_Stages(account_id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchleaddata/', authorize, async function (req, res) {
     console.log("+++lead++++",req.body);
    var cstartdateobj = new Date (req.body.filter.complatedstartdate);
    var complatedstartdate = req.body.filter.complatedstartdate?cstartdateobj.getFullYear() + '-' + ('0' + (cstartdateobj.getMonth() + 1)).slice(-2) + '-' + ('0' + cstartdateobj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.complatedstartdate =complatedstartdate;
    var cenddateobj= new Date(req.body.filter.complatedenddate);
    var complatedenddate = req.body.filter.complatedenddate ?cenddateobj.getFullYear() + '-' + ('0' + (cenddateobj.getMonth() + 1)).slice(-2) + '-' + ('0' + cenddateobj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.complatedenddate =complatedenddate;
    var startdateObj = new Date(req.body.filter.startdate);
    var startdate = req.body.filter.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.startdate = startdate;
    var enddateObj = new Date(req.body.filter.enddate);
    var enddate = req.body.filter.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.enddate = enddate;
    var mstartdateObj = new Date(req.body.filter.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.filter.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.filter.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.filter.modifiedenddate = menddate;
    var userrole = req.query.tknuserrole;
    req.body.filter.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.filter.userid)
        req.body.filter.account_id = managerid
    }
    console.log( req.body.filter)
    user_id = req.body.user_id;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = req.body.filter;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    var statusArr = req.body.filter.status?req.body.filter.status:[];
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.filter.status = newstatusArr;
    }
    var sourceArr = req.body.filter.source?req.body.filter.source:[];
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.filter.source = newsourceArr;
    }
    var agentArr = req.body.filter.agent?req.body.filter.agent:[];
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.filter.agent = newagentArr;
    }
    var adsnameArr = req.body.filter.ads_name?req.body.filter.ads_name:[];
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.filter.ads_name = newadsnameArr;
    }
    var tagArr = req.body.filter.tag_id?req.body.filter.tag_id:[];
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.filter.tag_id = newtagArr;
    }

    console.log("data::" + JSON.stringify(findmatch));
    if (req.body.filter.agentrole == 'supervisor') {
        ERP.searchsupervisorleaddata(findmatch, function (err, contacts_data) {
            if (err) {
                res.status(200).send({ 'payload': [] });
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    } else {
        ERP.searchleaddata(findmatch, function (err, contacts_data) {
            if (err) {
                res.status(200).send({ 'payload': [] });
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    }

});
router.post('/getleaddatalength/', authorize, async function (req, res) {
    //console.log(req.body);
    var complatedstartdateObj = new Date(req.body.complatedstartdate);
    var complatedstartdate = req.body.complatedstartdate ? complatedstartdateObj.getFullYear() + '-' + ('0' + (complatedstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + complatedstartdateObj.getDate()).slice(-2) : null;
    req.body.complatedstartdate = complatedstartdate;
    var complatedenddateObj = new Date(req.body.complatedenddate);
    var complatedenddate = req.body.complatedenddate ? complatedenddateObj.getFullYear() + '-' + ('0' + (complatedenddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + complatedenddateObj.getDate()).slice(-2) : null;
    req.body.complatedenddate = complatedenddate;
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : null;
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : null;
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;
    req.body.account_id = req.body.userid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status?req.body.status:[];
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source?req.body.source:[];
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name?req.body.ads_name:[];
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id?req.body.tag_id:[];
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }


    if (req.body.agentrole == 'supervisor') {
        ERP.getsupervisorleaddatalength(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    } else {
        ERP.getleaddatalength(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                console.log('asds',row)
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    }
});
router.get('/getsmstemplatedetail/:id', authorize, function (req, res) {
    ERP.getsmstemplatedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getadsnamebyuserid/', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.userid = managerid
    }
    var sourceArr = req.body.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    ERP.getadsnamebyuserid(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveleadstatus', authorize, function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    fdata = {
        status_name: name
    };
    ERP.checkleadstatus(name, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": 'lead status already exist!!' });
            } else {
                ERP.saveleadstatus(fdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(200).send({ "data": 'lead status saved succesfully.' });
                    }
                })
            }

        }
    })

})
router.get('/checkleadstatus/:name', authorize, function (req, res) {
    ERP.checkleadstatus(req.params.name, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadtags/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
        userid = managerid
    }
    ERP.getleadtags(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getnextleaddetail/', authorize, async function (req, res) {
    if (req.body.startdate == 'current') {
        var startdateObj = new Date();
    } else {
        var startdateObj = new Date(req.body.startdate);
    }
    if (req.body.enddate == 'current') {
        var enddateObj = new Date();
    } else {
        var enddateObj = new Date(req.body.enddate);
    }

    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) + ' 00:00:00';
    req.body.startdate = startdate;
    if (req.body.lead_id) {
        var enddateObj = new Date(req.body.lead_id);
        var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) + ' ' + ("0" + enddateObj.getHours()).slice(-2) + ':' + ("0" + enddateObj.getMinutes()).slice(-2) + ':' + ("0" + enddateObj.getSeconds()).slice(-2) + ' 23:59:59';
    } else {
        var enddateObj = new Date(req.body.enddate);
        var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    }
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = req.body.modifiedstartdate ? mstartdate : '';
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = req.body.modifiedenddate ? menddate : '';
    req.body.account_id = req.body.userid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name;
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id;
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }

    //console.log(req.body)
    if (req.body.agentrole == 'supervisor') {
        ERP.getsupervisorleaddatalength(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    } else {
        ERP.getnextleaddata(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    }
});

//create quotation without erp
router.post('/updateleadquotation', authorize, async function (req, res) {
    // var array = req.body
    var account_id = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var created_by = req.query.tknuserid;
    if (userrole == 1) {
        account_id = await helper.GetManagerIdByAgent(req.query.tknuserid)
    }
    var in_words = 'INR ' + converter.toWords(req.body.grandtotal) + ' only.'
    //update opportunity amount with quotation without GST Amount
    var updatedata = await ERP.updateopportunityamount(req.body.quotation_id, req.body.lead_id, req.body.total);
    var data = { quotation_id: req.body.quotation_id, account_id: account_id, lead_id: req.body.lead_id, total_quantity: req.body.totalquantity, grand_total: req.body.grandtotal, created_by: created_by, grand_total_inword: in_words, total_discount: req.body.totaldiscount, total_gstamount: req.body.totalgstamount, validity: req.body.validity, total_amount: req.body.total }
    //console.log(rows)
    ERP.updatleadquotation(data, req.body.quotation_id, function (err, rows2) {
        if (err) {
            return res.status(200).send({ 'data': "Something went wrong!!" });
        }
        else {
            if (req.body.items.length > 0) {
                ERP.deletequotationitems(req.body.quotation_id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(200).send({ 'data': "Something went wrong!!" });
                    }
                    else {
                        bulknumarray = [];
                        async.forEachOf(req.body.items, async (data, key, callback) => {
                            //console.log(data);
                            var data = { quotation_id: req.body.quotation_id, product_id: data.product_id, quantity: data.quantity, discount: data.discount, product_price: data.rate, product_amount: data.amount, gst: data.gst, gst_amount: data.gstamount }
                            ERP.insertquotationitems(data, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                    return res.status(200).send({ 'data': "Something went wrong!!" });
                                }
                                else {
                                }
                            })
                        })
                    }
                })

            }
            return res.status(200).send({ 'data': "Lead Quotation data updated successfully!!" });
        }
    })
})
router.get('/getleadstagenamebystatus/:status', authorize, async function (req, res) {
    //console.log(req.params.id);
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    //console.log(account_id);
    if (role == 1) {
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    ERP.getleadstagenamebystatus({ userid: account_id, status: req.params.status }, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getleadgenerator/', authorize, async function (req, res) {
    var userid = req.query.tknuserid
    var userrole = req.query.tknuserrole;
    var agentid = 0
    if (userrole == 1) {
        agentid = userid
        var managerid = await helper.GetManagerIdByAgent(userid)
    }
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://dholerasir.co/api/getleadgenerator.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {}
    };
    request(options, function (error, response) {
        //if (error) throw new Error(error);
        //console.log(response.body);
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            // console.log(response.body);
            var respdata = JSON.parse(response.body);
            if (respdata.data) {
                respdata.data.forEach(element => {
                    var data = { id: element.id, name: element.name, email: element.email, mobile: element.mobile, officialmobile: element.officialmobile, area: element.area, city: element.city, gender: element.gender, username: element.username, password: element.password, joiningdate: element.joiningdate, status: element.status, parent: element.parent, state: element.state }
                    ERP.savedholeraleadgenerator(data, function (err, rows2) { })
                });
            }

            res.status(200).send({ "data": JSON.parse(response.body) });
        }
    });

})

router.get('/getmanagers', authorize, async function (req, res) {
    var id = 0;
    ERP.getmanagers(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/searchleaddata_isdeleted/', authorize, async function (req, res) {

    var startdateObj = new Date(req.body.filter.startdate);
    var startdate = req.body.filter.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.startdate = startdate;
    var enddateObj = new Date(req.body.filter.enddate);
    var enddate = req.body.filter.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '1970-01-01';
    req.body.filter.enddate = enddate;
    var mstartdateObj = new Date(req.body.filter.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.filter.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.filter.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.filter.modifiedenddate = menddate;
    var userrole = req.query.tknuserrole;
    req.body.filter.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.filter.userid)
        req.body.filter.account_id = managerid
    }

    user_id = req.body.user_id;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = req.body.filter
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    var statusArr = req.body.filter.status;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.filter.status = newstatusArr;
    }
    var sourceArr = req.body.filter.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.filter.source = newsourceArr;
    }
    var agentArr = req.body.filter.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.filter.agent = newagentArr;
    }
    var adsnameArr = req.body.filter.ads_name;
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.filter.ads_name = newadsnameArr;
    }
    var tagArr = req.body.filter.tag_id;
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.filter.tag_id = newtagArr;
    }

    console.log("data::" + JSON.stringify(findmatch));
    if (req.body.filter.agentrole == 'supervisor') {
        ERP.searchsupervisorleaddata_isdeleted(findmatch, function (err, contacts_data) {
            if (err) {
                res.status(200).send({ 'payload': [] });
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    } else {
        ERP.searchleaddata_isdeleted(findmatch, function (err, contacts_data) {
            if (err) {
                res.status(200).send({ 'payload': [] });
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    }

});


router.post('/getleaddatalength_isdeleted/', authorize, async function (req, res) {
    //console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : null;
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : null;
    req.body.enddate = enddate;
    var mstartdateObj = new Date(req.body.modifiedstartdate);
    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
    req.body.modifiedstartdate = mstartdate;
    var menddateObj = new Date(req.body.modifiedenddate);
    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
    req.body.modifiedenddate = menddate;
    req.body.account_id = req.body.userid
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    var statusArr = req.body.status;
    if (statusArr.length > 0) {
        var newstatusArr = [];
        statusArr.forEach(element => {
            if (element != '') {
                newstatusArr.push("'" + element + "'");
            }
        });
        req.body.status = newstatusArr;
    }
    var sourceArr = req.body.source;
    if (sourceArr.length > 0) {
        var newsourceArr = [];
        sourceArr.forEach(element => {
            if (element != '') {
                newsourceArr.push("'" + element + "'");
            }
        });
        req.body.source = newsourceArr;
    }
    var agentArr = req.body.agent;
    if (agentArr) {
        var newagentArr = []
        agentArr.forEach(element => {
            if (element != '') {
                newagentArr.push(element);
            }
        });
        req.body.agent = newagentArr;
    }
    var adsnameArr = req.body.ads_name;
    if (adsnameArr.length > 0) {
        var newadsnameArr = [];
        adsnameArr.forEach(element => {
            if (element != '') {
                newadsnameArr.push("'" + element + "'");
            }
        });
        req.body.ads_name = newadsnameArr;
    }
    var tagArr = req.body.tag_id;
    if (tagArr) {
        var newtagArr = []
        tagArr.forEach(element => {
            if (element != '') {
                newtagArr.push(element);
            }
        });
        req.body.tag_id = newtagArr;
    }

    console.log("length::" + JSON.stringify(req.body))
    if (req.body.agentrole == 'supervisor') {
        ERP.getsupervisorleaddatalength_isdeleted(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    } else {
        ERP.getleaddatalength_isdeleted(req.body, function (err, row) {
            if (err) {
                res.status(200).send({ 'data': [] });
            } else {
                // console.log("1111"+JSON.stringify(contacts_data))
                res.status(200).send({ 'data': row });
            }
        })
    }
});
router.get('/deleteleadsrestore/:id', function (req, res) {
    ERP.deleteleadsrestore(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': rows[0] });
        }

    })
})
//delete_campagin_data
router.get('/delete_campagin_data/:id', function (req, res) {
    ERP.delete_campagin_data(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send({ 'data': "data deleted successfully!!!!" });
        }

    })
})
router.get('/getassignedsupervisoragents/:id', function (req, res) {
    ERP.getassignedsupervisoragents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': [] });
        }
        else {
            return res.status(200).send({ 'data': rows });
        }

    })
})
router.get('/getallleadsource/:id', authorize, async function (req, res) {
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        req.params.id = managerid
    }
    ERP.getallleadsource(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ 'data': [] });
        }
        else {
            return res.status(200).send({ 'data': rows });
        }

    })
})

router.get('/getticketlaststatus/:id', authorize, async function (req, res) {
    ERP.getticketlaststatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getdholeraplotproposal', function (req, res) {
    console.log(req.body);
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://dholerasir.co/api/getscheme.php',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            'projectname': req.body.name
        }
    };
    request(options, function (error, response) {
        if (error) {
            console.log(error)
            res.status(200).send({ "data": {} });
        }
        else {
            res.status(200).send({ "data": JSON.parse(response.body) });
        }
    });
})
router.post('/delete_all_lead_data', authorize, async function (req, res) {
    req.body.userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    req.body.role = userrole
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.userid)
        req.body.account_id = managerid
    }
    console.log("deleted _lead", req.body)
    ERP.check_password_manager(req.body.userid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            const result = bcrypt.compareSync(req.body.password, rows[0].account_password)
            if (result) {
                if (rows.length > 0) {
                    var startdateObj = new Date(req.body.startdate);
                    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
                    req.body.startdate = startdate;
                    var enddateObj = new Date(req.body.enddate);
                    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
                    req.body.enddate = enddate;
                    var mstartdateObj = new Date(req.body.modifiedstartdate);
                    var mstartdate = mstartdateObj.getFullYear() + '-' + ('0' + (mstartdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + mstartdateObj.getDate()).slice(-2);
                    req.body.modifiedstartdate = mstartdate;
                    var menddateObj = new Date(req.body.modifiedenddate);
                    var menddate = menddateObj.getFullYear() + '-' + ('0' + (menddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + menddateObj.getDate()).slice(-2);
                    req.body.modifiedenddate = menddate;
                    var statusArr = req.body.status;
                    if (statusArr.length > 0) {
                        var newstatusArr = [];
                        statusArr.forEach(element => {
                            if (element != '') {
                                newstatusArr.push("'" + element + "'");
                            }
                        });
                        req.body.status = newstatusArr;
                    }
                    var sourceArr = req.body.source;
                    if (sourceArr.length > 0) {
                        var newsourceArr = [];
                        sourceArr.forEach(element => {
                            if (element != '') {
                                newsourceArr.push("'" + element + "'");
                            }
                        });
                        req.body.source = newsourceArr;
                    }
                    var agentArr = req.body.agent;
                    if (agentArr) {
                        var newagentArr = []
                        agentArr.forEach(element => {
                            if (element != '') {
                                newagentArr.push(element);
                            }
                        });
                        req.body.agent = newagentArr;
                    }
                    var adsnameArr = req.body.ads_name;
                    if (adsnameArr.length > 0) {
                        var newadsnameArr = [];
                        adsnameArr.forEach(element => {
                            if (element != '') {
                                newadsnameArr.push("'" + element + "'");
                            }
                        });
                        req.body.ads_name = newadsnameArr;
                    }
                    var tagArr = req.body.tag_id;
                    if (tagArr) {
                        var newtagArr = []
                        tagArr.forEach(element => {
                            if (element != '') {
                                newtagArr.push(element);
                            }
                        });
                        req.body.tag_id = newtagArr;
                    }
                    var leadata = req.body.leadArr;

                    if (leadata.length > 0) {

                        for (let index = 0; index < leadata.length; index++) {

                            ERP.update_deleted_lead_bulk(leadata[index], function (err, dele_data) {
                                if (err) {
                                    res.status(200).send({ 'data': [] });
                                }
                                else {
                                    //  res.status(200).send({ 'data': 'Deleted Successfully!!' });
                                }
                            })




                        }
                    } else {
                        ERP.get_lead_list_api(req.body, function (err, leadata) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (leadata.length > 0) {
                                    for (var i = 0; i < leadata.length; i++) {
                                        ERP.update_deleted_lead_bulk(leadata[i]['l_id'], function (err, dele_data) {
                                            if (err) {
                                                res.status(200).send({ 'data': [] });
                                            }
                                            else {
                                                //  res.status(200).send({ 'data': 'Deleted Successfully!!' });
                                            }
                                        })
                                    }

                                }

                            }
                        })
                    }
                }
                res.status(200).send({ 'data': 'Deleted Successfully!!' });

            }
            else {
                res.status(200).send({ 'data': 'Password Not Match!!' });

            }
            // // return res.status({ 'data': 'Lead assign to agent successfully!!' })
        }
    })

})
module.exports = router;