import {Schema} from 'mongoose'
import WeaponTelemetry from './telemetryWeaponRecord'
import RangeTelemetry from './telemetryPlayerRanges'

const Telemetry = new Schema({
    name:            String,
    accountId:       String,
    name:            String,
    mode:            String,
    perspective:     String,
    map:             String,
    teamId:          Number,
    kills:           Number,
    shamefurDisplay: Boolean,
    matchId:         String,
    weapons:         [WeaponTelemetry],
    ranges:          RangeTelemetry
})

export default Telemetry