/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var route = require('./routecontroller.js')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
    route.get(req,res)      
    })
    
    .post(function (req, res){
      route.post(req,res)
    })
    
    .put(function (req, res){
      route.put(req,res)
    })
    
    .delete(function (req, res){
      route.delete(req,res)
    });
    
};
