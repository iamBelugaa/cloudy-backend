const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
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
      default: 'Admin',
      required: true,
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

AdminSchema.methods.checkPassword = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

AdminSchema.methods.updateLoginsCount = async function () {
  try {
    this.totalLogins++;
    return this.save();
  } catch (error) {
    throw new Error('Something Went Wrong. Please Try Again Later.');
  }
};

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
