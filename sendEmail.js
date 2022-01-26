

import nodemailer from "nodemailer";

export function sendResetLink(email,token){
    console.log(email,token)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject:"Reset Password Instructions",
        // text: `To reset your password, Please click on this link: http://localhost:3000/reset/${token}`,
        html:`
        <h3>Password Reset Instructions</h3>
        <div>To reset your password, Please click <a href=https://basic-react-app2.netlify.app/${token}>here</a></div>
        <div><small>Kindly check in spam folder also.</small></div>
        `
    };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

