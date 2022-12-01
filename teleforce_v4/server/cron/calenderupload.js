var cron = require('node-cron');
var Contacts = require('../model/Contacts');
var csv = require('csvtojson');
var async = require('async');
const helper = require('csvtojson');
var newhelper = require('../helper/common');
var dateFormat = require('dateformat');

cron.schedule('*/1 * * * *', async() => {
    console.log("json create!!");
    Contacts.CalenderFiledata('0', function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            if (data.length > 0) {
                rows = data[0]
                var status = '1';
                var m = new Date();
                let data_a = { "status": status, "start_time": m }
                let fileid = rows.fid;
                file_p = rows.file_path
                customer_id = rows.customer_id
                agentid = rows.agentid
                console.log("fileid: " + fileid);
                Contacts.updatefileStatusCalender(data_a, fileid, async function (err, count) {
                    if (err) {
                        console.log("Error: " + err)
                    }
                    else {

                        console.log("Status will be change Pending")

                        var csv_headers_format = [
                            'Sr No',
                            'meeting_type',
                            'customer_name',
                            'Description',
                            'email',
                            'mobile',
                            'StartTime',
                            'EndTime'
                        ]

                        const csvFilePath = '../uploads/' + file_p
                        await csv()
                            .fromFile(csvFilePath)
                            .then(async (jsonObj) => {
                                var json_keys = Object.keys(jsonObj[0]);
                                if (JSON.stringify(json_keys) != JSON.stringify(csv_headers_format)) {
                                    console.log('CSV file format is not valid, Download the sample file for reference.');
                                    let data_a = { "status": "2", "note": 'CSV file format is not valid, Download the sample file for reference.' }
                                    Contacts.updatefileCalenderStatus(data_a, fileid, function (err, count) { })
                                } else {
                                    bulkUpdateOps = [];
                                    await async.forEachOf(jsonObj, async (obj, key, callback) => {
                                        console.log("object ");
                                        console.log(JSON.stringify(obj));
                                        // if(obj['meeting_type'] == ''){

                                        // }
                                        var meeting_type = obj['meeting_type'];
                                        var customer_name = obj['customer_name'];
                                        var Description = obj['Description'];
                                        var email = obj['email'];
                                        var mobile = obj['mobile'];
                                        var StartTime = obj['StartTime'];
                                        var EndTime = obj['EndTime'];

                                        if (EndTime == '') {
                                            var currentDate = new Date(StartTime);
                                            var EndTime_1 = new Date(currentDate.getTime() + 15 * 60000);
                                            var EndTime = dateFormat(EndTime_1, "yyyy-mm-dd HH:MM:ss");
                                        }
                                        //console.log("EndTime :"+EndTime);

                                        var digitsrandom = await newhelper.randomNumber(6);
                                        var original_meeting_link = "https://meet.cloudX.in/" + digitsrandom;
                                        var short_link = await newhelper.CreateShortLink(original_meeting_link);
                                        var meet_link = "https://slss.in/" + short_link;

                                        if(meeting_type.toLowerCase() == 'call'){
                                            meeting_type = 'Call';
                                            original_meeting_link = '';
                                            meet_link = '';       
                                        }else{
                                            meeting_type = 'Video';
                                            Description = Description + "<br><a href='" + original_meeting_link + "'>" + meet_link + "</a>";
                                        }
                                        if (mobile != '' && StartTime != '' && EndTime != '') {
                                            contactdata = [meeting_type, customer_name, Description, email, mobile, StartTime, EndTime, agentid, meet_link, original_meeting_link];
                                            bulkUpdateOps.push(contactdata);
                                        }
                                    })
                                    //console.log(bulkUpdateOps)
                                    Contacts.insertbulkcalender(bulkUpdateOps, function (err, cont) {
                                        if (err) {
                                            console.log(err);
                                            let data_a = { "status": "2", "note": 'Invalid Data' }
                                        } else {
                                            console.log("Schedule Upload Done");
                                            var status = '2';
                                            var m = new Date();
                                            let data_b = ({ "status": status, "note": 'Data uplaoded successfully', "finish_time": m })
                                            Contacts.updatefileStatusCalender(data_b, fileid, function (err, count) {
                                                if (err) {
                                                    console.log("Error: " + err)
                                                }
                                                else {
                                                    console.log({ 'msg': 'Schedule uploaded successfully.' });
                                                }

                                            });
                                        }
                                    })
                                }
                            })
                    }

                });
            } else {
                console.log('No Pending File')
            }
        }
    });
})
