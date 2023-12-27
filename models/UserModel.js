const mongoose = require("mongoose");
const moment = require("moment");


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User name giriniz"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email  giriniz"],
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 6 },
  token: String,
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
