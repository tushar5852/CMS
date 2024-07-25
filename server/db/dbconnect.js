const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/dataUpload", {})
        .then(() => console.log("MongoDB connected"))
        .catch(err => {
            console.error("MongoDB connection error:", err.message);
            process.exit(1); // Exit process with failure
        });
};

module.exports = dbConnect;