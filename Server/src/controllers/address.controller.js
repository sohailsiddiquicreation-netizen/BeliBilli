const Address = require("../Models/address.model");

// Add Address
const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Address added",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get User Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Address updated",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);

    res.json({
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};