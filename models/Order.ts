import mongoose, { Schema, model, Model } from 'mongoose';
import { IOrder } from '../interfaces';

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      zip: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      country: { type: String, required: true },
      lastName: { type: String, required: true },
      firstName: { type: String, required: true },
      address2: { type: String },
    },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paidAt: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    subTotal: { type: Number, required: true },
    numberOfItems: { type: Number, required: true },
    paymentResult: { type: String },
  },
  {
    timestamps: true,
  }
);

const OrderModel: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

export default OrderModel;

/*
console.log({myModels: mongoose.models});
{
  myModels: {
    Product: Model { Product },
    User: Model { User },
    Order: Model { Order }
  }
}
*/
