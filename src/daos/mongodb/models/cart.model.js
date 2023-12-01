import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CartSchema = new mongoose.Schema({
  first_name: { 
    type: String, 
    required: true,
    index: true
  },
  last_name: { type: String, required: true },
  age: { type: Number },
  email:  { type: String, required: true, unique: true },  
  gender:  { type: String, required: true },
  pets:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      default: []
    }
  ]
});

CartSchema.plugin(mongoosePaginate);

CartSchema.pre('find', function(){
  this.populate('products')
})

export const CartModel = mongoose.model(
  'carts',
  CartSchema
); 


