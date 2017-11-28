import GlobalState from './GlobalState.js';

class ApiRequest {
  constructor(method, endpoint, body, type) {
    this.path = endpoint;
    this.options = {
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    }
    if (body) {
      this.options.headers['Content-Type'] = type || 'application/json';
      this.options.body = type && type !== 'application/json' ? body : JSON.stringify(body);
    }
    var session = new GlobalState().getValue('session');
    if (session) {
      this.options.headers['x-medimo-api-session'] = session;
    }
  }

  send(handler) {
    return fetch(this.path, this.options).then(res => res.text().then(data => handler(res, typeof data === 'string' ? JSON.parse(data, (key, value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) ? new Date(value) : value) : data)));
  }
}

export default ApiRequest;
