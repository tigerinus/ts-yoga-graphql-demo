# ts-yoga-graphql-demo

This is a [graphql-yoga](graphql-yoga.com) based demo with subscription over websocket

## Run

```bash
$ npm install
added 107 packages, and audited 108 packages in 11s

7 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

$ npm start

> ts-yoga-graphql-demo@1.0.0 start
> ts-node src/main.ts

(node:10070) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
💡 🧘 Yoga - Running GraphQL Server at http://127.0.0.1:4000/graphql
```

## Test

Open two tabs of <http://127.0.0.1:4000/graphql> in browser:

### Tab 1

```graphql
subscription newLink {
  newLink {
    id
    description
    url
  }
}
```

> Click Run so this start listening for `newLink`

### Tab 2

```graphql
query feed {
  feed {
    id
    url
    description
  }
}

mutation postLink {
  postLink(
    url: "www.prisma.io"
    description: "Prisma replaces traditional ORMs"
  ) {
    id
  }
}
```

> Run postLink and watch for subscribed `newLink` in Tab 1
