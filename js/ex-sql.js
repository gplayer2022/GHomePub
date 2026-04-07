import {
  ModelAnswer01,
  ModelAnswer02,
  ModelAnswer03,
  ModelAnswer04,
  ModelAnswer05,
  ModelAnswer06,
  ModelAnswer07,
  ModelAnswer08,
  ModelAnswer09,
  ModelAnswer10,
  ModelAnswer11,
  ModelAnswer12,
  ModelAnswer13,
  ModelAnswer14,
  ModelAnswer15,
  ModelAnswer16,
  ModelAnswer17,
  ModelAnswer18,
  ModelAnswer19,
  ModelAnswer20,
} from './sql-model-answer.js';
import {
  YourAnswer02,
  YourAnswer03,
  YourAnswer04,
  YourAnswer05,
  YourAnswer06,
  YourAnswer07,
  YourAnswer08,
  YourAnswer09,
  YourAnswer10,
  YourAnswer11,
  YourAnswer12,
  YourAnswer13,
  YourAnswer14,
  YourAnswer15,
  YourAnswer16,
  YourAnswer17,
  YourAnswer18,
  YourAnswer19,
  YourAnswer20,
} from './sql-your-answer.js';

// 戻り値なしで SQL
function runSql(database, sqlIElem, yourResultElem, modelAnswer, yourResultListElem, event) {
  const sql = sqlIElem.value;
  try {
    if (!sql) {
      throw new Error('未入力です。');
    }
    // SQLを実行
    database.run(sql);
    if (modelAnswer.checkAnswer(database)) {
      showResultMessage(yourResultElem, '成功です。出力結果はありません。');
      showResult2ResultList(yourResultListElem, true);
    } else {
      showResultMessage(yourResultElem, '不正解です。エラーではないようです。');
      showResult2ResultList(yourResultListElem, false);
    }
  } catch (error) {
    showResultMessage(yourResultElem, `エラー: ${error.message}`);
    showResult2ResultList(yourResultListElem, false);
  }
}

// 戻り値ありで SQL
function execSql(database, sqlIElem, yourResultElem, modelAnswer, yourResultListElem, event) {
  const sql = sqlIElem.value;
  try {
    // SQLを実行
    const responses = database.exec(sql);
    if (responses.length === 0) {
      if (modelAnswer.checkAnswerByResponses(responses)) {
        showResultMessage(yourResultElem, '成功です。出力結果はありません。');
        showResult2ResultList(yourResultListElem, true);
      } else {
        showResultMessage(yourResultElem, '不正解です。エラーではないようです。');
        showResult2ResultList(yourResultListElem, false);
      }
    } else {
      if (modelAnswer.checkAnswerByResponses(responses)) {
        showTable(yourResultElem, responses, '正解です。');
        showResult2ResultList(yourResultListElem, true);
      } else {
        showTable(yourResultElem, responses, '不正解です。エラーではないようです。');
        showResult2ResultList(yourResultListElem, false);
      }
    }
  } catch (error) {
    showResultMessage(yourResultElem, `エラー: ${error.message}`);
    showResult2ResultList(yourResultListElem, false);
  }
}

// 結果のメッセージを表示する
function showResultMessage(yourResultElem, message) {
  yourResultElem.replaceChildren();
  const pElem = document.createElement('p');
  pElem.classList.add('clare-line');
  pElem.textContent = message;
  yourResultElem.appendChild(pElem);
}

// SELECT 文等の結果をテーブルとして表示する
function showTable(yourResultElem, responses, message) {
  yourResultElem.replaceChildren();
  const pElem = document.createElement('p');
  pElem.classList.add('clare-line');
  pElem.textContent = message;
  yourResultElem.appendChild(pElem);
  responses.forEach((response) => {
    const tableElem = document.createElement('table');
    tableElem.classList.add('sql-table');
    const theadElem = document.createElement('thead');
    const theadTrElem = document.createElement('tr');
    const tbodyElem = document.createElement('tbody');
    response.columns.forEach((column) => {
      const thElem = document.createElement('th');
      thElem.textContent = column;
      theadTrElem.appendChild(thElem);
    });
    theadElem.appendChild(theadTrElem);
    response.values.forEach((record) => {
      const tbodyTrElem = document.createElement('tr');
      record.forEach((value) => {
        const tdElem = document.createElement('td');
        tdElem.textContent = value;
        tbodyTrElem.appendChild(tdElem);
      });
      tbodyElem.appendChild(tbodyTrElem);
    });
    tableElem.appendChild(theadElem);
    tableElem.appendChild(tbodyElem);
    yourResultElem.appendChild(tableElem);
  });
}

