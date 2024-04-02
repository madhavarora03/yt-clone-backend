import { TweetDocument, TweetMethods, TweetModel } from '@interfaces';
import { Schema, model } from 'mongoose';

const tweetSchema = new Schema<TweetDocument, TweetModel, TweetMethods>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Tweet = model<TweetDocument, TweetModel>('Tweet', tweetSchema);

export default Tweet;
