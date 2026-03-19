import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  onDisconnect,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp, } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { formatTimestamp, } from './firebase.js';
import { Referee, View, } from './game.js';
import { State, exRound, calcMean, verifySignature, } from './util.js';
import { inquireResult, postKeystrokeSequence, } from "./vercel.js";

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
const analytics = getAnalytics(app);

// ログイン状態によって、表示を切り替える
async function switchDisplay(state) {
  // ログイン前にログインを促す div
  const preLoginElem = document.getElementById('pre-login');
  // ログイン後にログイン情報を確認する div
  const postLoginElem = document.getElementById('post-login');
  // ユーザ名入力用 input[text] を含む span
  const userNameTextWrapper = document.getElementById('user-name-text-wrapper');
  // 登録済ユーザ名確認用 span
  const userNameElem = document.getElementById('user-name');
  const typingCardElem = document.getElementById('typing-card');
  const resultCardElem = document.getElementById('result-card');

  // ログインしたが、名前は未登録の場合
  if (state === State.HAS_LOGGED_IN) {
    preLoginElem.classList.add('hidden');
    postLoginElem.classList.remove('hidden');
    typingCardElem.classList.add('hidden');
    resultCardElem.classList.add('hidden');
    userNameTextWrapper.classList.remove('hidden');
    userNameElem.classList.add('hidden');
  }
  // 未ログイン状態の場合
  else if (state === State.PRE_LOGIN) {
    preLoginElem.classList.remove('hidden');
    postLoginElem.classList.add('hidden');
    typingCardElem.classList.add('hidden');
    resultCardElem.classList.add('hidden');
  }
  // ログイン済で名前も登録してある場合
  else if (state === State.NAME_REGISTERD) {
    preLoginElem.classList.add('hidden');
    postLoginElem.classList.remove('hidden');
    typingCardElem.classList.remove('hidden');
    resultCardElem.classList.remove('hidden');
    userNameTextWrapper.classList.add('hidden');
    userNameElem.classList.remove('hidden');
    await selectResults();
  }
}

// ユーザのログイン情報を表示する
function displayUserInfo(user) {
  const googleAccountNameElem = document.getElementById('google-account-name');
  const userNameTextIElem = document.getElementById('user-name-text');
  googleAccountNameElem.textContent = user.displayName;
  userNameTextIElem.placeholder = user.displayName;
}

// ユーザ名を読み込んで表示する
async function selectUserName() {
  const snapshot = await getDoc(
    doc(firestore, 'users', auth.currentUser.uid)
  );
  if (snapshot.exists()) {
    const data = snapshot.data();
    document.getElementById('user-name').textContent = data.name;
    switchDisplay(State.NAME_REGISTERD);
  }
}

// 名簿用ユーザ名を登録する
async function insertUserName() {
  const userNameTextIElem = document.getElementById('user-name-text');
  const userNameMessageElem = document.getElementById('user-name-message');
  const user = auth.currentUser;
  const userName = userNameTextIElem.value.trim();
  userNameMessageElem.textContent = '';
  try {
    if (user && userName) {
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          name: userName,
          createdAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
      userNameMessageElem.classList.remove('alert');
      userNameMessageElem.textContent = '氏名を登録しました。';
      await selectUserName();
      await registerOnlineUser(user);
    } else if (!userName) {
      userNameMessageElem.classList.add('alert');
      userNameMessageElem.textContent = '氏名が入力されていません！';
    }
  } catch (e) {
    userNameMessageElem.classList.add('alert');
    userNameMessageElem.textContent = `氏名登録に失敗 : ${e.message}`;
  }
}

// タイピングを開始する
async function startTyping() {
  View.clearContents();
  const typingBoardElem = document.getElementById('typing-board');
  typingBoardElem.classList.add('active');
  typingBoardElem.focus();
  // 選択中のレベルを取得する
  const level = document.querySelector('input[name="level"]:checked').value;
  let url = '';
  switch (level) {
    case 'easy':
      url = './ref/aiu.json';
      break;
    case 'normal':
      url = './ref/toshichi.json';
      break;
    case 'hard':
      url = './ref/miyabi.json';
      break;
  }
  const gameSessionId = crypto.randomUUID();
  // タイピング開始
  const referee = new Referee();
  await referee.loadPhrases(url);
  const user = auth.currentUser;
  // ゲーム終了時に一首終了を確実に待たせるため
  const pendingPosts = [];
  // 一首終了時の処理を登録
  // 登録関数は async しないこと！
  referee.addPhraseFinishListener((totalPhraseIndex, keystrokeSequence, binaryResponse) => {
    // ここは await しないこと！
    const post = postKeystrokeSequence(auth, gameSessionId, totalPhraseIndex, keystrokeSequence, binaryResponse);
    pendingPosts.push(post);
  });
  // 終了時の処理を登録
  referee.addFinishListener(async () => {
    typingBoardElem.classList.remove('active');
    await Promise.all(pendingPosts);
    const result = await inquireResult(auth, gameSessionId, level);
    const isValid = checkResult(result);
    if (isValid) {
      await selectResults();
      // Realtime Database の更新
      const statusRef = ref(database, `onlineUsers/${user.uid}`);
      await update(statusRef, {
        finishedAt: Date.now(),
      });
    } else {
      const errorResultElem = document.getElementById('error-result');
      errorResultElem.textContent = 'データに不整合が発生したようです……。';
    }
  })
  referee.startCountDown();
}

