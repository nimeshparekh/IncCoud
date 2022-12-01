var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Location = require('../model/location');
var Default = require('../model/default');
const authorize = require("../middlewares/auth");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.post('/saveAgentLocation',authorize, function (req, res) {
    const agent_id = req.body.agent_id;
    const lat = req.body.lat;
    const long = req.body.long;
    const number = req.body.number;
    const address = req.body.address;
    const state = req.body.state;
    const city = req.body.city;
    const areaname = req.body.areaname;
    const country = req.body.country;
    const Pincode = req.body.pincode;
    Default.getagentdetail(agent_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            managerid = rows[0].created_by;
            agentname = rows[0].account_name;
            agentmobile = rows[0].mobile;
            searchdata = {agent_id:agent_id,latitude:lat,longitude:long}
                
                Location.getagentlocation(searchdata, function (err, locationdata) {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        //console.log(locationdata);
                        if(locationdata.length>0 && locationdata[0].latitude==lat && locationdata[0].longitude==long ){
                            var today = new Date();
                            var datetime = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            
                            data = {location_id:locationdata[0].location_id,account_id:managerid,agent_id:agent_id,agent_name:agentname,agent_mobile:agentmobile,latitude:lat,longitude:long,
                                number:number,full_address:address,area_name:areaname,city:city,state:state,country:country,pincode:Pincode,last_modify_date:datetime	}
                            
                            Location.updateagentlocation(data, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                }
                                else{
                                    res.status(200).send({ "data": 'Agent Location updated successfully!!'});
                                }
                            })
                        }else{
                            var today = new Date();
                            var datetime = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                            data = {account_id:managerid,agent_id:agent_id,agent_name:agentname,agent_mobile:agentmobile,latitude:lat,longitude:long,
                                number:number,full_address:address,area_name:areaname,city:city,state:state,country:country,pincode:Pincode,created_date:datetime	}
                            
                            Location.saveagentlocation(data, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                }
                                else{
                                    res.status(200).send({ "data": 'Agent Location saved successfully!!'});
                                }
                            }) 
                        }
                    }
                }) 
                 
        }
    })
    
})
router.get('/getApproveSMSList/:id',authorize, function (req, res) {
    Template.getapprovesmslist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else{
            res.status(200).send({ "data": rows});
        }
    })    
})
router.get('/getTransactionalSMSserver/',authorize, function (req, res) {
    var id =0 ;
    Template.gettransactionalsmserver(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else{
            res.status(200).send({ "data": rows});
        }
    })    
})
router.get('/getAgentLocation/:id',authorize, function (req, res) {
    //console.log(req.params.id);
    var today = new Date();
    var date = today.getFullYear() + "-" +('0'+(today.getMonth()+1)).slice(-2)+ "-" + today.getDate();
    Location.getallagentlocation(req.params.id,date, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchAgentLocation/',authorize, function (req, res) {
    //console.log(req.body);
    var today = new Date(req.body.date);
    req.body.date = today.getFullYear() + "-" +('0'+(today.getMonth()+1)).slice(-2)+ "-" + today.getDate();
   
    Location.searchagentlocation(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})



module.exports = router;