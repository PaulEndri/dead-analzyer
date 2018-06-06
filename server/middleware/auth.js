import User from '../models/user'
import atob from 'atob'
/**
 * @todo Incorporate logic to bypass requests from the same machine
 * @param {*} ctx 
 * @param {*} next 
 */
const AuthMiddleware = async (ctx, next) => {
    try {
        const key    = ctx.get('authorization')
        const values = atob(key.toLowerCase().replace('basic ', '')).split(':')
        const user   = await User.find({
            secret: values[1],
            user:   values[0],
            active: true
        })

        if (user === null) {
            throw new Error("Authentication failed")
        }

        return await next()
    } catch(e) {
        console.log(e)
        ctx.throw(400, "Authentication failed")
    }

}
export default AuthMiddleware