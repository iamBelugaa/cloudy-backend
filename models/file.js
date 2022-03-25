const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimetype: { type: String, required: true },
    extension: { type: String, required: true },
    path: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uuid: { type: String, required: true, unique: true },
    uploaderInfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: { type: String, required: true },
      _id: false,
    },
    receiverInfo: { type: String, required: false },
  },
  { timestamps: true }
);

FileSchema.methods.updateReceiverInfo = async function (data) {
  try {
    this.receiverInfo = data;
    return this.save();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

const File = mongoose.model('File', FileSchema);
module.exports = File;
