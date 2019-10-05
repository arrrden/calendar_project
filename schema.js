const axios = require('axios');

const {
    GraphQLSchema,

    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLID,
} = require('graphql');

// CALENDAR TYPES
// Events
const EventType = new GraphQLObjectType({
    name: 'DayEvents',
    fields: () => ({
        event_index: { type: GraphQLID },
        event_title: { type: GraphQLString },
        event_des: { type: GraphQLString },
        event_complete: { type: GraphQLBoolean },

        event_time: { type: TimeType },
    })
})

const TimeType = new GraphQLObjectType({
    name: 'Time',
    fields: () => ({
        day_index: { type: GraphQLInt },

        event_date: { type: GraphQLString },
        event_start: { type: GraphQLString },
        event_duration: { type: GraphQLInt },
    })
})


// Root Query / Resolver
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event_ROOT: {
            type: new GraphQLList(EventType),
            resolve(_, args) {
                return axios.get('http://localhost:3001/eventData')
                    .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})


//firebase