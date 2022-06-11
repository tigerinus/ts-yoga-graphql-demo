const ws = require('ws');
const Crypto = require('crypto');
const { createClient } = require('graphql-ws');

const client = createClient({
  url: "ws://localhost:4000/graphql",
  webSocketImpl: ws,
  generateID: () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (Crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16),
    ),
});

(async () => {
  const onNext = (value) => {
    console.log(value);
  }

  await new Promise((resolve, reject) => {
    client.subscribe(
      {
        query: `
          subscription newLink {
            newLink {
              id
              description
              url
            }
          }        
        `
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      }
    );
  });
})();