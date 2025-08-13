const waitPort = require('wait-port');
const { exec } = require('child_process');

waitPort({
  host: 'localhost',
  port: 5432,
  timeout: 30000
}).then((open) => {
  if (open) {
    console.log('Database is ready!');
    exec('npm run seed', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error seeding: ${error}`);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    });
  } else {
    console.log('Database did not become available within the timeout');
  }
});
