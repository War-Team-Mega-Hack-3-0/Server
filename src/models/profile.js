const { models, model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const { encrypt } = require('../utils/encrypter');

const integrationSchema = new Schema(
  { label: { type: String } },
  { discriminatorKey: 'kind', _id: false }
);

const schema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  integrations: [integrationSchema],
  monthlyGoal: { type: Number },
  messageToken: { type: String },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

// VTEX Integration discriminator
schema.path('integrations').discriminator(
  'VTEX',
  new Schema(
    {
      code: { type: String },
      key: { type: String },
    },
    { _id: false }
  )
);

schema.pre('save', async function (next) {
  if (this.isModified()) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (
      this.integrations &&
      this.integrations.length > 0 &&
      this.isModified('integrations')
    ) {
      for (let i = 0; i < this.integrations.length; i++) {
        switch (this.integrations[i].kind) {
          case 'VTEX': {
            const { key, code } = this.integrations[i];
            if (this.isModified(`integrations.${i}.${key}`)) {
              this.integrations[i].key = encrypt(key);
            }
            if (this.isModified(`integrations.${i}.${code}`)) {
              this.integrations[i].code = encrypt(code);
            }
            break;
          }
        }
      }
    }

    this.updatedAt = new Date();
  }

  next();
});

module.exports = models.Profile || model('Profile', schema);