// 結果一覧に結果を表示し、ローカルストレージにデータを格納する
function showResult2ResultList(yourResultListElem, isCorrect) {
  if (isCorrect) {
    yourResultListElem.textContent = '〇';
    localStorage.setItem(yourResultListElem.dataset.resultId, "〇");
  } else {
    yourResultListElem.textContent = '×';
    localStorage.setItem(yourResultListElem.dataset.resultId, "×");
  }
}

// ドットの表示を切り替える
// 実際の設問の切り替えは別
function updateStep(step) {
  const stepProgressElems = document.querySelectorAll('#step-progress span');
  stepProgressElems.forEach((stepProgressElem, index) => {
    const formattedIndex = String(index + 1).padStart(2, '0');
    if (step === formattedIndex) {
      stepProgressElem.textContent = '●';
    } else {
      stepProgressElem.textContent = '○';
    }
  });
}

const totalStepsCount = 20;
// 指定されたステップを表示する
// 実際の設問を表示
function showStep(step) {
  for (let i = 0; i < totalStepsCount; i++) {
    const formattedIndex = String(i + 1).padStart(2, '0');
    const sqlStoryElem = document.getElementById(`sql-story-${formattedIndex}`);
    if (step === formattedIndex) {
      sqlStoryElem.classList.add('active');
    } else {
      sqlStoryElem.classList.remove('active');
    }
  }
  // 問題先頭位置にスクロールする
  const stepProgressElem = document.getElementById('step-progress');
  const y = stepProgressElem.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
}

// ローカルストレージから復元して表示
function restoreProgress(questions) {
  let topImcompleteStep = null;
  questions.forEach(({ no }, index) => {
    const yourResultListElem = document.getElementById(`your-result-list-${no}`);
    const key = yourResultListElem.dataset.resultId;
    const value = localStorage.getItem(key);
    // 結果一覧表を復元
    if (value) {
      yourResultListElem.textContent = value;
    }
    // 最初の未実施設問または不正解設問を取得
    if (!value || value === '×') {
      if (!topImcompleteStep) {
        topImcompleteStep = String(index + 1).padStart(2, '0');
      }
    }
  });
  // 全問終了済の場合は最初の設問に戻す
  const step = topImcompleteStep || '01';
  if (step !== '01') {
    updateStep(step);
    showStep(step);
  }
}

function clearProgress(questions) {
  questions.forEach(({ no }) => {
    const yourResultListElem = document.getElementById(`your-result-list-${no}`);
    const key = yourResultListElem.dataset.resultId;
    localStorage.removeItem(key);
    // UI をクリアする
    yourResultListElem.textContent = '';
  })
}

