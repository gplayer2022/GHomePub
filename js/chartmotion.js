(function() {
  'use strict';
  // スタートボタン
  const startButtonIElem = document.getElementById('start-button');
  // 実験場とボール
  const labBoardElem = document.getElementById('lab-board');
  const ballElem = document.getElementById('ball');
  // フォーム
  const originIElem = document.getElementById('origin');
  // キャンバス
  const chartXtContext = document.getElementById('chart-xt').getContext('2d');
  const chartVtContext = document.getElementById('chart-vt').getContext('2d');
  // 1 文字分のフォントサイズ（1 メートルに該当）
  const fontSize = 16;
  // 観測間隔
  const intervalMilliSecond = 250;
  // チャート
  let xtChart = null;
  let vtChart = null;
  // 両チャート共通
  let timeLabels = [];
  // x-t グラフ用
  let horizontalXs = [];
  let verticalYs = [];
  let diagonalDistances = [];
  // v-t グラフ用
  let horizontalVelocities = [];
  let verticalVelocities = [];
  let diagonalVelocities = [];
  // 座標と経過時間
  let x;
  let y;
  let milliSecond = 0;

  // 「開始」ボタンクリック
  startButtonIElem.addEventListener('click', function() {
    // チャート用配列を初期化
    initializeData();
    const interval = setInterval(function() {
      computeBallPosition();
      if (0 < timeLabels.length
        && horizontalXs[horizontalXs.length - 1] === x / fontSize
        && verticalYs[verticalYs.length - 1] === y / fontSize) {
        // グラフを描画
        drawXtChart();
        drawVtChart();
        clearInterval(interval);
      }
      timeLabels.push(milliSecond / 1000);
      milliSecond += intervalMilliSecond;
      // x-t グラフ用
      pushXtData();
      // v-t グラフ用
      pushVtData();
    }, intervalMilliSecond);
  }, false);

  // チャート用配列を初期化
  function initializeData() {
    if (xtChart !== null) {
      xtChart.destroy();
    }
    if (vtChart !== null) {
      vtChart.destroy();
    }
    timeLabels = [];
    horizontalXs = [];
    verticalYs = [];
    diagonalDistances = [];
    horizontalVelocities = [];
    verticalVelocities = [];
    diagonalVelocities = [];
    // ミリ秒の蓄積をクリア
    milliSecond = 0;
  }

  // ボールの位置を取得
  function computeBallPosition() {
    const ballStyle = getComputedStyle(ballElem);
    x = parseInt(ballStyle.left);
    y = parseInt(ballStyle.top);
  }

  // x-t グラフ用データを追加
  function pushXtData() {
    horizontalXs.push(x / fontSize);
    verticalYs.push(y / fontSize);
    diagonalDistances.push(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / fontSize);
  }

  // v-t グラフ用データを追加
  function pushVtData() {
    if (timeLabels.length === 1) {
      horizontalVelocities.push(null);
      verticalVelocities.push(null);
      diagonalVelocities.push(null);
    } else {
      horizontalVelocities.push(
        (horizontalXs[horizontalXs.length - 1] - horizontalXs[horizontalXs.length - 2])
        / (intervalMilliSecond / 1000));
      verticalVelocities.push(
        (verticalYs[verticalYs.length - 1] - verticalYs[verticalYs.length - 2])
        / (intervalMilliSecond / 1000));
      diagonalVelocities.push(
        (diagonalDistances[diagonalDistances.length - 1]
        - diagonalDistances[diagonalDistances.length - 2])
        / (intervalMilliSecond / 1000));
    }
  }

  // x-t グラフ描画
  function drawXtChart() {
    xtChart = new Chart(chartXtContext, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: '横方向',
          data: horizontalXs,
          borderColor: '#ff8888',
        }, {
          label: '縦方向',
          data: verticalYs,
          borderColor: '#448844',
        }, {
          label: '合成',
          data: diagonalDistances,
          borderColor: '#4488ff',
        }],
      },
      options: {
        title: {
          display: true,
          text: 'x-t グラフ',
        }
      }
    });
  }

  // v-t グラフ描画
  function drawVtChart() {
    vtChart = new Chart(chartVtContext, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: '横方向',
          data: horizontalVelocities,
          borderColor: '#ff8888',
        }, {
          label: '縦方向',
          data: verticalVelocities,
          borderColor: '#448844',
        }, {
          label: '合成',
          data: diagonalVelocities,
          borderColor: '#4488ff',
        }],
      },
      options: {
        title: {
          display: true,
          text: 'v-t グラフ',
        }
      }
    });
  }
})();