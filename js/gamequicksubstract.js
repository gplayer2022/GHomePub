new Vue({
  el: '#app',
  data: {
    level: 0,
    eachPoint: 10,
    questionsLength: 10,
    score: {
      point: 0,
      time: 0,
    },
    questions: [],
    is4SmartPhone: false,
    isRunning: false,
    startTime: 0,
  },
  methods: {
    startGame: function() {
      this.createQuestions();
      this.isRunning = !this.isRunning;
      this.startTime = Date.now();
      this.initializeScore();
    },
    initializeScore: function() {
      this.score.point = 0;
      this.score.time = 0;
    },
    createQuestions: function() {
      this.questions = [];
      for (let i = 0; i < this.questionsLength; i++) {
        let question = {};
        if (this.level === 0) {
          question.minuend = Math.floor(this.randomNext(10, 100));
          question.subtrahend = Math.floor(this.randomNext(0, 10));
        } else if (this.level === 1) {
          question.subtrahend = Math.floor(this.randomNext(10, 1000));
          const bills = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
          for (let j = 0; j < bills.length; j++) {
            if (question.subtrahend < bills[j]) {
              question.minuend = bills[Math.floor(this.randomNext(j, bills.length))];
              break;
            }
          }
        } else if (this.level === 2) {
          question.minuend = Math.floor(this.randomNext(100, 1000));
          question.subtrahend = Math.floor(this.randomNext(0, 100));
        } else {
          question.minuend = Math.floor(this.randomNext(0, 1000));
          question.subtrahend = Math.floor(this.randomNext(0, 1000));
        }
        question.difference = question.minuend - question.subtrahend;
        question.yourDifference = null;
        this.questions.push(question);
      }
    },
    randomNext: function(left, right) {
      return Math.random() * (right - left) + left;
    },
    answerDifference: function(i, value) {
      this.questions[i].yourDifference = parseFloat(value);
      if (this.questions[i].difference === this.questions[i].yourDifference) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
    },
    isFinished: function() {
      return this.questions.every(function(question) {
        return question.yourDifference !== null;
      });
    },
    endGame: function() {
      this.isRunning = !this.isRunning;
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});