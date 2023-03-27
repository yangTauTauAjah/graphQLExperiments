const {
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat
} = require("graphql");
const { userType, fileType, commentType, ActionType } = require("./dataTypes");
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
    let index

    switch (action) {
      case "update":
        if (!user_id?.length && !username?.length)
          throw Error("Please provide user_id to perform Update");

        index = !user_id
          ? mockUserData.findIndex((e) => e.username === username)
          : mockUserData.findIndex((e) => e.id === Number.parseInt(user_id));

        if (index < 0) throw Error("user_id not found");

        for (let arg in args) {
          if (arg === "user_id") continue;
          mockUserData[index][arg] = args[arg];
        }

        return mockUserData[index];

      case "delete":
        if (!user_id?.length) throw Error("Please provide user_id to perform Delete");

        index = mockUserData.findIndex((e) => e.id === Number.parseInt(user_id));
        if (index < 0) throw Error("user_id not found");

        return mockUserData.splice(index, 1)[0];

      case "create":
      default:
        if (!username?.length || !email?.length)
          throw Error(
            "Please fill out username and email field to perform Create"
          );
        let _ = {
          id: mockUserData.length + 1,
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
    const { action, file_id, user_id, title, tag, file_size, likes, dislikes } = args;
    let index

    switch (action) {
      case "update":
        if (!file_id?.length)
          throw Error("Please provide file_id to perform Update");

        index = mockFiles.findIndex(
          (e) => e.id === Number.parseInt(file_id)
        );

        if (index < 0) throw Error("file_id not found");

        for (let arg in args) {
          if (arg === "file_id") continue;
          mockFiles[index][arg] = args[arg];
        }

        return mockFiles[index];

      case "delete":
        if (!file_id?.length)
          throw Error("Please provide file_id to perform Delete");

        index = mockFiles.findIndex((e) => e.id === Number.parseInt(file_id));
        if (index < 0) throw Error("file_id not found");

        return mockFiles.splice(index, 1)[0];

      case "create":
      default:
        if (!user_id?.length || !title?.length || !file_size)
          throw Error(
            "Please fill out user_id, title, and file_size field to perform Create"
          );

        let _ = {
          id: mockFiles.length + 1,
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
    action: {
      type: ActionType,
      defaultValue: "create"
    },
    comment_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    comment: { type: GraphQLString },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt }
  },
  resolve(obj, args) {
    const { action, comment_id, user_id, comment, likes, dislikes } = args;
    let index

    switch (action) {
      case "update":
        if (!comment_id?.length)
          throw Error("Please provide comment_id to perform Update");

        index = mockComments.findIndex(
          (e) => e.id === Number.parseInt(comment_id)
        );
        if (index < 0) throw Error("comment_id not found");

        for (let arg in args) {
          if (arg === "comment_id") continue;
          mockComments[index][arg] = args[arg];
        }

        return mockComments[index];

      case "delete":
        if (!comment_id?.length)
          throw Error("Please provide comment_id to perform Delete");

        index = mockComments.findIndex((e) => e.id === Number.parseInt(comment_id));
        if (index < 0) throw Error("comment_id not found");

        return mockComments.splice(index, 1)[0];

      case "create":
      default:
        if (!user_id?.length || !comment?.length)
          throw Error(
            "Please fill out user_id and comment field to perform Create"
          );

        let _ = {
          id: mockComments.length + 1,
          user_id: Number.parseInt(user_id),
          comment,
          likes: likes || 0,
          dislikes: dislikes || 0,
          created_at: Date.now().toString()
        };

        mockComments.push(_);

        return _;
    }
  }
};

module.exports = { UserSchema, FileSchema, CommentSchema };
