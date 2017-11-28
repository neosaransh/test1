var Parse = require('./db.js');
var csv = require('csv-parse/lib/sync');
var fs = require('fs');

var data = csv(fs.readFileSync(process.argv[2]));
data.forEach(row => {
  new Parse.Query('_User').equalTo('name', row[0]).first({
    success: user => {
      var mhr = new Parse.Object('MHR', {patient: user, dateOfBirth: new Date(parseInt(row[1].substr(6, 2)) + 1900, parseInt(row[1].substr(3, 2)), parseInt(row[1].substr(0, 2))), gender: parseInt(row[2]) ? 'Female' : 'Male', ethnicity: row[5]});
      mhr.save({}, {
        useMasterKey: true,
        success: obj => {
          console.log(obj);
          var height = new Parse.Object('ScreenAnswer', {mhr: obj, question: {__type: 'Pointer', className: 'ScreenQuestion', objectId: 'UXWQ0hIAhi'}, uploader: {__type: 'Pointer', className: '_User', objectId: '6uXG8x1ic9'}, answer: {type: 'measurement', units: 'm', value: parseFloat(row[3])}});
          height.save({}, {
            useMasterKey: true,
            success: console.log,
            error: (obj, error) => console.log(error)
          });
          var weight = new Parse.Object('ScreenAnswer', {mhr: obj, question: {__type: 'Pointer', className: 'ScreenQuestion', objectId: 'rYyxDbFiFN'}, uploader: {__type: 'Pointer', className: '_User', objectId: '6uXG8x1ic9'}, answer: {type: 'measurement', units: 'kg', value: parseFloat(row[4])}});
          weight.save({}, {
            useMasterKey: true,
            success: console.log,
            error: (obj, error) => console.log(error)
          });
        },
        error: (obj, error) => console.log(error)
      });
    },
    error: (obj, error) => console.log(error)
  })
});
