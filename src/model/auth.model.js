import mongoose from 'mongoose'

const authSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
})


export const authModel = mongoose.model('auth', authSchema, 'auth')