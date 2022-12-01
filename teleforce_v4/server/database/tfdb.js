var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port:'3306',
    password: '',
    database: 'digital_mass',
}); 



connection.getConnection(function(err, connection) {
    if (err) {
        console.log('==>',err);
    }else{
        console.log('tb Datbase connected succesfully.');
    }       
});

module.exports = connection;
