var url = process.env.DB
var dbName = 'fcc-issuetracker'
var collName = 'issues'
var mongo=require('mongodb').MongoClient
var {ObjectId} = require('mongodb')

var populateNewRec=function(req) {
  var newRec = {} 
  
  newRec.project = req.params.project
  newRec.issue_title=req.body.issue_title
  newRec.issue_text = req.body.issue_text
  newRec.created_by = req.body.created_by
  newRec.assigned_to = req.body.assigned_to
  newRec.status_text = req.body.status_text
  newRec.created_on=(new Date()).toString()
  newRec.updated_on=(new Date()).toString()
  newRec.open=true
  return newRec
} 

exports.delete = function(req,res){
  
  if (req.body._id=='' || req.body._id==undefined) {
    res.send('_id error')
  } else {
    
    mongo.connect(url,function(err,db) {
    if (err) {
      res.send(JSON.stringify(err))
    } else {
      //console.log(db)
      var dbo=db.db(dbName)
      var coll = dbo.collection(collName)
      coll.remove({_id:ObjectId(req.body._id)},function(err,data){
        if (err ) {
          console.log('Error:'+err)
          res.send('error updating '+req.body._id)
        } else if (data.result.n==0) {
          console.log(data)
          res.send('could not update '+req.body._id)
        } else {
          res.send('successfully updated')
        }
      db.close()    
    })
    }   
  })
  }
}


exports.post = function(req,res){
  
  var newRec = populateNewRec(req)
  //console.log(newRec)
  if (newRec.issue_title == undefined ||
      newRec.issue_text == undefined ||
      newRec.created_by == undefined) {
    res.send('required fields missing')
  } else {
  mongo.connect(url,function(err,db) {
  if (err) {
  console.log(err)
    res.send(JSON.stringify(err))
  } else {
    
    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    
    coll.insert(newRec,function(err,data) {
    if (err) {
      console.log('Error:'+err)
    } 
    
    db.close()
    res.send(newRec)
    })
  }
  })
  }
}

exports.put = function(req,res){
  
  //console.log(req.body)
  if ((req.body.issue_title=='' || req.body.issue_title==undefined) &&
    (req.body.issue_text=='' || req.body.issue_text==undefined) &&
    (req.body.created_by=='' || req.body.created_by==undefined) &&
    (req.body.assigned_to=='' || req.body.assogmed_to==undefined) &&
    (req.body.open==null || req.body.open==false || req.body.open==undefined) &&
    (req.body.status_text=='' || req.body.status_text==undefined)) {
    res.send('no updated field sent')
  } else { 
  var newRec = populateNewRec(req)
  //console.log(newRec)
  mongo.connect(url,function(err,db) {
  if (err) {
    console.log(err)
    res.send(JSON.stringify(err))
  } else {
    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    newRec.updated_on=(new Date()).toString()
    
    newRec.open=req.body.open

    coll.update({_id:req.body._id},newRec,function(err,count) {
      
      //console.log(count)

      if (err ) {
        console.log('Error:'+err)
        res.send('could not update '+req.body._id)
      } else if (count.n==0) {
        res.send('id not found '+req.body._id)
      
      } else {
        //console.log('Rec:'+JSON.stringify(newRec))
        res.send('successfully updated')
      }
      db.close()    
      
    })
  }             
})}
}
    

exports.get = function(req,res){
  // collect params for search
  var params = req.params
  if (req.body.issue_title!==undefined){params.issue_title=req.body.issue_title}
  if (req.body.issue_text!==undefined){params.issue_text = req.body.issue_text}
  if (req.body.created_by!==undefined){params.create_by = req.body.created_by}
  if (req.body.assigned_to!==undefined){params.assigned_to = req.body.assigned_to}
  if (req.body.status_text!==undefined){params.status_text = req.body.status_text}
  if (req.body.created_on!==undefined){params.create_on=req.body.created_on}
  if (req.body.updated_on!==undefined){params.updated_on=req.body.updated_on}
  if (req.body.open!==undefined){params.open=req.body.open}
  //console.log(req)
  //console.log(params)
  
  mongo.connect(url,function(err,db) {
  if (err) {res.send(JSON.stringify(err))
  } else {

    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    coll.find(params).toArray(function(err,docs){
      if (err) {res.send(JSON.stringify(err))
      }  else {
        res.send(docs)
      }
      db.close()
    })
  }
})
}
  


