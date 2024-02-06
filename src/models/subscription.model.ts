import {
  SubscriptionDocument,
  SubscriptionMethods,
  SubscriptionModel,
} from '@/interfaces';
import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema<
  SubscriptionDocument,
  SubscriptionModel,
  SubscriptionMethods
>(
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

const Subscription = model<SubscriptionDocument, SubscriptionModel>(
  'Subscription',
  subscriptionSchema,
);

export default Subscription;
