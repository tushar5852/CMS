const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
// const AppDataSource = require("./data-source");
const dbCoonect = require("./db/dbconnect")
const Product = require("./db/dbSchema")

// const upload = multer({ dest: 'uploads/' })

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(express.json())
dbCoonect()


//   Multer
const storage = multer.diskStorage({
  destination: function(req , file , cb){
      cb(null , "./uploads")
  },
  filename: function(req , file , cb){
      cb(null , file.fieldname + "-" + path.extname(file.originalname))
  }
})

// Multer configuration

const upload = multer({storage: storage})


app.get("/" , (req , res) => {
  res.json({
    message: "Hi from server"
  })
})


app.post("/upload" , upload.array('file' , 10) , async (req , res) =>{
  try {
    const filesData = req.files.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    }));

    const newFileDocument = new Product({ files: filesData });
    const savedFileDocument = await newFileDocument.save();

    res.json({
      message: "Upload to db",
      data: savedFileDocument
    });
  } catch (error) {
    res.status(500).send('Error uploading files');
  }
  // res.json({
  //   message: "upload successfull",
  //   data: req.files
  // })
})

// AppDataSource.initialize().then(async (connection) => {
//   const fileRepository = connection.getRepository("File");

  // Set up storage engine for multer
  // const storage = multer.diskStorage({
  //   destination: "./uploads/",
  //   filename: (req, file, cb) => {
  //     cb(null, `${Date.now()}-${file.originalname}`);
  //   },
  // });

  // const upload = multer({ storage });

  // app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // // Fetch files data
  // app.get("/api/files", async (req, res) => {
  //   try {
  //     const files = await fileRepository.find();
  //     res.json(files);
  //   } catch (error) {
  //     res.status(500).send("Error fetching files");
  //   }
  // });

  // // Upload files
  // app.post("/api/upload", upload.array("file", 10), async (req, res) => {
  //   try {
  //     console.log(req)
  //     // const files = await Promise.all(
  //     //   req.files.map((file) =>
  //     //     fileRepository.save({ name: file.originalname, type: file.mimetype })
  //     //   )
  //     // );
  //     // res.json({ files: files.map((file) => file.id) });
  //   } catch (error) {
  //     res.status(500).send("Error uploading files");
  //   }
  // });  

  // // Update file order
  // app.post("/api/update-order", async (req, res) => {
  //   const { files } = req.body;
  //   try {
  //     await connection.transaction(async (transactionalEntityManager) => {
  //       await Promise.all(
  //         files.map((fileId, index) =>
  //           transactionalEntityManager.update(File, fileId, { order: index })
  //         )
  //       );
  //     });
  //     res.json({ message: "Order updated" });
  //   } catch (error) {
  //     res.status(500).send("Error updating order");
  //   }
  // });

app.listen("5000" , () => {
  console.log("server is connected")
})