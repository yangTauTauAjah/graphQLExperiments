const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLUnionType
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
          created_at: {
            type: new GraphQLObjectType({
              name: 'DateCreation',
              fields: {
                before: {type: GraphQLString},
                after: {type: GraphQLString}
              }
            })
          }
        },
        resolve(obj, args) {
          if (args.user_id) return [mockUserData.find((e) => e.id.toString() === args.user_id)];
          else if (Object.keys(args) === 0) return mockUserData

          let _ = structuredClone(mockUserData)
          
          if (args.username) _ = _.filter(e => e.username.includes(args.username))
          if (args.email) _ = _.filter(e => e.email.includes(args.email))
          if (args.created_at.before) _ = _.filter(e => Number.parseInt(e.created_at.before) > Number.parseInt(e.created_at))
          if (args.created_at.after) _ = _.filter(e => Number.parseInt(e.created_at.after) < Number.parseInt(e.created_at))
        }
      },
      Files: {
        type: new GraphQLList(fileType),
        resolve(obj, arg) {
          return mockFiles;
        }
      },
      Comments: {
        type: new GraphQLList(commentType),
        resolve(obj, arg) {
          return mockComments;
        }
      }
    }
  }),
});

module.exports = { schema };
