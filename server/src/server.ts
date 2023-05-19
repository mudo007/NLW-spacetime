import fastify from 'fastify';

const app = fastify();
const serverPort = 1234;

//test route
app.get('/hello', () => {
  return 'Hello World';
});

//starts the server on localhost.
//we need to add host: '0.0.0.0' because of docker
app
  .listen({
    port: serverPort,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${serverPort}`);
  });
