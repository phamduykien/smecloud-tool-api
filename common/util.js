class Util {
    handlePageError(res, e) {
        console.log("Error " + e);
        if (!res.finished) {
            res.status(500).send(e.message);
        }
    }
}

module.exports = new Util();