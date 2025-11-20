import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"

const SALT_ROUNDS = 10

export const authService = {
    signup,
    login,
    refresh,
    createTokens,
}

export async function signup({email, password, fullname}){
    const collection = await dbService.getCollection('user')

    if (!password || !fullname || !email) throw new Error("Missing required fields")

    const existingUser = await collection.findOne({ email })

    if (existingUser) throw new Error('Email already exists')

    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    
    const userToSave = {
        fullname,
        email,
        password: hash,
        createdAt: Date.now(),
    }

    const { insertedId } = await collection.insertOne(userToSave)

    const cleanUser = {
        _id: insertedId,
        email: userToSave.email,
        fullname: userToSave.fullname,
        createdAt: userToSave.createdAt,
    }

    const { accessToken, refreshToken } = createTokens(cleanUser)

    return { user: cleanUser, accessToken, refreshToken }
}

export async function login({email, password}){
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ email })

    if (!user) throw new Error("User not found")

    const isMatch = await bcrypt.compare(password, user.password) 
    if (!isMatch) throw new Error("Incorrect password")
    
    const cleanUser = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        createdAt: user.createdAt
    }

    const { accessToken, refreshToken } = createTokens(cleanUser)

    return { user: cleanUser, accessToken, refreshToken }
}

export async function refresh(oldRefreshToken){
    let decoded
    try {
        decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
        throw new Error("Invalid refresh token")
    }

    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: new ObjectId(decoded._id)})
    if (!user) throw new Error('User not found')
        
    const cleanUser = {
        _id: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        createdAt: user.createdAt,
    }

    const { accessToken, refreshToken: newRefreshToken } = createTokens(cleanUser)
    return { user: cleanUser, accessToken, refreshToken: newRefreshToken }
}

function createTokens(user) {
    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    return { accessToken, refreshToken }
}