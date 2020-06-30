const { models, model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const { encrypt } = require('../utils/encrypter');

const integrationSchema = new Schema({
  label: { type: String },
  key: { type: String },
  code: { type: String },
});

const schema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String },
  integrations: [integrationSchema],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

schema.pre('save', async function (next) {
  // Se password modificado = encrypta
  // Se integrationSchema modificado = Key e Code encryptado
  // Modificado = updated at
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.integrations && this.integrations.length > 0) {
    for (let i = 0; i < this.integrations.length; i++) {
      if (this.isModified(`integrations.${i}`)) {
        const { key, code } = this.integrations[i];
        if (key) {
          this.integrations[i].key = encrypt(key);
        }
      }
    }
  }

  if (this.isModified) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = models.Profile || model('Profile', schema);
