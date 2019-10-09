const axios = require('axios');
const moment = require('moment');

const {
    GraphQLSchema,

    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLID,
} = require('graphql');

// TYPES
// Events

const EventType = new GraphQLObjectType({
    name: 'EventType',
    description: 'Individual instances of events',
    fields: () => ({
        id: { type: GraphQLString },
        event_title: { type: GraphQLString },
        event_des: { type: GraphQLString },
        event_complete: { type: GraphQLBoolean },

        event_info: { type: TimeType },

        event_monthIndex: {
            type: GraphQLString,
            resolve(obj) {
                console.log('hello 2')
                return moment(obj.event_info.eventDate).format('MM-YYYY')
            }
        },
        event_dayIndex: {
            type: GraphQLInt,
            resolve(obj) {
                return parseInt(moment(obj.event_info.eventDate).format('D'))
            }
        }
    })
})

// Time

const TimeType = new GraphQLObjectType({
    name: 'TimeType',
    description: 'Returns the date time and duration of an event',
    fields: () => ({
        eventDate: { type: GraphQLString }, // 'MM-DD-YYYY'
        start_time: { type: GraphQLString }, // 'HH:mm'
        end_time: { // HH-mm //FOR SOME REASON MOMENT RESETS THE TIME TO MIDNGHT...
            type: GraphQLString,
            resolve(obj) {
                return moment([obj.start_time]).add(obj.duration, 'hours').format('HH:mm')
            }
        },
        duration: { type: GraphQLInt },
    })
})

// ROOT

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'returns an event by its event_id or an array of events by the month',
    fields: {
        event: {
            type: EventType,
            description: 'returns an event by its id',
            args: {
                id: { type: GraphQLString }
            },
            resolve(_, args) {
                return axios.get('http://localhost:3001/eventData/' + args.id)
                    .then(res => res.data)
            }
        },
        events: {
            type: new GraphQLList(EventType),
            description: 'returns all events in a given month',
            args: {
                event_monthIndex: { type: GraphQLString }
            },
            resolve(_, args) {
                console.log('hello')
                return axios.get('http://localhost:3001/eventData/', { params: args })
                    .then(res => res.data.filter(d => console.log('res', d) || moment(d.event_info.eventDate).format("MM-YYYY") === args.event_monthIndex))

            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})