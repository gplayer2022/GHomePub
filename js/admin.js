import {
  initializeApp,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import {
  formatTimestamp,
} from './firebase.js';
import {
  State,
  exRound,
  calcMean,
} from "./util.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvGvBlF_2mLc96Iwp99SgklA-d0IjovnY",
  authDomain: "g-home-typing.firebaseapp.com",
  projectId: "g-home-typing",
  storageBucket: "g-home-typing.firebasestorage.app",
  messagingSenderId: "254951493595",
  appId: "1:254951493595:web:90a1dba3435161b099e1fe",
  measurementId: "G-QMY0Q7FFRC",
  databaseURL: "https://g-home-typing-default-rtdb.asia-southeast1.firebasedatabase.app" // Realtime Database 用
};

// Firebase を初期化する
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase();

// ----------------------
// 管理者ログイン対応
// ----------------------
// 管理者かどうかをチェックする
async function checkAdmin(uid) {
  const snapshot = await getDoc(doc(firestore, "users", uid));
  return snapshot.exists() && snapshot.data().isAdmin === true;
}

// 表示を切り替える
async function switchDisplay(state) {
  const preLoginElem = document.getElementById('pre-login');
  const postLoginElem = document.getElementById('post-login');
  const usersCardElem = document.getElementById('users-card');
  const resultsCardElem = document.getElementById('results-card');
  const aggregationsCardElem = document.getElementById('aggregations-card');
  if (state === State.PRE_LOGIN) {
    preLoginElem.classList.remove('hidden');
    postLoginElem.classList.add('hidden');
    usersCardElem.classList.add('hidden');
    resultsCardElem.classList.add('hidden');
    aggregationsCardElem.classList.add('hidden');
  } else {
    preLoginElem.classList.add('hidden');
    postLoginElem.classList.remove('hidden');
    usersCardElem.classList.remove('hidden');
    resultsCardElem.classList.remove('hidden');
    aggregationsCardElem.classList.remove('hidden');
  }
}

// ----------------------
// 一般ユーザのログイン監視
// ----------------------
// ログイン中のユーザ一覧を取得する
function subscribeOnlineUsers() {
  const onlineRef = ref(database, 'onlineUsers');
  const errorMessageElem = document.getElementById('error-message');
  onValue(onlineRef, (snapshot) => {
    errorMessageElem.textContent = '';
    if (snapshot.exists()) {
      const users = snapshot.val();
      showUsers(users);
      // タイピング終了ユーザを検知する
      detectFinishedUsers(users);
    } else {
      showUsers({});
    }
  }, (error) => {
    errorMessageElem.textContent = `ログインユーザ取得に失敗 : ${error}`;
  });
}

// ログイン中のユーザ一覧を表示する
function showUsers(users) {
  const usersElem = document.getElementById('login-users');
  usersElem.replaceChildren();
  Object.values(users)
    .filter(user => user.online)
    .forEach(user => {
      const trElem = document.createElement('tr');
      const nameTdElem = document.createElement('td');
      const loginStateTdElem = document.createElement('td');
      nameTdElem.textContent = user?.name ?? user.displayName ?? '未設定';
      loginStateTdElem.textContent = user.online ? '〇' : '×';
      trElem.appendChild(nameTdElem);
      trElem.appendChild(loginStateTdElem);
      usersElem.appendChild(trElem);
    })
}

// ----------------------
// タイピング終了後の更新
// ----------------------
// タイピング終了ユーザを検知する
const lastFinishedAtTimes = new Map();
async function detectFinishedUsers(users) {
  for (const [uid, user] of Object.entries(users)) {
    const previousTime = lastFinishedAtTimes.get(uid);
    if (user.finishedAt && user.finishedAt !== previousTime) {
      lastFinishedAtTimes.set(uid, user.finishedAt);
      // 指定ユーザのタイピング記録を読み込む
      await loadUserResults(uid, user);
    }
  }
}

// 指定ユーザのタイピング記録を読み込む
async function loadUserResults(uid, user) {
  const snapshot = await getDocs(query(
    collection(firestore, 'users', uid, 'results'),
    orderBy('createdAt', 'asc')
  ));
  const results = [];
  snapshot.forEach((doc) => results.push(doc.data()));
  // データを整形する
  const createdAts = [];
  const correctCounts = [];
  const incorrectCounts = [];
  results.forEach((result) => {
    createdAts.push(formatTimestamp(result.createdAt));
    correctCounts.push(result.correctCount);
    incorrectCounts.push(result.incorrectCount);
  });
  const userUidElem = getUserContainer(uid);
  userUidElem.replaceChildren();
  // データを表示する
  showResults(userUidElem, user, results, correctCounts);
  // チャートを描画する
  drawChart(userUidElem, createdAts, correctCounts, incorrectCounts);
}

