const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let emailLengthChecker = (email) => {
  if(!email){
    return false;
  }else{
    if(email.length < 5 || email.length >30){
      return false
    }else{
      return true;
    }
  }
}

let validEmailChecker = (email) => {
  if(!email){
    return false;
  }else{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

let usernameLengthChecker = (username) => {
  if(!username){
    return false
  }else{
    if(username.length < 3 || username.length > 15){
      return false
    }else{
      return true;
    }
  }
}

let validUsernameChecker = (username) => {
  if(!username){
    return false
  }else{
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
}

let passwordLengthChecker = (password) => {
  if(!password){
    return false
  }else{
    if(password.length < 8 || password.length > 35){
      return false;
    }else{
      return true;
    }
  }
}

let validPasswordChecker = (password) => {
  if(!password){
    return false;
  }else{
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);// treba naci reg exp za password
    return regExp.test(password);
  }
}


const emailValidators = [
  {validator: emailLengthChecker, message: 'E-mail must be at least 5 characters but no more than 30'},
  {validator: validEmailChecker, message: 'Must be valid email'}
]

const usernameValidators = [
  {validator: usernameLengthChecker, message: 'Username must be at least 3 characters but no more than 15'},
  {validator: validUsernameChecker, message: 'Username must be valid'}
]

const passwordValidators = [
  {validator: passwordLengthChecker, message: 'Password must be at least 8 characters but no more than 35'},
  {validator: validPasswordChecker, message: 'Password must be valid'}
]

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});

userSchema.pre('save', function(next){
  if(!this.isModified('password'))
    return next();
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if(err) throw err;
      this.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
