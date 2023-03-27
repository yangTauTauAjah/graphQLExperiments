const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require("graphql");
const { userType, DateInputType, fileType, FloatRangeType, IntRangeType, commentType } = require('./dataTypes')
const { mockUserData, mockFiles, mockComments } = require("./data");

const UserSchema = {
  type: new GraphQLList(userType),
  args: {
    user_id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    created_at: { type: DateInputType }
  },
  resolve(obj, args) {
    if (args.user_id)
      return [mockUserData.find((e) => e.id.toString() === args.user_id)];
    else if (Object.keys(args) === 0) return mockUserData;

    let _ = structuredClone(mockUserData);

    if (args.username)
      _ = _.filter((e) =>
        e.username.toLowerCase().includes(args.username.toLowerCase())
      );
    if (args.email)
      _ = _.filter((e) =>
        e.email.toLowerCase().includes(args.email.toLowerCase())
      );
    if (args.created_at?.before)
      _ = _.filter(
        (e) =>
          Date.parse(args.created_at.before) > Number.parseInt(e.created_at)
      );
    if (args.created_at?.after)
      _ = _.filter(
        (e) => Date.parse(args.created_at.after) < Number.parseInt(e.created_at)
      );

    return _;
  }
};

const FileSchema = {
  type: new GraphQLList(fileType),
  args: {
    file_id: { type: GraphQLID },
    user_identifier: { type: GraphQLString },
    title: { type: GraphQLString },
    tag: { type: GraphQLString },
    file_size: { type: FloatRangeType },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    created_at: { type: DateInputType }
  },
  resolve(obj, args) {
    if (args.file_id)
      return [mockFiles.find((e) => e.id.toString() === args.file_id)];
    else if (Object.keys(args) === 0) return mockFiles;

    let _ = structuredClone(mockFiles);

    if ((i = args.user_identifier)) {
      let o =
        i.search(/\D/) !== -1
          ? mockUserData.find((e) =>
              e.username.toLowerCase().includes(i.toLowerCase())
            )?.id
          : i;
      _ = _.filter((e) => e.user_id === Number.parseInt(o));
    }

    if (args.title)
      _ = _.filter((e) =>
        e.title.toLowerCase().includes(args.title.toLowerCase())
      );

    if (args.tag)
      _ = _.filter((e) => e.tag.toLowerCase() === args.tag.toLowerCase());

    if (args.file_size?.min)
      _ = _.filter((e) => e.file_size > args.file_size.min);

    if (args.file_size?.max)
      _ = _.filter((e) => e.file_size < args.file_size.max);

    if (args.likes?.min) _ = _.filter((e) => e.likes > args.likes.min);

    if (args.likes?.max) _ = _.filter((e) => e.likes < args.likes.max);

    if (args.dislikes?.min) _ = _.filter((e) => e.dislikes > args.dislikes.min);

    if (args.dislikes?.max) _ = _.filter((e) => e.dislikes < args.dislikes.max);

    if (args.created_at?.before)
      _ = _.filter(
        (e) =>
          Date.parse(args.created_at.before) > Number.parseInt(e.created_at)
      );

    if (args.created_at?.after)
      _ = _.filter(
        (e) => Date.parse(args.created_at.after) < Number.parseInt(e.created_at)
      );

    return _;
  }
};

const CommentSchema = {
  type: new GraphQLList(commentType),
  args: {
    comment_id: { type: GraphQLID },
    user_identifier: { type: GraphQLString },
    contain: { type: GraphQLString },
    likes: { type: IntRangeType },
    dislikes: { type: IntRangeType },
    created_at: { type: DateInputType }
  },
  resolve(obj, args) {
    if (args.comment_id)
      return [mockComments.find((e) => e.id.toString() === args.comment_id)];
    else if (Object.keys(args) === 0) return mockComments;

    let _ = structuredClone(mockComments);

    if ((i = args.user_identifier)) {
      let o =
        i.search(/\D/) !== -1
          ? mockUserData.find((e) =>
              e.username.toLowerCase().includes(i.toLowerCase())
            )?.id
          : i;
      _ = _.filter((e) => e.user_id === Number.parseInt(o));
    }

    if (args.contain)
      _ = _.filter((e) =>
        e.comment.toLowerCase().includes(args.contain.toLowerCase())
      );

    if (args.likes?.min) _ = _.filter((e) => e.likes > args.likes.min);

    if (args.likes?.max) _ = _.filter((e) => e.likes < args.likes.max);

    if (args.dislikes?.min) _ = _.filter((e) => e.dislikes > args.dislikes.min);

    if (args.dislikes?.max) _ = _.filter((e) => e.dislikes < args.dislikes.max);

    if (args.created_at?.before)
      _ = _.filter(
        (e) =>
          Date.parse(args.created_at.before) > Number.parseInt(e.created_at)
      );

    if (args.created_at?.after)
      _ = _.filter(
        (e) => Date.parse(args.created_at.after) < Number.parseInt(e.created_at)
      );

    return _;
  }
};

module.exports = { UserSchema, FileSchema, CommentSchema };
