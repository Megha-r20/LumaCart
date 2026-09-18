import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';

const getServerModule = async (port) => import(`../server.js?port=${port}&ts=${Date.now()}`);

test('startServer falls back to the next port when the default port is already in use', async () => {
  const port = 5100;
  process.env.PORT = String(port);

  const blocker = net.createServer();
  await new Promise((resolve) => blocker.listen(port, '127.0.0.1', resolve));

  const { startServer } = await getServerModule(port);
  const server = await startServer(port);

  assert.equal(server.address().port, port + 1);

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  await new Promise((resolve, reject) => {
    blocker.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});
