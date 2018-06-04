var url = process.env.DB
var dbName = 'fcc-issuetracker'
var collName = 'issues'
var mongo=require('mongodb').MongoClient

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
  
  if (req.body._id=='') {
    res.send('_id error')
  } else {
    
    mongo.connect(url,function(err,db) {
    console.log(err)
    if (err) {
      res.send(JSON.stringify(err))
    } else {

      //console.log(db)
      var dbo=db.db(dbName)
      var coll = dbo.collection(collName)
      var result=coll.remove({_id:req.body._id},function(err,data){
        console.log(data['result']['n'])
      
        if (err ) {
          console.log('Error:'+err)
          res.send('could not update '+req.body._id)
        } else if (data['result']['n']==0) {
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
  
  mongo.connect(url,function(err,db) {
  console.log(err)
  if (err) {
    res.send(JSON.stringify(err))
  } else {
    
    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    
    coll.insert(newRec,function(err,data) {
    if (err) {
      console.log('Error:'+err)
    } else {
      console.log('NewRec:'+JSON.stringify(newRec))
    }
    
    db.close()
    res.send(newRec)
    })
  }
  
  
})
}

exports.put = function(req,res){
  
  console.log(req.body)
  if ((req.body.issue_title=='') &&
    (req.body.issue_text=='') &&
    (req.body.created_by=='') &&
    (req.body.assigned_to=='') &&
    (req.body.open==null || req.body.open==false) &&
    (req.body.status_text=='')) {
    res.send('no updated field sent')
  } else { 
    

  var newRec = populateNewRec(req)

  mongo.connect(url,function(err,db) {
  console.log(err)
  if (err) {
    res.send(JSON.stringify(err))
  } else {

    //console.log(db)
    var dbo=db.db(dbName)
    var coll = dbo.collection(collName)
    newRec.updated_on=(new Date()).toString()
    newRec.open=req.body.open

    coll.update({_id:req.body._id},newRec,function(err,count) {
      var cnt=JSON.parse(count)
      console.log(cnt.n)
      
      if (err ) {
        console.log('Error:'+err)
        res.send('could not update '+req.body._id)
      } else if (cnt.n==0) {
        res.send('could not update '+req.body._id)
      
      } else {
        console.log('Rec:'+JSON.stringify(newRec))
        res.send('successfully updated')
      }
      db.close()    
      
    })
  }             
})}
}
    

    


exports.get = function(req,res){
  
  mongo.connect(url,{useNewUrlParser:true},function(err,db) {
  if (err) {res.send(JSON.stringify(err))} 

  var dbo=db.db(dbName)
  var coll = dbo.collection(collName)
  /*  coll.find({urlNum:urlNum}).toArray(function(err,docs){
          if (err) {response.send(JSON.stringify(err))}
      console.log(docs)
          var result=""
          if (docs.length>0) {
            result=docs[0].url
            console.log(result)    
          }
          db.close()
         })
  */
  })
  
}
  


