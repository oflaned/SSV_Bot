import mongoose from 'mongoose'
const { Schema } = mongoose

const ssvStatusSchema = new Schema({
    id: { type: String, required: true },
    chatId: { type: [String], required: true },
    status: { type: String, default: "Inactive" },
    name: { type: String, default: "SSV node" }
})

export const ssvStatus = mongoose.model('ssvStatus_V2', ssvStatusSchema)
