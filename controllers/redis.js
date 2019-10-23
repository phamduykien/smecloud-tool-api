
const express = require('express')
const redis = require('redis')
const Util = require('../common/util')
const RedisServer = require('../models/redis_server')

const router = express.Router();
const opts = {
    host: '127.0.0.1',
    port: 6379
};
const client = redis.createClient(opts);

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
 * Lay cac cau hinh server
 * CreatedBy PDKIEN 21/10/2019
 */
router.get('/key/:id?', async (req, res) => {
    try {
        let id = req.params["id"];
        if (id) {
            //Lay thong tin server voi id tu trong db mongo
            let server = await RedisServer.findById(id);
            if (server) {
                let opt = { host: server.host, port: server.port }, client = redis.createClient(opt);
                client.keys("*", (err, arr) => {
                    if (err) {
                        Util.handlePageError(res, e)
                    } else {
                        res.send(arr);
                    }
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

        return res.send({
            message: 'Created new RedisServer config successfully!',
            data: server
        })
    } catch (e) {
        return Util.handlePageError(res, e)
    }
});

module.exports = router;