
const express = require('express')
const redis = require('redis')
const Util = require('../common/util')
const RedisServer = require('../models/redis_server')

const router = express.Router();

const opt = {
    host: '127.0.0.1',
    port: 6379,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ENOTFOUND') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server not found');
        }
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return 10;
    }
}
const client = redis.createClient(opt);

/**
 * Lay tat ca key
 * CreatedBy PDKIEN 21/10/2019
 */
router.get('/all', function (req, res, next) {
    client.keys("*", (err, arr) => {
        let count = arr;
    });
});
router.post('/', function (req, res, next) {
    let data = req.body;
    if (typeof (data) == "object") {
        let key = data["key"], value = data["value"];
        client.set(key, value, (err, result) => {
            res.sendStatus(200);

        });
    }

});

/**
 * Lay cac cau hinh server
 * CreatedBy PDKIEN 21/10/2019
 */
router.get('/server', async (req, res) => {
    try {

        let servers = await RedisServer.find({});
        res.send(servers);

    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

/**
 * Lay danh sach key theo trong mot server
 * CreatedBy PDKIEN 21/10/2019
 */
router.get('/keys/:id?', async (req, res) => {
    try {
        let id = req.params["id"];
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                opt.host = server.host;
                opt.port = server.port;
                let client = redis.createClient(opt);
                client.on("error", function (err) {
                    Util.handlePageError(res, err);
                });
                client.keys("*", (err, arr) => {
                    if (err) {
                        Util.handlePageError(res, err)
                    } else {
                        res.send(arr);
                    }
                    client.quit();
                });

            }
        }
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

/**
 * Lay mot cache item theo key
 */
router.get('/item/:id/:key', async (req, res) => {
    try {
        let id = req.params["id"], key = req.params["key"];
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                opt.host = server.host;
                opt.port = server.port;
                let client = redis.createClient(opt);
                client.on("error", function (err) {
                    Util.handlePageError(res, err);
                });
                client.get(key, (err, item) => {
                    if (err) {
                        Util.handlePageError(res, err)
                    } else {
                        res.send(item);
                    }
                    client.quit();
                });

            }
        }
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});
/**
 * Them mot cache item
 */
router.post('/item/:id/', async (req, res) => {
    try {
        let id = req.params["id"], payload = req.body;
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                opt.host = server.host;
                opt.port = server.port;
                let client = redis.createClient(opt);
                client.on("error", function (err) {
                    Util.handlePageError(res, err);
                });
                client.set(payload.key, payload.value, (err, item) => {
                    if (err) {
                        Util.handlePageError(res, err)
                    } else {
                        res.send(item);
                    }
                    client.quit();
                });

            }
        }
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});
/**
 * Sua 1 cache item
 */
router.put('/item/:id/:key', async (req, res) => {
    try {
        let id = req.params["id"], key = req.params["key"], payload = req.body, value = payload.data;
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                opt.host = server.host;
                opt.port = server.port;
                let client = redis.createClient(opt);
                client.on("error", function (err) {
                    Util.handlePageError(res, err);
                });
                client.set(key, value, (err, item) => {
                    if (err) {
                        Util.handlePageError(res, err)
                    } else {
                        res.send(item);
                    }
                    client.quit();
                });

            }
        }
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

/**
 * Xoa 1 cache item
 */
router.delete('/item/:id/:key', async (req, res) => {
    try {
        let id = req.params["id"], key = req.params["key"];
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                opt.host = server.host;
                opt.port = server.port;
                let client = redis.createClient(opt);
                client.on("error", function (err) {
                    Util.handlePageError(res, err);
                });
                client.del(key, (err, item) => {
                    if (err) {
                        Util.handlePageError(res, err)
                    } else {
                        res.send("Ok");
                    }
                    client.quit();
                });

            }
        }
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

/**
 * Them mot cau hinh server
 * CreatedBy PDKIEN 21/10/2019
 */
router.post('/server', async (req, res) => {
    try {
        const server = await new RedisServer(req.body).save()
        payload
        return res.send({
            message: 'Created new RedisServer config successfully!',
            data: server
        })
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

module.exports = router;