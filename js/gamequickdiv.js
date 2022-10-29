new Vue({
  el: '#app',
  data: {
    eachPoint: 5,
    questionsLength: 10,
    score: {
      point: 0,
      time: 0,
    },
    questions: [],
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
        question.dividend = Math.floor(Math.random() * 10);
        question.divisor = Math.floor(Math.random() * 9) + 1;
        question.quotient = Math.floor(question.dividend / question.divisor);
        question.remainder = question.dividend % question.divisor;
        question.yourQuotient = -1;
        question.yourRemainder = -1;
        this.questions.push(question);
      }
    },
    answerQuotient: function(i, value) {
      this.questions[i].yourQuotient = parseInt(value);
      if (this.questions[i].quotient === this.questions[i].yourQuotient) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
    },
    answerRemainder: function(i, value) {
      this.questions[i].yourRemainder = parseInt(value);
      if (this.questions[i].remainder === this.questions[i].yourRemainder) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
    },
    isFinished: function() {
      return this.questions.every(function(question) {
        return question.yourQuotient !== -1 && question.yourRemainder !== -1;
      });
    },
    endGame: function() {
      this.isRunning = !this.isRunning;
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});