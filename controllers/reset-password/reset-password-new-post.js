const { verifyToken, generateToken } = require('../../modules/jwt')
const resetPasswordValidation = require('../../validations/reset-password-validation')
const { generateHash } = require('../../modules/bcrypt')

module.exports = async (req, res) => {
   try {
      const resetPasswordToken = req.cookies['reset_password']

      const { phone } = verifyToken(resetPasswordToken)

      const { password, repeatedPassword } = await resetPasswordValidation.validateAsync(req.body)

      await req.db.users.update({
         password: await generateHash(password)
      }, {
         where: {
            phone
         }
      })

      const token = generateToken({
         user_agent: req.headers['user-agent'],
         phone
      })

      res.clearCookie('reset_password').cookie('token', token).send({
         ok: true,
         message: 'password changed'
      })
   } catch (e) {
      res.status(400).send({
         ok: false,
         message: e + ''
      })
   }
}