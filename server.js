
const app = require("./src/index");

const port = process.env.DEV_APP_PORT;

const server = app.listen(port, () => {
    console.log('Server is running on port ' + port);
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit server'));
})