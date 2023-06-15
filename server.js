const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
// dependency path
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
// membuat konfigurasi diskStorage multer
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

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;
app.use(express.static('uploads'));

// Koneksi ke MongoDB
const username = "urffan";
const password = "wV3SGkrcXS0CgBhY";
const cluster = "cluster0";
const dbname = "rimba";

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.kqmq35u.mongodb.net/${dbname}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Berhasil konek ke mongoDB')
}).then((error) => {
    console.log(error);
});

// models
const Item = require('./src/models/item');
const Customer = require('./src/models/customer');

app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Mengambil semua item
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Membuat item baru
app.post('/items', multer({ storage: diskStorage }).single('barang'), async (req, res) => {
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

// Mengambil detail item
app.get('/items/:id', getItem, (req, res) => {
  res.json(res.item);
});

// Mengupdate item
app.put('/items/:id', multer({ storage: diskStorage }).single('barang'), async (req, res) => {
  const idItem = req.params.id;
  const { nama_item, unit, stok, harga_satuan } = req.body;
  const data = {
    nama_item: nama_item,
    unit: unit,
    stok: stok,
    harga_satuan: harga_satuan,
    barang: req.file.filename,
  };  

  try {    
    await Item.findOneAndUpdate({ _id: idItem }, data);
    res.status(200).json({status: true, message:'Updated data success'})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Menghapus item
app.delete('/items/:id', getItem, async (req, res) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mengambil semua customer
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Membuat customer baru
app.post('/customers', multer({ storage: diskStorage }).single('ktp'), async (req, res) => {
  const { nama, contact, email, alamat, diskon, tipe_diskon } = req.body;

  try {
    const customer = new Customer({
      nama,
      contact,
      email,
      alamat,
      diskon,
      tipe_diskon,
      ktp: req.file.filename,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mengambil detail customers
app.get('/customers/:id', getCustomer, (req, res) => {
  res.json(res.customer);
});

// Mengupdate customer
app.put('/customers/:id', multer({ storage: diskStorage }).single('ktp'), async (req, res) => {
  const idItem = req.params.id;
  const { nama, contact, email, alamat, diskon, tipe_diskon } = req.body;
  const data = {
    nama: nama,
    contact: contact,
    email: email,
    alamat: alamat,
    diskon: diskon,
    tipe_diskon: tipe_diskon,
    ktp: req.file.filename,
  };  

  try {    
    await Customer.findOneAndUpdate({ _id: idItem }, data);
    res.status(200).json({status: true, message:'Updated data success'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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


// Middleware untuk mendapatkan customers
async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Customer tidak ditemukan' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.customer = customer;
  next();
}

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});