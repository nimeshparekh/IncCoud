// var APIRESTERPNext = require('restapi-erpnext');
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const authorize = require("../middlewares/auth");
var ERP = require('../model/erp');
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
const LReport = require('../model/lmsreport');
var Contacts = require('../model/Contacts');

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

router.post('/getleadsourcereport', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.getleadsourcereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/getuntouchleadreport', authorize, async function (req, res) {
    date = new Date();
    //if (req.body.day) {
        d = new Date(date.setDate(date.getDate() - (req.body.days)));
        req.body.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    
    LReport.getuntouchleadreport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/getleadstagereport', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.getleadstagereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/getleadopportunityamountreport', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.getleadopportunityamountreport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/getleadbystagereport', authorize, async function (req, res) {

    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.getleadbystagereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/getleadtimelinereport', authorize, async function (req, res) {

    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.getleadtimelinereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_supervisiore_Lead_Timeline_Report', authorize, async function (req, res) {

    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    
    LReport.get_supervisiore_Lead_Timeline_Report(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/get_supervisor_lead_opportunity_amount_report', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.get_supervisor_lead_opportunity_amount_report(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/get_supervisoir_leadstagereport', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.get_supervisoir_leadstagereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })

})

router.post('/get_supervisior_lead_by_stage_report', authorize, async function (req, res) {

    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.get_supervisior_lead_by_stage_report(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})

router.post('/get_supervisior_UntouchLeadReport', authorize, async function (req, res) {
    date = new Date();
    //if (req.body.day) {
        d = new Date(date.setDate(date.getDate() - (req.body.days)));
        req.body.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    
    LReport.get_supervisior_UntouchLeadReport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_supervisior_LeadSourceReport', authorize, async function (req, res) {
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.get_supervisior_LeadSourceReport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})

/// Analytics-----gharph
///stage_leads_converts_the
router.post('/stage_leads_converts_the_most', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date();
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.stage_leads_converts_the_most(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})

// stage_wise_drop_off analiytics
router.post('/stage_wise_drop_off', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date();
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.stage_wise_drop_off(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_ads_id', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    

    LReport.get_ads_id(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_ads_cost_graph', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    

    LReport.get_ads_cost_graph(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            // console.log(rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
//stage_wise_oppurtunity_amount
router.post('/stage_wise_oppurtunity_amount', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date();
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    LReport.stage_wise_oppurtunity_amount(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_adslist_by_agent', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    console.log(req.body);
    LReport.get_adslist_by_agent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            console.log(rows)
            var ads_id=rows[0]["ads_id"];
            req.body.ads_id=ads_id;
            LReport.get_ads_new_roi_by_agent(req.body, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": [] });
        
                }
                else {
                    // console.log(rows)
                    return res.status(200).send({ 'data': response });
                }
            })
          // return res.status(200).send({ 'data': rows });
        }
    })
})
router.post('/get_ads_roi_by_agent', authorize, async function (req, res) {
    req.body.userid =req.query.tknuserid
    LReport.get_ads_roi_by_agent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
             console.log("new",rows)
            return res.status(200).send({ 'data': rows });
        }
    })
})
module.exports = router;