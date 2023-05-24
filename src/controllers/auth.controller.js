const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const mailHelper = require('../helpers/mailer.helper')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');



const generateOTP = () => {
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const isOtpExpired = (user) => {
  const currentTime = moment();
  const updatedAt = moment(user.updatedAt);

  // Calculate the difference in minutes between the current time and the updatedAt time
  const minutesDiff = currentTime.diff(updatedAt, 'minutes');

  // Check if the difference is greater than or equal to 5 minutes
  if (minutesDiff >= 1) {
    return true; // OTP has expired
  } else {
    return false; // OTP is still valid
  }
};

exports.registerUser = async (req, res) => {
  console.log('register called')
  let user = await User.find({ email: req.body.email });
  if (user.length > 0) {
    return res.status(400).json({ 'msg': 'User already exists' });
  } else {
    const otp = generateOTP();
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ 'msg': 'Internal server error' });
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        otp: otp
      });
      newUser.save();
      mailHelper.sendMail(req, res, req.body.email, 'register', { otp });
      return res.status(200).json({ 'msg': 'User created' });
    });
  }
}

exports.verifyOtp = async (req,res) => {
  let user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(400).json({'msg': 'User does not exist'})
  }
  bcrypt.compare(req.body.password,user.password, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({'msg': 'Internal server error',error:err});
    }
    if (result) {

      if(isOtpExpired(user)){
        return res.status(400).json({'msg': 'OTP expired' });
      }
      
      if(req.body.otp === user.otp){
        user.is_verified = true;
        user.save();
        const token = jwt.sign(
          {
            _id: user._id,
            idseq: user.idseq,
            name: user.name,
            email: user.email,
            is_verified: user.is_verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "24h",
          }
        );
        const ONE_DAY = 86400000; // in milliseconds

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: ONE_DAY,
        });
        return res.status(200).json({msg: 'OTP Verified',token:token});
      }else{
        return res.status(400).json({'msg': 'Invalid OTP'})
      }
    }else{
      return res.status(400).json({'msg': 'Invalid Password'})
    }
  })
}


exports.resendOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ 'msg': 'User does not exist' });
    }
    if(!isOtpExpired(user)){
      return res.status(400).json({'msg': 'OTP is recently shared please wait until its expired.' });
    }
   
    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    mailHelper.sendMail(req, res, req.body.email, 'resendOTP', { otp });

    return res.status(200).json({ 'msg': 'OTP sent' });
  } catch (err) {
    return res.status(500).json({ 'msg': 'Internal server error' });
  }
};


exports.login = async (req,res) => {
  let user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(400).json({'msg': 'User does not exist'})
  }
  bcrypt.compare(req.body.password,user.password, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({'msg': 'Internal server error',error:err});
    }
    if (result) {      
      if(user.is_verified === true){
        const token = jwt.sign(
          {
            _id: user._id,
            idseq: user.idseq,
            name: user.name,
            email: user.email,
            is_verified: user.is_verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "24h",
          }
        );
        const ONE_DAY = 86400000; // in milliseconds

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: ONE_DAY,
        });
        return res.status(200).json({msg: 'Login successful',token:token});
      }else{
        return res.status(400).json({'msg': 'User Email Not Verified'})
      }
    }else{
      return res.status(400).json({'msg': 'Invalid Password'})
    }
  })
}