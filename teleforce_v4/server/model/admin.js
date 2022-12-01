var db = require('../database/db');

var Admin = {

    getadminusers: function (id, callback) {
        return db.query('SELECT * from tf_account_table where created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
    },
    getadmindetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id=' + id, [], callback);
    },
    insertadminuser: function (data, callback) {
        return db.query('Insert INTO tf_account_table SET ?', data, callback);
    },
    updateadminuser: function (data, callback) {
        return db.query('update tf_account_table set ? WHERE account_id = ?', [data, data.account_id], callback);
    },
    deleteadminuser: function (id, callback) {
        return db.query('DELETE FROM tf_account_table where account_id=?', [id], callback);
    },
    getchannels: function (id, callback) {
        return db.query('SELECT D.*,A.account_name as managername from tf_did as D INNER join tf_did_numbers as N on D.did=N.did left join tf_account_table as A on A.account_id=N.account_id WHERE A.expiry_date >= CURDATE() ORDER BY D.did ASC', [], callback);
    },
    getUnusedDid: function (id, callback) {
        return db.query('SELECT D.* from tf_did as D WHERE D.did NOT IN (SELECT did FROM tf_did_numbers) ORDER BY D.did ASC', [], callback)
    },
    ExprieDid: function (id, callback) {
        return db.query('SELECT D.*,A.account_name as managername from tf_did as D INNER join tf_did_numbers as N on D.did=N.did left join tf_account_table as A on A.account_id=N.account_id WHERE A.expiry_date < CURDATE() ORDER BY D.did ASC', [], callback)

    },
    insertchannel: function (data, callback) {
        return db.query('Insert INTO tf_did SET ?', data, callback);
    },
    getchanneldetail: function (id, callback) {
        return db.query('SELECT * from tf_did where id=' + id, [], callback);
    },
    updatechannel: function (data, callback) {
        return db.query('update tf_did set ? WHERE id = ?', [data, data.id], callback);
    },
    deletechannel: function (id, callback) {
        return db.query('DELETE FROM tf_did where id=?', [id], callback);
    },
    getsmsdata: function (id, callback) {
        return db.query('select tf_smstemplate.*,tf_account_table.account_name from tf_smstemplate INNER JOIN tf_account_table ON tf_smstemplate.account_id =tf_account_table.account_id WHERE `approve_status` = 1  ORDER by add_date DESC', [], callback)
    },
    getsmsunapprovedata: function (id, callback) {
        return db.query('select tf_smstemplate.*,tf_account_table.account_name from tf_smstemplate INNER JOIN tf_account_table ON tf_smstemplate.account_id =tf_account_table.account_id WHERE `approve_status` != 1  ORDER by add_date DESC', [], callback)
    },
    updatesmsdata: function (data, callback) {
        return db.query('update tf_smstemplate set ? WHERE sms_id = ?', [data, data.sms_id], callback);

    },
    savesmsdata: function (data, callback) {
        return db.query('Insert INTO tf_smstemplate SET ? ', data, callback);

    },
    deletesmsdata: function (id, callback) {
        return db.query('DELETE FROM tf_smstemplate where sms_id=?', [id], callback);

    },
    getsmsdetail: function (id, callback) {
        return db.query('select * from tf_smstemplate where sms_id=' + id, [], callback)

    },
    getemaildata: function (id, callback) {
        return db.query('select tf_emailtemplate.*,tf_account_table.account_name from tf_emailtemplate INNER JOIN tf_account_table ON tf_emailtemplate.account_id =tf_account_table.account_id order by add_date desc', [], callback)

    },
    getemaildetail: function (id, callback) {
        return db.query('select * from tf_emailtemplate where email_id=' + id, [], callback)

    },
    updateemaildata: function (data, callback) {
        return db.query('update tf_emailtemplate set ? WHERE email_id = ?', [data, data.email_id], callback);

    },
    saveemaildata: function (data, callback) {
        return db.query('Insert INTO tf_emailtemplate SET ? ', data, callback);

    },
    deleteemaildata: function (id, callback) {
        return db.query('DELETE FROM tf_emailtemplate where email_id=?', [id], callback);

    },
    demorequest: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_contact`WHERE `deleted` = "no" AND `push_erp` = "no" ORDER by request_date DESC ', [], callback);

    },
    getdemorequestbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_contact where id= ?', [id], callback);
    },
    getdigitalrequestbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_teledigital where id= ?', [id], callback);
    },
    getsmsrequestbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_telesms where id= ?', [id], callback);
    },
    getmailrequestbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_telemail where id= ?', [id], callback);
    },
    updatedemorequest: function (id, data, callback) {
        return db.query('UPDATE tf_request_contact set ? where id= ?', [data, id], callback);
    },
    deletedemorequest: function (id, callback) {
        db.query('UPDATE tf_request_contact set deleted="yes" where id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    demoreqlist: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_contact` WHERE `deleted` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    geterplist: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_contact` WHERE `push_erp` = 'yes'ORDER by request_date DESC ", [], callback);

    },
    getvisitortraking: function (id, callback) {
        return db.query("SELECT * ,count(id) as heat FROM `tf_visitor_traking` group by ip order by create_date desc", [], callback);
    },
    getVisitorIp: function (ip, callback) {
        return db.query("SELECT * FROM `tf_visitor_traking` WHERE ip = " + "'" + ip + "'", [], callback);

    },
    getpackages: function (id, callback) {
        return db.query('SELECT * FROM `tf_packages` ORDER by add_date DESC ', [], callback);
    },
    savepackage: function (data, callback) {
        return db.query('Insert INTO tf_packages SET ?', data, callback);
    },
    updatepackage: function (data, callback) {
        return db.query('update tf_packages set ? WHERE package_id = ?', [data, data.package_id], callback);
    },
    deletepackage: function (id, callback) {
        return db.query('DELETE FROM tf_packages where package_id=?', [id], callback);
    },
    getpackagedetail: function (id, callback) {
        return db.query('SELECT * from tf_packages where package_id=' + id, [], callback);
    },
    getsmsserverdata: function (id, callback) {
        return db.query('select * from tf_sms_server', [], callback)

    },
    getsmsserverdetail: function (id, callback) {
        return db.query('select * from tf_sms_server where sid=' + id, [], callback)

    },
    updatesmsserverdata: function (data, callback) {
        return db.query('update tf_sms_server set ? WHERE sid = ?', [data, data.sid], callback);

    },
    savesmsserverdata: function (data, callback) {
        return db.query('Insert INTO tf_sms_server SET ? ', data, callback);

    },
    deletesmsserverdata: function (id, callback) {
        return db.query('DELETE FROM tf_sms_server where sid=?', [id], callback);

    },
    getemailserverdata: function (id, callback) {
        return db.query('select * from tf_email_server', [], callback)
    },
    getemailserverdetail: function (id, callback) {
        return db.query('select * from tf_email_server where server_id=' + id, [], callback)

    },
    updateemailserverdata: function (data, callback) {
        return db.query('update tf_email_server set ? WHERE server_id = ?', [data, data.server_id], callback);

    },
    saveemailserverdata: function (data, callback) {
        return db.query('Insert INTO tf_email_server SET ? ', data, callback);

    },
    deleteemailserverdata: function (id, callback) {
        console.log(id);
        return db.query('DELETE FROM tf_email_server where server_id=?', [id], callback);

    },
    getofferdata: function (id, callback) {
        return db.query("SELECT * FROM `tf_get_offers` ORDER by date DESC", [], callback);
    },
    getcareersdata: function (id, callback) {
        return db.query("SELECT * FROM `tf_careers` ORDER by date DESC", [], callback);
    },
    approvesms: function (data, callback) {
        return db.query('update  tf_smstemplate set ? WHERE sms_id = ?', [data, data.sms_id], callback);
    },
    getsmsapprovestatus: function (id, callback) {
        return db.query('SELECT * from tf_smstemplate WHERE sms_id = ' + id, [], callback);
    },
    searchreqdata: function (data, callback) {
        var where = ' deleted = "no" AND push_erp = "no" ';
        //var where =" mobile like '%"+data.mobile+"%'";

        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_contact` where ' + where + '', [], callback);
    },
    searchreqdatabydelete: function (data, callback) {
        var where = ' deleted = "yes" ';
        //var where =" mobile like '%"+data.mobile+"%'";

        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_contact` where ' + where + '', [], callback);
    },

    searchreqdatabyerp: function (data, callback) {
        var where = ' push_erp = "yes" ';
        //var where =" mobile like '%"+data.mobile+"%'";

        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_contact` where ' + where + '', [], callback);
    },
    getdemoreqfeedback: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_contact_feedback` WHERE requestid = ? ', [id], callback);
    },
    updatedemorefeedback: function (data, callback) {
        return db.query('Insert INTO tf_request_contact_feedback set ? ', [data], callback);
    },
    getdigitalcurrentdata: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_teledigital`WHERE `deleted` = "no" AND `push_erp` = "no" ORDER by request_date DESC ', [], callback);

    },
    getdigitaldeletedata: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_teledigital` WHERE `deleted` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    getdigitalerpdata: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_teledigital` WHERE `push_erp` = 'yes'ORDER by request_date DESC ", [], callback);

    },
    searchdata: function (data, callback) {
        var where = ' push_erp = "no" AND deleted = "no" ';
        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_teledigital` where ' + where + '', [], callback);
    },
    searchdatabydelete: function (data, callback) {
        var where = ' deleted = "yes" ';
        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_teledigital` where ' + where + '', [], callback);
    },
    searchdatabyerp: function (data, callback) {
        var where = ' push_erp = "yes" ';
        if (data.startdate != '1970-01-01') {
            where += " and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_teledigital` where ' + where + '', [], callback);
    },
    deletedigitaldata: function (id, callback) {
        db.query('UPDATE tf_request_teledigital set deleted="yes" where id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    getdigitalbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_teledigital where id= ?', [id], callback);
    },
    getdigitalbypush_erp: function (callback) {
        return db.query('SELECT * from  tf_request_contact where push_erp = "no"', callback);
    },
    updatedigitaldata: function (id, data, callback) {
        return db.query('UPDATE tf_request_contact set ? where id= ?', [data, id], callback);
    },
    updatedigitalreqdata: function (id, data, callback) {
        return db.query('UPDATE tf_request_teledigital set ? where id= ?', [data, id], callback);
    },
    getdigitalfeedback: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_teledigital_feedback` WHERE requestid = ? ', [id], callback);
    },
    gettelesmsfeedback: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_telesms_feedback` WHERE requestid = ? ', [id], callback);
    },
    updatedigitalfeedback: function (data, callback) {
        return db.query('Insert INTO tf_request_teledigital_feedback set ? ', [data], callback);
    },
    updatesmsfeedback: function (data, callback) {
        return db.query('Insert INTO tf_request_telesms_feedback set ? ', [data], callback);
    },
    searchmailData: function (data, callback) {
        var where = ' push_erp = "no"  AND deleted = "no" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telemail` where ' + where + '', [], callback);
    },
    searchmaildatabydelete: function (data, callback) {
        var where = ' deleted = "yes" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telemail` where ' + where + '', [], callback);
    },
    searchmaildatabyerp: function (data, callback) {
        var where = ' push_erp = "yes" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telemail` where ' + where + '', [], callback);
    },
    searchsmsData: function (data, callback) {
        var where = ' deleted ="no"  AND push_erp = "no" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telesms` where ' + where + '', [], callback);
    },
    searchsmsDatabydelete: function (data, callback) {
        var where = ' deleted ="yes" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telesms` where ' + where + '', [], callback);
    },
    searchsmsDatabyerp: function (data, callback) {
        var where = ' push_erp ="yes" ';
        if (data.startdate != '1970-01-01') {
            where += "and DATE(request_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(request_date)<='" + data.enddate + "'";
        }
        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        return db.query('SELECT * FROM `tf_request_telesms` where ' + where + '', [], callback);
    },
    deletedigitalmail: function (id, callback) {
        db.query('UPDATE tf_request_telemail set deleted="yes" where id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },

    deletedigitalsms: function (id, callback) {
        db.query('UPDATE tf_request_telesms set deleted="yes" where id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },

    getdigitalmaildata: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_telemail` WHERE `deleted` = "no" AND `push_erp` = "no" ORDER by request_date DESC ', [], callback);

    },
    getdigitalsmsdata: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_telesms` WHERE `deleted` = "no" AND `push_erp` = "no" ORDER by request_date DESC ', [], callback);

    },
    getdelatedmaildata: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_telemail` WHERE `deleted` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    getdelatedsmsdata: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_telesms` WHERE `deleted` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    getmailerplist: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_telemail` WHERE `push_erp` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    getsmserplist: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_telesms` WHERE `push_erp` = 'yes' ORDER by request_date DESC ", [], callback);

    },
    getdigitalmailbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_telemail where id= ?', [id], callback);
    },
    getdigitalsmsbyid: function (id, callback) {
        return db.query('SELECT * from tf_request_telesms where id= ?', [id], callback);
    },
    updatedigitalmaildata: function (id, data, callback) {
        return db.query('UPDATE tf_request_telemail set ? where id= ?', [data, id], callback);
    },
    updatedigitalsmsdata: function (id, data, callback) {
        return db.query('UPDATE tf_request_telesms set ? where id= ?', [data, id], callback);
    },
    updatedigitalmaildata: function (id, data, callback) {
        return db.query('UPDATE tf_request_telemail set ? where id= ?', [data, id], callback);
    },
    getdigitalmailfeedback: function (id, callback) {
        return db.query('SELECT * FROM `tf_request_telemail_feedback` WHERE requestid = ? ', [id], callback);
    },
    updatedigitalmailfeedback: function (data, callback) {
        return db.query('Insert INTO tf_request_telemail_feedback set ? ', [data], callback);
    },
    getGSTdata: function (id, callback) {
        return db.query("SELECT * FROM `Company_GST_Master` ORDER by Data_Date DESC", [], callback);
    },
    getGstDetail: function (id, callback) {
        return db.query("SELECT * FROM `Company_GST_Master`  WHERE  GST_ID ='" + id + "'", [], callback);

    },
    saveGSTData: function (data, callback) {
        return db.query('Insert INTO Company_GST_Master SET ? ', data, callback);

    },
    updateGSTData: function (data, callback) {

        return db.query('UPDATE Company_GST_Master set ? where GST_ID= ?', [data, data.GST_ID], callback);
    },
    deleteGST: function (id, callback) {
        return db.query('DELETE FROM Company_GST_Master where GST_ID=?', [id], callback);
    },
    getstatedata: function (id, callback) {
        return db.query("SELECT * FROM `tf_state` ORDER BY state_name ASC ", [], callback);

    },
    gettelesmspackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_SMS_Package` ORDER by SMS_ID DESC", [], callback);
    },
    gettelesmspackagedetail: function (id, callback) {
        
        return db.query("SELECT * FROM `tf_Tele_SMS_Package`  WHERE  SMS_ID ='" + id + "'", [], callback);

    },
    savetelesmspackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tele_SMS_Package SET ? ', data, callback);
    },
    updatetelesmspackageData: function (data, callback) {
        return db.query('UPDATE tf_Tele_SMS_Package set ? where SMS_ID= ?', [data, data.SMS_ID], callback);
    },
    deletetelesmspackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tele_SMS_Package where SMS_ID=?', [id], callback);
    },
    gettelemailpackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Mail_Package` ORDER by Mail_ID DESC", [], callback);
    },
    gettelemailpackagedetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Mail_Package`  WHERE  Mail_ID ='" + id + "'", [], callback);
    },
    savetelemailpackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tele_Mail_Package SET ? ', data, callback);
    },
    updatetelemailpackageData: function (data, callback) {
        return db.query('UPDATE tf_Tele_Mail_Package set ? where Mail_ID= ?', [data, data.Mail_ID], callback);
    },
    deletetelemailpackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tele_Mail_Package where Mail_ID=?', [id], callback);
    },
    gettelemeetpackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Meet_Package` ORDER by Meet_ID DESC", [], callback);
    },
    gettelemeetpackagedetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Meet_Package`  WHERE  Meet_ID ='" + id + "'", [], callback);
    },
    savetelemeetpackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tele_Meet_Package SET ? ', data, callback);
    },
    updatetelemeetpackageData: function (data, callback) {
        return db.query('UPDATE tf_Tele_Meet_Package set ? where Meet_ID= ?', [data, data.Meet_ID], callback);
    },
    deletetelemeetpackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tele_Meet_Package where Meet_ID=?', [id], callback);
    },

    getteledigitalpackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Digital_Package` ORDER by Digital_ID DESC", [], callback);
    },
    getteledigitalpackagedetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Digital_Package`  WHERE  Digital_ID ='" + id + "'", [], callback);
    },
    saveteledigitalpackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tele_Digital_Package SET ? ', data, callback);
    },
    updateteledigitalpackageData: function (data, callback) {
        return db.query('UPDATE tf_Tele_Digital_Package set ? where Digital_ID= ?', [data, data.Digital_ID], callback);
    },
    deleteteledigitalpackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tele_Digital_Package where Digital_ID=?', [id], callback);
    },
    getchannelstat: function (date, callback) {
        return db.query("SELECT MAX(count) as totalchannel,DATE_FORMAT(date,'%H:%i') as time FROM `tf_channelusages` WHERE date like '" + date + "' GROUP BY time ORDER BY `id` ASC", [], callback);
    },
    getchannelstat2: function (date, callback) {
        return db.query("SELECT MAX(count) as totalchannel,DATE_FORMAT(date,'%H:%i') as time FROM `tf_channelusages_new` WHERE date like '" + date + "' GROUP BY time ORDER BY `id` ASC", [], callback);
    },
    getblocknumbers: function (data, callback) {
        return db.query('SELECT * FROM `tf_block_number`  ORDER BY ' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    getBlockNumbertotalData:function(data,callback){
        return db.query('SELECT count(num_id) as total FROM `tf_block_number`', [], callback);

    },
    getblocknumberdetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_block_number` where num_id=" + id, [], callback);
    },
    insertblocknumber: function (data, callback) {
        return db.query('Insert INTO tf_block_number SET ?', data, callback);
    },
    updateblocknumber: function (data, callback) {
        return db.query('update tf_block_number set ? WHERE num_id = ?', [data, data.num_id], callback);
    },
    deleteblocknumber: function (id, callback) {
        return db.query('DELETE FROM tf_block_number where num_id=?', [id], callback);
    },
    insertagentassignlead: function (data, callback) {
        return db.query('Insert INTO tf_agent_assignlead SET ?', data, callback);
    },
    insertagentassigndigitallead: function (data, callback) {
        return db.query('Insert INTO tf_agent_digitalassignlead SET ?', data, callback);
    },
    insertagentsmsassignlead: function (data, callback) {
        return db.query('Insert INTO tf_agent_assignleadsms SET ?', data, callback);
    },
    insertagentmailassignlead: function (data, callback) {
        return db.query('Insert INTO tf_agent_assignmaillead SET ?', data, callback);
    },
    getagentassignleadetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_agent_assignlead`  WHERE  request_id ='" + id + "'", [], callback);
    },
    getagentassignleaddigital: function (id, callback) {
        return db.query("SELECT * FROM `tf_agent_digitalassignlead`  WHERE  request_id ='" + id + "'", [], callback);
    },
    getagentassignsmsleadetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_agent_assignleadsms`  WHERE  request_id ='" + id + "'", [], callback);
    },
    getagentassignmailleadetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_agent_assignmaillead`  WHERE  request_id ='" + id + "'", [], callback);
    },
    getsignRequest: function (id, callback) {
        return db.query("SELECT * FROM `tf_request_signup`  ORDER BY`created_at` DESC ", [], callback)
    },
    searchsignReqData: function (data, callback) {
        var where = ' 1=1 ';
        if (data.startdate != '1970-01-01') {
            where += " and DATE(created_at)>='" + data.startdate + "'";
        }

        if (data.mobile) {
            where += " and mobile like '%" + data.mobile + "%'";
        }
        if (data.name) {
            where += " and name like '%" + data.name + "%'";
        }
        if (data.username) {
            where += " and username like '%" + data.username + "%'";
        }
        if (data.services) {
            where += " and services like '%" + data.services + "%'";
        }
        return db.query('SELECT * FROM `tf_request_signup` where ' + where + '', [], callback);
    },
    gettollfreepackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tollfree_Package` ORDER by TFree_id DESC", [], callback);
    },
    gettollfreepackagedetail: function (id, callback) {        
        return db.query("SELECT * FROM `tf_Tollfree_Package`  WHERE  TFree_id ='" + id + "'", [], callback);
    },
    savetollfreepackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tollfree_Package SET ? ', data, callback);
    },
    updatetollfreepackageData: function (data, callback) {
        return db.query('UPDATE tf_Tollfree_Package set ? where TFree_id= ?', [data, data.TFree_id], callback);
    },
    deletetollfreepackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tollfree_Package where TFree_id=?', [id], callback);
    },
    getOBDpackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_OBD_Package` ORDER by OBD_id DESC", [], callback);
    },
    getOBDpackagedetail: function (id, callback) {        
        return db.query("SELECT * FROM `tf_OBD_Package`  WHERE  OBD_id ='" + id + "'", [], callback);
    },
    saveOBDpackagedata: function (data, callback) {
        return db.query('Insert INTO tf_OBD_Package SET ? ', data, callback);
    },
    updateOBDpackageData: function (data, callback) {
        return db.query('UPDATE tf_OBD_Package set ? where OBD_id= ?', [data, data.OBD_id], callback);
    },
    deleteOBDpackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_OBD_Package where OBD_id=?', [id], callback);
    },
    getadspackages: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Digital_Ads_Package` ORDER by Adspackage_id DESC", [], callback);
    },
    getadspackagedetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_Tele_Digital_Ads_Package`  WHERE  Adspackage_id ='" + id + "'", [], callback);
    },
    saveadspackagedata: function (data, callback) {
        return db.query('Insert INTO tf_Tele_Digital_Ads_Package SET ? ', data, callback);
    },
    updateadspackagedata: function (data, callback) {
        return db.query('UPDATE tf_Tele_Digital_Ads_Package set ? where Adspackage_id= ?', [data, data.Adspackage_id], callback);
    },
    deleteadspackagedata: function (id, callback) {
        return db.query('DELETE FROM tf_Tele_Digital_Ads_Package where Adspackage_id=?', [id], callback);
    },
    getpacksmsdetail: function (id, callback) {
        return db.query('SELECT * from tf_Tele_SMS_Package where SMS_ID=?', [id], callback);
    },
    getpackmaildetail: function (id, callback) {
        return db.query('SELECT * from tf_Tele_Mail_Package where Mail_ID=?', [id], callback);
    },
    getpackmeetdetail: function (id, callback) {
        return db.query('SELECT * from tf_Tele_Meet_Package where Meet_ID=?', [id], callback);
    },
    getpackdigitaldetail: function (id, callback) {
        return db.query('SELECT * from tf_Tele_Digital_Package where Digital_ID=?', [id], callback);
    },
    getpackdigitaladsdetail: function (id, callback) {
        return db.query('SELECT * from tf_Tele_Digital_Ads_Package where Adspackage_id=?', [id], callback);
    },
    getpacktollfreedetail: function (id, callback) {
        return db.query('SELECT * from tf_Tollfree_Package where TFree_id=?', [id], callback);
    },
    getpackobddetail: function (id, callback) {
        return db.query('SELECT * from tf_OBD_Package where OBD_id=?', [id], callback);
    },
    getasteriskserverdata: function (id, callback) {
        return db.query('select * from tf_asterisk_server', [], callback)
    },
    getasteriskserverdetail: function (id, callback) {
        return db.query('select * from tf_asterisk_server where server_id=' + id, [], callback)

    },
    updateasteriskserverdata: function (data, callback) {
        return db.query('update tf_asterisk_server set ? WHERE server_id = ?', [data, data.server_id], callback);
    },
    saveasteriskserverdata: function (data, callback) {
        return db.query('Insert INTO tf_asterisk_server SET ? ', data, callback);
    },
    deleteasteriskserverdata: function (id, callback) {
        return db.query('DELETE FROM tf_asterisk_server where server_id=?', [id], callback);
    },    
    getblocknumberdatas: function (id, callback) {
        return db.query("SELECT * FROM `tf_block_number` where account_id ="+id+" ORDER by num_id DESC", [], callback);
    },
    getchannelstat3: function (date, callback) {
        return db.query("SELECT MAX(count) as totalchannel,DATE_FORMAT(date,'%H:%i') as time FROM `tf_channelusages_airtel` WHERE date like '%" + date + "%' GROUP BY time ORDER BY `id` ASC", [], callback);
    },    
    checkmobilenumber: function (mobile, callback) {
        return db.query('SELECT * FROM `tf_block_number` where number =?', [mobile], callback);
    },
    delete_mappping_zohouser:function(uid,account_id,callback){
        return db.query('UPDATE `tf_zoho_user` SET `mapuser_id` = 0  WHERE `uid` ='+uid+'  and `account_id` = '+account_id,callback)
    },
    getsocketserverdata: function (id, callback) {
        return db.query('select * from tf_socket_server', [], callback)
    },
    get_obd_asterisk_server_data: function(id,callback){
        return db.query('SELECT * FROM `tf_obd_asterisk_server` ',callback)
    }
}

module.exports = Admin;