function main() {
  const questions = [
    {
      no: '01',
      ModelAnswer: ModelAnswer01,
      YourAnswer: null,
      exec: runSql,
    },
    {
      no: '02',
      ModelAnswer: ModelAnswer02,
      YourAnswer: YourAnswer02,
      exec: execSql,
    },
    {
      no: '03',
      ModelAnswer: ModelAnswer03,
      YourAnswer: YourAnswer03,
      exec: runSql,
    },
    {
      no: '04',
      ModelAnswer: ModelAnswer04,
      YourAnswer: YourAnswer04,
      exec: execSql,
    },
    {
      no: '05',
      ModelAnswer: ModelAnswer05,
      YourAnswer: YourAnswer05,
      exec: execSql,
    },
    {
      no: '06',
      ModelAnswer: ModelAnswer06,
      YourAnswer: YourAnswer06,
      exec: execSql,
    },
    {
      no: '07',
      ModelAnswer: ModelAnswer07,
      YourAnswer: YourAnswer07,
      exec: execSql,
    },
    {
      no: '08',
      ModelAnswer: ModelAnswer08,
      YourAnswer: YourAnswer08,
      exec: execSql,
    },
    {
      no: '09',
      ModelAnswer: ModelAnswer09,
      YourAnswer: YourAnswer09,
      exec: execSql,
    },
    {
      no: '10',
      ModelAnswer: ModelAnswer10,
      YourAnswer: YourAnswer10,
      exec: execSql,
    },
    {
      no: '11',
      ModelAnswer: ModelAnswer11,
      YourAnswer: YourAnswer11,
      exec: execSql,
    },
    {
      no: '12',
      ModelAnswer: ModelAnswer12,
      YourAnswer: YourAnswer12,
      exec: execSql,
    },
    {
      no: '13',
      ModelAnswer: ModelAnswer13,
      YourAnswer: YourAnswer13,
      exec: execSql,
    },
    {
      no: '14',
      ModelAnswer: ModelAnswer14,
      YourAnswer: YourAnswer14,
      exec: execSql,
    },
    {
      no: '15',
      ModelAnswer: ModelAnswer15,
      YourAnswer: YourAnswer15,
      exec: execSql,
    },
    {
      no: '16',
      ModelAnswer: ModelAnswer16,
      YourAnswer: YourAnswer16,
      exec: execSql,
    },
    {
      no: '17',
      ModelAnswer: ModelAnswer17,
      YourAnswer: YourAnswer17,
      exec: execSql,
    },
    {
      no: '18',
      ModelAnswer: ModelAnswer18,
      YourAnswer: YourAnswer18,
      exec: execSql,
    },
    {
      no: '19',
      ModelAnswer: ModelAnswer19,
      YourAnswer: YourAnswer19,
      exec: execSql,
    },
    {
      no: '20',
      ModelAnswer: ModelAnswer20,
      YourAnswer: YourAnswer20,
      exec: execSql,
    },
  ];
  questions.forEach(({ no }) => {
    const displayHintElem = document.getElementById(`display-hint-${no}`);
    displayHintElem.addEventListener('click', (event) => {
      event.currentTarget.parentElement.classList.add('hidden');
      document.getElementById(`sql-hint-${no}`).classList.remove('hidden');
    });
  });
  // sql.js
  initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
  }).then((SQL) => {
    questions.forEach(({ no, ModelAnswer, YourAnswer, exec }) => {
      const yourSqlElem = document.getElementById(`your-sql-${no}`);
      const runYourSqlIElem = document.getElementById(`run-your-sql-${no}`);
      const yourResultElem = document.getElementById(`your-result-${no}`);
      const yourResultListElem = document.getElementById(`your-result-list-${no}`);
      const answerCardElem = document.getElementById(`answer-${no}-card`);
      // 実行ボタン
      runYourSqlIElem.addEventListener('click', () => {
        // 模範解答用
        const modelAnswer = new ModelAnswer(new SQL.Database());
        const database = new SQL.Database();
        // ユーザ解答用
        if (YourAnswer) {
          new YourAnswer(database);
        }
        exec(database, yourSqlElem, yourResultElem, modelAnswer, yourResultListElem);
        answerCardElem.classList.remove('hidden');
      });
    });
  });
  // ドットクリックで問題を表示
  const stepProgressElems = document.querySelectorAll('#step-progress span');
  stepProgressElems.forEach((stepProgressElem, index) => {
    stepProgressElem.addEventListener('click', (event) => {
      const step = event.currentTarget.dataset.step;
      updateStep(step);
      showStep(step);
    });
  });
  // 「次へ」ボタンで次の問題を表示する
  const toNextIElems = document.querySelectorAll('.to-next-step');
  toNextIElems.forEach((toNextElem, index) => {
    toNextElem.addEventListener('click', (event) => {
      const step = event.currentTarget.dataset.nextStep;
      updateStep(step);
      showStep(step);
    });
  })
  // リストをクリアする
  const clearYourProgressButtonIElem = document.getElementById('clear-your-progress-button');
  clearYourProgressButtonIElem.addEventListener('click', () => {
    clearProgress(questions);
  });
  // 再訪時にページを復元する
  restoreProgress(questions);
}

window.addEventListener('DOMContentLoaded', main);
