const mongoose = require('mongoose');
/*
Field modul Customer terdiri dari nama, contact, email, alamat, diskon, tipe_diskon,
ktp(image). Terdapat 2 tipe diskon yaitu persentase dan fix diskon. 
*/
const customerSchema = new mongoose.Schema({
    nama: String,
    contact: String,
    email: String,
    alamat: String,
    diskon: Number,
    tipe_diskon: String,
    ktp: String
});
  
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;