var cron = require('node-cron');
var Contacts = require('../../model/Contacts');
var csv=require('csvtojson');
var async = require('async');



cron.schedule('*/1 * * * *', () => {
    Contacts.BulkFiledata('0',function (err, data) {
        if (err) {
            console.log("Error: " + err)
        }else{
            if(data.length>0){
                rows = data[0]
                var status = '1';
                var m = new Date();
                let data_a = { "status": status,"start_time": m }
                let fileid = rows.fid;
                file_p = rows.file_path
                customer_id = rows.customer_id
                segment = rows.segment
                console.log("fileid: " + fileid);
                Contacts.updatebulkfileStatus(data_a, fileid, function (err, count) {
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
                            'is_mobile_dnd (no,yes)'
                        ]
                
                        const csvFilePath='../../uploads/' + file_p
                        csv()
                        .fromFile(csvFilePath)
                        .then((jsonObj)=>{
                            var json_keys = Object.keys(jsonObj[0]);
                            bulkUpdateOps = [];
                            bulkUpdateMetaOps = [];
                            async.forEachOf(jsonObj, async (obj, key, callback) => {
                                let difference = json_keys.filter(x => !csv_headers_format.includes(x));
                                console.log(difference)
                                if(obj['is_mobile_dnd']=='' || obj['is_mobile_dnd']!='yes'){
                                    var dnd = 'no';
                                }else{
                                    var dnd = obj['is_mobile_dnd'].toLowerCase();
                                }
                                //
                                
                                //console.log(obj['mobile_dnd'])
                                if(obj['email']!='' || obj['mobile']!=''){
                                    var m = new Date();
                                    var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds() + key+1;
                                    var mobile = obj['mobile'].replace(/\s/g, '');
                                    if(mobile.length==10 || mobile.length==11){
                                        var contactdata = [cont_id, customer_id, obj['name'].replace(/[^a-zA-Z0-9 ]/g, ""), obj['email'], mobile, obj['address'].replace(/[^a-zA-Z ]/g, ""), obj['city'], obj['state'], m, segment, dnd];
                                        bulkUpdateOps.push(contactdata);
                                        difference.forEach(element => {
                                            if(obj[element]!=''){
                                                var metadata = [customer_id,cont_id,element,obj[element]]
                                                bulkUpdateMetaOps.push(metadata)
                                            }
                                        });
                                    }
                                }
                            })
                            console.log(bulkUpdateOps)
                            Contacts.insertbulkcontact(bulkUpdateOps, function (err, cont) {
                                if (err) {
                                    //console.log(err);
                                    var m = new Date();
                                    let data_a = { "status": "2","note": 'Invalid Data',"finish_time":m  }
                                    Contacts.updatebulkfileStatus(data_a, fileid, function (err, count) {
                                        if (err) {
                                            console.log("Error: " + err)
                                        }
                                        else {
                                            console.log({'msg':'Invalid Data'});
                                        }
        
                                    });
                                } else {
                                    Contacts.insertbulkcontactmeta(bulkUpdateMetaOps, function (err, cont) {
                                        console.log(err);
                                        console.log(cont);
                                    })
                                    console.log("Contact Upload Done");
                                    var status = '2';
                                    var m = new Date();
                                    let data_b = ({ "status": status,"note": 'Data uplaoded successfully',"finish_time":m })
                                    Contacts.updatebulkfileStatus(data_b, fileid, function (err, count) {
                                        if (err) {
                                            console.log("Error: " + err)
                                        }
                                        else {
                                            console.log({'msg':'Contacts uploaded successfully.'});
                                        }
        
                                    });
                                }
                            })
                        })
                    }
            
                });
            }else{
                console.log('No Pending File')
            }
        }
    });
})
