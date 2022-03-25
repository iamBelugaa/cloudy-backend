const httpErrors = require('http-errors');
const {
  emailVerificationSchema,
  registrationValidationSchema,
} = require('../../services/userInputValidation');
const { checkEmailAdmin } = require('../../helpers/findUserDetails');
const hashPassword = require('../../helpers/hashPassword');
const Admin = require('../../models/admin');

async function getAllAdmins(user, req, res, next) {
  try {
    const admins = await Admin.find({
      _id: { $ne: user._id },
    })
      .sort('-createdAt')
      .select('displayName email isSuperAdmin createdAt -_id')
      .exec();

    return res.status(200).json({
      status: 'ok',
      admins,
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteAdminAccount(user, req, res, next) {
  try {
    const { email } = req.body;

    if (!email) return next(httpErrors.BadRequest('Email Must Be Provided.'));

    if (email === user.email)
      return next(
        httpErrors.BadRequest('To Delete Your Account Go To Settings Tab.')
      );

    const validEmail = await emailVerificationSchema.validateAsync({ email });
    if (validEmail) {
      const adminToDelete = await Admin.findOne({
        email: validEmail.email,
      });

      if (!adminToDelete)
        return next(httpErrors.BadRequest("User doesn't exist."));

      if (adminToDelete.role === 'User')
        return next(httpErrors.BadRequest("Cann't delete user account."));

      if (process.env.SUPER_ADMIN.includes(adminToDelete.email.address))
        return next(
          httpErrors.BadRequest("You cann't delete Super Admin's account.")
        );

      await adminToDelete.remove();
      return res.status(200).json({
        status: 'ok',
        message: `Account deleted.`,
      });
    }
  } catch (error) {
    return next(error);
  }
}

async function addAdminAccount(user, req, res, next) {
  try {
    const { displayName, password, email } = req.body;

    if (!displayName || !password || !email)
      return next(httpErrors.BadRequest('All fields are required.'));

    if (email !== email.toLowerCase())
      return next(httpErrors.BadRequest(`Email must be in Lowercase.`));

    const validDetails = await registrationValidationSchema.validateAsync({
      displayName,
      email,
      password,
    });

    if (validDetails) {
      const existEmail = await checkEmailAdmin(validDetails.email);

      if (existEmail)
        return next(httpErrors.BadRequest(`${email} is already registered.`));

      const hashedPassword = await hashPassword(validDetails.password);
      const admin = new Admin({
        displayName: validDetails.username,
        email: validDetails.email,
        password: hashedPassword,
      });

      await admin.save();
      return res.status(201).json({
        status: 'ok',
        message: 'Admin added successfully.',
        data: {
          displayName: admin.displayName,
          email: admin.email,
          id: admin.id,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllAdmins, deleteAdminAccount, addAdminAccount };
