import mongoose from 'mongoose'

const { Schema } = mongoose

const ssvStatusSchema = new Schema({
    id: { type: String, required: true },
    chatId: { type: [String], required: true },
    status: { type: String, default: "Inactive" },
    name: { type: String, default: "SSV node" }
})
export const ssvStatus = mongoose.model('ssvStatus_V2_test', ssvStatusSchema)


const idsFaucetSchema = new Schema({
    id: { type: String, required: true},
    ping: {type: Boolean, default: false}
})
export const ssvFaucet = mongoose.model(('ssvFaucet_v2'), idsFaucetSchema )