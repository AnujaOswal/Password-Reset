import User from '../models/auth.model.js'
import expressJwt from 'express-jwt'
import _ from 'lodash'
import { OAuth2Client } from 'google-auth-library'
import fetch from 'node-fetch'
import validator, { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import errorHandler from '../helpers/dbErrorHandling.js'
import nodemailer from "nodemailer";

export default function registerController(req,res){
    const {name , email ,password}= req.body
    console.log(email)
    const errors = validationResult(req)
   // console.log(errors)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
          errors: firstError
        });
      } else {
        User.findOne({
          email
        }).exec((err, user) => {
          if (user) {
            return res.status(400).json({
              errors: 'Email is taken'
            });
          }
        });
        
    const token = jwt.sign(
        {
          name,
          email,
          password
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '15m'
        }
      );

      
        let Transport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        });

      //email data sending
      const emailData = {
        from: process.env.MAIL_USERNAME,
        to: 'anujaoswal7@gmail.com',
        subject: 'Account activation link ❗ ❗ ❗ ❗',
        html: `
                  <h1>Please use the following to activate your account</h1>
                  <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                  <hr />
                  <p>This email may containe sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
                  <p style="margin: 0;">Regards,</p>\n
                  <p style="margin: 0;">NodeJs Auth Part</p>\n
                  <p style="margin: 0;">India</p>
              `
              
      };
      Transport.sendMail(emailData, function (err,data)
      {
        if(err)
        {
          console.log('ERROR Occur ❌',err)
        }
        else{
          console.log('EMAIL SENT ❗ ❗ ❗ ❗')

        }
      })
    //console.log(name ,email,password ❗)
      
    }
}