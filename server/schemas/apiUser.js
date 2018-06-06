import {Schema} from 'mongoose'

const ApiUser = new Schema({
    user:   String,
    secret: String,
    active: {
        type:    Boolean,
        default: true
    },
    limit: {
        type:    Number,
        default: 10
    }
})

export default ApiUser