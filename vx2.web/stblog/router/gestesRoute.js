const con = require('../mysql/mysql');
const util = require('util');
var gestesRoute = function(app, urlencodeParser) {
    app.post("/title", urlencodeParser, function(req, res) {
        console.log(req.body);
        var k = {
            ad: "ok",
            kk: "jj"
        }
        res.send(k);
    });
    //获取分类与标题
    app.get('/gestesTitle', urlencodeParser, function(req, res) {
        con.query(`SELECT title_tb.id as title_id,
            title_tb.title as title,
            content_tb.id as content_id,
            content_tb.content_title as content
            FROM stblog.title_tb left join
            stblog.content_tb on title_tb.id = content_tb.title_tb_id
            order by title_tb.createDate ASC`,
            function(data) {                               //将查询结果转换成数组对象
                let temp = [];
                data.forEach(function(value, index, data) {
                    if(temp.every(function(tempvalue){
                       return tempvalue.title_id != value.title_id;
                    })) {
                        temp.push({title_id:value.title_id,title:value.title,children:[]});
                    }
                    if(value.content_id) {
                        temp.forEach(function(tempvalue, tempindex, temp) {
                            if(value.title_id == tempvalue.title_id) {
                               temp[tempindex].children.push( {
                            content_id:value.content_id,
                            content:value.content
                            }); 
                            }
                        })   
                    }
                });
          
              console.log("d："+util.inspect(temp,true))  
          res.send(temp);
        });
    });
    //获取内容信息
    app.get('/gestesContent', urlencodeParser, function(req, res) {
        let params=[];
        params.push(req.query.contentId);
         console.log("req.query: "+JSON.stringify(req.query));
        con.queryParams(`SELECT content_tb.content_title as title,content_tb.content FROM stblog.content_tb where content_tb.id = ?`,
                        params,
                        function (data) {
                            res.send(data);
                        }
                        );
    });
}
module.exports = gestesRoute;