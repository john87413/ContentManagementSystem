const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: { type: String, unique: [true, '名稱不得重複'], required: [true, '名稱不得為空'] },
  password: {
    type: String,
    required: [true, '密碼不得為空'],
    select: false,
    set(val) {
      return require("bcryptjs").hashSync(val, 10);
    },
  },
});

module.exports = mongoose.model("User", schema);
