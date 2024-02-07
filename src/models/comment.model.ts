import { CommentDocument, CommentMethods, CommentModel } from '@/interfaces';
import { Schema, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema<CommentDocument, CommentModel, CommentMethods>(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

commentSchema.plugin(mongooseAggregatePaginate);

const Comment = model<CommentDocument, CommentModel>('Comment', commentSchema);

export default Comment;
