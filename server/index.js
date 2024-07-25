const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const AppDataSource = require("./data-source");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

AppDataSource.initialize().then(async (connection) => {
  const fileRepository = connection.getRepository("File");

  // Set up storage engine for multer
  const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Fetch files data
  app.get("/api/files", async (req, res) => {
    try {
      const files = await fileRepository.find();
      res.json(files);
    } catch (error) {
      res.status(500).send("Error fetching files");
    }
  });

  // Upload files
  app.post("/api/upload", upload.array("file", 10), async (req, res) => {
    try {
      const files = await Promise.all(
        req.files.map((file) =>
          fileRepository.save({ name: file.originalname, type: file.mimetype })
        )
      );
      res.json({ files: files.map((file) => file.id) });
    } catch (error) {
      res.status(500).send("Error uploading files");
    }
  });

  // Update file order
  app.post("/api/update-order", async (req, res) => {
    const { files } = req.body;
    try {
      await connection.transaction(async (transactionalEntityManager) => {
        await Promise.all(
          files.map((fileId, index) =>
            transactionalEntityManager.update(File, fileId, { order: index })
          )
        );
      });
      res.json({ message: "Order updated" });
    } catch (error) {
      res.status(500).send("Error updating order");
    }
  });

  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((error) => console.log("TypeORM connection error: ", error));
