const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    nama_item: String,
    unit: String,
    stok: Number,
    harga_satuan: Number,
    barang: String,
});
  
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;