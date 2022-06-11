import { makeExecutableSchema } from '@graphql-tools/schema'
import { createPubSub } from '@graphql-yoga/node'

const pubSub = createPubSub()

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    postLink(url: String!, description: String!): Link!
  }

  type Subscription {
    newLink: Link
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`

// 1
type Link = {
    id: string
    url: string
    description: string
}

// 2
const links: Link[] = [
    {
        id: 'link-0',
        url: 'https://graphql-yoga.com',
        description: 'The easiest way of setting up a GraphQL server',
    },
]


const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        // 3
        feed: () => links,
    },
    Mutation: {
        postLink: (parent: unknown, args: { description: string; url: string }) => {
            // 1
            let idCount = links.length

            // 2
            const link: Link = {
                id: `link-${idCount}`,
                description: args.description,
                url: args.url,
            }

            links.push(link)
            pubSub.publish('newLink', link)
            return link
        },
    },
    Subscription: {
        newLink: {
            subscribe: () => pubSub.subscribe('newLink'),
            resolve: (payload: Link) => payload,
        },
    },
    // 4
    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
    },
}

export const graphqlSchema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions],
})
