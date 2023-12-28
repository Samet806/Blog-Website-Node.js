const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/email", (req, res) => {
  const outputHTML = `
        <h2> Mail Details </h2>
        <ul>
        <li> Name: ${req.body.name} </li>
        <li> Email: ${req.body.email} </li>
        <li> Phone: ${req.body.phone} </li>
        </ul>
        <h3> Message  </h3>
        <p>:${req.body.message}  </p>`;

        const transporter = nodemailer.createTransport({
            host: "smtp.live.com",
            port: 587,
            secure: false,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: "sevim43osma@hotmail.com",
              pass: "Sevim+123",
            },
          });
          //yoenakmmcedfppqx
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Node Proje contact form" <sevim43osma@hotmail.com>', // sender address
              to: "sevim43osma@hotmail.com", // list of receivers
              subject: "Node Contact message ✔", // Subject line
              text: "Hello world?", // plain text body
              html: outputHTML, // html body
            });

            req.session.sessionFlash = {
                type: "alert alert-success",
                message: "Postunuz başarılı bir şekilde eklendi",
              };
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            req.session.sessionFlash = {
                type: "alert alert-success",
                message: "Mesajınız başarılı bir şekilde gönderildi",
              };
              res.redirect("/contact");
        
          }
          
          main().catch(console.error);
});

module.exports = router;
