var db = require('../database/db');

var Manager = {

    getmanagers: function (id, callback) {
        return db.query('SELECT A.*,P.package_name as packagename from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by='+id+' order by create_date desc', [], callback);
        //return db.query('SELECT A.*,P.package_name as packagename,(SELECT SUM(CallTalkTime) as totalseconds FROM `tf_cdr` WHERE accountid=A.account_id) as duration from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by='+id+' order by create_date desc', [], callback);

        //return db.query('SELECT A.*,P.package_name as packagename,(SELECT SUM(CallTalkTime) as totalseconds FROM `tf_cdr` WHERE accountid=A.account_id) as duration from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by='+id+' order by create_date asc', [], callback);
    },
    getmanagerdetail: function (id, callback) {
        //return db.query('SELECT *,(SELECT Discount_Type FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Discount_Type,(SELECT Discount_Per FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Discount_Per,(SELECT Account_GST_NO FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Account_GST_NO,(SELECT Account_Address FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Account_Address,(SELECT Account_State_Code FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as  Account_State_Code,(SELECT Company_GST_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Company_GST_ID,(SELECT Plan_discount FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Plan_discount,(SELECT SMS_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_ID,(SELECT SMS_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_Plan_Value,(SELECT Mail_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Mail_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as  Mail_ID,(SELECT Mail_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Mail_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Mail_Plan_Value,(SELECT Meet_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Meet_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Meet_ID,(SELECT Meet_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Meet_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Meet_Plan_Value,(SELECT Digital_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Digital_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Digital_ID,(SELECT Digital_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Digital_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Digital_Plan_Value,(SELECT Ads_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Ads_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Ads_ID,(SELECT Ads_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Ads_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Ads_Plan_Value,(SELECT Tele_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Tele_Startdate,(SELECT Mail_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Mail_Startdate,(SELECT Meet_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Meet_Startdate,(SELECT Digital_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Digital_Startdate,(SELECT SMS_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as SMS_Startdate,(SELECT TFree_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as TFree_Startdate,(SELECT Ads_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Ads_Startdate,(SELECT TFree_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `TFree_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as TFree_ID,(SELECT TFree_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `TFree_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as TFree_Plan_Value,(SELECT OBD_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `OBD_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as OBD_ID,(SELECT OBD_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `OBD_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as OBD_Plan_Value,(SELECT plan_minuits FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Plan_Type` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as plan_minuits,(SELECT free_minuites FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Plan_Type` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as free_minuites,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate,(SELECT SMS_Pr_No FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_Pr_No,(SELECT OBD_User_Balance FROM tf_account_balance WHERE Account_ID = A.account_id) as obdbalance,(SELECT OBD_start_date FROM tf_account_balance WHERE Account_ID = A.account_id) as obdstartdate,(SELECT OBD_User_Used FROM tf_account_balance WHERE Account_ID = A.account_id) as obdused from tf_account_table A where A.account_id='+id, [], callback);
        //console.log('SELECT *,B.Account_GST_NO,B.Account_Address,B.Account_State_Code,B.Company_GST_ID,B.Plan_discount,B.SMS_ID,B.SMS_Plan_Value,B.Mail_ID,B.Mail_Plan_Value,B.Meet_ID,B.Meet_Plan_Value,B.Digital_ID,B.Digital_Plan_Value,B.plan_minuits,B.free_minuites,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate,(SELECT OBD_User_Balance FROM tf_account_balance WHERE Account_ID = A.account_id) as obdbalance,(SELECT voip_pulse_charge FROM tf_account_balance WHERE Account_ID = A.account_id) as voip_pulse_charge from tf_account_table A LEFT JOIN Billing_data B ON B.Account_ID=A.account_id where A.account_id='+id+' ORDER BY B.Bill_ID DESC LIMIT 1');
        return db.query('SELECT *,B.Account_GST_NO,B.Account_Address,B.Account_State_Code,B.Company_GST_ID,B.Plan_discount,B.SMS_ID,B.SMS_Plan_Value,B.Mail_ID,B.Mail_Plan_Value,B.Meet_ID,B.Meet_Plan_Value,B.Digital_ID,B.Digital_Plan_Value,B.plan_minuits,B.free_minuites,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate,(SELECT OBD_User_Balance FROM tf_account_balance WHERE Account_ID = A.account_id) as obdbalance,(SELECT voip_pulse_charge FROM tf_account_balance WHERE Account_ID = A.account_id) as voip_pulse_charge,(SELECT lead_limit FROM tf_account_balance WHERE Account_ID = A.account_id) as lead_limit from tf_account_table A LEFT JOIN Billing_data B ON B.Account_ID=A.account_id where A.account_id=' + id + ' ORDER BY B.Bill_ID DESC LIMIT 1', [], callback);
    },
    gettempmanagerdetail: function (id, callback) {
        return db.query('SELECT * FROM tf_tmp_user where userid=' + id, [], callback);
        //return db.query('SELECT *,B.Account_GST_NO,B.Account_Address,B.Account_State_Code,B.Company_GST_ID,B.Plan_discount,B.SMS_ID,B.SMS_Plan_Value,B.Mail_ID,B.Mail_Plan_Value,B.Meet_ID,B.Meet_Plan_Value,B.Digital_ID,B.Digital_Plan_Value,B.plan_minuits,B.free_minuites,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate from tf_account_table A LEFT JOIN Billing_data B ON B.Account_ID=A.account_id where A.account_id='+id+' ORDER BY B.Bill_ID DESC LIMIT 1', [], callback);
    },
    getmanagerrenewpackagedetail: function (id, callback) {
        return db.query('SELECT *,(SELECT Discount_Type FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Discount_Type,(SELECT Discount_Per FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Discount_Per,(SELECT Account_GST_NO FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Account_GST_NO,(SELECT Account_Address FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Account_Address,(SELECT Account_State_Code FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as  Account_State_Code,(SELECT Company_GST_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Company_GST_ID,(SELECT Plan_discount FROM `Billing_data` WHERE `Account_ID`= A.account_id ORDER BY Bill_ID DESC LIMIT 1) as Plan_discount,(SELECT SMS_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_ID,(SELECT SMS_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_Plan_Value,(SELECT Mail_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Mail_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as  Mail_ID,(SELECT Mail_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Mail_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Mail_Plan_Value,(SELECT Meet_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Meet_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Meet_ID,(SELECT Meet_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Meet_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Meet_Plan_Value,(SELECT Digital_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Digital_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Digital_ID,(SELECT Digital_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Digital_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Digital_Plan_Value,(SELECT Ads_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Ads_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Ads_ID,(SELECT Ads_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Ads_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as Ads_Plan_Value,(SELECT SMS_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as SMS_Startdate,(SELECT Ads_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Ads_Startdate,(SELECT TFree_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as TFree_Startdate,(SELECT TFree_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `TFree_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as TFree_ID,(SELECT TFree_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `TFree_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as TFree_Plan_Value,(SELECT OBD_ID FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `OBD_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as OBD_ID,(SELECT OBD_Plan_Value FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `OBD_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as OBD_Plan_Value,(SELECT plan_minuits FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Plan_Type` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as plan_minuits,(SELECT free_minuites FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `Plan_Type` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as free_minuites,(SELECT Tele_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Tele_Startdate,(SELECT Mail_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Mail_Startdate,(SELECT Meet_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Meet_Startdate,(SELECT Digital_Startdate FROM tf_account_balance WHERE Account_ID = A.account_id) as Digital_Startdate,(SELECT Mail_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as mailexpirydate,(SELECT Meet_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as meetexpirydate,(SELECT Digital_Expire FROM tf_account_balance WHERE Account_ID = A.account_id) as digitalexpirydate,(SELECT SMS_Pr_No FROM `Billing_data` WHERE `Account_ID`= A.account_id AND `SMS_ID` IS NOT NULL ORDER BY Bill_ID DESC LIMIT 1) as SMS_Pr_No,(SELECT OBD_start_date FROM tf_account_balance WHERE Account_ID = A.account_id) as obdstartdate from tf_account_table A where A.account_id=' + id, [], callback);
    },
    insertmanager: function (data, callback) {
        return db.query('Insert INTO tf_account_table SET ?', data, callback);
    },
    updatemanager: function (data, callback) {
        return db.query('update tf_account_table set ? WHERE account_id = ?', [data, data.account_id], callback);
    },
    deletemanager: function (id, callback) {
        return db.query('DELETE FROM tf_account_table where account_id=?', [id], callback);
    },
    getmanagerchannels: function (id, callback) {
        return db.query('SELECT * from tf_did_numbers where account_id=' + id, [], callback);
    },
    getassignChannel: function (id, callback) {
        db.query('SELECT distinct pr.id,pr.did,pr.did_name as channelname FROM tf_did pr  where pr.status="active" and pr.did not in (select did from tf_did_numbers)', function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    savemanagerchannel: function (data, callback) {
        return db.query('Insert INTO tf_did_numbers SET ?', data, callback);
    },
    getsoundapprovestatus: function (id, callback) {
        return db.query('select * from tf_sound_library WHERE id = ' + id, [], callback)
    },
    savesoundstatus: function (data, callback) {
        return db.query('update tf_sound_library set ? WHERE id = ?', [data, data.id], callback);
    },
    updateassignchannelstatus: function (data, callback) {
        return db.query('update tf_did_numbers set ? WHERE id = ?', [data, data.id], callback);
    },
    getsounddata: function (id, callback) {
        return db.query('select tf_sound_library.* ,tf_account_table.account_name from  `tf_sound_library`  INNER JOIN tf_account_table ON tf_sound_library.account_id =tf_account_table.account_id AND `status` = 1 ORDER by addDate DESC', [], callback);
    },
    Pendingsounddata: function (id, callback) {
        return db.query('select tf_sound_library.* ,tf_account_table.account_name from `tf_sound_library` INNER JOIN tf_account_table ON tf_sound_library.account_id =tf_account_table.account_id AND `status` != 1 ORDER by addDate DESC', [], callback);
    },
    deleteassignchannel: function (id, callback) {
        return db.query('DELETE FROM tf_did_numbers where id=?', [id], callback);
    },
    findManagerMobile: function (mobile, callback) {
        return db.query('SELECT * from tf_account_table where account_type=2 and mobile=?', [mobile], callback);
    },
    findManagerEditMobile: function (mobile, id, callback) {
        return db.query('SELECT * from tf_account_table where account_type=2 and mobile=? and account_id!=?', [mobile, id], callback);
    },
    getexpire: function (id, callback) {
        console.log('SELECT A.*,P.package_name as packagename from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by=' + id + ' AND expiry_date > CURRENT_TIMESTAMP order by create_date asc');
        //return db.query('SELECT A.*,P.package_name as packagename,(SELECT SUM(CallTalkTime) as totalseconds FROM `tf_cdr` WHERE accountid=A.account_id) as duration from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by='+id+' AND expiry_date > CURRENT_TIMESTAMP order by create_date asc', [], callback);
        return db.query('SELECT A.*,P.package_name as packagename from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by=' + id + ' AND expiry_date > CURRENT_TIMESTAMP order by create_date asc', [], callback);
    },
    expire: function (id, callback) {
        //return db.query('SELECT A.*,P.package_name as packagename,(SELECT SUM(CallTalkTime) as totalseconds FROM `tf_cdr` WHERE accountid=A.account_id) as duration from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by='+id+' AND expiry_date < CURRENT_TIMESTAMP order by create_date asc', [], callback);
       console.log('SELECT A.*,P.package_name as packagename from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by=' + id + ' AND expiry_date < CURRENT_TIMESTAMP order by create_date asc');
        return db.query('SELECT A.*,P.package_name as packagename from tf_account_table AS A left join tf_packages AS P on P.package_id=A.package_id where created_by=' + id + ' AND expiry_date < CURRENT_TIMESTAMP order by create_date asc', [], callback);
    },
    insertbilldata: function (data, callback) {
        return db.query('Insert INTO Billing_data SET ?', data, callback);
    },
    getlastbillid: function (data, callback) {
        return db.query('SELECT * from Billing_data ORDER BY Bill_ID DESC ', [], callback);
    },
    getuserlastbilldata: function (id, callback) {
        return db.query('SELECT * from Billing_data WHERE Account_ID=' + id + ' ORDER BY Bill_ID DESC ', [], callback);
    },
    updatebilldata: function (data, callback) {
        return db.query('update Billing_data set ? WHERE Bill_ID = ?', [data, data.Bill_ID], callback);
    },
    getbillingdata: function (id, callback) {
        //console.log(data.status);
        //return db.query('SELECT B.Bill_ID,DATE_FORMAT(B.Bill_Date, "%d-%m-%Y") as Bill_Date,P.package_name FROM Billing_data B  LEFT JOIN tf_packages P ON P.package_id=B.Plan_Type WHERE B.Account_ID ='+id+' order by B.Bill_Date desc', [], callback);
        return db.query('SELECT B.Bill_ID,B.Final_amount,DATE_FORMAT(B.Bill_Date, "%d-%m-%Y") as Bill_Date,P.package_name,(SELECT SMS_Plan FROM tf_Tele_SMS_Package WHERE SMS_ID=B.SMS_ID) as smspackage,(SELECT Mail_Plan FROM tf_Tele_Mail_Package WHERE Mail_ID=B.Mail_ID) as mailpackage,(SELECT Meet_Plan FROM tf_Tele_Meet_Package WHERE Meet_ID=B.Meet_ID) as meetpackage,(SELECT Digital_Plan FROM tf_Tele_Digital_Package WHERE Digital_ID=B.Digital_ID) as digitalpackage FROM Billing_data B  LEFT JOIN tf_packages P ON P.package_id=B.Plan_Type WHERE B.Account_ID =' + id + ' order by B.Bill_Date desc', [], callback);
    },
    generateinvoice: function (billid, callback) {
        //console.log(data.status);
        return db.query('SELECT B.Bill_ID,B.Plan_Type,B.Plan_discount,A.company_name,A.account_name,B.Account_Address,B.Bill_ID,DATE_FORMAT(B.Bill_Date, "%d/%m/%Y") as Bill_Date,B.Account_GST_NO,P.package_name,B.Plan_Value,B.Plan_TotalValue,B.Plan_user,B.Plan_CGST,B.Plan_SGST,B.Plan_IGST,B.Total_GST,B.Final_amount,B.Company_GST_ID, B.Company_GST_ID as panno,(SELECT Address FROM Company_GST_Master WHERE GST_Number=B.Company_GST_ID) as cmpaddress,B.Meet_ID,(SELECT Meet_Plan FROM `tf_Tele_Meet_Package` where Meet_ID=B.Meet_ID and B.Meet_ID IS NOT NULL ) as meetpackage,B.Meet_Plan_Value,(SELECT SMS_Plan FROM `tf_Tele_SMS_Package` where SMS_ID=B.SMS_ID and B.SMS_ID IS NOT NULL ) as smspackage,B.SMS_Plan_Value,B.SMS_ID,(SELECT Mail_Plan FROM `tf_Tele_Mail_Package` where Mail_ID=B.Mail_ID and B.Mail_ID IS NOT NULL ) as mailpackage,B.Mail_Plan_Value,B.Mail_ID,(SELECT Digital_Plan FROM `tf_Tele_Digital_Package` where Digital_ID=B.Digital_ID and B.Digital_ID IS NOT NULL ) as digitalpackage,B.Digital_Plan_Value,B.Digital_ID FROM Billing_data B LEFT JOIN tf_account_table A ON A.account_id=B.Account_ID LEFT JOIN tf_packages P ON P.package_id=B.Plan_Type WHERE B.Bill_ID ="' + billid + '" order by B.Bill_Date desc limit 1', [], callback);
    },
    insertaccountbalancedata: function (data, callback) {
        return db.query('Insert INTO tf_account_balance SET ?', data, callback);
    },
    updateaccountbalancedata: function (data, callback) {
        return db.query('update tf_account_balance set ? WHERE Account_ID = ?', [data, data.Account_ID], callback);
    },
    insertupdatemangerdata: function (data, callback) {
        return db.query('Insert INTO tf_activity_logs SET ?', data, callback);
    },
    getaccountbalancedatabyid: function (id, callback) {
        return db.query('SELECT * from tf_account_balance WHERE Account_ID=' + id, [], callback);
    },
    getVendordata: function (id, callback) {
        return db.query('select * from tf_vendor', [], callback)
    },
    getVenderByid: function (id, callback) {
        return db.query('select * from tf_vendor where ven_id=' + id, [], callback)

    },
    updateVenderData: function (data, callback) {
        return db.query('update tf_vendor set ? WHERE ven_id = ?', [data, data.ven_id], callback);

    },
    saveVendorData: function (data, callback) {
        return db.query('Insert INTO tf_vendor SET ? ', data, callback);

    },
    deleteVendorData: function (id, callback) {
        return db.query('DELETE FROM tf_vendor where ven_id=?', [id], callback);

    },
    searchVendor: function (data, callback) {
        //console.log(data);
        var where = 'account_id=' + data.account_id;
        if (data.ven_city) {
            where += " and ven_city='" + data.ven_city + "'";
        }
        if (data.ven_pincode) {
            where += " and ven_pincode='" + data.ven_pincode + "'";
        }
        if (data.ven_mobile) {
            where += " and ven_mobile='" + data.ven_mobile + "'";
        }
        return db.query('SELECT * FROM `tf_vendor` where ' + where + '', [], callback);
    },
    getagentdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id=' + id, [], callback);
    },
    getVendorList: function (id, callback) {
        return db.query('SELECT * from tf_vendor where account_id=' + id, [], callback);
    },
    searchVendorlist: function (data, callback) {
        var where = 'account_id=' + data.account_id;
        if (data.ven_city) {
            where += " and ven_city='" + data.ven_city + "'";
        }
        if (data.ven_pincode) {
            where += " and ven_pincode='" + data.ven_pincode + "'";
        }
        if (data.ven_mobile) {
            where += " and ven_mobile='" + data.ven_mobile + "'";
        }
        return db.query('SELECT * FROM `tf_vendor` where ' + where + '', [], callback);
    },
    getassignsmserver: function (id, callback) {
        db.query('SELECT distinct S.sid,S.sid,S.server_name as servername FROM tf_sms_server S  where  S.sid not in (select server_id from tf_assign_sms_server where account_id=' + id + ')', function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    savemanagersmserver: function (data, callback) {
        return db.query('Insert INTO tf_assign_sms_server SET ?', data, callback);
    },
    getmanagersmserver: function (id, callback) {
        return db.query('SELECT A.*,S.server_name,S.server_type from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where account_id=' + id, [], callback);
    },
    deleteassignsmserver: function (id, callback) {
        return db.query('DELETE FROM tf_assign_sms_server where assign_id=?', [id], callback);
    },
    savemanagerotp: function (data, callback) {
        return db.query('Insert INTO tf_managerotp SET ?', data, callback);
    },
    checkmobileotp: function (data, callback) {
        //console.log('SELECT * from tf_managerotp where account_id=' + data.userid +' and otp='+data.otp+' order by otp_id desc');
        return db.query('SELECT * from tf_managerotp where account_id=' + data.userid + ' and otp=' + data.otp + ' order by otp_id desc', [], callback);
    },
    deletemanagerotp: function (id, callback) {
        return db.query('DELETE FROM tf_managerotp where account_id=?', [id], callback);
    },
    insertsendsmsdata: function (data, callback) {
        return db.query('Insert INTO tf_sendsms SET ?', data, callback);
    },
    insertsendemaildata: function (data, callback) {
        return db.query('Insert INTO tf_sendemail SET ?', data, callback);
    },
    gettempuser: function (data, callback) {
        return db.query('SELECT * FROM `tf_tmp_user`', callback);
    },
    getkycformdata: function (id, callback) {
        return db.query('SELECT * from tf_tmp_user_kyc WHERE userid	 = ' + id, [], callback);

    },
    gettempusernamebyid: function (id, callback) {
        return db.query('SELECT * FROM `tf_tmp_user` where userid =' + id, callback);
    },
    gettemptransctiondata: function (user, callback) {
        return db.query('SELECT * FROM `tf_payment_transaction` WHERE `user` ="' + user + '"', callback)
    },
    updatetempuser: function (data, callback) {
        return db.query('update tf_tmp_user set ? WHERE userid = ?', [data, data.userid], callback);
    },
    getactivemanagerdetail: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_id=? and current_status=0 and expiry_date >=CURDATE()', [id], callback);
    },
    save_subscription: function (data, callback) {
        return db.query('Insert INTO tf_subscription SET ?', data, callback);
    },
    check_subscription: function (data, callback) {
        return db.query('SELECT * FROM `tf_subscription` WHERE manager_id = ? AND name = ? AND plans = ? AND status = 0', [data.manager_id, data.name, data.plans], callback);
    },
    update_subscription: function (data, callback) {
        return db.query('update tf_subscription set ? WHERE s_id = ?', [data, data.s_id], callback);
    },
    getsubscriptiondata: function (id, callback) {
        return db.query('SELECT * FROM `tf_subscription` WHERE `manager_id` = ? ORDER BY `s_id` DESC', [id], callback);
    },
    change_subscription: function (data, callback) {
        return db.query('update tf_subscription set ? WHERE s_id = ?', [data, data.s_id], callback);
    },
    getsettingbyname: function (name, callback) {
        return db.query('SELECT * FROM `tf_settings` WHERE `setting_name` = ? ORDER BY `s_id` DESC', [name], callback);
    },
    getcustomapi: function (id, callback) {
        return db.query("SELECT * FROM `tf_manager_api` WHERE account_id=" + id, [], callback)
    },
    savecustomapi: function (data, callback) {
        return db.query("Insert INTO tf_manager_api SET ?", data, callback);
    },
    updatecustomapi: function (data, callback) {
        return db.query('update tf_manager_api set ? WHERE api_id = ?', [data, data.api_id], callback);

    },
    getcustomapibyid: function (id, callback) {
        return db.query("SELECT * FROM `tf_manager_api` WHERE api_id=" + id, [], callback)
    },
    deletecustomapi: function (data, callback) {
        return db.query('DELETE FROM tf_manager_api where api_id=?', [data.id], callback);
    },
    searchcustomapi: function (data, callback) {
        //console.log("search ",data);
        var where = 'account_id=' + data.userid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(created_date)>='" + data.startdate + "'";
        }
        if (data.api_method) {
            where += " and api_method='" + data.api_method + "'";
        }
        if (data.api_name) {
            where += " and api_name ='" + data.api_name + "'";
        }
        if (data.status) {
            where += " and status ='" + data.status + "'";
        }
        return db.query('SELECT * FROM `tf_manager_api`  where ' + where + ' ORDER BY created_date DESC ', [], callback);

    },
    searchmanagaerdata: function (data, callback) {
        // console.log(data);
        var where = 'created_by =' + data.customer_id;
        //var where = 'account_type=2 ';

        if (data.email) {
            where += ' and `email` LIKE "' + data.email + '"';
        }
        if (data.agentname) {
            where += ' and account_name = "' + data.agentname + '"';
        }
        if (data.userid) {
            where += ' and account_id =' + data.userid;
        }
        if (data.agentnumber) {
            where += ' and mobile =' + data.agentnumber;
        }
        if (data.its_demo) {
            where += ' and is_demo =' + data.its_demo
        }
        if (data.createdstart) {
            where += ' And DATE(create_date) BETWEEN "' + data.createdstart + '"';
        }
        if (data.createdend) {
            where += ' AND "' + data.createdend + '"';
        }
        if (data.startdate) {
            where += ' AND  DATE(expiry_date) BETWEEN "' + data.startdate + '"';
        }

        if (data.enddate) {
            where += ' AND "' + data.enddate + '"';

        }
        return db.query('SELECT * FROM tf_account_table WHERE ' + where + ' order by create_date desc', callback);
    },
    savedispotiondata: function (data, callback) {
        return db.query("Insert INTO tf_call_disposition_manager SET  ?", data, callback);

    },
    getdispotion: function (id, callback) {
        return db.query("SELECT * FROM `tf_call_disposition_manager` WHERE account_id=" + id + " ORDER by id DESC", [], callback)

    },
    getdispositionbyid: function (id, callback) {
        return db.query("SELECT * FROM `tf_call_disposition_manager` WHERE id=" + id, [], callback)

    },
    updatedispotiondata: function (data, callback) {
        return db.query('update tf_call_disposition_manager set ? WHERE id = ?', [data, data.id], callback);

    },
    deletedispositon: function (data, callback) {
        return db.query('DELETE FROM tf_call_disposition_manager where id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM tf_call_disposition_supervisor where disposition_id=?', [data.id], callback);
            }
        })
    },
    getVoiceServerDetail: async function (id, callback) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM `tf_asterisk_server` WHERE `server_id` = ?', [id],
                async function (err, rows) {
                    if (rows.length > 0) {
                        resolve(rows[0]);
                    } else {
                        resolve(null);

                    }
                }
            )
        })
    },
    getSoundUserEmailid: async function (id, callback) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT A.email FROM `tf_sound_library` S LEFT JOIN tf_account_table A ON A.account_id=S.account_id WHERE S.id = ?', [id],
                async function (err, rows) {
                    if (rows.length > 0) {
                        resolve(rows[0].email);
                    } else {
                        resolve(null);

                    }
                }
            )
        })
    },
    get_all_managers_account_status:function(id,callback){
        return db.query('SELECT U.renew_account_manager,T.account_name AS SalesManager,U.account_name,U.email,U.mobile,U.channels AS channels,U.user_limit,U.package_name,U.expiry_date FROM(SELECT A.account_name AS account_name,A.email AS email,A.mobile AS mobile,A.channels AS channels,A.user_limit AS user_limit,A.expiry_date AS expiry_date,P.package_name AS package_name,A.renew_account_manager AS renew_account_manager FROM tf_account_table AS A LEFT JOIN tf_packages AS P ON P.package_id=A.package_id WHERE created_by='+id+' ORDER BY create_date ASC)U LEFT JOIN tf_account_table T ON U.renew_account_manager=T.account_id',callback)
    },
    active_user_account_status:function(id,callback){
        return db.query('SELECT U.renew_account_manager,T.account_name AS SalesManager,U.account_name,U.email,U.mobile,U.channels AS channels,U.user_limit,U.package_name,U.expiry_date FROM(SELECT A.account_name AS account_name,A.email AS email,A.mobile AS mobile,A.channels AS channels,A.user_limit AS user_limit,A.expiry_date AS expiry_date,P.package_name AS package_name,A.renew_account_manager AS renew_account_manager FROM tf_account_table AS A LEFT JOIN tf_packages AS P ON P.package_id=A.package_id WHERE created_by='+id+' AND expiry_date > CURRENT_TIMESTAMP ORDER BY create_date ASC)U LEFT JOIN tf_account_table T ON U.renew_account_manager=T.account_id',callback)
    },
    expire_user_account_status:function(id,callback){
        return db.query('SELECT U.renew_account_manager,T.account_name AS SalesManager,U.account_name,U.email,U.mobile,U.channels AS channels,U.user_limit,U.package_name,U.expiry_date FROM(SELECT A.account_name AS account_name,A.email AS email,A.mobile AS mobile,A.channels AS channels,A.user_limit AS user_limit,A.expiry_date AS expiry_date,P.package_name AS package_name,A.renew_account_manager AS renew_account_manager FROM tf_account_table AS A LEFT JOIN tf_packages AS P ON P.package_id=A.package_id WHERE created_by='+id+' AND expiry_date < CURRENT_TIMESTAMP ORDER BY create_date ASC)U LEFT JOIN tf_account_table T ON U.renew_account_manager=T.account_id',callback)

    }
}

module.exports = Manager;
