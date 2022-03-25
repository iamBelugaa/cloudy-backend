const path = require('path');
const fs = require('fs');
const File = require('../../models/file');
const httpErrors = require('http-errors');

// -------------------- Get Download Link -------------------- //
async function getDownloadLink(req, res, next) {
  try {
    if (req?.params?.uuid) {
      const { uuid } = req.params;
      const existFile = await File.findOne({ uuid }).exec();

      // ----------- If Doesn't Exist Render Download Page With An Error Message ---------- //
      if (!existFile)
        return next(
          httpErrors.NotFound(
            'This link is maybe broken or expired. Request the sender to send a new link or a valid one.'
          )
        );

      // -------------------- Else Render Download Page With Download Link -------------------- //
      if (!fs.existsSync(path.join(__dirname, '../../', existFile.path)))
        return next(
          httpErrors.NotFound(
            "The File you're trying to access doesn't exist anymore. Request the sender to upload it again."
          )
        );
      else
        return res.status(200).json({
          status: 'ok',
          data: {
            fileName: getSmallFileName(existFile.fileName),
            fileSize: formatBytes(existFile.fileSize),
            downloadLink: `${process.env.ROOT_DOMAIN}/api/file/${existFile.uuid}`,
          },
        });
    }
  } catch (error) {
    return next(error);
  }
}

// --------------- Download File --------------- //
async function downloadFile(req, res, next) {
  try {
    if (req?.params?.uuid) {
      const { uuid } = req.params;
      const existFile = await File.findOne({ uuid }).exec();

      // --------------- Check For The Existence In The Database --------------- //
      if (!existFile)
        return next(
          httpErrors.NotFound(
            'This link is maybe broken or expired. Request the sender to send a new link or a valid one.'
          )
        );

      // --------------- Check For The Existence Of The File In The Uploads Folder --------------- //
      if (fs.existsSync(path.join(__dirname, '../../', existFile.path)))
        return res
          .status(200)
          .download(path.join(__dirname, '../../', existFile.path));
      else
        return next(
          httpErrors.NotFound(
            "The File you're trying to access doesn't exist anymore. Request the sender to upload it again."
          )
        );
    }
  } catch (error) {
    return next(error);
  }
}

// -------------------- Compress The File Name -------------------- //
function getSmallFileName(filename) {
  if (filename.length > 25) {
    const length = filename.length;
    return `${filename.slice(0, 25)}...${filename.slice(length - 10, length)}`;
  }
  return filename;
}

// -------------------- Formatting The Size Of The File -------------------- //
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const kbToByte = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const size = Math.floor(Math.log(bytes) / Math.log(kbToByte));

  return (
    parseFloat((bytes / Math.pow(kbToByte, size)).toFixed(2)) +
    ' ' +
    sizes[size]
  );
}

module.exports = {
  getDownloadLink,
  downloadFile,
};
