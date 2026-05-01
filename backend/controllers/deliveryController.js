const Delivery = require('../models/Delivery');

// ---------- CREATE ----------
exports.createDelivery = async (req, res) => {
  try {
    // req.body should contain: orderId, driverId, address, status (optional)
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- READ (single by ID) ----------
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      //.populate('orderId')                // was 'order'
      //.populate('driverId', 'name');      // was 'driver'
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- UPDATE ----------
exports.updateDelivery = async (req, res) => {
  try {
    // req.body may contain: status, driverId, address, proofImage, etc.
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- DELETE ----------
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json({ message: 'Delivery cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- FILE UPLOAD (proof of delivery) ----------
exports.uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { proofImage: req.file.path, status: 'delivered' },
      { new: true }
    );
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
