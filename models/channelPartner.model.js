const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const channelPartnerSchema = new Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    agencyName: { type: String, required: true },
    reraNumber: { type: String, required: true },
    address: { type: String },
    partnerType: { type: String, required: true }
}, {
    timestamps: true
});

const ChannelPartner = mongoose.model('ChannelPartner', channelPartnerSchema);

module.exports = ChannelPartner;
