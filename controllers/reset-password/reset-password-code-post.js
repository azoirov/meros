const codeValidation = require('../../validations/code-validation')
const { generateToken } = require('../../modules/jwt')

module.exports = async (req, res) => {
   try {
      const { sessions, users } = req.db

      const { phone, code } = await codeValidation.validateAsync(req.body)

      const candidate = await sessions.findOne({
         where: {
            phone
         }
      })

      if (!candidate) {
         throw new Error('session not found')
      }

      if (candidate.code !== code) {
         await sessions.update({
            attempts: candidate.attempts + 1
         }, {
            where: {
               phone
            }
         })

         return res.status(400).send({
            ok: false,
            message: 'invalid code'
         })
      }

      if (candidate.code === code) {
         await sessions.update({
            attempts: 0
         }, {
            where: {
               phone
            }
         })

         const resetPasswordToken = generateToken({
            user_agent: req.headers['user-agent'],
            phone
         })

         return res.cookie('reset_password', resetPasswordToken).status(200).send({
            ok: true,
            message: 'valid code'
         })
      }
   } catch (e) {
      res.status(400).send({
         ok: false,
         message: e + ''
      })
   }
}