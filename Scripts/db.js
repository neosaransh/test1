var Parse = require('parse/node');

Parse.serverURL = 'http://medimo-test.herokuapp.com/parse';

Parse.initialize('bGbWSeIv6znyE7xctLTB', null, '835aFHTnKlnqm9wsPNgd');

Object.assign(Parse.Query.prototype, {
  equalToPointer(key, className, objectId) {
    return this.equalTo(key, {__type: 'Pointer', className, objectId});
  }
});

module.exports = Parse;
