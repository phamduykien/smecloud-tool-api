
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const RedisServerSchema = new Schema(
    {
        count: Number,
        host: String,
        port: Number
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)
module.exports = mongoose.model('redis_server', RedisServerSchema, 'redis_server')