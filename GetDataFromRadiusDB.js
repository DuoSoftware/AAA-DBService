var dbModel = require('AAA-DBModel');


var GetUser = function(username, callback)
{
    try
    {
        dbModel.radcheck.find({where: [{username: username}]})
            .then(function(rest)
            {
               callback(undefined,rest);
            }).catch(function(err)
            {
                callback(err,undefined);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }
};


var CreateUser = function(strObj, callback)
{
    try
    {
       // console.log(strObj);

      //  console.log(strObj.username);
      //  console.log(strObj.password);

        if(strObj)
        {
            var userObject = dbModel.radcheck.build({
                //id:1,
                username:strObj.username,
                op:":=",
                attribute:"Cleartext-Password",
                value:strObj.password
            });

            userObject.save().then(function(res)
            {
                var userReplyObject = dbModel.radreply.build({
                    // id:1,
                    username:strObj.username,
                    op:":=",
                    attribute:"Simultaneous-Use",
                    value:strObj.concurrentSessions
                });

                userReplyObject.save().then(function(resz)
                {
                    callback(undefined,resz);
                }).catch(function(errz)
                {
                    callback(errz,undefined);
                })
            }).catch(function(err)
            {
                callback(err,undefined);
            })

        }
        else
        {
            callback(ex,undefined);
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var UpdateUserPassword = function(strObj, callback)
{
    try
    {
        // console.log(strObj);

        //  console.log(strObj.username);
        //  console.log(strObj.password);

        if(strObj)
        {
            dbModel.radcheck.update(
                {
                    value:strObj.password
                },
                {
                    where:[{username:strObj.username},{attribute:"Cleartext-Password"}]
                }

            ).then(function(result)
                {
                    if(result>0)
                    {
                      //  console.log(result);
                        callback(undefined,result)

                    }
                    else
                    {
                        callback('no record found',undefined)
                    }
                }).error(function(error)
                {
                    callback(error,undefined)
                });
        }
        else
        {
            callback(ex,undefined);
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var UpdateUserSessionCount = function(strObj, callback)
{
    try
    {
        // console.log(strObj);

        //  console.log(strObj.username);
        //  console.log(strObj.password);

        if(strObj)
        {
            dbModel.radreply.update(
                {
                    value:strObj.concurrentSessions
                },
                {
                    where:[{username:strObj.username},{attribute:"Simultaneous-Use"}]
                }

            ).then(function(result)
                {
                    if(result>0)
                    {
                       // console.log(result);
                        callback(undefined,result)

                    }
                    else
                    {
                        callback('no record found',undefined)
                    }
                }).error(function(error)
                {
                    callback(error,undefined)
                });
        }
        else
        {
            callback(ex,undefined);
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};



var CreateRouterAttributes = function(strObj, callback)
{
    try
    {
        // console.log(strObj);

        //  console.log(strObj.username);
        //  console.log(strObj.password);

        if(strObj)
        {
            var array = [];
            var key, count = 0;
            for(key in strObj) {
                var obj = {
                    router : strObj[key].ROUTER,
                    routerattribute: strObj[key].MAPVALUE,
                    attributename:strObj[key].KEY
                }
                if(strObj.hasOwnProperty(key)) {
                  //  array.push("router:'"+strObj[key].ROUTER+"',routerattribute:'"+strObj[key].MAPVALUE+"',attributename:'"+strObj[key].KEY+"'");
                  //  console.log("router: '"+strObj[key].ROUTER+"',routerattribute: '"+strObj[key].MAPVALUE+"',attributename: '"+strObj[key].KEY+"'");
                    array.push(obj);
                    count++;
                }
            }
        dbModel.routerattribute.bulkCreate(
                array
            ).then(function(result) { // Notice: There are no arguments here, as of right now you'll have to...

                    callback(undefined,'true');

            }).error(function(err){
                    callback(err,undefined);
                })
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};


var CreateGroupWithAttributes = function(grpAttribAry, callback)
{
    try
    {
        // console.log(strObj);

        //  console.log(strObj.username);
        //  console.log(strObj.password);

        if(grpAttribAry)
        {
            var arr = [];
            var key, count = 0;
            var limit = grpAttribAry.length;

            if(count >= limit)
            {
                callback(new Error('No elements in array', arr));
            }
            else
            {
               grpAttribAry.forEach(function(grpAttribObj)
                {

                        dbModel.routerattribute.find({where: [{router:grpAttribObj.ROUTER},{attributename:grpAttribObj.ATTRIBUTE},{routerattribute:{$ne:"Auth-Type"}}],attributes:['routerattribute']})
                            .then(function(rest)
                            {


                                if(rest)
                                {
                                    console.log("\n");
                                    console.log(rest.routerattribute);
                                    console.log("\n");


                                        var obj = {
                                        groupname : grpAttribObj.GROUP,
                                        attribute: rest.routerattribute,
                                        op:':=',
                                        value:grpAttribObj.VALUE
                                        }

                                        arr.push(obj);
                                        count++;

                                        if(count >= limit)
                                        {
                                        callback(undefined, arr,grpAttribObj.GROUP,grpAttribObj.ROUTER);
                                        }


                                }
                                else
                                {
                                    count++;

                                    if(count >= limit)
                                    {
                                        callback(undefined, arr,grpAttribObj.GROUP,grpAttribObj.ROUTER);
                                    }

                                }


                                // callback(undefined,rest);
                            }).catch(function(err)
                            {
                                callback(err,undefined);
                                //console.log(err);
                            });




                    //console.log(obj);
                    //console.log(array);


                });
            }

        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var hasAuthenticationType = function(AuthType,grpAttribAry,callback)
{
    var errorMsg="";
    var index=0;
   // console.log(JSON.stringify(grpAttribAry));
   // var i = null;
    for (var i = 0; i < grpAttribAry.length; i++) {

        //console.log(grpAttribAry[i].ATTRIBUTE);
        if (grpAttribAry[i].ATTRIBUTE == AuthType) {


           // console.log(AuthType);
           // console.log(grpAttribAry[i].ATTRIBUTE);
            index=i;
            dbModel.routerattribute.find({where: [{router:grpAttribAry[index].ROUTER},{attributename:AuthType}],attributes:['routerattribute']})
                .then(function(rest)
                {
                    if(rest)
                    {
                        //console.log(grpAttribAry[i].ROUTER);
                       // console.log(grpAttribAry[i].GROUP);
                       // console.log(rest.routerattribute);
                       // console.log(index);
                        //console.log(grpAttribAry[0].ROUTER);
                        callback(undefined, grpAttribAry[index].VALUE,grpAttribAry[index].GROUP,rest.routerattribute);
                    }
                    else
                    {
                        callback(new Error("AuthenticationType Not Found"),"","",undefined);

                    }


                    // callback(undefined,rest);
                }).catch(function(err)
                {
                    callback(err,"","",undefined);
                    //console.log(err);
                });



           // callback(undefined,);
            //return true;
           // console.log("AuthType");
        }
        else
        {
          errorMsg="AuthenticationType Not Found in Array";
           if(grpAttribAry.length == i+1 )
           {
              // console.log("HIT");
               callback(new Error(errorMsg),"","",undefined);
           }

           // callback(new Error("AuthenticationType Not Found in Array"),"","",undefined);
        }
    }


};


var UpdateGroupAttribute = function(grpAttribObj, callback)
{
    try
    {

        if(grpAttribObj)
        {
            dbModel.routerattribute.find({where: [{router:grpAttribObj.ROUTER},{attributename:grpAttribObj.ATTRIBUTE}],attributes:['routerattribute']})
                .then(function(rest)
                {
                    if(rest) {

                        if(grpAttribObj.ATTRIBUTE=="AuthenticationType")
                        {
                            dbModel.radgroupcheck.update(
                                {
                                    value: grpAttribObj.VALUE
                                },
                                {
                                    where: [{groupname: grpAttribObj.GROUP}, {attribute: rest.routerattribute}]
                                }
                            ).then(function (result) {
                                    if (result > 0) {
                                        // console.log(result);
                                        callback(undefined, result)

                                    }
                                    else {
                                        callback(new Error('no record found'), undefined)
                                    }
                                }).error(function (error) {
                                    callback(error, undefined)
                                });

                        }
                        else
                        {
                        dbModel.radgroupreply.update(
                            {
                                value: grpAttribObj.VALUE
                            },
                            {
                                where: [{groupname: grpAttribObj.GROUP}, {attribute: rest.routerattribute}]
                            }
                        ).then(function (result) {
                                if (result > 0) {
                                    // console.log(result);
                                    callback(undefined, result)

                                }
                                else {
                                    callback(new Error('no record found'), undefined)
                                }
                            }).error(function (error) {
                                callback(error, undefined)
                            });
                        }
                    }
                    else
                    {
                        callback(new Error('EMPTY'),undefined)
                    }

                }).catch(function(err)
                {
                    callback(err,undefined);
                   // console.log(err);
                });

        }
        else
        {
            callback(ex,undefined);
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};

var GetGroupAttributes = function(group, callback)
{
    try
    {
        dbModel.radgroup.find({where: [{groupname:group}],attributes:['router']})
            .then(function(result)
            {
               if(result) {
                   dbModel.radgroupreply.findAll({where: [{groupname: group}]})
                       .then(function (AttributeAry) {
                           // callback(undefined,rest);
                           console.log(JSON.stringify(AttributeAry));

                           var arr = [];
                           var key, count = 0;
                           var limit = AttributeAry.length;

                           if (count >= limit) {
                               callback(new Error('No elements in array', arr));
                           }
                           else {
                               AttributeAry.forEach(function (grpAttribObj) {
                                   //console.log('grpAttribObj : ' + JSON.stringify(grpAttribObj));

                                   dbModel.routerattribute.find({
                                       where: [{router: result.router}, {routerattribute: grpAttribObj.attribute}],
                                       attributes: ['attributename']
                                   })
                                       .then(function (rest) {
                                           //console.log('error :'+ err);
                                           //onsole.log('error :'+ rest);
                                           //console.log(rest.routerattribute);
                                           //  console.log(grpAttribAry[key].ATTRIBUTE);
                                           //  console.log(rest.routerattribute);
                                           //  console.log(grpAttribAry[key].VALUE);

                                           if (rest) {

                                               var obj = {
                                                   groupname: grpAttribObj.groupname,
                                                   attribute: rest.attributename,
                                                   op: grpAttribObj.op,
                                                   value: grpAttribObj.value
                                               }

                                               arr.push(obj);
                                               count++;

                                               if (count >= limit) {
                                                   console.log(arr);
                                                   callback(undefined, arr);
                                               }


                                           }
                                           else {
                                               count++;

                                               if (count >= limit) {
                                                   callback(undefined, arr);
                                               }

                                           }


                                           // callback(undefined,rest);
                                       }).catch(function (err) {
                                           callback(err, undefined);
                                           //console.log(err);
                                       });
                                   //console.log(obj);
                                   //console.log(array);


                               });

                           }

                       }).catch(function (err) {
                           callback(err, undefined);
                           // console.log(err);
                       });
               }

               else
               {
                   callback("group not found", undefined);
               }
               // console.log(result.router) ;

            }).catch(function (err) {
                callback(err, undefined);
                // console.log(err);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }
};


var GetGroupNameswithRouter = function(callback)
{
    try
    {
        dbModel.radgroup.findAll({where:[{}],attributes:['groupname','router']})
      // dbModel.radgroup.find({where: [{groupname:group}],attributes:['router']})
            .then(function(rest)
            {
                callback(undefined,rest);
            }).catch(function(err)
            {
                callback(err,undefined);
            });

    }
    catch(ex)
    {
        callback(ex, undefined);
    }
};

var AssignUserToGroup = function(username,groupname, callback)
{
    try
    {
        // console.log(strObj);

        //  console.log(strObj.username);
        //  console.log(strObj.password);

        if(username && groupname)
        {
            dbModel.radcheck.find({where: [{username:username},{attribute:'Cleartext-Password'}],attributes:['username']})
                .then(function(result)
                {
                    //callback(undefined,rest);
                   // console.log(result.username);
                    if(result)
                    {
                        dbModel.radgroup.find({where: [{groupname:groupname}],groupname:['groupname']})
                            .then(function(result)
                            {
                                //console.log(result.groupname);

                                if(result)
                                {

                                var userGroupObject = dbModel.radusergroup.build({
                                    //id:1,
                                    username:username,
                                    groupname:groupname,
                                    priority:"1"
                                    // value:strObj.password
                                });

                                userGroupObject.save().then(function(res)
                                {
                                    callback(undefined,"true");
                                }).catch(function(err)
                                {
                                    callback(err,undefined);
                                })


                                }
                                else
                                {
                                    callback("Group Not Found",undefined);
                                }

                            }).catch(function(err)
                            {
                                callback("Group Not Found",undefined);
                                //  callback(err,undefined);
                            });
                    }
                    else
                    {
                        callback("User Not Found",undefined);
                    }
                }).catch(function(err)
                {
                    callback("User Not Found",undefined);
                  //  callback(err,undefined);
                });

            //console.log



        }
        else
        {
            callback(ex,undefined);
        }

    }
    catch(ex)
    {
        callback(ex, undefined);
    }

};


module.exports.GetUser = GetUser;
module.exports.CreateUser = CreateUser;
module.exports.UpdateUserPassword = UpdateUserPassword;
module.exports.UpdateUserSessionCount = UpdateUserSessionCount;
module.exports.CreateRouterAttributes = CreateRouterAttributes;
module.exports.CreateGroupWithAttributes = CreateGroupWithAttributes;
module.exports.UpdateGroupAttribute= UpdateGroupAttribute;
module.exports.GetGroupAttributes= GetGroupAttributes;
module.exports.GetGroupNamesWithRouter= GetGroupNameswithRouter;
module.exports.AssignUserToGroup= AssignUserToGroup;
module.exports.hasAuthenticationType= hasAuthenticationType;