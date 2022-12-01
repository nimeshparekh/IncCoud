var cron = require('node-cron');
var Admin = require('../model/admin');
var APIRESTERPNext = require('restapi-erpnext');
var APIRESTERPNext = new APIRESTERPNext({
    username : 'sales@cloudX.in',
    password : 'cloudX@321',
    baseUrl  : 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
})


cron.schedule('*/5 * * * * *', () => {
    Admin.getdigitalbypush_erp(function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ldata = rows[0]
            console.log(ldata)
            var name = ldata['name']
            var email = ldata['email']
            var mobile = ldata['mobile']
            var intrest = ldata['intrest']
            var lead = {"doctype": "Lead", "lead_name": name,"email_id":email,"mobile_no":mobile,"notes":"<div>"+intrest+"</div>"}
            data = { push_erp: 'yes' }
            Admin.updatedemorequest(ldata['id'], data, function (err, rows) { })
            APIRESTERPNext.sainterpnext('/api/resource/Lead', 'POST', lead).then(function (response) {
                if(response){
                    data = { push_erp: 'yes' }
                    Admin.updatedemorequest(ldata['id'], data, function (err, rows) { })
                }
            })
            
        }
    })
});