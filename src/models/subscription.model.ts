import { SubscriptionDocument, SubscriptionModel } from '@interfaces';
import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Subscription = model<SubscriptionModel>(
  'Subscription',
  subscriptionSchema,
);

export default Subscription;
