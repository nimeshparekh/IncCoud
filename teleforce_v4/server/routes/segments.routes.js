var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var Segments = require('../model/segment');
const helper = require('../helper/common');
const authorize = require("../middlewares/auth");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));


router.get('/getallcontact/:id',authorize, async function (req, res) {
    var userid=req.params.id; 
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        userid = managerid
    } 
    Segments.getContact(userid, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({'data': data });
    });
});
router.get('/getsupervisorsegments/:id', function (req, res) {
    Segments.getsupervisorsegments(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({'data': data });
    });
});

router.post('/createcontact',authorize,async  function (req, res) {
    var m = new Date();
    var cont_id = 'SEG' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    req.body.cont_id = cont_id;
    req.body.created_date = m;    
    var userrole = req.query.tknuserrole;
    req.body.created_by= req.body.customer_id;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.customer_id)
        req.body.customer_id = managerid        
    }    
    Segments.createcontact(req.body, function (err, count) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Segment added sucessfully!' });
        }
    });
});

router.get('/delete/:cont_id', function (req, res) {
    //console.log(req.params.cont_id);
    Segments.deleteContact(req.params.cont_id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Segment deleted successfully!' });
        }
    });
});

router.post('/update',authorize,async function (req, res) {
    let data = req.body;
    //console.log('Body: ' + JSON.stringify(req.body));
    let cont_id = req.body.cont_id;
    delete data.cont_id;
    var userrole = req.query.tknuserrole;
    //console.log(req.query);
    req.body.created_by= req.body.customer_id;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.body.customer_id)
        req.body.customer_id = managerid        
    }   
    Segments.updateCategory(data, cont_id, function (err, count) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Segment Updated sucessfully!' });
        }

    });

});

router.get('/getcontactdetail/:id', function (req, res) {
    Segments.getContactDetail(req.params.id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});
router.get('/deletesegemntreq/:id', function (req, res) {
    Segments.deletesegemntreq(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})
router.get('/getsupervisorallsegments/:id', function (req, res) {
    Segments.getsupervisorallsegments(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({'data': data });
    });
});


module.exports = router;