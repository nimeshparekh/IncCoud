var mysql = require('mysql');
// var connection = mysql.createPool({
//     host: '103.182.153.113', //
//     user: 'admin_user', //admin_cloudX
//     port:'3306',
//     password: 'mL#KkT*Dx8svS', //Ns40WZYMaONpoRSm
//     database: 'db_cloudX',
// }); 
var connection = mysql.createPool({
    host: 'localhost', //
    user: 'root', //admin_cloudX
    port:'3306',
    password: '', //Ns40WZYMaONpoRSm
    database: 'db_cloudX_testing',
}); 

// var connection = mysql.createPool({
//     host: '192.168.1.37', //
//     user: 'admin_cloudX', //root
//     port:'3306',
//     password: 'Pd*ye&nwsf4I', //Garuda@dv1234
//     database: 'db_cloudX',
// }); 


connection.getConnection(function(err, connection) {
    if (err) {
        console.log('==>', err);
    }else{
        console.log('Database connected succesfully.');
    }       
});


module.exports = connection;
