import ApiRequest from './ApiRequest.js';

export class Screen {
  constructor(data) {
    this.data = data;
  }

  getQuestions(callback) {
    if (this.questions) {
      setImmediate(() => callback(this.questions, 200));
    } else {
      new ApiRequest('GET', '/questions?id=' + this.data.id).send((res, data) => {
        if (res.status < 400) {
          this.questions = data;
        }
        callback(data, res.status);
        console.log(data);
      });
    }
  }
}

export default (callback => {
  new ApiRequest('GET', '/screens').send((res, data) => {
    if (res.status < 400) {
      callback(data.map(screen => new Screen(screen)), 200);
    } else {
      callback(data, res.status);
    }
  });
});
