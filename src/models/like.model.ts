import { LikeDocument, LikeMethods, LikeModel } from '@/interfaces';
import { Schema, model } from 'mongoose';

const likeSchema = new Schema<LikeDocument, LikeModel, LikeMethods>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Like = model<LikeDocument, LikeModel>('Like', likeSchema);

export default Like;
