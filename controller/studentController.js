const { dataSource } = require('../database')
const bcrypt = require('bcryptjs')
const studentRepo = dataSource.getRepository('student1')

const otpRepo = dataSource.getRepository('otp')
require('dotenv').config()

//signup
const signUp = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = encryptedPassword
    console.log('password::   ' + encryptedPassword)

    const resp = await studentRepo.save(req.body)
    
    res.status(200).json({
      status: 'success',
      response: resp,
      message: 'account created successfully'
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      status: 'failure',
      response: null,
      message: 'already exists,please provide the valid details '
    })
  }
}

//login
const login = async (req, res) => {
  try {
    const resp = await studentRepo.findOne({
      where: { userName: req.body.userName }
    })
    console.log('user', resp)
    if (!resp) {
      console.log('Invalid user name')
      res.status(400).json({
        status: 'failure',
        message: 'invalid userName'
      })
    } else {
      const encryptedPassword = await bcrypt.compare(
        req.body.password,
        resp.password
      )
      console.log('password', encryptedPassword)

      if (encryptedPassword) {
        console.log('student  signin')
        res.status(200).json({
          status: 'success',
          message: 'logged in successfull'
        })
      } else {
        res.status(400).json({
          status: 'failure',
          message:
            'invalid userName or password, please provide the valid password'
        })
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}

//change password
const updatePassword = async (req, res) => {
  try {
    const resp1 = await studentRepo.findOneBy({ userName: req.body.userName })

    // console.log(resp1)

    if (!resp1.userName) {
      console.log('user not exists')
    } else {
      const salt = await bcrypt.genSalt(10)

      const encryptedPassword = await bcrypt.hash(req.body.password, salt)

      req.body.password = encryptedPassword

      const resp = await studentRepo.update(
        { userName: req.body.userName },
        req.body
      )

      res.send(resp)
    }
  } catch (error) {
    console.log(error.message)
  }
}


function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}


//otp generation
const emailSend = async (req, res) => {
  try {
    const data = await studentRepo.findOneBy({ userName: req.body.userName })
    console.log(data.userName)
  
      let otpCode = Math.floor(100000 + Math.random() * 900000)
      console.log(otpCode)
      const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);
    console.log(expiration_time)
      let otpData = await otpRepo.save({
        userName: data.userName,
        code: otpCode,
        expireIn:expiration_time
      })
      
      console.log('please check your userName for otp')
      res.status(200).json({
        message: 'email send successfully'
      })
    
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      message: 'userName is not exists'
    })
  }
}
//change password
const changePassword = async (req, res) => {
  try {
    let data = await otpRepo.findOneBy({
      userName: req.body.userName,
      code: req.body.otpCode
    })
    console.log(data.code)
    if (!data) {
      
      console.log("data not exists")
      } else {
        let currentTime = new Date().getTime()
        let diff = data.expireIn - currentTime
        if (diff < 0) {
          console.log('otp expire')
        console.log("data not exists")
        res.status(200).json({
          message: 'otp expired'
        })
      }
  
        else{
          let resp = await studentRepo.findOneBy({ userName: req.body.userName })
          if(req.body.otpCode==data.code)
     {
       console.log("inside if block");
        const salt = await bcrypt.genSalt(10)
           const encryptedPassword = await bcrypt.hash(req.body.password, salt)  
         const resp = await studentRepo.update(
             { userName: req.body.userName },
           {password:encryptedPassword}
           )
           console.log("resp",resp)
     }    
     res.status(200).json({
      message: 'password changed successfully'
    })
         }
        }
    
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: 'something went wrong'
    })
  }
  
}

//node mailer
// const mailer = (userName, code) => {
//   var nodemailer = require('nodemailer')
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     port: 587,
//     secure: false,
//     auth: {
//       userName: 'code1@gmail.com',
//       password: '1234'
//     }
//   })
//   var mailOptions = {
//     from: 'code1@gmail.com',
//     to: 'code2@gmail.com',
//     subject: 'sending emailusing nodejs',
//     text: 'hi'
//   }
//   transporter.sendMail(mailOptions, function (err, info) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('email sent:' + info.response)
//     }
//   })
// }
module.exports = { signUp, login, updatePassword, emailSend, changePassword }
