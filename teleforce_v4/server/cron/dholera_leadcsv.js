var cron = require('node-cron');
var Erp = require('../model/erp');
var API = require('../model/api');
var csv=require('csvtojson');
var async = require('async');
require("dotenv").config();
console.log(process.env.ERPURL)
var Contacts = require('../model/Contacts');
var helper = require("../helper/common");
var dateFormat = require("dateformat");

cron.schedule('*/1 * * * *', () => {
    console.log("Start")
    Erp.dholeraAllFiledata('0',async function (err, data) {
        if (err) {
            console.log("Error: " + err)
        }else{
            console.log("Start")
            console.log(data)
            if(data.length>0){
                var rows = data[0]
                var status = '1';
                var m = new Date();
                let data_a = { "file_status": status,"start_time": m }
                let fileid = rows.F_id;
                var file_p = rows.file_path
                console.log("fileid: " + fileid);
                var account_id = rows.user_id
                var assignagentid = rows.agent_id
                var agentgroupid = rows.agentgroup_id
                var category = rows.segmentid
                var duplicateallow = rows.remove_duplicate
                Erp.updatedholerafileStatus(data_a, fileid, function (err, count) {
                    if (err) {
                        console.log("Error: " + err)
                     }
                     else {                        
                        console.log("Status will be change Pending")
                        var csv_headers_format = [
                            'name',
                            'email',
                            'mobile',
                            'address',
                            'city',
                            'state',
                            'source'
                        ]
                        const csvFilePath= '../' + file_p
                        console.log(file_p)
                        csv()
                        .fromFile(csvFilePath)
                        .then((jsonObj)=>{
                            var json_keys = Object.keys(jsonObj[0]);
                            // if(JSON.stringify(json_keys) != JSON.stringify(csv_headers_format)){
                            //     console.log('CSV file format is not valid, Download the sample file for reference.'); 
                            //     let data_a = { "file_status": "2","note": 'CSV file format is not valid, Download the sample file for reference.' }
                            //     Erp.updatefileStatus(data_a, fileid, function (err, count) {})
                            // }else{
                                bulkUpdateOps = [];
                                //console.log(jsonObj)
                                var tmpmobile = []
                                Erp.get_username(account_id,async function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //console.log(rows[0].erp_email);
                                        // var erp_email = rows[0].erp_email
                                        // var erp_email = rows[0].erp_email
                                        var managername = rows[0].account_name
                                        //if(agentid>0){
                                            //console.log("only agent");
                                            if(jsonObj.length>0){
                                                var loopinterval =  0;
                                                async.forEachOf(jsonObj, async (obj, key, callback) => {
                                                    let difference = json_keys.filter(x => !csv_headers_format.includes(x));
                                                    console.log(difference)
                                                    var lead = {};
                                                    lead.doctype = "Lead";
                                                    lead.status = "Lead";
                                                    lead.source = obj['source']?obj['source']:'Call';
                                                    lead.notes = '';
                                                    lead.email_id = obj['email']?obj['email']:'';
                                                    lead.lead_name = obj['name'].replace(/[^a-zA-Z ]/g, "");
                                                    lead.address_title = obj['address']?obj['address']:'';
                                                    lead.city = obj['city']?obj['city']:'';
                                                    lead.state = obj['state']?obj['state']:'';
                                                    var mobile = obj['mobile']?obj['mobile'].substr(-10):'';
                                                    lead.mobile_no = mobile;
                                                    
                                                    if(tmpmobile.includes(mobile)){}else{
                                                        tmpmobile.push(mobile)
                                                        setTimeout(() => {
                                                            API.findlead(mobile,account_id,async function (err, data) {
                                                                if (data.length > 0) {
                                                                    console.log('Lead already exists.')
                                                                } else {
                                                                        var response = lead
                                                                        if (response) {
                                                                            if(assignagentid>0){
                                                                                var agentid = assignagentid
                                                                            }else{
                                                                                var agentid = await API.GetLeadAgent(agentgroupid)
                                                                            }
                                                                            response.User_id = account_id
                                                                            response.agent_id = agentid
                                                                            response.is_sync = "yes"    
                                                                            var now = new Date();
                                                                            response.creation = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                                                            response.modified = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                                                                            response.modified_by = managername
                                                                            response.title = lead.lead_name;       
                                                                            API.addlead_db(response, function (err, rows) {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                }
                                                                                else {
                                                                                    var leadid = rows.insertId
                                                                                    let year = new Date().getFullYear()
                                                                                    let month = new Date().getMonth()                                    
                                                                                    let lead_name = {}
                                                                                    lead_name.name = 'CRM-LEAD-'+year+'-'+(month+1)+leadid
                                                                                    Erp.updat_lead_name(lead_name,leadid, function (err, rows2) {})
                                                                                    var m = new Date();
                                                                                    var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds()+leadid;
                                                                                    var data = { cont_id: cont_id, customer_id: account_id, created_date: m, name: lead.lead_name, email: lead.email_id, mobile: lead.mobile_no, address: lead.address_title, city: lead.city, state: lead.state, lead_source: lead.lead_source, category: category, created_by: account_id, lead_id: leadid }
                                                                                    Contacts.createcontact(data, function (err, result) {
                                                                                        //console.log(err)
                                                                                        if (err) {
                                                                                            console.log(err)
                                                                                            //res.status(200).json(err);
                                                                                        }
                                                                                        else {
                                                                                            var conid = cont_id
                                                                                            //console.log(extraitems)
                                                                                            if(difference.length>0){
                                                                                                difference.forEach(element => {
                                                                                                    if(obj[element]!=''){
                                                                                                        helper.SaveContactMeta(element,obj[element], conid, account_id)
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                            var timeline = {}
                                                                                            timeline.agent_id = agentid
                                                                                            timeline.account_id = account_id
                                                                                            timeline.lead_id = leadid
                                                                                            timeline.current_status = 'Lead'
                                                                                            timeline.notes = 'Create Lead BY ' + managername
                                                                                            Erp.add_timeline_lead(timeline, function (err, rows2) {})
                                                                                        }
                                                                                    });
                                                                                }
                                                                            })
                                                                        }
                                                                }
                                                            })
                                                        },loopinterval);
                                                        loopinterval = 1000*(key+1)
                                                    }
                                                })
                                                var status = '2';
                                                var m = new Date();
                                                let data_b = ({ "file_status": status,"note": 'Data uploaded successfully',"finish_time":m })
                                                Erp.updatedholerafileStatus(data_b, fileid, function (err, count) {
                                                    if (err) {
                                                        console.log("Error: " + err)
                                                    }
                                                    else {
                                                        console.log({'msg':'Lead Data uploaded successfully.'});
                                                    }
                                                });
                                            }
                                        // }else{
                                        //    console.log("no agent id found");
                                        // }
                                    }
                                })
                        })
                    }
                })
            }
        }
    })
})