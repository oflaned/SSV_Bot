import mongoose from 'mongoose'
const { Schema } = mongoose

const ssvStatusSchema = new Schema({
    address: { type: String, required: true },
    chatId: { type: [String], required: true },
    status: { type: String, default: "Inactive" }
})

export const ssvStatus = mongoose.model('ssvStatus', ssvStatusSchema)