// 各ユーザ用描画コンテナを取得する
// すでに枠設定済なら使いまわし、なければ新規に作成する
function getUserContainer(uid) {
  const resultChartWrapperElem = document.getElementById('result-chart-wrapper');
  let userUidElem = document.getElementById(`user-${uid}`);
  if (!userUidElem) {
    userUidElem = document.createElement('div');
    userUidElem.id = `user-${uid}`;
    userUidElem.classList.add('user-result');
    resultChartWrapperElem.appendChild(userUidElem);
  }
  return userUidElem;
}

// 今回および過去の統計を表示する
function showResults(userUidElem, user, results, correctCounts) {
  // <h3 class="card-subtitle">ユーザ名</h3>
  const h3Elem = document.createElement('h3');
  h3Elem.classList.add('card-subtitle');
  h3Elem.textContent = user.name;
  // <dl class="table-like">
  //   <dt>レベル / 正 / 誤</dt>
  //   <dd></dd>
  //   <dt>最大値 / 平均値 / 最小値</dt>
  //   <dd</dd>
  // </dl>
  const dlElem = document.createElement('dl');
  dlElem.classList.add('table-like');
  const currentDtElem = document.createElement('dt');
  currentDtElem.textContent = 'レベル / 正 / 誤';
  const currentDdElem = document.createElement('dd');
  const statisticsDtElem = document.createElement('dt');
  statisticsDtElem.textContent = '最大 / 平均 / 最小';
  const statisticsDdElem = document.createElement('dd');
  // 表示
  userUidElem.appendChild(h3Elem);
  dlElem.appendChild(currentDtElem);
  dlElem.appendChild(currentDdElem);
  dlElem.appendChild(statisticsDtElem);
  dlElem.appendChild(statisticsDdElem);
  userUidElem.appendChild(dlElem);
  // 今回のデータ
  const lastResult = results[results.length - 1];
  const level = lastResult.level;
  const correctCount = lastResult.correctCount;
  const incorrectCount = lastResult.incorrectCount;
  const levels = {
    easy: "初級",
    normal: "中級",
    hard: "上級"
  };
  const jpLevel = levels[level] ?? "不明";
  currentDdElem.textContent = `${jpLevel} / ${correctCount} / ${incorrectCount}`;
  // 集計
  let mean = calcMean(correctCounts);
  mean = exRound(mean, 2);
  const max = Math.max(...correctCounts);
  const min = Math.min(...correctCounts);
  statisticsDdElem.textContent = `${max} / ${mean} / ${min}`;
}

// チャートを描画する
function drawChart(parentElem, createdAts, correctCounts, incorrectCounts) {
  const resultChartCanvasElem = document.createElement('canvas');
  resultChartCanvasElem.classList.add('result-chart');
  parentElem.appendChild(resultChartCanvasElem);
  // 高解像度向け対応
  const rect = resultChartCanvasElem.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio;
  resultChartCanvasElem.width = rect.width * devicePixelRatio;
  resultChartCanvasElem.height = rect.height * devicePixelRatio;
  const context = resultChartCanvasElem.getContext('2d');
  context.scale(devicePixelRatio, devicePixelRatio);
  // グラフとして表示する
  const Chart = window.Chart;
  const chart = new Chart(resultChartCanvasElem, {
    type: 'line',
    data: {
      labels: createdAts,
      datasets: [
        {
          label: '正入力数',
          data: correctCounts,
          borderColor: '#40D2DC',
        },
        {
          label: '誤入力数',
          data: incorrectCounts,
          borderColor: '#8758FF',
        },
      ],
    },
    options: {
      // ラベルは縦向きで間引かずに
      scales: {
        x: {
          ticks: {
            minRotation: 90,
            maxRotation: 90,
            autoSkip: false,
          },
        },
        y: {
          min: 0,
          max: Math.ceil(Math.max(...correctCounts) * 1.05),
        },
      },
    },
  });
}

// ----------------------
// 期間集計処理
// ----------------------
async function aggregateAllUsers(startTime, endTime) {
  const snapshot = await getDocs(collection(firestore, "users"));
  const aggregations = [];
  for (const userDoc of snapshot.docs) {
    const name = userDoc.data().name;
    const resultsSnapshot = await getDocs(query(
      collection(firestore, 'users', userDoc.id, 'results'),
      where('createdAt', '>=', new Date(startTime)),
      where('createdAt', '<=', new Date(endTime)),
      orderBy('createdAt', 'asc')
    ));
    const results = resultsSnapshot.docs.map(doc => doc.data());
    const userResults = aggregateUserResults(results);
    aggregations.push({
      uid: userDoc.id,
      name: name,
      userResults: userResults,
    });
  }
  showAggregations(aggregations);
}

