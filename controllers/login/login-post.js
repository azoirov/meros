const loginValidation = require('../../validations/login-validation')
const { compareHash } = require('../../modules/bcrypt')
const { generateToken } = require('../../modules/jwt')

module.exports = async (req, res) => {
   try {
      const { sessions, users } = req.db

      const { phone, password } = await loginValidation.validateAsync({
         phone: req.body.phone.replace(/ /g, '').substring(1), password: req.body.password
      })

      const candidate = await users.findOne({
         where: {
            phone
         }
      })

      if (!candidate) {
         throw new Error('This phone does not exist')
      }

      const isPasswordCorrect = await compareHash(password, candidate.password)

      if (!isPasswordCorrect) {
         throw new Error('Password is not correct')
      }

      await sessions.update({
         user_agent: req.headers['user-agent']
      }, {
         where: {
            phone
         }
      })

      const token = generateToken({
         user_agent: req.headers['user-agent'],
         phone
      })

      res.cookie('token', token).redirect('/')
   } catch (e) {
      res.status(400).render('login', {
         title: 'Meros | Login',
         error: e + ''
      })
   }
}