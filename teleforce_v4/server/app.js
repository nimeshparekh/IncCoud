var express = require('express');
var app = express();
var cors = require('cors');
// ADD THESE TWO LINES
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var DefaultRoutes = require('./routes/default.routes');
var SigninRoutes = require('./routes/signin.routes');
var CallRoutes = require('./routes/call.routes');
var SettingRoutes = require('./routes/setting.routes');
var AdminRoutes = require('./routes/admin.routes');
var ManagerRoutes = require('./routes/manager.routes');
var SegmentsRoutes = require('./routes/segments.routes');
var ContactRoutes = require('./routes/contacts.routes');
var ZohoRoutes = require('./routes/zoho.routes');
var  TemplateRoutes = require('./routes/template.routes');
var MasterdataRoutes = require('./routes/master.routes');
var  ReportRoutes = require('./routes/report.routes');
var  APIRoutes = require('./routes/api.routes');
var  SmscampaignRoutes = require('./routes/smscampaign.routes');
var  LocationRoutes = require('./routes/location.routes');
var  PaymentRoutes = require('./routes/payment.routes');
var  LmsreportRoutes = require('./routes/lms_report.routes');
var  DigitalRoutes = require('./routes/digital.routes');
var ProductsRoutes = require('./routes/products.routes');
// var ErpRoutes = require('./middlewares/ERP/ERP')
var ErpRoutes = require('./routes/ERP')
var DailerRoutes = require('./routes/dialer.routes')
var EmailRoutes = require('./routes/email.routes')
var ObdCampaignRoutes = require('./routes/obd_campaign.routes')
var morgan = require('morgan')

app.use(morgan('combined'))

app.use(cors());
//app.disable('etag');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());
//create a cors middleware
app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,multipart/form-data");
    next();
});
app.use('/api/',express.static('uploads'));
app.use('/api/',express.static('telemedia'));

app.use('/api/pdf/',express.static('uploads/LMS/Email'));

app.use('/api/default/', DefaultRoutes);

app.use('/api/signin/', SigninRoutes);

app.use('/api/call/', CallRoutes);

app.use('/api/setting/', SettingRoutes);

app.use('/api/admin/', AdminRoutes);

app.use('/api/manager/', ManagerRoutes);

app.use('/api/segments/', SegmentsRoutes);

app.use('/api/contacts/', ContactRoutes);

app.use('/api/zoho/', ZohoRoutes);

app.use('/api/template/', TemplateRoutes);

app.use('/api/master/', MasterdataRoutes);

app.use('/api/report/', ReportRoutes);

app.use('/api/tfapi/', APIRoutes);

app.use('/api/smscampaign/', SmscampaignRoutes);

app.use('/api/location/', LocationRoutes);
app.use('/api/payment/', PaymentRoutes);
app.use('/api/digital/', DigitalRoutes);

app.use('/api/products/', ProductsRoutes);
app.use('/api/erp/', ErpRoutes);
app.use('/api/lmsreport/', LmsreportRoutes);
app.use('/api/dialer/', DailerRoutes);
app.use('/api/email/', EmailRoutes);
app.use('/api/obdcampaign/', ObdCampaignRoutes);

// Define PORT
//const port = process.env.PORT || 3000;
const PORT_1 = 3000;
const PORT_2 = 3006;
const PORT_3 = 3003;
const PORT_4 = 3004;
const PORT_5 = 3005;
const server1 = app.listen(PORT_1,(req,res)=>{
    console.log('listen to port '+PORT_1)
});
const server2 = app.listen(PORT_2,(req,res)=>{
    console.log('listen to port '+PORT_2)
});
const server3 = app.listen(PORT_3,(req,res)=>{
    console.log('listen to port '+PORT_3)
});
const server4 = app.listen(PORT_4,(req,res)=>{
    console.log('listen to port '+PORT_4)
});
const server5 = app.listen(PORT_5,(req,res)=>{
    console.log('listen to port '+PORT_5)
});

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    //console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message); 
});

// app.engine('hbs', require('exphbs'));
// app.set('view engine', 'hbs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html','hbs');
app.set('views', __dirname);