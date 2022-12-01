var db = require('../database/db');

var Payment = {
    getpaymentransactiondata: function (data, callback) {
        //console.log(data.status);
        return db.query('SELECT * FROM tf_payment_transaction order by pay_id desc', [], callback);
    },
    searchpaymentransaction:function (data, callback) {
        //console.log(data.status);
        var where = '1=1 ';
        if (data.startdate != '1970-01-01' && data.startdate != '') {            
            where += " and DATE(date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != '') {            
            where += " and DATE(date)<='" + data.enddate + "'";
        }
        if (data.txnid != null) {
            where += " and txnid like'%" + data.txnid + "%'";
        }
        if (data.firstname != null) {
            where += " and firstname like'%" + data.firstname + "%'";
        }
        if (data.bankrefno != null) {
            where += " and bank_ref_num like'%" + data.bankrefno + "%'";
        }
        if (data.payumoneyid != null) {
            where += " and payuMoneyId like'%" + data.payumoneyid + "%'";
        }
        if (data.mihpayid != null) {
            where += " and mihpayid like'%" + data.mihpayid + "%'";
        }
        if (data.mobile != null) {
            where += " and mobile like'%" + data.mobile + "%'";
        }
        //console.log('SELECT * FROM tf_payment_transaction where '+ where +' order by pay_id desc');
        return db.query('SELECT * FROM tf_payment_transaction where '+ where +' order by pay_id desc', [], callback);
    },
    savepaydata: function (data, callback) {
        return db.query('Insert INTO tf_payment_transaction SET ?', [data], callback);
    },
}

module.exports = Payment;