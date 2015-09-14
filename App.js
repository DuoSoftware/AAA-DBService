/**
 * Created by Administrator on 6/26/15.
 */
var restify = require('restify');
var config = require('config');
var getDataFromRadiusDB = require('./GetDataFromRadiusDB');
var dbModel = require('AAA-DBModel');

var server = restify.createServer({
    name: 'AAA-DBService',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;
var hostVersion = config.Host.Version;



server.post('/AAA/API/User', function(req, res, next)
{
    // console.log('method starting..')
    try
    {
        //var obj=req.body;
        //console.log(req.body);
     //   var username = req.params.username;
     //   var password = req.body.password;
      //  var concurntSessions = req.params.concurntSessions;



        getDataFromRadiusDB.CreateUser(req.body,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(err.toString());
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                //res.end(JSON.stringify(result));
                res.end('true');
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.put('/AAA/API/User/Password', function(req, res, next)
{
    //  console.log('method starting..')
    try
    {
        //var obj=req.body;
        //console.log(req.body);
        //var username = req.params.username;
        //var password = req.body.password;
        // var concurntSessions = req.params.concurntSessions;



        getDataFromRadiusDB.UpdateUserPassword(req.body,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(err.toString());
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                //res.end(JSON.stringify(result));
                res.end('true');
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.put('/AAA/API/User/ConcurrentSessions', function(req, res, next)
{
    //  console.log('method starting..')
    try
    {
        //var obj=req.body;
        //console.log(req.body);
        //var username = req.params.username;
        //var password = req.body.password;
        // var concurntSessions = req.params.concurntSessions;



        getDataFromRadiusDB.UpdateUserSessionCount(req.body,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(err.toString());
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                //res.end(JSON.stringify(result));
                res.end('true');
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.get('/AAA/API/User/:username', function(req, res, next)
{
    console.log('method starting..')
    try
    {
        var username = req.params.username;

        getDataFromRadiusDB.GetUser(username,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                // res.end(result);
                console.log(err);
                res.end('false');
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.post('/AAA/API/RouterAttributes',function(req,res,next)
{
//console.log(req.body[1].KEY);

getDataFromRadiusDB.CreateRouterAttributes(req.body,function(err,resz)
{
   if(err)
   {
       console.log(err);
       res.end(err);
   }else
   {
       console.log(resz);
       res.end(resz);
   }
})

   return next();
});

server.post('/AAA/API/GroupWithAttributes',function(req,res,next)
{
//console.log(req.body[1].KEY);
getDataFromRadiusDB.hasAuthenticationType("AuthenticationType",req.body,function(err, value,group,routerAttrib)
{
   // console.log("dsdsd>>>>>>>>>>>>>>>>>>>>");
   // console.log(router);
   // console.log(group);
   // console.log(routerAttrib)

    if(err)
    {
        console.log(err);
        res.end();
    }else
    {

      //  console.log(value);
      //   console.log(group);
       //  console.log(routerAttrib);

         var authTypeObject = dbModel.radgroupcheck.build({
         // id:1,
         groupname:group,
         op:":=",
         attribute:routerAttrib,
         value:value
         });

        authTypeObject.save().then(function(resz)
         {
        // callback(undefined,resz);
             console.log(resz);

             if(resz)
             {
                 getDataFromRadiusDB.CreateGroupWithAttributes(req.body,function(err, modArr,group,router)
                 {
                     if(err)
                     {
                         console.log(err);
                         res.end(err);
                     }else
                     {
                         console.log("Array");
                         console.log(modArr);

                         dbModel.radgroupreply.bulkCreate(
                             modArr
                         ).then(function(result) { // Notice: There are no arguments here, as of right now you'll have to...

                                 var groObj= dbModel.radgroup.build(
                                     {
                                         //id:1,
                                         groupname:group,
                                         router:router
                                     });
                                 groObj.save().then(function(resz)
                                 {
                                     res.end('TRUE');

                                     //  callback(undefined,resz);
                                 }).catch(function(errz)
                                 {
                                     res.end(errz);
                                     // callback(errz,undefined);
                                 })

                             }).error(function(err){
                                 //callback(err,undefined);
                                 res.end(err);
                             })

                     }
                 })

             }
             else
             {
                 res.end();
             }

         }).catch(function(errz)
         {
             console.log(errz);
             res.end();
         //callback(errz,undefined);
         })
    }

    res.end();
})

/*
    getDataFromRadiusDB.CreateGroupWithAttributes(req.body,function(err, modArr,group,router)
    {
        if(err)
        {
            console.log(err);
            res.end(err);
        }else
        {
            console.log("Array");
            console.log(modArr);

          dbModel.radgroupreply.bulkCreate(
                modArr
            ).then(function(result) { // Notice: There are no arguments here, as of right now you'll have to...

                 var groObj= dbModel.radgroup.build(
                      {
                          //id:1,
                          groupname:group,
                          router:router
                      });
                  groObj.save().then(function(resz)
                  {
                      res.end('TRUE');

                      //  callback(undefined,resz);
                  }).catch(function(errz)
                  {
                      res.end(errz);
                     // callback(errz,undefined);
                  })

                }).error(function(err){
                    //callback(err,undefined);
                    res.end(err);
                })

        }
    })
*/
    return next();
});

server.put('/AAA/API/GroupAttribute', function(req, res, next)
{
    //  console.log('method starting..')
    try
    {

        getDataFromRadiusDB.UpdateGroupAttribute(req.body,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(err.toString());
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                //res.end(JSON.stringify(result));
                res.end('true');
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.get('/AAA/API/GroupAttributes/:groupname', function(req, res, next)
{
   //console.log('method starting..')
    try
    {
        var groupname = req.params.groupname;

        getDataFromRadiusDB.GetGroupAttributes(groupname,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                // res.end(result);
                console.log(err);
                res.end(err);
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.get('/AAA/API/GroupNamesWithRouter', function(req, res, next)
{
    //console.log('method starting..')
    try
    {
        //var groupname = req.params.groupname;

        getDataFromRadiusDB.GetGroupNamesWithRouter(function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                // res.end(result);
                console.log(err);
                res.end(err);
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.post('/AAA/API/Assign/:username/:groupname', function(req, res, next)
{
    // console.log('method starting..')
    try
    {
        //var obj=req.body;
        //console.log(req.body);
        var username = req.params.username;
        var groupname = req.params.groupname;
      //  var password = req.body.password;
      // var concurntSessions = req.params.concurntSessions;



        getDataFromRadiusDB.AssignUserToGroup(username,groupname,function (err, result)
        {
            if (err)
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(err.toString());
            }
            else
            {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                //res.end(JSON.stringify(result));
                res.end('true');
            }
        });
    }
    catch(ex)
    {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(ex);
    }

    return next();

});

server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});