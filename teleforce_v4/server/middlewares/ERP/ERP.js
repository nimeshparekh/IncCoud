var APIRESTERPNext = require('restapi-erpnext');
var express = require('express');
var router = express.Router();
const authorize = require("../auth");
var Admin = require('');


var APIRESTERPNext = new APIRESTERPNext({
    username : 'khodu.garuda@gmail.com',
    password : 'Ps@78143',
    baseUrl  : 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
})


// APIRESTERPNext.sainterpnext('/api/resource/Lead', 'GET', null).then(function (res) {
//     console.log('Resultado', res);
//   })

// var lead = {"doctype": "Lead", "lead_name": "nimesh","email_id":"nimesh.garuda@gmail.com","mobile_no":"9044524218"}


// APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (res) {
//     console.log('Resultado', res);
//   })


router.post('/lead_create', authorize, function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var lead = {"doctype": "Lead", "lead_name": name,"email_id":email,"mobile_no":mobile}

    APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (response) {
        if(response){
            res.status(200).send({ "msg": 'Create Lead Succesfully'});
        }
    })
    
})



router.post('/erp_issue', authorize, function (req, res) {
    console.log("start")
    Admin.getdigitalbypush_erp(function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ldata = rows[0]
            console.log(ldata)
            // var name = ldata['name']
            // var email = ldata['email']
            // var mobile = ldata['mobile']
            // var lead = {"doctype": "Lead", "lead_name": name,"email_id":email,"mobile_no":mobile}

            // APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (response) {
            //     if(response){
            //         data = { push_erp: 'yes' }
            //         Admin.updatedemorequest(id, data, function (err, rows) { })
            //         return res.status(200).send({ "msg": 'Create Lead Succesfully'});
            //     }
            // })
            
        }
    })
    // var subject = req.body.subject;
    // var status = req.body.status;
    // var customer = req.body.customer;
    // var priority = req.body.priority;
    // var issue_type = req.body.issue_type;
    // var issue = {"doctype": "Issue", "subject": subject,"status":status,"customer":customer,"priority":priority,"issue_type":issue_type,}
    // APIRESTERPNext.sainterpnext('/api/resource/Issue', 'POST', issue).then(function (response) {
    //     if(response){
    //         console.log("Done")
    //         res.status(200).send({ "msg": 'Create Issue Succesfully'});
    //     }
    // })
    
})


module.exports = router;