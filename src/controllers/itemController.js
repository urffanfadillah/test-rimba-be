const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
    // konfigurasi folder penyimpanan file
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "/uploads"));
    },
    // konfigurasi penamaan file yang unik
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
});

// model
const Item  = require('../models/item');

// Middleware untuk mendapatkan item berdasarkan ID
async function getItem(req, res, next) {
    let item;
    try {
      item = await Item.findById(req.params.id);
      if (item == null) {
        return res.status(404).json({ message: 'Item tidak ditemukan' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  
    res.item = item;
    next();
}

router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', multer({ storage: diskStorage }).single('barang'), async (req, res) => {
    const { nama_item, unit, stok, harga_satuan } = req.body;
    try {
        const item = new Item({
            nama_item,
            unit,
            stok,
            harga_satuan,
            barang: req.file.filename,
        });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', getItem, (req, res) => {
    res.json(res.item);
});

router.put('/:id', getItem, async (req, res) => {
    const { nama_item, unit, stok, harga_satuan } = req.body;
  
    if (nama_item) {
      res.item.nama_item = nama_item;
    }
    if (unit) {
      res.item.unit = unit;
    }
    if (stok) {
      res.item.stok = stok;
    }
    if (harga_satuan) {
      res.item.harga_satuan = harga_satuan;
    }
  
    try {
      await res.item.save();
      res.json(res.item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', getItem, async (req, res) => {
    try {
      await res.item.remove();
      res.json({ message: 'Item berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;