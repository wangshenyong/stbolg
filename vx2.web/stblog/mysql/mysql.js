const mysql = require('mysql');
// mysql连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    databases: 'stblog'
});

function con_mysql() {

    var con = {
        // 无参数据查询
        query: function(sql, goback) {
            connection.query(sql, function(err, result) {
                if (err) {
                    console.log("查询失败: " + sql);
                    console.log(err.message);
                } else {
                    goback(result);
                }
            });
        },
        queryParams: function(sql, params, goback) {
            connection.query(sql, params,
                function(err, result) {
                    if (err) {
                        console.log("带参查询失败: " + sql);
                        console.log(err.message);
                    } else {
                        goback(result)
                    }
                });
        },
       updateParams: function(sql, params, goback) {
            connection.query(sql, params, function(err, result) {
                if(err) {
                    console.log('更新操作失败: '+ sql);
                    console.log(err.message);
                } else {
                    goback(result);
                }
            })
       },
       insertParams: function(sql, params, goback) {
        connection.query(sql, params, function(err, result) {
            if(err) {
                console.log('插入操作失败: '+ sql);
                console.log(err.message);
            } else {
                goback(result);
            }
        });
       }
    }
    return con;
}
module.exports = con_mysql();