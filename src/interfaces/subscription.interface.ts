import { Document, Model, Schema } from 'mongoose';

export interface Subscription {
  subscriber: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionDocument extends Subscription, Document {}

export interface SubscriptionMethods {}

export interface SubscriptionModel extends Model<SubscriptionDocument> {}
