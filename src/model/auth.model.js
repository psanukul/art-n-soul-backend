import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    }
});

// Pre-save middleware to hash the password
authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if the password is correct
authSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to generate JWT access token
authSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10d' }
    );
};

export const authModel = mongoose.model('auth', authSchema, 'auth')