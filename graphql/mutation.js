const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");
const {
  userType,
  DateInputType,
  fileType,
  commentType,
  ActionType
} = require("./dataTypes");
const { mockUserData, mockFiles, mockComments } = require("./data");

const UserSchema = {
  type: userType,
  args: {
    action: {
      type: ActionType,
      defaultValue: "create"
    },
    user_id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  },
  resolve(obj, args) {
    const { action, user_id, username, email } = args;

    switch (action) {
      case "update":
        if (!user_id && !username.length)
          throw Error("Please provide user_id to perform Update");

        let index = !user_id
          ? mockUserData.findIndex((e) => e.username === username)
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
  type: fileType,
  args: {
    action: {
      type: ActionType,
      defaultValue: "create"
    },
    file_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    title: { type: GraphQLString },
    tag: { type: GraphQLString },
    file_size: { type: GraphQLFloat },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt }
  },
  resolve(obj, args) {
    const { action, user_id, title, tag, file_size, likes, dislikes } = args;

    switch (action) {
      case "update":
        if (!file_id?.length)
          throw Error("Please provide file_id to perform Update");

        let index = mockFiles.findIndex(
          (e) => e.id === Number.parseInt(file_id)
        );

        for (let arg in args) {
          if (arg === "file_id") continue;
          mockFiles[index][arg] = args[arg];
        }

        return mockFiles[index];

      case "delete":
        if (!file_id?.length)
          throw Error("Please provide file_id to perform Delete");

        index = mockFiles.findIndex((e) => e.id === file_id);

        return mockFiles.splice(index, 1);

      case "create":
      default:
        if (!user_id?.length || !title?.length || !file_size)
          throw Error(
            "Please fill out user_id, title, and file_size field to perform Create"
          );
          
        let _ = {
          id: mockFiles.length,
          user_id: Number.parseInt(user_id),
          title,
          tag: tag || null,
          file_size: file_size,
          likes: likes || 0,
          dislikes: dislikes || 0,
          created_at: Date.now().toString()
        };

        mockFiles.push(_);

        return _;
    }
  }
};

const CommentSchema = {
  type: commentType,
  args: {
    comment_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    content: { type: GraphQLString },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
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
