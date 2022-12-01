var db = require('../database/db');
const { filter } = require('async');
var Master = {
    searchmaster: function (filter,position,pagesize,callback) {    
        return db.query('SELECT * FROM `tf_master_data` '+filter+'  LIMIT '+position+','+pagesize+'' , [], callback);
    },
    totalmaster: function (filter, callback) {
        return db.query('SELECT count(name) as total FROM `tf_master_data` '+filter,callback);
    },
    datacount: function (filter, callback) {
        return db.query('SELECT COUNT(city) as total,city FROM `tf_master_data` GROUP BY city ORDER BY total desc LIMIT 50',callback);
    },
    to: function (position,pagesize,callback) {
        return db.query('SELECT COUNT(city) as total,city FROM `tf_master_data` GROUP BY city ORDER BY total desc LIMIT '+position+','+pagesize+'',callback);
    },
    data: function (filter, callback) {
        return db.query('SELECT COUNT(city) as total,city FROM `tf_master_data` GROUP BY city',callback);
    },
    pincodecount: function (filter, callback) {
        return db.query('SELECT COUNT(Pincode) as total,Pincode FROM `tf_master_data` GROUP BY Pincode ORDER BY total desc LIMIT 10',callback);
    },
    topincode: function (position,pagesize,callback) {
        return db.query('SELECT COUNT(Pincode) as total,Pincode FROM `tf_master_data` GROUP BY Pincode ORDER BY total desc LIMIT '+position+','+pagesize+'',callback);
    },
    pindata: function (filter, callback) {
        return db.query('SELECT COUNT(Pincode) as total,Pincode FROM `tf_master_data` GROUP BY Pincode',callback);
    }

}

module.exports = Master;