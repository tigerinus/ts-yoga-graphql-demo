from gql import gql, Client
from gql.transport.websockets import WebsocketsTransport

if __name__ == '__main__':
    transport = WebsocketsTransport(
        url="ws://localhost:4000/graphql"
    )

    client = Client(transport=transport, fetch_schema_from_transport=True)

    query = gql(
        '''
          subscription newLink {
            newLink {
              id
              description
              url
            }
          } 
        '''
    )

    for result in client.subscribe(query):
        print(result)
