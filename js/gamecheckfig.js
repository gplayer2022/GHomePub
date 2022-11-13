new Vue({
  el: "#app",
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
        if (this.level === 0) {
          question.operator = "+";
          question.checkOperator = "-";
          question.left = Math.floor(this.randomNext(0, 12));
          question.right = Math.floor(this.randomNext(0, 10));
          question.answer = question.left + question.right;
          question.remainder = null;
        } else if (this.level === 1) {
          question.operator = "-";
          question.checkOperator = "+";
          question.answer = Math.floor(this.randomNext(0, 10));
          question.right = Math.floor(this.randomNext(0, 10));
          question.left = question.answer + question.right;
          question.remainder = null;
        } else if (this.level === 2) {
          question.operator = "×";
          question.checkOperator = "÷";
          question.left = Math.floor(this.randomNext(0, 12));
          question.right = Math.floor(this.randomNext(1, 10));
          question.answer = question.left * question.right;
          question.remainder = null;
        } else if (this.level === 3) {
          question.operator = "÷";
          question.checkOperator = "×";
          question.answer = Math.floor(this.randomNext(0, 10));
          question.right = Math.floor(this.randomNext(1, 10));
          question.left = question.answer * question.right;
          question.remainder = null;
        } else {
          question.operator = "÷";
          question.checkOperator = "×";
          question.answer = Math.floor(this.randomNext(0, 10));
          question.right = Math.floor(this.randomNext(1, 10));
          question.remainder = Math.floor(this.randomNext(0, question.right));
          question.left = question.answer * question.right + question.remainder;
        }
        question.yourLeft = null;
        this.questions.push(question);
      }
    },
    randomNext: function (left, right) {
      return Math.random() * (right - left) + left;
    },
    answer: function (i, value) {
      this.questions[i].yourLeft = parseFloat(value);
      if (this.questions[i].left === this.questions[i].yourLeft) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
    },
    isFinished: function () {
      return this.questions.every(function (question) {
        return question.yourLeft !== null;
      });
    },
    endGame: function () {
      this.isRunning = !this.isRunning;
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});
