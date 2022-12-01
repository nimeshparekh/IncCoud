var mysql = require('mysql');
require("dotenv").config();

var connection = mysql.createPool({
    host: process.env.OPENEMMDBHOST,
    user: process.env.OPENEMMDBUSERNAME,
    port:'3306',
    password: process.env.OPENEMMDBPWD,
    database: process.env.OPENEMMDB//'openemm',
}); 



connection.getConnection(function(err, connection) {
    if (err) {
        console.log('==>', err);
    }else{
        console.log('openemm Datbase connected succesfully.');
    }       
});

module.exports = connection;
