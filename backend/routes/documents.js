const router = require('express').Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/upload', upload.single('document'), (req, res) => {
  res.json({ file: req.file.filename, message: 'Uploaded' })
})

module.exports = router

