import mongoose from 'mongoose'
import User from '../schemas/apiUser'

export default mongoose.model("api_user", User)