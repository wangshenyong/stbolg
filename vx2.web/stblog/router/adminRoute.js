const con = require('../mysql/mysql');
const util = require('util');
const adminRoute = function(app, urlencodeParser) {
    // 获取分组与标题
    app.get('/admin', urlencodeParser, function(req, res) {
        let sql = `SELECT title_tb.id as title_id,
            title_tb.title as title,
            content_tb.id as content_id,
            content_tb.content_title as content
            FROM stblog.title_tb left join
            stblog.content_tb on title_tb.id = content_tb.title_tb_id
            order by title_tb.createDate ASC`,
            params = [];
        con.queryParams(sql, params, function(data) {
            let temp = [];
            data.forEach(function(value, index, data) {
                if (temp.every(function(tempvalue) {
                        return tempvalue.title_id != value.title_id;
                    })) {
                    temp.push({ title_id: value.title_id, title: value.title, children: [] });
                }
                if (value.content_id) {
                    temp.forEach(function(tempvalue, tempindex, temp) {
                        if (value.title_id == tempvalue.title_id) {
                            temp[tempindex].children.push({
                                content_id: value.content_id,
                                content: value.content
                            });
                        }
                    })
                }
            });

            console.log("d：" + util.inspect(temp, true))
            res.send(temp);
        });
    });
    // 新建分类并且创立内容
    app.post('/admin/postTitleCon', urlencodeParser, function(req, res) {
        // 插入标题
        let sql = `INSERT INTO stblog.title_tb 
		(title, createDate, changeDate, changeUser, owerUser, jurisdiction) 
		VALUES (?, ?, ?, ?, ?, ?)`,
        params;
        console.log("post: " + util.inspect(req.body))

        // params.push(req.body.title);
        let date = new Date();
        let dateFormat = date.getFullYear();
        dateFormat = dateFormat + '/'+ (parseInt(date.getMonth())+1);
        dateFormat = dateFormat+ '/'+ parseInt(date.getDate());
        // params.push(dateFormat);
        // params.push(dateFormat);
        // params.push('236');
        // params.push('124');
        // params.push('19');
        params = [req.body.title, dateFormat, dateFormat, '236', '123', '19'];
        //将标题插入数据库
        con.insertParams(sql, params, function(data) {
            if (data.error) {
                res.send('error');
            } else {
                // 数据库中title_id表的id
                params = [];
                params.push(req.body.title);
                sql = `SELECT title_tb.id FROM stblog.title_tb where title_tb.title = ?`;

                con.queryParams(sql, params, function(data) {
                    //将内容插入数据库
                    if (data && data.length == 1) {
                    	// params = [];

                    	// params.push(data[0].id);
                    	// params.push(dateFormat);
                    	// params.push(dateFormat);
                    	// params.push(req.body.content);
                    	// params.push('129');
                    	// params.push(req.body.content_title);
                    	params = [data[0].id, dateFormat, dateFormat, req.body.content, '129',req.body.content_title];
                    	sql = `INSERT INTO stblog.content_tb 
                    	(title_tb_id, createDate, changeDate, content, jurisdiction, content_title)
                    	 VALUES (?, ?, ?, ?, ?, ?)`;
                        con.insertParams(sql, params, function(data) {
                        	res.send('success');
                        });
                    }
                });
            }
        });

    });
    // 更新内容
    app.post('/admin/updateContent', urlencodeParser, function(req, res) {
        let sql = `update stblog.content_tb  
			set content_tb.content = ? 
			where content_tb.id = ?`,
            params;
        params = [req.body.content, req.body.content_id];
        con.updateParams(sql, params, function(data) {
            if (data) {
                res.send('update success');
            } else {
                res.send('update');
            }
        })
    });
    //更新文本的标题
    app.post('/admin/changeContentTitle',urlencodeParser , function(req, res) {
    	let sql =`update stblog.content_tb set content_title = ? where id=?`,
    	params;
    	params = [req.body.title, req.body.title_id];
    	console.log('change title: '+ util.inspect(params));
    	con.updateParams(sql, params, function(data) {
    		if(data) {
    			res.send('update success');
    		} else {
    			res.send('update');
    		}
    	});
    });
}
module.exports = adminRoute;