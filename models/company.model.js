const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  address: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
