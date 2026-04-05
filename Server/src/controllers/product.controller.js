const Product = require("../Models/product.model");
const Category = require("../Models/category.model");

// Create Product (Admin)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock, images } = req.body;

    // Check category
    let categoryExists;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryStr = String(category);
    // Allow both ID and Name
    if (categoryStr.match(/^[0-9a-fA-F]{24}$/)) {
      categoryExists = await Category.findById(categoryStr);
    } else {
      categoryExists = await Category.findOne({ name: categoryStr });
    }

    if (!categoryExists) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    const uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const imagekit = require("../config/imagekit.config");
      for (const img of images) {
        if (img.startsWith("data:image")) {
          try {
            const uploaded = await imagekit.upload({
              file: img,
              fileName: title.replace(/[^a-zA-Z0-9]/g, "_") + "_" + Date.now(),
              folder: "/products"
            });
            uploadedImages.push(uploaded.url);
          } catch (uploadErr) {
            console.error("ImageKit upload failed:", uploadErr.message);
            // skip failed image and continue
          }
        } else {
          uploadedImages.push(img);
        }
      }
    }

    const product = await Product.create({
      title,
      description,
      price,
      category: categoryExists._id,
      stock,
      images: uploadedImages,
    });

    res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (error) {
    console.error("createProduct error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Products (with pagination + search)
const getProducts = async (req, res) => {
  try {
    const { page = 1, keyword = "" } = req.query;

    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      title: { $regex: keyword, $options: "i" },
    })
      .populate("category")
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments();

    res.json({
      total,
      page,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Single Product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { images } = req.body;
    let uploadedImages = images || [];

    if (images && Array.isArray(images) && images.length > 0) {
      const imagekit = require("../config/imagekit.config");
      uploadedImages = [];
      for (const img of images) {
        if (img.startsWith("data:image")) {
          try {
            const uploaded = await imagekit.upload({
              file: img,
              fileName: "product_img_" + Date.now(),
              folder: "/products"
            });
            uploadedImages.push(uploaded.url);
          } catch (uploadErr) {
            console.error("ImageKit upload failed:", uploadErr.message);
            // skip failed image
          }
        } else {
          uploadedImages.push(img);
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: uploadedImages },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
