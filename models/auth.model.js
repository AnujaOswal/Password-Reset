import Mongoose  from "mongoose";
import Crypto from "google-auth-library/build/src/crypto/crypto.js";

//userschema
const userScheama = new Mongoose.Schema(
    {
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
      },
      name: {
        type: String,
        trim: true,
        required: true
      },
      hashed_password: {
        type: String,
        required: true
      },
      salt:String,
      role:{
          type:String,
          default:'Normal'
      },
      resetPasswordLink:{
          data:String,
          default:""
      }
    },{
        timeStamp:true
    }
)
// virtual
userScheama
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods
userScheama.methods = {
    //comparing password type and hash generated psd
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return Crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

export default Mongoose.model('User', userScheama);