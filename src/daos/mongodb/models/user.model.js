import mongoose, { Schema, model } from 'mongoose'

const usersSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart"
  },
  isGithub: {
    type: Boolean,
    required: true,
    default: false
  },
  isGoogle: {
    type: Boolean,
    required: true,
    default: false
  },
  last_connection: {
    type: Date,
    default: Date.now, 
    required: true
  }
})

// usersSchema.pre("find", function () {
//   this.populate("cart");
// });

const userColl = 'users'
export const UserModel = model(userColl,usersSchema)
