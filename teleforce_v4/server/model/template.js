var db = require('../database/db');

var Template = {
    getapprovesmstemplate:function (id, callback) {
        return db.query('SELECT * from tf_smstemplate where approve_status=1', [id], callback);
    },
    getapprovesmslist: function (cid, callback) { 
        return db.query('Select * from tf_smstemplate where approve_status=1 and account_id='+cid,[], callback);
    },     
    gettransactionalsmserver: function (cid, callback) { 
        return db.query('Select * from tf_sms_server where server_type=0 ',[], callback);
    },
    inserttemplate: function (data, callback) {
        return db.query('Insert INTO tf_emailtemplate SET ?', data, callback);
    },
    updatetemplate: function (data, callback) {
        return db.query('update tf_emailtemplate SET ? where email_id=?', [data, data.email_id], callback);
    },
    getemailtemplatelist: function (cid, callback) { 
        return db.query('Select * from tf_emailtemplate where  email_id='+cid, callback);
    },
    getapproveemaillist: function (cid, callback) { 
        return db.query('Select account_id,email_id,email_title,email_subject from tf_emailtemplate where status=1 and account_id= ? ',[cid], callback);
    },
    getapproveapilist: function (cid, callback) { 
        return db.query('Select * from tf_manager_api where status="active" and account_id= ? ',[cid], callback);
    },
    getwhatsapptemplatedata: function (id, callback) {
        //console.log('select * from tf_emailtemplate where account_id= ' + id+" "+'ORDER by add_date DESC');
        return db.query('select * from tf_whatsapp_template where account_id= ' + id + " " + 'ORDER by wtemp_id DESC', [], callback)
    },
    insertwhatsapptemplate: function (data, callback) {
        return db.query('Insert INTO tf_whatsapp_template SET ?', data, callback);
    },
    updatewhatsapptemplate: function (data, callback) {
        return db.query('update tf_whatsapp_template SET ? where wtemp_id=?', [data, data.wtemp_id], callback);
    },
    getwhatsapptemplatedetail: function (cid, callback) { 
        return db.query('Select * from tf_whatsapp_template where  wtemp_id='+cid, callback);
    },
    deletewhatsapptemplatedata: function (id, callback) {
        return db.query('DELETE FROM tf_whatsapp_template where wtemp_id=?', [id], callback);
    },
}

module.exports = Template;