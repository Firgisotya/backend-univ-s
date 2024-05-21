const nodemailer = require("nodemailer");
const Mustache = require("mustache");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "univsproject@gmail.com",
    pass: "xqkehdblwtszrdja",
  },
});

const otpMail = async (email, data) => {
  // membuat kondisi jam pagi siang sore malam dari jam saat ini
  let time = new Date().getHours();
  let greeting = "";
  if (time < 12) {
    greeting = "pagi";
  } else if (time > 12 && time < 15) {
    greeting = "siang";
  } else if (time > 15 && time <= 17) {
    greeting = "sore";
  } else {
    greeting = "malam";
  }
  try {
    let template = fs.readFileSync("views/email/otp.html", "utf8");
    let message = {
      from: "univsproject@gmail.com",
      to: email,
      subject: `Haloo, kak ${data.name} berikut adalah OTP untuk melakukan reset password`,
      html: Mustache.render(template, data),
    };
    return await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
const orderMail = async (email, data) => {
  // membuat kondisi jam pagi siang sore malam dari jam saat ini
  let time = new Date().getHours();
  let greeting = "";
  if (time < 12) {
    greeting = "pagi";
  } else if (time > 12 && time < 15) {
    greeting = "siang";
  } else if (time > 15 && time <= 17) {
    greeting = "sore";
  } else {
    greeting = "malam";
  }
  try {
    let template = fs.readFileSync("app/views/email/invoice.html", "utf8");
    let message = {
      from: gmail,
      to: email,
      subject: `Haloo, selamat ${greeting} kak ${data.personalDetail.firstName} ${data.personalDetail.lastName} terima kasih telah melakukan pemesanan tiket pada DuweGawe, Berikut adalah kode invoice anda.`,
      html: Mustache.render(template, data),
    };
    return await transporter.sendMail(message);
  } catch (error) {}
};

module.exports = { otpMail, orderMail };
