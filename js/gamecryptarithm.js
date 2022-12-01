Vue.component('game-hint', {
  inheritAttrs: false,
  template: `<li class="game-hint">
      <div class="hint">{{hint}}</div>
      <button
        v-if="canGoNextHint"
        v-on:click="onclick"
        type="button"
      >
        ヒント &gt;&gt;
      </button>
    </li>`,
  props: {
    questionIndex: {
      type: Number,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
    canGoNextHint: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: function() {
    return {
      // ヒントを見た場合の減点
      deduction: 1,
    };
  },
  methods: {
    onclick: function() {
      const event = {
        questionIndex: this.questionIndex,
        deduction: this.deduction,
      };
      this.$emit('show-hint', event);
    },
  },
});

new Vue({
  el: "#app",
  data: {
    level: 0,
    eachPoint: 10,
    questionsLength: 10,
    score: {
      point: 0,
      deduction: 0,
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
      this.score.deduction = 0;
      this.score.time = 0;
    },
    createQuestions: function () {
      this.questions = [];
      for (let i = 0; i < this.questionsLength; i++) {
        let question = {};
        question.hints = [];
        question.hints.push('ヒントを表示できます。');
        question.maxHintIndex2Show = question.hints.length - 1;
        if (this.level === 0) {
          question.operator = "+";
          question.checkOperator = "-";
          question.left = Math.floor(this.randomNext(0, 18));
          question.right = Math.floor(this.randomNext(0, 12));
          question.answer = question.left + question.right;
          question.remainder = null;
          question.hints.push(`交換法則 : ? ${question.operator} ${question.left} = ${question.answer}`);
          question.hints.push(`移項 : ? = ${question.answer} ${question.checkOperator} ${question.left}`);
        } else if (this.level === 1) {
          question.operator = "-";
          question.checkOperator = "+";
          question.answer = Math.floor(this.randomNext(0, 12));
          question.right = Math.floor(this.randomNext(0, 18));
          question.left = question.answer + question.right;
          question.remainder = null;
          question.hints.push(`移項 : ${question.left} = ${question.answer} ${question.checkOperator} ?`);
          question.hints.push(`交換法則 : ${question.left} = ? ${question.checkOperator} ${question.answer}`);
          question.hints.push(`移項 : ${question.left} ${question.operator} ${question.answer} = ?`);
          question.hints.push(`両辺の交換 : ? = ${question.left} ${question.operator} ${question.answer}`);
        } else if (this.level === 2) {
          question.operator = "×";
          question.checkOperator = "÷";
          question.left = Math.floor(this.randomNext(1, 12));
          question.right = Math.floor(this.randomNext(0, 10));
          question.answer = question.left * question.right;
          question.remainder = null;
          question.hints.push(`交換法則 : ? ${question.operator} ${question.left} = ${question.answer}`);
          question.hints.push(`移項 : ? = ${question.answer} ${question.checkOperator} ${question.left}`);
        } else if (this.level === 3) {
          question.operator = "÷";
          question.checkOperator = "×";
          question.answer = Math.floor(this.randomNext(1, 12));
          question.right = Math.floor(this.randomNext(1, 12));
          question.left = question.answer * question.right;
          question.remainder = null;
          question.hints.push(`移項 : ${question.left} = ${question.answer} ${question.checkOperator} ?`);
          question.hints.push(`交換法則 : ${question.left} = ? ${question.checkOperator} ${question.answer}`);
          question.hints.push(`移項 : ${question.left} ${question.operator} ${question.answer} = ?`);
          question.hints.push(`両辺の交換 : ? = ${question.left} ${question.operator} ${question.answer}`);
        } else {
          question.operator = "÷";
          question.checkOperator = "×";
          question.answer = Math.floor(this.randomNext(1, 12));
          question.right = Math.floor(this.randomNext(1, 12));
          question.remainder = Math.floor(this.randomNext(0, question.right));
          question.left = question.answer * question.right + question.remainder;
          question.hints.push(`商と余りの関係 : ${question.left} = ${question.answer} ${question.checkOperator} ? + ${question.remainder}`);
          question.hints.push(`移項 : ${question.left} - ${question.remainder} = ${question.answer} ${question.checkOperator} ?`);
          question.hints.push(`交換法則 : ${question.left} - ${question.remainder} = ? ${question.checkOperator} ${question.answer}`);
          question.hints.push(`移項 : (${question.left} - ${question.remainder}) ${question.operator} ${question.answer} = ?`);
          question.hints.push(`両辺の交換 : ? = (${question.left} - ${question.remainder}) ${question.operator} ${question.answer}`);
        }
        question.yourRight = null;
        this.questions.push(question);
      }
    },
    shouldShowHint: function(j, maxHintIndex2Show) {
      return j <= maxHintIndex2Show;
    },
    shouldShowNextHintButton: function(i, j) {
      return this.questions[i].maxHintIndex2Show === j
        && this.questions[i].hints.length - 1 !== j
        && this.questions[i].yourRight === null;
    },
    lastHint: function(i) {
      return this.questions[i].hints[this.questions[i].hints.length - 1].split(': ')[1];
    },
    randomNext: function (left, right) {
      return Math.random() * (right - left) + left;
    },
    answer: function (i, value) {
      this.questions[i].yourRight = parseFloat(value);
      if (this.questions[i].right === this.questions[i].yourRight) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
    },
    showNextHint: function(event) {
      const question = this.questions[event.questionIndex];
      question.maxHintIndex2Show = Math.min(
        ++this.questions[event.questionIndex].maxHintIndex2Show,
        this.questions[event.questionIndex].hints.length);
      Vue.set(this.questions, event.questionIndex, question);
      this.score.deduction -= event.deduction;
    },
    isFinished: function () {
      return this.questions.every(function (question) {
        return question.yourRight !== null;
      });
    },
    endGame: function () {
      this.isRunning = !this.isRunning;
      this.score.point = Math.max(0, this.score.point + this.score.deduction);
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});
