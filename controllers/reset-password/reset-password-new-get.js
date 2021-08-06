const { verifyToken } = require('../../modules/jwt')

module.exports = async (req, res) => {
   try {
      const { sessions } = req.db

      const resetPasswordToken = req.cookies['reset_password']

      if (!resetPasswordToken) {
         return res.redirect('/reset-password')
      }

      const { user_agent, phone } = verifyToken(resetPasswordToken)

      const candidate = await sessions.findOne({
         where: {
            user_agent, phone
         }
      })

      if (!candidate || user_agent !== req.headers['user-agent']) {
         return res.clearCookie('reset_password').redirect('/reset-password')
      }

      res.render('reset-password-new', {
         title: 'Meros | New password',
         path: '/reset-password/new'
      })
   } catch (e) {
      res.clearCookie('reset_password').redirect('/reset-password')
   }
}