const express = require("express");
const cors = require("cors")
const app = express();
const mongoose = require("mongoose");
const recordRoute = require("./routes/record");
const Record = require("./models/Record");
const router = require("express").Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const xlsx = require('node-xlsx');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/senthil', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

// app.use("/api/upload", recordRoute);


app.post("/upload", upload.any(), async (req, res) => {
  const data = req.files;
  const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/uploads/${req.files[0].filename}`));
  const Data = workSheetsFromBuffer[0].data.slice(1).map(item => (
    {
      link: item[1] || '',
      prefix: item[2] || '',
      selectTags: item[3] || '',
      selectedTags: item[4] || ''
    }
  ))

  Data.forEach((item) => {
    const record = Record({ ...item })
    record.save()
  })
  res.status(200).send({ success: true, data: Data });
})

app.get("/upload", async (req, res) => {
  const data = await Record.find({});
  res.send(data);
})

app.listen(3000, (req, res) => {
  console.log("Server is running");
})