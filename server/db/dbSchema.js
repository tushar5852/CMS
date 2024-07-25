const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    files: [{
        fieldname: { type: String, required: true },
        originalname: { type: String, required: true },
        encoding: { type: String, required: true },
        mimetype: { type: String, required: true },
        destination: { type: String, required: true },
        filename: { type: String, required: true },
        path: { type: String, required: true },
        size: { type: Number, required: true },
      }]
    }, { timestamps: true });
//   });
  
  const Product = mongoose.model("Product", productSchema);

module.exports = Product