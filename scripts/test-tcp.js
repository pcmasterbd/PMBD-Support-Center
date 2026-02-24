
const net = require('net');

const client = new net.Socket();
const port = 5432;
const host = 'db.prisma.io';

console.log(`Connecting to ${host}:${port}...`);

client.connect(port, host, function () {
    console.log('SUCCESS: Connected to host!');
    client.destroy();
});

client.on('error', function (err) {
    console.error('FAILED: Connection error:', err.message);
    process.exit(1);
});

client.setTimeout(5000, function () {
    console.error('FAILED: Connection timed out');
    client.destroy();
    process.exit(1);
});
