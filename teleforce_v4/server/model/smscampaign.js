var db = require('../database/db');

var Smscampaign = {
    getallsmscampaign: function (cid, callback) {
        return db.query('Select *,S.sms_title,S.approve_status as sms_status from tf_sms_campaigns C inner join tf_smstemplate S ON S.sms_id=C.smstemp_id where C.account_id=' + cid + " " + 'ORDER by add_date DESC', callback);
    },
    getsmscampaignsdata: function (data, callback) {
        var where ='C.account_id='+data.account_id;
        if(data.startdate && data.enddate){
            where += ' and C.cam_date between "'+data.startdate+' 00:00:00" and "'+data.enddate+' 23:59:59"'
        }
        return db.query('SELECT C.cam_name,C.cid,C.cam_date,S.sms_title,W.wtemp_title,C.type,IF(C.type =0,S.sms_title,W.wtemp_title) AS TITLE_TYPE_BASED,S.approve_status AS sms_status,(SELECT COUNT(mobile) FROM tf_sms_campagins_number WHERE cid=C.cid) AS total FROM tf_smscampagis C LEFT JOIN tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_whatsapp_template W ON W.wtemp_id=C.cam_temp_id WHERE '+where+'', [], callback)
        //return db.query('Select C.cam_name,C.cid,C.cam_date,S.sms_title,S.approve_status as sms_status,COUNT(N.mobile)AS total from tf_smscampagis C inner join tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_sms_campagins_number N ON N.cid=C.cid  where '+where+' GROUP BY N.cid ORDER BY C.cam_date DESC', [], callback);
    },
    getmanagersmscampaignsdata: function (data, callback) {
        var where ='C.account_id='+data.account_id+' and C.cam_status="'+data.camstatus+'"';
        if(data.startdate && data.enddate){
            where += ' and C.cam_date between "'+data.startdate+' 00:00:00" and "'+data.enddate+' 23:59:59"'
        }
        console.log('SELECT C.cam_name,C.cid,C.cam_date,S.sms_title,W.wtemp_title,C.type,IF(C.type =0,S.sms_title,W.wtemp_title) AS TITLE_TYPE_BASED,S.approve_status AS sms_status,(SELECT COUNT(mobile) FROM tf_sms_campagins_number WHERE cid=C.cid) AS total FROM tf_smscampagis C LEFT JOIN tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_whatsapp_template W  ON W.wtemp_id=C.cam_temp_id WHERE '+where+' ORDER BY C.cam_date DESC');
        return db.query('SELECT C.cam_name,C.cid,C.cam_date,S.sms_title,W.wtemp_title,C.type,IF(C.type =0,S.sms_title,W.wtemp_title) AS TITLE_TYPE_BASED,S.approve_status AS sms_status,(SELECT COUNT(mobile) FROM tf_sms_campagins_number WHERE cid=C.cid) AS total FROM tf_smscampagis C LEFT JOIN tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_whatsapp_template W  ON W.wtemp_id=C.cam_temp_id WHERE '+where+' ORDER BY C.cam_date DESC', [], callback)
        //return db.query('Select C.cam_name,C.cid,C.cam_date,S.sms_title,S.approve_status as sms_status,COUNT(N.mobile)AS total from tf_smscampagis C inner join tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_sms_campagins_number N ON N.cid=C.cid  where '+where+' GROUP BY N.cid ORDER BY C.cam_date DESC', [], callback);
    },
    
    getagentsmscampaignsdata: function (data, callback) {
        var where ='C.created_by='+data.account_id;
        if(data.startdate && data.enddate){
            where += ' and C.cam_date between "'+data.startdate+' 00:00:00" and "'+data.enddate+' 23:59:59"'
        }
        return db.query('SELECT C.cam_name,C.cid,C.cam_date,S.sms_title,C.cam_status,W.wtemp_title,C.type,IF(C.type =0,S.sms_title,W.wtemp_title) AS TITLE_TYPE_BASED,S.approve_status AS sms_status,(SELECT COUNT(mobile) FROM tf_sms_campagins_number where cid=C.cid) AS total FROM tf_smscampagis C LEFT JOIN tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_whatsapp_template W ON W.wtemp_id=C.cam_temp_id WHERE '+where+' ORDER BY C.cam_date DESC', [], callback)
        //return db.query('Select C.cam_name,C.cid,C.cam_date,S.sms_title,S.approve_status as sms_status,COUNT(N.mobile)AS total from tf_smscampagis C inner join tf_smstemplate S ON S.sms_id=C.cam_temp_id LEFT JOIN tf_sms_campagins_number N ON N.cid=C.cid  where '+where+' GROUP BY N.cid ORDER BY C.cam_date DESC', [], callback);
    },
    
    getapprovesmslist: function (cid, callback) {
        return db.query('Select * from tf_smstemplate where approve_status=1 and account_id=' + cid, [], callback);
    },
    savesmscampaign: function (data, callback) {
        return db.query('Insert INTO tf_sms_campaigns SET ?', data, callback);
    },
    insertbulksmscampaigncontact: function (data, callback) {
        db.query('Insert INTO tf_smscampaigns_numbers (smscam_id,account_id,cont_id,segment_id) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    deletesmscampaign: function (id, callback) {
        return db.query('DELETE FROM `tf_sms_campaigns` WHERE sms_camid=?', id, callback);
    },
    deletesmscampaigncontact: function (id, callback) {
        return db.query('DELETE FROM `tf_smscampaigns_numbers` WHERE smscam_id=?', id, callback);
    },
    getsmscampaigndetail: function (cid, callback) {
        return db.query('Select *,S.sms_title,SS.server_name from tf_sms_campaigns C inner join tf_smstemplate S ON S.sms_id=C.smstemp_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id where C.sms_camid=?', cid, callback);
    },
    getsmscampaignsegment: function (cid, callback) {
        //console.log('Select N.*,S.name from tf_smscampaigns_numbers N INNER JOIN tf_segments S ON S.cont_id=N.segment_id where smscam_id='+cid+' group by segment_id');
        return db.query('Select N.*,S.name from tf_smscampaigns_numbers N INNER JOIN tf_segments S ON S.cont_id=N.segment_id where smscam_id=? group by segment_id', [cid], callback);
    },
    updatesmscampaign: function (data, callback) {
        return db.query('UPDATE tf_smscampagis SET ? WHERE cid=?', [data, data.cid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getpromotionalsmserver: function (id, callback) {
        return db.query('SELECT A.*,S.server_name,S.server_type,S.sid from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=' + id + ' and S.server_type=1', [], callback);
    },
    getsmscampaigncontacts: function (cid, callback) {
        return db.query('Select N.*,S.name AS segment_name, C.name as contact_name,C.email as contact_email,C.mobile as contact_mobile from tf_smscampaigns_numbers N INNER JOIN tf_segments S ON S.cont_id=N.segment_id LEFT JOIN tf_contacts C ON C.cont_id= N.cont_id where N.smscam_id=' + cid + " " + 'ORDER by date desc', callback);
    },
    deletecampaigncontact: function (id, callback) {
        return db.query('DELETE FROM `tf_smscampaigns_numbers` WHERE sms_numid=?', id, callback);
    },
    getStartSMSCampaigns: function (action, callback) {
        return db.query('SELECT * FROM `tf_sms_campaigns` WHERE smscam_action=? and smscam_status=0', [action], callback);
    },
    updatesmscampaigncontact: function (data, callback) {
        return db.query('UPDATE tf_smscampaigns_numbers SET ? WHERE numid=?', [data, data.numid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getsmslog: function (data, callback) {
        var where = "account_id=" + data.account_id;
        if (data.startdate != '' && data.enddate != '') {
            where += " and (sentdate between '" + data.startdate + "  00:00:00' and '" + data.enddate + " 23:59:59')";
        }
        if (data.mobile) {
            where += " and mobile=" + data.mobile;
        }
        if (data.status) {
            where += " and sms_status='" + data.status + "'";
        }
       // console.log("SELECT * FROM `tf_sms_report` WHERE " + where + " ORDER by "+data.sortcolumn+"  " + data.sortdirection + " LIMIT " + data.position + "," + data.pageSize);
        return db.query("SELECT * FROM `tf_sms_report` WHERE " + where + " ORDER by "+data.sortcolumn+"  " + data.sortdirection + " LIMIT " + data.position + "," + data.pageSize, callback)
    },
    getsmstotalcredit: function (data, callback) {
        var where = "account_id=" + data.account_id;
        if (data.startdate != '' && data.enddate != '') {
            where += " and (sentdate between '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59')";
        }
        if (data.mobile) {
            where += " and mobile=" + data.mobile;
        }
        if (data.status) {
            where += " and sms_status='" + data.status + "'";
        }

        return db.query("SELECT SUM(sms_credit) as totalcredit FROM `tf_sms_report` WHERE " + where, callback)
    },
    getsmstatus: function (userid, callback) {
        return db.query("SELECT sms_status FROM `tf_sms_report` WHERE account_id=" + userid + " and sms_status IS NOT NULL GROUP BY sms_status", callback)
    },
    deletesmslink: function (id, callback) {
        return db.query('DELETE FROM `tf_sms_links` WHERE sl_id=?', id, callback);
    },
    getsmslinklist: function (userid, callback) {
        return db.query("SELECT * FROM `tf_sms_links` WHERE account_id=" + userid + " order by sl_id desc", callback)
    },
    getsmslinkdetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_sms_links` WHERE sl_id=" + id, callback)
    },
    savesmslink: function (data, callback) {
        return db.query('Insert INTO tf_sms_links SET ?', data, callback);
    },
    updatesmslink: function (data, callback) {
        return db.query('UPDATE tf_sms_links SET ? WHERE sl_id=?', [data, data.sl_id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getassignsmsserver: function (id, camtype, callback) {
        return db.query('SELECT A.*,S.server_name,S.server_type,S.sid,S.server_url from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=' + id + ' and S.server_type=' + camtype, [], callback);
    },
    savesmscampaigndata: function (data, callback) {
        return db.query('Insert INTO tf_smscampagis SET ?', data, callback);
    },
    getContactbySegment: function (data, callback) {
        return db.query('Select * from tf_contacts where customer_id=? and category = ? ORDER BY created_date DESC', [data.id, data.category], callback);
    },
    insertbulksmscampaigncontact: function (data, callback) {
        db.query('Insert INTO tf_sms_campagins_number (cid,name,status,message,date,mobile,cont_id,form_id,sms_credit) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getContactbyLeadStatus: function (data, callback) {
        return db.query('SELECT C.* FROM tf_leads L INNER JOIN tf_contacts C ON C.lead_id=L.l_id  WHERE L.status="' + data.status + '" AND L.User_id=' + data.id, [], callback);
    },

    getstatuswithcontactcount: function (id, callback) {
        //console.log('SELECT C.*,CD.stage_status as statusdb,CD.status_master as masterstatus,C.stage_name,(SELECT COUNT(C.cont_id) FROM tf_leads L INNER JOIN tf_contacts C ON C.lead_id=L.l_id  WHERE L.status=CD.status_master AND L.User_id=' + id + ') AS contactcount FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = '+id);
        return db.query('SELECT C.*,CD.stage_status as statusdb,CD.status_master as masterstatus,C.stage_name,(SELECT COUNT(C.cont_id) FROM tf_leads L INNER JOIN tf_contacts C ON C.lead_id=L.l_id  WHERE L.status=CD.status_master AND L.User_id=' + id + ') AS contactcount FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ?', [id], callback);
    },
    searchcampaigndata(data, callback) {
        var where = 'cid=' + data.customer_id;

        if (data.mobile) {
            where += " and mobile='" + data.mobile + "'";
        }
        if (data.name) {
            where += " and name='" + data.name + "'";
        }
        if (data.hit_count) {
            where += " and hit_count='" + data.hit_count + "'";
        }
        return db.query('SELECT * FROM `tf_sms_campagins_number` where ' + where + '', [], callback);

    },
    getcampaignohitcount: function (id, callback) {
        //console.log('SELECT n.*,u.visitor as hit_count FROM `tf_sms_campagins_number` n left join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink where ' + where + ' ORDER by date  '+data.sortdirection+' LIMIT '+data.position+','+data.pageSize);
        return db.query('SELECT u.visitor as hit_count FROM `tf_sms_campagins_number` n left join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink where n.numid=' + id, [], callback);
    },
    getsmsdeliver: function (id, callback) {
        return db.query('SELECT COUNT(`numid`) as deliver FROM `tf_sms_campagins_number` WHERE status ="1" and `cid` = ' + id, callback);
    },
    getsmssent: function (id, callback) {
        return db.query('SELECT COUNT(`numid`) as smssent FROM `tf_sms_campagins_number` WHERE  `cid` = ' + id, callback);
    },
    getcampaigndetail: function (id, callback) {
        return db.query("Select S.sms_title,L.sl_url,C.cam_name,C.cam_date,C.cams_type,C.cam_type from tf_smscampagis C inner join tf_smstemplate S ON S.sms_id=C.`cam_temp_id` LEFT JOIN tf_sms_links L ON L.sl_id=C.cam_link where C.cid=" + id, callback);
    },
    gethitcount(id, callback) {
        //console.log("SELECT COUNT(u.visitor) as count ,SUM(u.visitor) as total FROM tf_sms_campagins_number n INNER join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink WHERE u.visitor>0 and n.cid =" + id);
        return db.query("SELECT COUNT(u.visitor) as count ,SUM(u.visitor) as total FROM tf_sms_campagins_number n INNER join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink WHERE u.visitor>0 and n.cid =" + id, callback);
    },
    searchloadCampagin: function (data, callback) {
        var where = ' n.cid=' + data.cid;
        if (data.startdate && data.enddate) {
            where += " and n.date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and n.name LIKE '" + data.name + "'";
        }
        if (data.mobile) {
            where += " and n.mobile='" + data.mobile + "'";
        }
        //console.log('SELECT n.*,u.visitor as hit_count FROM `tf_sms_campagins_number` n left join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink where ' + where + ' ORDER by date  ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize);
        return db.query('SELECT n.*,b.sms_credit as sms_credit FROM `tf_sms_campagins_number` n LEFT JOIN tf_sms_report b ON n.numid=b.cdr_id  where ' + where + ' ORDER by date  ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize, [], callback);        
    },
    searchsmscampaignumberlength: function (data, callback) {
        var where = ' n.cid=' + data.customer_id;
        if (data.startdate && data.enddate) {
            where += " and n.date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and n.name LIKE '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and n.mobile='" + data.mobile + "'";
        }
        if (data.hit_count) {
            where += " and hit_count='" + data.hit_count + "'";
        }        
        return db.query('SELECT COUNT(n.numid) AS length FROM `tf_sms_campagins_number` n LEFT JOIN tf_sms_report b ON n.numid=b.cdr_id where ' + where, [], callback);        
    },
    gettotalsmscreditusage: function (data, callback) {
        var where = ' a.cid=' + data.customer_id;
        if (data.startdate && data.enddate) {
            where += " and a.date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and a.name LIKE '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and a.mobile='" + data.mobile + "'";
        }      
        return db.query("SELECT COUNT(IF(mystat = '2',1,NULL)) AS SMS_SENT_FAILED, SUM(IF(mystat = '2',sms_credit, 0)) AS SMS_CREDIT_FAILED,COUNT(IF(mystat = '1',1,NULL)) AS SMS_DELIVERED, SUM(IF(mystat = '1',sms_credit, 0)) AS SMS_DELIVERED_CREDIT FROM (SELECT a.numid,a.cid,a.status AS mystat,b.cdr_id,account_id,b.sms_status,b.sms_credit FROM tf_sms_campagins_number a LEFT JOIN tf_sms_report b ON a.numid=b.cdr_id WHERE "+where+")U;", [], callback);        
    },
    
    getshorturl: async function (url) {
        console.log(url);
        return new Promise(function (resolve, reject) {
            requestify.request("https://slss.in/", {
                method: 'POST',
                body: { url: url },
                dataType: 'form-url-encoded',
            }).then(function (response) {
                console.log(response + "===api==")
                var rs = JSON.parse(response.body);
                var shorturl = rs.url
                console.log(shorturl);
                resolve(shorturl)
            })
                .fail(function (response) {
                    console.log(response + "==api error==" + type)
                    resolve('')
                });
        })
    },

    smscampaignumberdatatocsv: function (data, callback) {
        var where = ' n.cid=' + data.customer_id;
        if (data.startdate && data.enddate) {
            where += " and n.date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and n.name LIKE '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and n.mobile='" + data.mobile + "'";
        }      
        return db.query('SELECT n.* FROM `tf_sms_campagins_number` n left join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink where ' + where, [], callback);        
    },
    searchsmsbalancedata:function(data,callback){
        return db.query("SELECT sms_pr_no AS sms_credit,sms_pr_balance AS balance_sms,sms_pr_used AS sms_used FROM tf_account_balance WHERE account_id="+data,callback);
    },
    totalcountsmsgraph:function(data,callback){
        //console.log("SELECT COUNT(sms_id) AS TOTAL_SMS_SENT, COUNT(IF(sms_status= 'SUBMIT_FAILED',1,NULL)) AS SUBMIT_FAILED, COUNT(IF(sms_status= 'SUBMIT_ACCEPTED',1,NULL)) AS SUBMIT_ACCEPTED, COUNT(IF(sms_status= 'DELIVERY_FAILED',1,NULL)) AS DELIVERY_FAILED, COUNT(IF(sms_status= 'DELIVERY_SUCCESS',1,NULL)) AS DELIVERY_SUCCESS FROM tf_sms_report WHERE account_id="+data.userid+"  AND DATE(sentdate) BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')");
        return db.query("SELECT COUNT(sms_id) AS TOTAL_SMS_SENT, COUNT(IF(sms_status= 'SUBMIT_FAILED',1,NULL)) AS SUBMIT_FAILED, COUNT(IF(sms_status= 'SUBMIT_ACCEPTED',1,NULL)) AS SUBMIT_ACCEPTED, COUNT(IF(sms_status= 'DELIVERY_FAILED',1,NULL)) AS DELIVERY_FAILED, COUNT(IF(sms_status= 'DELIVERY_SUCCESS',1,NULL)) AS DELIVERY_SUCCESS FROM tf_sms_report WHERE account_id="+data.userid+"  AND DATE(sentdate) BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')",callback);
    },
    getsmsloglength: function (data, callback) {
        var where = "account_id=" + data.account_id;
        if (data.startdate != '' && data.enddate != '') {
            where += " and (sentdate between '" + data.startdate + "  00:00:00' and '" + data.enddate + " 23:59:59')";
        }
        if (data.mobile) {
            where += " and mobile=" + data.mobile;
        }
        if (data.status) {
            where += " and sms_status='" + data.status + "'";
        }
       // console.log("SELECT * FROM `tf_sms_report` WHERE " + where + " ORDER by "+data.sortcolumn+"  " + data.sortdirection + " LIMIT " + data.position + "," + data.pageSize);
        return db.query("SELECT * FROM `tf_sms_report` WHERE " + where, callback)
    },
    searchsmslinkdata: function (data, callback) {
        var where = 'account_id =' + data.userid;
        if (data.name) {
            where += " and (sl_name like '%" + data.name + "%'";
        }
        if (data.name) {
            where += " or sl_url like '%" + data.name + "%'";
        }
        if (data.name) {
            where += " or status like '%" + data.name + "%')";
        }
        //console.log('select * from tf_sms_links where ' + where);
        return db.query('select * from tf_sms_links where ' + where+' order by sl_id desc', callback);
    },
    getlinkcountreport:function(id,callback){
        return db.query('SELECT s.cam_name,n.mobile,u.visitor,n.name FROM `tf_sms_campagins_number` n INNER JOIN `tf_smscampagis` s on n.`cid` = s.cid INNER join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink WHERE u.visitor>0 AND s.account_id='+id,[], callback);

    },
    searchlinkcount:function(data,callback){
        var where = 's.account_id='+data.userid;
        if(data.cam_name){
            where +=" and s.cam_name like '%"+data.cam_name+"%'" ;

        }
        if(data.mobile){
            where +=" and  n.mobile like '%"+data.mobile+"%'" ;

        }
        if(data.hit_count){
            where +=" and u.visitor like '%"+data.hit_count+"%'" ;

        }
        //console.log('SELECT s.cam_name,n.mobile,n.hit_count FROM `tf_sms_campagins_number` n INNER JOIN `tf_smscampagis` s on n.`cid` = s.cid WHERE '+where+' and  n.hit_count>0 ');
        return db.query('SELECT s.cam_name,n.mobile,u.visitor,n.name FROM `tf_sms_campagins_number` n INNER JOIN `tf_smscampagis` s on n.`cid` = s.cid INNER join tf_url_shortner u on u.short_code = n.shorturl_link or u.short_code = n.form_shortlink WHERE  '+where+' and  u.visitor>0 ',[], callback);


    },
    
}



module.exports = Smscampaign;