// データをチェックする
async function checkResult(result) {
  let isValidResult = false;
  const isValid = await verifySignature(
    result.signature, result.hash);
  if (result.correctCount === Referee.totalCorrectCount &&
    result.incorrectCount === Referee.totalIncorrectCount &&
    isValid) {
    isValidResult = true;
  }
  return isValidResult;
}

// これまでの結果一覧を読み込んでグラフにする
async function selectResults() {
  const user = auth.currentUser;
  const docs = await getDocs(query(
    collection(firestore, 'users', user.uid, 'results'),
    orderBy('createdAt', 'asc')
  ));
  // データを整形する
  const createdAts = [];
  const correctCounts = [];
  const incorrectCounts = [];
  docs.forEach(function (doc) {
    createdAts.push(formatTimestamp(doc.data().createdAt));
    correctCounts.push(doc.data().correctCount);
    incorrectCounts.push(doc.data().incorrectCount);
  });
  if (0 < correctCounts.length) {
    // 集計
    showStatistics(correctCounts);
    // グラフとして表示する
    showChart(createdAts, correctCounts, incorrectCounts);
  }
}

// 集計する
function showStatistics(correctCounts) {
  const countsLengthElem = document.getElementById('counts-length');
  const maxCorrectCountElem = document.getElementById('max-correct-count');
  const meanCorrectCountElem = document.getElementById('mean-correct-count');
  const minCorrectCountElem = document.getElementById('min-correct-count');
  // 平均計算
  let mean = calcMean(correctCounts);
  mean = exRound(mean, 2);
  countsLengthElem.textContent = correctCounts.length;
  maxCorrectCountElem.textContent = Math.max(...correctCounts);
  meanCorrectCountElem.textContent = mean;
  minCorrectCountElem.textContent = Math.min(...correctCounts);
}

// これまでの結果をグラフとして表示する
let chart;
function showChart(createdAts, correctCounts, incorrectCounts) {
  const resultChartCanvasElem = document.getElementById('result-chart');
  // 高解像度向け対応
  const rect = resultChartCanvasElem.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio;
  resultChartCanvasElem.width = rect.width * devicePixelRatio;
  resultChartCanvasElem.height = rect.height * devicePixelRatio;
  const context = resultChartCanvasElem.getContext('2d');
  context.scale(devicePixelRatio, devicePixelRatio);
  // グラフとして表示する
  if (chart) {
    chart.destroy();
  }
  const Chart = window.Chart;
  chart = new Chart(resultChartCanvasElem, {
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

// Realtime Database にログインユーザを登録する
async function registerOnlineUser(user) {
  const userDoc = await getDoc(doc(firestore, 'users', user.uid));
  if (userDoc.exists()) {
    const userData = {
      uid: user.uid,
      displayName: user.displayName || null,
      online: true,
      lastLogin: Date.now(),
      finishedAt: 0,
    };
    if (userDoc.data().name) {
      // ユーザがこのサイト用に登録した名前
      userData.name = userDoc.data().name;
    }
    const statusRef = ref(database, `onlineUsers/${user.uid}`);
    await set(statusRef, userData);
    onDisconnect(statusRef).remove();
  }
}

// メインメソッド
async function main() {
  const loginMessageElem = document.getElementById('login-message');
  await setPersistence(auth, browserLocalPersistence);
  // すでにログイン済かどうかをチェックして表示を切り替える
  onAuthStateChanged(auth, async function (user) {
    // ログイン済の場合
    if (user) {
      const userDoc = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userDoc);
      const settingsSnap = await getDoc(doc(firestore, 'settings', 'app'));
      // 未登録ユーザかつ登録期間外の場合
      if (!userSnap.exists() && !settingsSnap.data().canRegister) {
        await auth.signOut();
        loginMessageElem.textContent = '登録期間外です。';
      } else {
        await switchDisplay(State.HAS_LOGGED_IN);
        displayUserInfo(user);
        await selectUserName();
        // Realtime Database の更新
        registerOnlineUser(user);
      }
    } else {
      await switchDisplay(State.PRE_LOGIN);
    }
  });
  // ログインボタン押下イベント登録
  document.getElementById('login').addEventListener('click', async function () {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // Firefox 以外ではリダイレクト方式は不安定な模様
      // await signInWithRedirect(auth, googleAuthProvider);
    } catch (e) {
      loginMessageElem.textContent = `ログイン失敗 : ${e.message}`;
      await switchDisplay(State.PRE_LOGIN);
    }
  });
  // 名前登録ボタン押下イベント登録
  document.getElementById('user-name-button').addEventListener('click', insertUserName);
  // タイピング開始ボタン押下イベント登録
  document.getElementById('start-typing-button').addEventListener('click', startTyping);
}

document.addEventListener('DOMContentLoaded', main);
