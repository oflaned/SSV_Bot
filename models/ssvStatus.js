import mongoose from 'mongoose'

const { Schema } = mongoose

const ssvStatusSchema = new Schema({
    id: { type: String, required: true },
    chatId: { type: [String], required: true },
    status: { type: String, default: 'Inactive' },
    name: { type: String, default: 'SSV node' },
    performance: { type: Object, default: { '24h': -1, '30d': -1 } },
    validators_count: { type: Number, default: -1 },
})
export const ssvStatus = mongoose.model('ssvStatus_V2_tests', ssvStatusSchema)

const idsFaucetSchema = new Schema({
    id: { type: String, required: true },
    ping: { type: Boolean, default: false },
})
export const ssvFaucet = mongoose.model('ssvFaucet_v2_test', idsFaucetSchema)

const chatIdsSchema = new Schema({
    chatId: { type: String, required: true },
})
export const ssvChatIds = mongoose.model('ChatIds_tests', chatIdsSchema)
