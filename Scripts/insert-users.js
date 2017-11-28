var Parse = require('./db.js');
var csv = require('csv-parse/lib/sync');
var fs = require('fs');

var data = csv(fs.readFileSync(process.argv[2]));
data.forEach(row => {
  var user = new Parse.Object('_User', {username: row[0].toLowerCase().replace(/[^a-z]/g, '.'), name: row[0], password: 'test', type: 'patient'});
  user.save({}, {
    useMasterKey: true,
    success: console.log,
    error: (obj, error) => console.log(error)
  });
});
