const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLEnumType
} = require("graphql");
const { mockUserData } = require("./data");

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
      resolve(obj) {
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

const ActionType = new GraphQLEnumType({
  name: "ActionType",
  values: {
    create: { value: "create" },
    update: { value: "update" },
    delete: { value: "delete" }
  }
})

module.exports = {
  userType,
  fileType,
  commentType,
  DateInputType,
  IntRangeType,
  FloatRangeType,
  ActionType
};
