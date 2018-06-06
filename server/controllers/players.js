import Player from '../models/player'
import MatchRecord from '../models/matchRecord'
import TelemetryRecord from '../models/telemetry'
import AggregateQuery from '../queries/aggregate'
import qs from 'qs'

export default class PlayerController {
    /**
     * path: /player
     * params: player=Comma,Delimited,String,Of,Names
     * query:
     *  map = Map (Miramar/Erangel)
     *  mode = solo/duo/squad
     *  perspective = fpp/tpp
     * @param {*} ctx 
     * @param {*} next 
     */
    async get(ctx, next) {
        const query    = AggregateQuery.slice(0)
        const uriqs    = ctx.request.querystring
        const parsedQs = qs.parse(uriqs)
        const {
            player,
            page,
            pageSize
        } = ctx.params.player


        if (player) {
            query[0].$match.name.$in = player.split(',')
        } else {
            query[0].$match = {}
        }

        if(parsedQs.map) {
            query[0].$match.map = parsedQs.map.toLowerCase() === 'miramar' ? 'Desert' : 'Erangel'
        }
        
        if(parsedQs.mode) {
            query[0].$match.mode = parsedQs.mode
        }

        if(parsedQs.perspective) {
            query[0].$match.perspective = parsedQs.perspective
        }

        if(!player) {
            query.push({
                $skip: (pageSize || 25) * (page || 0)
            })
            query.push({
                $limit: (pageSize || 25)
            })

            if(Object.keys(query[0].$match).length === 0) {
                query = query.slice(1)
            }
        }
        const playerData = await TelemetryRecord.aggregate(query)

        // clear the cache because js refuses to let go of the damn array
        // look into immutable.js`
        query[0].$match = {name: {$in: []}}

        ctx.body = playerData.shift();
    }
}