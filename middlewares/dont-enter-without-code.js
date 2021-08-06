const { verifyToken } = require('../modules/jwt')

module.exports = async (req, res, next) => {
   const codeToken = req.cookies['code-token']

   if (!codeToken) {
      return res.redirect('/users')
   }

   const { user_agent, phone, code } = verifyToken(codeToken)

   const candidate = await req.db.sessions.findOne({
      where: {
         phone, code
      }
   })

   if (!candidate || user_agent !== req.headers['user-agent']) {
      res.clearCookie('code-token')
      return res.redirect('/users')
   }

   next()
}