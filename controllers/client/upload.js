const path = require('path');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const httpErrors = require('http-errors');
const File = require('../../models/file');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join('uploads/')),
  filename: (req, file, cb) => {
    const filename = `${uuid()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 * 100 },
}).single('file');

async function uploadFile(user, req, res, next) {
  try {
    upload(req, res, async (err) => {
      if (err) return next(httpErrors.BadRequest(err.message));

      if (!req.file)
        return next(httpErrors.BadRequest('File Must Be Provided.'));

      const file = new File({
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimetype: req.file.mimetype,
        extension: path.extname(req.file.originalname).toLowerCase(),
        path: req.file.path,
        fileSize: req.file.size,
        uuid: uuid(),
        uploaderInfo: {
          id: user._id,
          email: user.email,
        },
      });
      await file.save();
      await user.increaseFilesCountAndStorage(file.fileSize);

      return res.status(200).json({
        status: 'ok',
        downloadLink: `${process.env.ROOT_DOMAIN}/api/file/${file.uuid}`,
        message: 'File uploaded. Copy the link or send it via Email.',
      });
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = uploadFile;
