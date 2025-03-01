const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leadSchema = new Schema({
  leadType: { type: String, required: true, enum: ['my_lead', 'channel_partner'] },
  channelPartner: { type: Schema.Types.ObjectId, ref: 'ChannelPartner' },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  date: { type: Date, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  purpose: { type: String, required: true },
  budget: { type: String },
  bhk: { type: String },
  leadSource: { type: String },
  leadStatus: { type: String, default: 'New' },
  financing: { type: String }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
