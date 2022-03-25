const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, lowercase: true, required: true },
    displayName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
    },

    password: { type: String, required: true },
    role: {
      type: String,
      default: 'User',
      required: true,
    },
    activeFiles: { type: Number, default: 0, required: false },
    totalEmailsSent: { type: Number, default: 0, required: false },
    activeStorage: { type: Number, default: 0, required: false },
  },
  { timestamps: true }
);

UserSchema.methods.checkPassword = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

UserSchema.methods.changeInformation = async function ({ email, username }) {
  try {
    this.email = email;
    this.username = username;
    return this.save();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

UserSchema.methods.increaseFilesCountAndStorage = async function (size) {
  try {
    this.activeFiles++;
    this.activeStorage += size;
    return this.save();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

UserSchema.methods.decreaseFilesCountAndStorage = async function (
  size,
  count = 1
) {
  try {
    this.activeFiles -= count;
    this.activeStorage -= size;
    return this.save();
  } catch (error) {
    console.log(error.message);
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

UserSchema.methods.updateEmailsSentCount = async function () {
  try {
    this.totalEmailsSent++;
    return this.save();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
