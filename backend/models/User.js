const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const likedProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  brand: String,
  color: String,
  fabric: String,
  length: String,
  type: String,
  fit: String,
  mainTrend: String,
  pattern: String,
  product: String
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedProducts: [likedProductSchema]
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
