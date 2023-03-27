const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require("graphql");
const {
  userType,
  DateInputType,
  fileType,
  FloatRangeType,
  IntRangeType,
  commentType
} = require("./dataTypes");
const { mockUserData, mockFiles, mockComments } = require("./data");

const UserSchema = {
  type: userType,
  args: {
    action: {
      type: new GraphQLEnumType({
        name: "ActionType",
        values: {
          create: { value: "create" },
          update: { value: "update" },
          delete: { value: "delete" }
        }
      }),
      defaultValue: "create"
    },
    user_id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  },
  resolve(obj, args) {
    const { action, user_id, username, email } = args;

    console.log(args);

    switch (action) {
      case "update":
        if (!user_id && !username.length)
          throw Error("Please provide user_id to perform Update");

        let index = !user_id
          ? mockUserData.findIndex(
              (e) => e.username === Number.parseInt(username)
            )
          : mockUserData.findIndex((e) => e.id === Number.parseInt(user_id));

        for (let arg in args) {
          if (arg === "user_id") continue;
          mockUserData[index][arg] = args[arg];
        }

        return mockUserData[index];

      case "delete":
        if (!user_id) throw Error("Please provide user_id to perform Delete");

        index = mockUserData.findIndex((e) => e.id === user_id);

        return mockUserData.splice(index, 1);

      case "create":
      default:
        if (!username.length || !email.length)
          throw Error(
            "Please fill out username and email field to perform Create"
          );
        let _ = {
          id: mockUserData.length,
          username,
          email,
          created_at: Date.now().toString()
        };

        mockUserData.push(_);

        return _;
    }
  }
};

const FileSchema = {
  type: new GraphQLList(fileType),
  args: {
    file_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: GraphQLID },
    title: { type: GraphQLString },
    tag: { type: GraphQLString },
    file_size: { type: FloatRangeType },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt }
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
    comment_id: { type: new GraphQLNonNull(GraphQLID) },
    user_id: { type: GraphQLID },
    content: { type: GraphQLString },
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
