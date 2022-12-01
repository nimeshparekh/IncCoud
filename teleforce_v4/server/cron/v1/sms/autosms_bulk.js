var cron = require('node-cron');
var async = require('async');
var db = require('../../../database/db');
var requestify = require('requestify');
var Smscampaign = require('../../../model/smscampaign');
const request = require('request');
var helper = require("../../../helper/common");
var ERP = require('../../../model/erp');

cron.schedule('*/60 * * * * *', () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log(hours+":"+minutes)
    db.query('SELECT * FROM tf_smscampagis WHERE cam_status="0"', [], async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.length > 0) {
                var camdata = data[0]
                var camid = camdata.cid
                var camtype = camdata.cam_type
                var camaccountid = camdata.account_id
                var cam_temp_id = camdata.cam_temp_id
                const messagetype = camdata.type
                var camlink = camdata.cam_link
                var var1 = camdata.var1
                var var2 = camdata.var2
                var var3 = camdata.var3
                var var4 = camdata.var4
                var var5 = camdata.var5
                var customvar1 = camdata.customvar1
                var customvar2 = camdata.customvar2
                var customvar3 = camdata.customvar3
                var customvar4 = camdata.customvar4
                var customvar5 = camdata.customvar5
                if(messagetype==0){
                    //Text
                    var updatedbalance = await helper.UpdateSMSBalance(camaccountid)
                    console.log("updatedbalance ==>"+updatedbalance)
                    db.query('SELECT A.*,S.server_name,S.server_type,S.sid,S.server_url from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=? and S.server_type=?', [camaccountid, camtype], async function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (data.length > 0) {
                                var serverArr = data[0];
                                db.query('SELECT * FROM `tf_smstemplate` WHERE `sms_id` =' + cam_temp_id + ' and `account_id` = ' + camaccountid,[], async function (err, tempdata) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var templateid = tempdata[0].templateid;
                                        var contentid = tempdata[0].contentid;
                                        db.query('SELECT * FROM tf_account_balance WHERE Account_ID=?', [camaccountid], async function (err, data) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                if (data.length > 0) {
                                                    var balanceArr = data[0]
                                                    var balance = 0
                                                    var balancevar = 'SMS_Pr_Balance'
                                                    balance = balanceArr.SMS_Pr_Balance
                                                    if (balance > 0) {
                                                        var numlen = balance > 50 ? 50 : balance;
                                                        db.query('SELECT * FROM `tf_sms_campagins_number` WHERE `cid` = ? and status="0" ORDER BY numid ASC limit ?', [camid, numlen], async function (err, ndata) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                if (ndata.length > 0) {
                                                                    var loopinterval =  0;
                                                                    async.forEachOf(ndata, async (num, key, callback) => {
                                                                        //console.log(num);
                                                                        var form_id = num.form_id
                                                                        var numid = num.numid
                                                                        var message = num.message
                                                                        var mobile = num.mobile
                                                                        var name = num.name
                                                                        const cont_id = num.cont_id
                                                                        var fshort_url = ''
                                                                        var space = ' '
                                                                        const leaddata = await helper.GetLeadByContactID(cont_id)
                                                                        //Replace Link
                                                                        if(var1=='link'){
                                                                            var vardata = await helper.GetSMSLinkReplaceWithShortLink(camlink,numid)
                                                                            message = message.replace("{#var1#}", vardata);
                                                                        }
                                                                        if(var2=='link'){
                                                                            var vardata = await helper.GetSMSLinkReplaceWithShortLink(camlink,numid)
                                                                            message = message.replace("{#var2#}", vardata);
                                                                        }
                                                                        if(var3=='link'){
                                                                            var vardata = await helper.GetSMSLinkReplaceWithShortLink(camlink,numid)
                                                                            message = message.replace("{#var3#}", vardata);
                                                                        }
                                                                        if(var4=='link'){
                                                                            var vardata = await helper.GetSMSLinkReplaceWithShortLink(camlink,numid)
                                                                            message = message.replace("{#var4#}", vardata);
                                                                        }
                                                                        if(var5=='link'){
                                                                            var vardata = await helper.GetSMSLinkReplaceWithShortLink(camlink,numid)
                                                                            message = message.replace("{#var5#}", vardata);
                                                                        }
                                                                        //Replace Form
                                                                        if(var1=='form'){
                                                                            var vardata = await helper.GetSMSFormReplaceWithShortLink(form_id,numid)
                                                                            message = message.replace("{#var1#}", vardata);
                                                                        }
                                                                        if(var2=='form'){
                                                                            var vardata = await helper.GetSMSFormReplaceWithShortLink(form_id,numid)
                                                                            message = message.replace("{#var2#}", vardata);
                                                                        }
                                                                        if(var3=='form'){
                                                                            var vardata = await helper.GetSMSFormReplaceWithShortLink(form_id,numid)
                                                                            message = message.replace("{#var3#}", vardata);
                                                                        }
                                                                        if(var4=='form'){
                                                                            var vardata = await helper.GetSMSFormReplaceWithShortLink(form_id,numid)
                                                                            message = message.replace("{#var4#}", vardata);
                                                                        }
                                                                        if(var5=='form'){
                                                                            var vardata = await helper.GetSMSFormReplaceWithShortLink(form_id,numid)
                                                                            message = message.replace("{#var5#}", vardata);
                                                                        }

                                                                        //Replace Name
                                                                        if(var1=='name'){
                                                                            var vardata = name
                                                                            message = message.replace("{#var1#}", vardata);
                                                                        }
                                                                        if(var2=='name'){
                                                                            var vardata = name
                                                                            message = message.replace("{#var2#}", vardata);
                                                                        }
                                                                        if(var3=='name'){
                                                                            var vardata = name
                                                                            message = message.replace("{#var3#}", vardata);
                                                                        }
                                                                        if(var4=='name'){
                                                                            var vardata = name
                                                                            message = message.replace("{#var4#}", vardata);
                                                                        }
                                                                        if(var5=='name'){
                                                                            var vardata = name
                                                                            message = message.replace("{#var5#}", vardata);
                                                                        }
                                                                        //Replace custom value
                                                                        if(var1=='custom'){
                                                                            message = message.replace("{#var1#}", customvar1);
                                                                        }
                                                                        if(var2=='custom'){
                                                                            message = message.replace("{#var2#}", customvar2);
                                                                        }
                                                                        if(var3=='custom'){
                                                                            message = message.replace("{#var3#}", customvar3);
                                                                        }
                                                                        if(var4=='custom'){
                                                                            message = message.replace("{#var4#}", customvar4);
                                                                        }
                                                                        if(var5=='custom'){
                                                                            message = message.replace("{#var5#}", customvar5);
                                                                        }

                                                                        message = message.replace("{#var1#}", space);
                                                                        message = message.replace("{#var2#}", space);
                                                                        message = message.replace("{#var3#}", space);
                                                                        message = message.replace("{#var4#}", space);
                                                                        message = message.replace("{#var5#}", space);
                                                                        var url = serverArr.server_url;                                                                        
                                                                        url = url.replace('{msg}', message);
                                                                        url = url.replace('{mobile}', mobile);
                                                                        url = url.replace('{contentid}', contentid);
                                                                        url = url.replace('{templateid}', templateid);
                                                                        console.log(url);
                                                                        setTimeout(() => {
                                                                            request(encodeURI(url), { json: true, "rejectUnauthorized": false }, (err, res, body) => {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log("sms respo");
                                                                                    console.log(JSON.stringify(body));
                                                                                    var transactionId = body.transactionId;
                                                                                    var sms_status = body.state;
                                                                                    var status ;
                                                                                    if (sms_status == 'SUBMIT_ACCEPTED' || sms_status == 'DELIVERY_SUCCESS') {
                                                                                        status = '1';
                                                                                    }
                                                                                    else{
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
                                                                                    var numberdata = { account_id: camaccountid, mobile: mobile, cdr_id: numid, sms_status: smsstatus, sms_uid: transactionId, sms_credit: msgcredit, sentdate: new Date() ,text:message};
                                                                                    db.query('Insert INTO tf_sms_report SET ?', numberdata,function (err, rows2) {
                                                                                        var smsid = rows2.insertId
                                                                                        if(leaddata.length>0){
                                                                                            //Update Lead Timeline
                                                                                            var timeline = {}
                                                                                            timeline.agent_id = leaddata[0].agent_id
                                                                                            timeline.account_id = leaddata[0].User_id
                                                                                            timeline.lead_id = leaddata[0].l_id
                                                                                            timeline.current_status = leaddata[0].status
                                                                                            timeline.notes = 'SMS - '+message
                                                                                            timeline.action_type = 'sms'
                                                                                            timeline.action_id = smsid
                                                                                            ERP.add_timeline_lead(timeline, function (err, rows2) {})
                                                                                        }
                                                                                    });                                                                                
                                                                                    db.query('update tf_sms_campagins_number set message =?,status=?,delivery_date = ?,transactionId=?,sms_status=? WHERE numid=?', [message, status, new Date(), transactionId, sms_status, numid]);
                                                                                    //db.query('update tf_sms_campagins_number set form_id=?,form_shortlink = ? WHERE numid=?', [form_id, fshort_url, numid]);
                                                                                    
                                                                                }
                                                                            });
                                                                        },loopinterval);
                                                                        loopinterval = 1000*(key+1)    
                                                                    });
                                                                }else{
                                                                    db.query('update tf_smscampagis set cam_status="1",cam_enddate=? WHERE cid=?', [new Date(),camid]);
                                                                }
                                                            }
                                                        });
                                                    }else{
                                                        console.log('No available sms credit.')
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }else{
                                console.log('No sms server found.')
                            }
                        }
                    });
                }else{
                    //Whatsapp
                    const whatsappapi = await helper.GetManagerSettingValueByName(camaccountid,'whatsup_api')
                    if(whatsappapi>0){
                        const apiArr = await helper.GetAPIDataById(whatsappapi)
                        if(apiArr.length>0){
                            const apidata = apiArr[0]
                            const tempid = cam_temp_id
                            const tempdata = await helper.GetWhatsappTemplateById(tempid)
                            const attachfile = tempdata[0].attach_file
                            //
                            var url = apidata.api_endpoint
                            var attachurl = apidata.api_endpoint
                            const msg = tempdata[0].wtemp_description;
                            
                            var numlen = 60;
                            db.query('SELECT * FROM `tf_sms_campagins_number` WHERE `cid` = ? and status="0" ORDER BY numid ASC limit ?', [camid, numlen], async function (err, ndata) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (ndata.length > 0) {
                                        var loopinterval =  0;
                                        async.forEachOf(ndata, async (num, key, callback) => {
                                            //console.log(num);
                                            var form_id = num.form_id
                                            var numid = num.numid
                                            var message = num.message
                                            const mobile = num.mobile
                                            var name = num.name
                                            const cont_id = num.cont_id
                                            var fshort_url = ''
                                            var space = ' '
                                            const leaddata = await helper.GetLeadByContactID(cont_id)
                                            setTimeout(() => {
                                                url = url.replace('{mobile}', mobile).replace('{text}', message);
                                                var method = apidata.api_method
                                                var payload = apidata.api_payload != null ? apidata.api_payload.replace('{mobile}', mobile).replace('{text}', message).replace('{link}', '') : {}
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
                                                console.log(options);
                                                request(options,async function (error, response) {
                                                    console.log(error);
                                                    console.log('text response',response.body);
                                                    if(leaddata.length>0){
                                                        console.log('leaddata',leaddata);
                                                        var sdata = { lead_id: leaddata[0].l_id, cdrid: 0, account_id: camaccountid, message: message, mobile: mobile }
                                                        await helper.AddWhatsappChat(sdata.account_id,'','');
                                                        ERP.addwhatsapp_db(sdata, function (err, rows) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                //Update Lead Timeline
                                                                var timeline = {}
                                                                var timeline = {}
                                                                timeline.agent_id = leaddata[0].agent_id
                                                                timeline.account_id = leaddata[0].User_id
                                                                timeline.lead_id = leaddata[0].l_id
                                                                timeline.current_status = leaddata[0].status
                                                                timeline.notes = 'Whatsapp - '+message
                                                                timeline.action_type = 'whatsapp'
                                                                timeline.action_id = rows.insertId
                                                                console.log('timeline ==>',timeline);
                                                                ERP.add_timeline_lead(timeline, function (err, rows2) {})
                                                            }
                                                        })
                                                    }
                                                    db.query('update tf_sms_campagins_number set message =?,status=?,delivery_date = ?,transactionId=?,sms_status=? WHERE numid=?', [message,'1', new Date(), '', '', numid]);
                                                });
                                                //
                                                if(attachfile!='' && attachfile!=null){
                                                    var filepath ='https://app.cloudX.in/api/' + attachfile;
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
                                                    //console.log('options',options);
                                                    request(options, async function (error, response) {
                                                        console.log('link response',response.body);
                                                    });
                                                }
                                            },loopinterval);
                                            loopinterval = 1000*(key+1) 
                                        })
                                    }else{
                                        db.query('update tf_smscampagis set cam_status="1",cam_enddate=? WHERE cid=?', [new Date(),camid]);
                                    }
                                }
                            })
                        }
                    }else{
                        console.log('No Whatsapp  api found!');
                    }
                }
            }else{
                console.log('No pending campaign found!');
            }
        }
    })


    // db.query('SELECT * FROM tf_sms_campagins_number WHERE shorturl_link!=""', [], async function (err, ndata) {
    //     if (err) {
    //         console.log(err);
    //     }else {
    //         if (ndata.length > 0) {
    //             async.forEachOf(ndata,async (num,key, callback) => {
    //                 requestify.request("https://slss.in/analytics", {
    //                     method: 'POST',
    //                     body: {route:num.shorturl_link},
    //                     dataType: 'form-url-encoded',
    //                 }).then(function(response) {
    //                     //console.log(response+"===api==")
    //                     var rs= JSON.parse(response.body);
    //                     console.log(rs)
    //                     var  hitcount = rs.visitors
    //                     db.query('UPDATE tf_sms_campagins_number SET `hit_count`="'+hitcount+'" WHERE numid=?',[num.numid]);
    //                 })
    //                 .fail(function(response) {

    //                 });
    //             })
    //         }
    //     }
    // })
})