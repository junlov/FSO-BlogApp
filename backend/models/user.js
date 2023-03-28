const mongoose = require("mongoose");
const uniqueValidor = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 3 },
  passwordHash: { type: String, required: true },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidor);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