// 各ユーザのデータを集計する
function aggregateUserResults(results) {
  const createdAts = [];
  const correctCounts = [];
  const incorrectCounts = [];
  results.forEach((filteredResult) => {
    createdAts.push(formatTimestamp(filteredResult.createdAt));
    correctCounts.push(filteredResult.correctCount);
    incorrectCounts.push(filteredResult.incorrectCount);
  });
  let max = 0;
  let min = 0;
  if (0 < results.length) {
    max = Math.max(...correctCounts);
    min = Math.max(...correctCounts);
  }
  const userResults = {
    createdAts: createdAts,
    correctCounts: correctCounts,
    incorrectCounts: incorrectCounts,
    count: results.length,
    max: max,
    min: min,
    mean: exRound(calcMean(correctCounts), 2),
  };
  return userResults;
}

function showAggregations(aggregations) {
  const aggregationsWrapperElem = document.getElementById('aggregations-wrapper');
  aggregationsWrapperElem.replaceChildren();
  aggregations.forEach((aggregation) => {
    const h3Elem = document.createElement('h3');
    h3Elem.classList.add('card-subtitle');
    h3Elem.textContent = aggregation.name;
    // <dl class="table-like">
    //   <dt>実施回数</dt>
    //   <dd></dd>
    //   <dt>最大値</dt>
    //   <dd></dd>
    //   <dt>平均値</dt>
    //   <dd></dd>
    //   <dt>最小値</dt>
    //   <dd></dd>
    // </dl>
    const dlElem = document.createElement('dl');
    dlElem.classList.add('table-like');
    // 実施回数
    const countDtElem = document.createElement('dt');
    countDtElem.textContent = '実施回数';
    dlElem.appendChild(countDtElem);
    const countDdElem = document.createElement('dd');
    countDdElem.textContent = aggregation.userResults.count;
    dlElem.appendChild(countDdElem);
    // 最大値
    const maxDtElem = document.createElement('dt');
    maxDtElem.textContent = '最大値';
    dlElem.appendChild(maxDtElem);
    const maxDdElem = document.createElement('dd');
    maxDdElem.textContent = aggregation.userResults.max;
    dlElem.appendChild(maxDdElem);
    // 平均値
    const meanDtElem = document.createElement('dt');
    meanDtElem.textContent = '平均値';
    dlElem.appendChild(meanDtElem);
    const meanDdElem = document.createElement('dd');
    meanDdElem.textContent = aggregation.userResults.mean;
    dlElem.appendChild(meanDdElem);
    // 最小値
    const minDtElem = document.createElement('dt');
    minDtElem.textContent = '最小値';
    dlElem.appendChild(minDtElem);
    const minDdElem = document.createElement('dd');
    minDdElem.textContent = aggregation.userResults.max;
    dlElem.appendChild(minDdElem);
    // 表示
    aggregationsWrapperElem.appendChild(h3Elem);
    aggregationsWrapperElem.appendChild(dlElem);
    // 結果が存在する場合
    if (0 < aggregation.userResults.count) {
      // チャートを描画する
      drawChart(aggregationsWrapperElem,
        aggregation.userResults.createdAts,
        aggregation.userResults.correctCounts,
        aggregation.userResults.incorrectCounts);

    }
  });
}

// 終了日に今日の日付をデフォルト値として入れる
function setToday2DateIElem() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${yyyy}-${mm}-${dd}`;
  document.getElementById('end-date').value = formattedToday;
}

// メインメソッド
async function main() {
  await setPersistence(auth, browserLocalPersistence);
  // すでにログイン済かどうかをチェックして表示を切り替える
  onAuthStateChanged(auth, async function (user) {
    if (user) {
      const isAdmin = await checkAdmin(user.uid);
      if (!isAdmin) {
        await switchDisplay(State.PRE_LOGIN);
        location.href = '../';
        return;
      }
      await switchDisplay(State.HAS_LOGGED_IN);
      subscribeOnlineUsers();
    }
  });
  // ログインボタン押下イベント登録
  document.getElementById('login').addEventListener('click', async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
    } catch (e) {
      const loginMessageElem = document.getElementById('login-message');
      loginMessageElem.textContent = `ログイン失敗 : ${e.message}`;
      await switchDisplay(State.PRE_LOGIN);
    }
  });
  // 集計ボタン押下イベント登録
  document.getElementById('aggregate-button').addEventListener('click', async () => {
    const startTime = new Date(document.getElementById('start-date').value).getTime();
    const endTime = new Date(document.getElementById('end-date').value).getTime();
    await aggregateAllUsers(startTime, endTime);
  });
  // 終了日を今日の日付にする
  setToday2DateIElem();
}

document.addEventListener('DOMContentLoaded', main);
