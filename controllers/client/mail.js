const httpErrors = require('http-errors');
const File = require('../../models/file');
const sendMail = require('../../services/sendEmail');
const htmlTemplate = require('../../helpers/downloadEmailTemplate');
const { formatBytes } = require('../../helpers/formatFile');
const {
  emailVerificationSchema,
} = require('../../services/userInputValidation');

async function sendEmailToClient(user, req, res, next) {
  try {
    if (!req?.body?.emailTo || !req?.body?.uuid)
      return next(httpErrors.BadRequest('All fields are required.'));

    const { emailTo, uuid } = req.body;
    const validEmail = await emailVerificationSchema.validateAsync({
      email: emailTo,
    });

    if (validEmail) {
      const file = await File.findOne({ uuid }).exec();

      if (!file)
        return next(
          httpErrors.BadRequest("File doesn't exist anymore. Upload it again.")
        );

      if (file?.receiverInfo)
        return next(httpErrors.BadRequest('Email sent already.'));

      await sendMail({
        from: process.env.MAIL_CLIENT,
        to: emailTo,
        subject: `Drop.it File Sharing. ${user.email} shared a file with you.`,
        text: `${user.email} shared a file with you. Total size ${formatBytes(
          file.fileSize
        )}.`,
        html: htmlTemplate({
          emailFrom: user.email,
          downloadLink: `${process.env.ROOT_DOMAIN}/api/file/${file.uuid}`,
          size: formatBytes(file.fileSize),
        }),
      });

      await file.updateReceiverInfo(emailTo);
      await user.updateEmailsSentCount();

      return res.status(200).json({
        status: 'ok',
        message: `Email Sent To ${emailTo}.`,
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = sendEmailToClient;
