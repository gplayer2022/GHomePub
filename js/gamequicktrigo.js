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
    selections: [],
    is4SmartPhone: false,
    isRunning: false,
    startTime: 0,
    baseSelections: {
      p1: {
        value: "1",
        levels: [1, 2, 3],
      },
      pfs3d2: {
        value: "√3/2",
        levels: [0, 1, 2, 3],
      },
      pf1ds2: {
        value: "1/√2",
        levels: [0, 1, 2, 3],
      },
      pf1d2: {
        value: "1/2",
        levels: [0, 1, 2, 3],
      },
      pm0: {
        value: "0",
        levels: [1, 2, 3],
      },
      mf1d2: {
        value: "-(1/2)",
        levels: [1, 2, 3],
      },
      mf1ds2: {
        value: "-(1/√2)",
        levels: [1, 2, 3],
      },
      mfs3d2: {
        value: "-(√3/2)",
        levels: [1, 2, 3],
      },
      m1: {
        value: "-1",
        levels: [1, 2, 3],
      },
    },
  },
  computed: {
    trigonometricRatioes: function () {
      return [
        // sin
        {
          question: {
            degree: `sin0°`,
            radian: `sin0`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pm0.value,
        },
        {
          question: {
            degree: `sin30°`,
            radian: `sin(π/6)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pf1d2.value,
        },
        {
          question: {
            degree: `sin45°`,
            radian: `sin(π/4)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pf1ds2.value,
        },
        {
          question: {
            degree: `sin60°`,
            radian: `sin(π/3)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pfs3d2.value,
        },
        {
          question: {
            degree: `sin90°`,
            radian: `sin(π/2)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.p1.value,
        },
        {
          question: {
            degree: `sin120°`,
            radian: `sin(2π/3)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pfs3d2.value,
        },
        {
          question: {
            degree: `sin135°`,
            radian: `sin(3π/4)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pf1ds2.value,
        },
        {
          question: {
            degree: `sin150°`,
            radian: `sin(5π/6)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pf1d2.value,
        },
        {
          question: {
            degree: `sin180°`,
            radian: `sinπ`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pm0.value,
        },
        {
          question: {
            degree: `sin210°`,
            radian: `sin(7π/6)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1d2.value,
        },
        {
          question: {
            degree: `sin225`,
            radian: `sin(5π/4)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1ds2.value,
        },
        {
          question: {
            degree: `sin240°`,
            radian: `sin(4π/3)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mfs3d2.value,
        },
        {
          question: {
            degree: `sin270°`,
            radian: `sin(3π/2)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.m1.value,
        },
        {
          question: {
            degree: `sin300°`,
            radian: `sin(5π/3)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mfs3d2.value,
        },
        {
          question: {
            degree: `sin315°`,
            radian: `sin(7π/4)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1ds2.value,
        },
        {
          question: {
            degree: `sin330°`,
            radian: `sin(11π/6)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1d2.value,
        },
        {
          question: {
            degree: `sin360°`,
            radian: `sin(2π)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.pm0.value,
        },
        // cos
        {
          question: {
            degree: `cos0°`,
            radian: `cos0`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.p1.value,
        },
        {
          question: {
            degree: `cos30°`,
            radian: `cos(π/6)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pfs3d2.value,
        },
        {
          question: {
            degree: `cos45°`,
            radian: `cos(π/4)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pf1ds2.value,
        },
        {
          question: {
            degree: `cos60°`,
            radian: `cos(π/3)`,
          },
          levels: [0, 1, 2, 3],
          answer: this.baseSelections.pf1d2.value,
        },
        {
          question: {
            degree: `cos90°`,
            radian: `cos(π/2)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.pm0.value,
        },
        {
          question: {
            degree: `cos120°`,
            radian: `cos(2π/3)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.mf1d2.value,
        },
        {
          question: {
            degree: `cos135°`,
            radian: `cos(3π/4)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.mf1ds2.value,
        },
        {
          question: {
            degree: `cos150°`,
            radian: `cos(5π/6)`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.mfs3d2.value,
        },
        {
          question: {
            degree: `cos180°`,
            radian: `cosπ`,
          },
          levels: [1, 2, 3],
          answer: this.baseSelections.m1.value,
        },
        {
          question: {
            degree: `cos210°`,
            radian: `cos(7π/6)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mfs3d2.value,
        },
        {
          question: {
            degree: `cos225°`,
            radian: `cos(5π/4)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1ds2.value,
        },
        {
          question: {
            degree: `cos240°`,
            radian: `cos(4π/3)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.mf1d2.value,
        },
        {
          question: {
            degree: `cos270°`,
            radian: `cos(3π/2)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.pm0.value,
        },
        {
          question: {
            degree: `cos300°`,
            radian: `cos(5π/3)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.pf1d2.value,
        },
        {
          question: {
            degree: `cos315°`,
            radian: `cos(7π/4)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.pf1ds2.value,
        },
        {
          question: {
            degree: `cos330°`,
            radian: `cos(11π/6)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.pfs3d2.value,
        },
        {
          question: {
            degree: `cos360°`,
            radian: `cos(2π)`,
          },
          levels: [2, 3],
          answer: this.baseSelections.p1.value,
        },
      ];
    },
  },
  methods: {
    startGame: function () {
      this.createQuestions();
      this.createSelections();
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
      const _this = this;
      this.questions = JSON.parse(JSON.stringify(this.trigonometricRatioes));
      this.questions = this.questions.filter(function (question) {
        return question.levels.some(function (level) {
          return _this.level === level;
        });
      });
      // プロパティを調整
      this.questions.forEach(function (question) {
        if (_this.level === 3) {
          question.question = question.question.radian;
        } else {
          question.question = question.question.degree;
        }
        delete question.levels;
        question.yourAnswer = "";
      });
      // // 設問数が足りない場合に設問を水増しする
      if (this.questions.length < this.questionsLength) {
        this.questions.forEach(function (question) {
          _this.questions.push(JSON.parse(JSON.stringify(question)));
        });
      }
      this.shuffle(this.questions);
      this.questions.splice(0, this.questions.length - this.questionsLength);
    },
    createSelections: function () {
      this.selections = [];
      const _this = this;
      Object.keys(this.baseSelections).forEach(function (key) {
        if (
          _this.baseSelections[key].levels.some(function (level) {
            return _this.level === level;
          })
        ) {
          _this.selections.push(_this.baseSelections[key].value);
        }
      });
    },
    shuffle: function (items) {
      for (let i = items.length - 1; 0 <= i; i--) {
        const needle = this.randomNext(0, items.length);
        [items[i], items[needle]] = [items[needle], items[i]];
      }
    },
    randomNext: function (left, right) {
      return Math.floor(Math.random() * (right - left) + left);
    },
    selectAnswer: function (i, selection, event) {
      this.$set(this.questions[i], "yourAnswer", selection);
      if (this.questions[i].answer === this.questions[i].yourAnswer) {
        this.score.point += this.eachPoint;
      }
      if (this.isFinished()) {
        this.endGame();
      }
      this.$forceUpdate();
    },
    isFinished: function () {
      return this.questions.every(function (question) {
        return question.yourAnswer !== "";
      });
    },
    endGame: function () {
      this.isRunning = !this.isRunning;
      this.score.time = Math.floor((Date.now() - this.startTime) / 1000);
    },
  },
});
