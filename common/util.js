class Util {
    handlePageError(res, e) {
        res.setStatus(500).send(e.message);
    }
}

module.exports = new Util();