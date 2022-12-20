const EntitySchema = require('typeorm').EntitySchema
const otpSchema = new EntitySchema({
  name: 'otp',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },

    userName: {
      type: 'varchar',
      unique: true,
      nullable: false
    },
    code: {
      type: 'varchar',
      nullable: false
    },
    expireIn: {
      type: Date,
      nullable: false
    }
  }
})

module.exports = { otpSchema }
