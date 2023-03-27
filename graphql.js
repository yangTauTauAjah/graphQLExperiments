const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLUnionType,
  GraphQLInputObjectType
} = require("graphql");
const mockData = require("./mocked_datas/mock_book.json");
const mockUserData = require("./mocked_datas/mock_user_data.json");
const mockFiles = require("./mocked_datas/mock_files.json");
const mockComments = require("./mocked_datas/mock_comments.json");

// READ

const userType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    created_at: {
      type: GraphQLString,
      resolve(obj) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      }
    }
  })
});

const fileType = new GraphQLObjectType({
  name: "FileType",
  fields: () => ({
    id: { type: GraphQLID },
    user_data: {
      type: userType,
      resolve(obj) {
        return mockUserData.find((e) => obj.user_id === e.id);
      }
    },
    title: { type: GraphQLString },
    tag: { type: GraphQLString },
    file_size: { type: GraphQLFloat },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    created_at: {
      type: GraphQLString,
      resolve(obj, arg) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      }
    }
  })
});

const commentType = new GraphQLObjectType({
  name: "CommentType",
  fields: () => ({
    id: { type: GraphQLID },
    user_data: {
      type: userType,
      resolve(obj) {
        return mockUserData.find((e) => obj.user_id === e.id);
      }
    },
    comment: { type: GraphQLString },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    created_at: {
      type: GraphQLString,
      resolve(obj, arg) {
        return new Date(Number.parseInt(obj.created_at)).toISOString();
      }
    }
  })
});

const DateInputType = new GraphQLInputObjectType({
  name: "DateCreation",
  fields: {
    before: { type: GraphQLString },
    after: { type: GraphQLString }
  }
});

const IntRangeType = new GraphQLInputObjectType({
  name: "IntRangeType",
  fields: {
    min: { type: GraphQLInt },
    max: { type: GraphQLInt }
  }
});

const FloatRangeType = new GraphQLInputObjectType({
  name: "FloatRangeType",
  fields: {
    min: { type: GraphQLFloat },
    max: { type: GraphQLFloat }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      User: {
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
                Date.parse(args.created_at.before) >
                Number.parseInt(e.created_at)
            );
          if (args.created_at?.after)
            _ = _.filter(
              (e) =>
                Date.parse(args.created_at.after) <
                Number.parseInt(e.created_at)
            );

          return _;
        }
      },
      Files: {
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
            _ = _.filter((e) => e.title.toLowerCase().includes(args.title.toLowerCase()));

          if (args.tag)
            _ = _.filter((e) => e.tag.toLowerCase() === args.tag.toLowerCase());

          if (args.file_size?.min)
            _ = _.filter((e) => e.file_size > args.file_size.min);

          if (args.file_size?.max)
            _ = _.filter((e) => e.file_size < args.file_size.max);

          if (args.likes?.min)
            _ = _.filter((e) => e.likes > args.likes.min);

          if (args.likes?.max)
            _ = _.filter((e) => e.likes < args.likes.max);

          if (args.dislikes?.min)
            _ = _.filter((e) => e.dislikes > args.dislikes.min);

          if (args.dislikes?.max)
            _ = _.filter((e) => e.dislikes < args.dislikes.max);

          if (args.created_at?.before)
            _ = _.filter(
              (e) =>
                Date.parse(args.created_at.before) >
                Number.parseInt(e.created_at)
            );

          if (args.created_at?.after)
            _ = _.filter(
              (e) =>
                Date.parse(args.created_at.after) <
                Number.parseInt(e.created_at)
            );

          return _;
        }
      },
      Comments: {
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
            return [
              mockComments.find((e) => e.id.toString() === args.comment_id)
            ];
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
            _ = _.filter((e) => e.comment.toLowerCase().includes(args.contain.toLowerCase()));

          if (args.likes?.min)
            _ = _.filter((e) => e.likes > args.likes.min);

          if (args.likes?.max)
            _ = _.filter((e) => e.likes < args.likes.max);

          if (args.dislikes?.min)
            _ = _.filter((e) => e.dislikes > args.dislikes.min);

          if (args.dislikes?.max)
            _ = _.filter((e) => e.dislikes < args.dislikes.max);

          if (args.created_at?.before)
            _ = _.filter(
              (e) =>
                Date.parse(args.created_at.before) >
                Number.parseInt(e.created_at)
            );

          if (args.created_at?.after)
            _ = _.filter(
              (e) =>
                Date.parse(args.created_at.after) <
                Number.parseInt(e.created_at)
            );

          return _;
        }
      }
    }
  })
});

module.exports = { schema };
