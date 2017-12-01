var mysql=require('mysql');

var pool=mysql.createPool({
	host	: 'mysql2.gear.host',
	user	:  'pardeep',
    // Use own credentials pls
//	password	: 'acedata@mysql',
    password : 'pardeep16mysql@',
	database	: 'acedatabase'

});

var getConnection = function (cb) {
    //console.log(pool);
    pool.getConnection(function (err, connection) {

        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        if(err) {
            //console.log(err);
          return cb(err);
        }
        cb(null, connection);
    });
};

module.exports=getConnection;
