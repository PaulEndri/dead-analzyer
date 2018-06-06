import {Schema} from 'mongoose'

const RangeTelemetry = new Schema({
    cqc:    Number,
    short:  Number,
    medium: Number,
    long:   Number
}, {_id: false})

export default RangeTelemetry