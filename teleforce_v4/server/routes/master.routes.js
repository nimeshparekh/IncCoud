var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Master = require('../model/master');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
var request = require('request');
const awry = require('awry');
const { filter } = require('async');
var async = require("async");
var fs = require('fs');
var http = require('http');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.post('/master', function (req, res) {
    const filter = req.body.filter;
    
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = 'where 1=1'
    if(filter.city!=''){
        findmatch += ' AND city ="'+filter.city+'"';
    }
    if(filter.pincode!=''){
        findmatch += ' AND Pincode ="'+filter.pincode+'"';
    }
    if(filter.mobile!=''){
        findmatch += ' AND mobile ="'+filter.mobile+'"';
    }
    Master.searchmaster(findmatch,position,pageSize, function (err, contacts_data) {
        if(err){
        }
        res.status(200).send({'payload':contacts_data}); 
    })

}); 


router.post('/totalmaster', function (req, res) {
    const filter = req.body.filter;
    findmatch = 'where 1=1'
    if(filter.city!=''){
        findmatch += ' AND city ="'+filter.city+'"';
    }
    if(filter.pincode!=''){
        findmatch += ' AND Pincode ="'+filter.pincode+'"';
    }
    if(filter.mobile!=''){
        findmatch += ' AND mobile ="'+filter.mobile+'"';
    }
    Master.totalmaster(findmatch, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
             res.status(200).send({ "data": rows });
         }
 
     })
 })


 router.post('/citycount', function (req, res) {
    const filter = req.body.filter;
    
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    Master.to(position,pageSize, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
            res.status(200).send({'payload':rows}); 
        }
 
     })
 })


 router.post('/citycountlist', function (req, res) {
    Master.data(req.body, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
             res.status(200).send({ "data": rows.length});
         }
 
     })
 })

 router.post('/citycountlisttop10', function (req, res) {
    Master.datacount(req.body, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
             res.status(200).send({ "data": rows});
         }
 
     })
 })

 router.post('/pincountlisttop10', function (req, res) {
    Master.pincodecount(req.body, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
             console.log(rows.length)
             res.status(200).send({ "data": rows});
         }
 
     })
 })

 router.post('/pincodecount', function (req, res) {
    const filter = req.body.filter;
    
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    console.log(position)
    console.log(pageSize)
    Master.topincode(position,pageSize, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
            res.status(200).send({'payload':rows}); 
        }
 
     })
 })

 router.post('/pincountlist', function (req, res) {
    Master.pindata(req.body, function (err, rows) {
         if (err) {
             console.log(err);
         }
         else {
             res.status(200).send({ "data": rows.length});
         }
 
     })
 })

 


module.exports = router;