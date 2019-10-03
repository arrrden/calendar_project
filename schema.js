const axios = require('axios');

const {
    GraphQLSchema,

    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
} = require('graphql');


// Fake Type 
const FakeType = new GraphQLObjectType({
    name: 'FakeName',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
    })
});




// // Types
// const DayType = new GraphQLObjectType({
//     name: 'daysEvents',
//     fields: () => ({
//         day: { type: GraphQLString },
//         events: { type: EventType }
//     })
// });

// // Child Type
// const EventType = new GraphQLObjectType({
//     name: 'eventList',
//     fields: () => ({
//         TITLE: { type: GraphQLString },
//         TIME: { type: GraphQLString },
//         DURATION: { type: GraphQLString },
//         LOCATIONS: { type: GraphQLString }
//     })
// });

// Root Query --- YO THIS MUST REFERENCE THE OTHER SHIT
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        FAKE: {
            type: new GraphQLList(FakeType),
            resolve(parent, args) {


                return axios.get('http://localhost:3000/fakeDatabase')
                    .then(res => res.data)
            },
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})


//firebase