const express = require("express");
const expstatic = require("express-static");
const bodyParser = require("body-parser");
const setting = require("./libs/setting");
const MongoUtil = require("./libs/mongoUtil");
const dbutil = new MongoUtil(setting.host, setting.port, setting.dbname);
const ObjectId = require("mongodb").ObjectId;

const server = express();
server.listen(1900);

server.use(bodyParser.urlencoded({
	extended: false
}));

server.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

	next();
});

// 本接口负责返回当前的轮播图的信息
server.use("/carousel/list", function(req, res) {
	dbutil.find({}, {}, "carousel", function(err, result) {
		if(err) throw err;
		res.send({
			errno: 0,
			data: result
		}).end();
	})
});

//查找热门电影
server.use("/hot/list/:cnt", function(req, res) {
	let count = parseInt(req.params.cnt);
	dbutil.find({}, {
		sort: {
			score: -1
		},
		limit: count
	}, "movies", function(err, result) {
		if(err) throw err;
		res.send({
			errno: 0,
			data: result
		}).end();
	})
});

//查询热门预告片
server.use("/notice/list", function(req, res) {
	dbutil.find({}, {}, "notice", function(err, result) {
		if(err) throw err;
		res.send({
			errno: 0,
			data: result
		}).end();
	})
});

//查询猜你喜欢的电影---随机
server.use("/ulike/list", function(req, res) {
	dbutil.find({}, {}, "movies", function(err, result) {
		if(err) throw err;
		let target = [];
		if(result.length > 5) {
			for(var i = 0; i < 5;) {
				let index = parseInt(Math.random() * result.length);
				if(target.indexOf(result[index]) == -1) {
					target.push(result[index]);
					i++;
				}
			}
		}
		else{
			target = result;
		}

		res.send({
			errno: 0,
			data: target
		}).end();
	})
});

//静态资源：轮播图的图片等文件的处理
server.use(expstatic(__dirname + "/resource"));