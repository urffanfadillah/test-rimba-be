const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = require('./item');
const Customer = require('./customer');
/*
Field modul Sales terdiri dari code_transaksi, tanggal_transaksi, customer,
item(multiple), qty, total_diskon(auto fill), total_harga(autofill), total_bayar
*/

const salesSchema = new mongoose.Schema({
    code_transaksi: {
        type: Schema.Types.ObjectId,
        default: function () {
            return new mongoose.Types.ObjectId();
        },
        unique: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    item: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Item'
            },
            qty: Number
        }
    ],
    email: String,
    alamat: String,
    diskon: Number,
    tipe_diskon: String,
    ktp: String
});
  
const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;