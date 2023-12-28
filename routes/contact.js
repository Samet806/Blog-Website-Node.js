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
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
           
              user: "sametkoruk2@gmail.com",
              pass: "yoenakmmcedfppqx",
            },
          });
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Node Proje contact form" <sametkoruk2@gmail.com>', // sender address
              to: "sametkoruk2@gmail.com", // list of receivers
              subject: "Node Contact message ✔", // Subject line
              text: "Hello world?", // plain text body
              html: outputHTML, // html body
            });

            req.session.sessionFlash = {
                type: "alert alert-success",
                message: "Postunuz başarılı bir şekilde eklendi",
              };
          
            console.log("Message sent: %s", info.messageId);
          
            req.session.sessionFlash = {
                type: "alert alert-success",
                message: "Mesajınız başarılı bir şekilde gönderildi",
              };
              res.redirect("/contact");
        
          }
          
          main().catch(console.error);
});

module.exports = router;
