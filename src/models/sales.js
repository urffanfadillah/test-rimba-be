const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new Schema({
  tanggal_transaksi: { type: Date, required: true },
  customer: { type: String, required: true },
  item: [{
    nama_item: { type: String, required: true },
    qty: { type: Number, required: true }
  }],
  diskon: { type: String, required: false },
  sub_total: { type: String, required: false },
  total: { type: String, required: false }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
