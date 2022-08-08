import mongoose from 'mongoose'
const { Schema } = mongoose

const ssvStatussSchema = new Schema({
    address: { type: String, required: true },
    chatId: { type: [String], required: true },
    status: { type: String, default: "Inactive" },
    name: { type: String, default: "SSV node" }
})

export const ssvStatus = mongoose.model('ssvStatuss', ssvStatussSchema)
