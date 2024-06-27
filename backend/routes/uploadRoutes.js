const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new aws.S3();

router.post('/upload', upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  const tempFilePath = path.join(__dirname, '..', 'temp', file.originalname);
  const compressedFilePath = path.join(__dirname, '..', 'temp', `compressed_${file.originalname}`);

  // Ensuring that temp directory exists
  if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'temp'));
  }

  try {
    // Saving the file temporarily
    fs.writeFileSync(tempFilePath, file.buffer);

    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
        if (err) reject(err);
        resolve(metadata);
      });
    });

    const duration = metadata.format.duration;
    if (duration > 1800) {
      fs.unlinkSync(tempFilePath); // Cleaning up the temp file
      return res.status(400).json({ error: 'File exceeds 30 minutes limit' });
    }

    // Compressing the video
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .output(compressedFilePath)
        .videoCodec('libx264')
        .size('640x?')
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Uploading the compressed video to S3
    const compressedFileBuffer = fs.readFileSync(compressedFilePath);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `compressed_${Date.now()}_${file.originalname}`,
      Body: compressedFileBuffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    const newFile = new File({
      title,
      description,
      fileUrl: data.Location,
      fileType: file.mimetype,
      duration,
    });

    await newFile.save();
    fs.unlinkSync(tempFilePath); // Cleaning up the temp file
    fs.unlinkSync(compressedFilePath); // Cleaning up the compressed file
    res.status(200).send('File uploaded and compressed successfully');
  } catch (err) {
    console.error(err);
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath); // Cleaning up the temp file
    }
    if (fs.existsSync(compressedFilePath)) {
      fs.unlinkSync(compressedFilePath); // Cleaning up the compressed file
    }
    res.status(500).send(err);
  }
});

router.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;