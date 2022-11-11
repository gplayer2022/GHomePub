new Vue({
  el: "#app",
  data: {
    level: 0,
    eachPoint: 5,
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
    startGame: function () {
      this.createQuestions();
      this.isRunning = !this.isRunning;
      this.startTime = Date.now();
      this.initializeScore();
    },
    initializeScore: function () {
      this.score.point = 0;
      this.score.time = 0;
    },
    createQuestions: function () {
      this.questions = [];
      for (let i = 0; i < this.questionsLength; i++) {
        let question = {};
        if (this.level === 0 || this.level === 1) {
          this.eachPoint = 5;
          if (this.level === 0) {
            question.dividend = Math.floor(Math.random() * 10);
            question.divisor = Math.floor(Math.random() * 9) + 1;
          } else {
            question.dividend = Math.floor(Math.random() * 100);
            question.divisor = Math.floor(Math.random() * 49) + 1;
          }
          question.quotient = Math.floor(question.dividend / question.divisor);
          question.remainder = question.dividend % question.divisor;
          question.yourQuotient = null;
          question.yourRemainder = null;
        } else if (this.level === 2 || this.level === 3) {
          this.eachPoint = 10;
          let quotient;
          if (this.level === 2) {
            question.divisor = Math.floor(Math.random() * 9) + 1;
            quotient = Math.floor(Math.random() * 150);
          } else {
            question.divisor = Math.floor(Math.random() * 49) + 1;
            quotient = Math.floor(Math.random() * 150);
          }
          let dividend = quotient * question.divisor;
          let pointPosition = Math.floor(Math.random() * 2) + 1;
          question.quotient = this.slideDecimalPoint(quotient, pointPosition);
          question.dividend = this.slideDecimalPoint(dividend, pointPosition);
          question.remainder = null;
          question.yourQuotient = null;
          question.yourRemainder = null;
        } else if (this.level === 4 || this.level === 5) {
          this.eachPoint = 10;
          let quotient;
          let divisor;
          if (this.level === 4) {
            divisor = Math.floor(Math.random() * 9) + 1;
            quotient = Math.floor(Math.random() * 150);
          } else {
            divisor = Math.floor(Math.random() * 49) + 1;
            quotient = Math.floor(Math.random() * 150);
          }
          let dividend = quotient * divisor;
          let pointPosition = Math.floor(Math.random() * 3) + 1;
          let divisorPointPosition = Math.floor(Math.random() * 2) + 1;
          question.quotient = this.slideDecimalPoint(
            quotient,
            pointPosition - divisorPointPosition
          );
          question.dividend = this.slideDecimalPoint(dividend, pointPosition);
          question.divisor = this.slideDecimalPoint(
            divisor,
            divisorPointPosition
          );
          question.remainder = null;
          question.yourQuotient = null;
          question.yourRemainder = null;
        } else {
        }
        this.questions.push(question);
      }
    },
    slideDecimalPoint: function (integer, pointPosition) {
      let _integer;
      if (pointPosition < 0) {
        _integer = integer * Math.pow(10, -1 * pointPosition);
      } else {
        _integer = "0".repeat(pointPosition) + integer.toString();
        let left = _integer.substring(0, _integer.length - pointPosition);
        let right = _integer.substring(_integer.length - pointPosition);
        _integer = left + "." + right;
      }
      return parseFloat(_integer);
    },
    answerQuotient: function (i, value) {
      this.questions[i].yourQuotient = parseFloat(value);
      if (this.questions[i].quotient === this.questions[i].yourQuotient) {
        this.score.point += this.eachPoint;
      }
      if (this.hasDone()) {
        this.endGame();
      }
    },
    answerRemainder: function (i, value) {
      this.questions[i].yourRemainder = parseFloat(value);
      if (this.questions[i].remainder === this.questions[i].yourRemainder) {
        this.score.point += this.eachPoint;
      }
      if (this.hasDone()) {
        this.endGame();
      }
    },
    hasDone: function () {
      return this.questions.every(function (question) {
        let hasDone = false;
        if (question.remainder !== null) {
          if (
            question.yourQuotient !== null &&
            question.yourRemainder !== null
          ) {
            hasDone = true;
          }
        } else {
          if (question.yourQuotient !== null) {
            hasDone = true;
          }
        }
        return hasDone;
      });
    },
    endGame: function () {
      this.isRunning = !this.isRunning;
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});
