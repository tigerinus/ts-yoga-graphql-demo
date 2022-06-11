import { createServer } from '@graphql-yoga/node'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import { graphqlSchema } from './schema'


async function main() {
    const yogaApp = createServer({
        schema: graphqlSchema,
        graphiql: {
            // Use WebSockets in GraphiQL
            subscriptionsProtocol: 'WS',
        },
    })

    // Get NodeJS Server from Yoga
    const httpServer = await yogaApp.start()
    // Create WebSocket server instance from our Node server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: yogaApp.getAddressInfo().endpoint,
    })

    // Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
    useServer(
        {
            execute: (args: any) => args.rootValue.execute(args),
            subscribe: (args: any) => args.rootValue.subscribe(args),
            onSubscribe: async (ctx, msg) => {
                const { schema, execute, subscribe, contextFactory, parse, validate } =
                    yogaApp.getEnveloped(ctx)

                const args = {
                    schema,
                    operationName: msg.payload.operationName,
                    document: parse(msg.payload.query),
                    variableValues: msg.payload.variables,
                    contextValue: await contextFactory(),
                    rootValue: {
                        execute,
                        subscribe,
                    },
                }

                const errors = validate(args.schema, args.document)
                if (errors.length) return errors
                return args
            },
        },
        wsServer,
    )
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})