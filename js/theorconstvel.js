(function() {
  'use strict';
  // 速度
  let velocity = 0;
  // 角度
  let angle = 0;
  // 経過時間
  let milliSecond = 0;
  // フォームタグ
  const velocityIElem = document.getElementById('velocity');
  const angleIElem = document.getElementById('angle');
  const startButtonIElem = document.getElementById('start-button');
  // ボール
  const ballElem = document.getElementById('ball');
  const ballPosition = {
    x: 0,
    y: 0,
  };
  // 観測間隔
  const intervalMilliSecond = 250;
  // キャンバス
  const chartXtContext = document.getElementById('theoretical-chart-xt').getContext('2d');
  const chartVtContext = document.getElementById('theoretical-chart-vt').getContext('2d');
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

  // 「開始」ボタンクリック
  startButtonIElem.addEventListener('click', function() {
    // チャート用配列を初期化
    initializeData();
    setUserParam();
    const interval = setInterval(function() {
      if (hasStopped()) {
        // グラフを描画
        drawXtChart();
        drawVtChart();
        clearInterval(interval);
      }
      timeLabels.push(milliSecond / 1000);
      // グラフ用
      pushXtData();
      pushVtData();
      milliSecond += intervalMilliSecond;
    }, intervalMilliSecond);
  }, false);

  // 値を初期化
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
    // ボール位置をクリア
    ballPosition.x = 0;
    ballPosition.y = 0;
  }

  // ユーザ設定値をセット
  function setUserParam() {
    velocity = parseFloat(velocityIElem.value);
    angle = parseFloat(angleIElem.value);
  }

  // ボールの停止判定
  function hasStopped() {
    const ballStyle = getComputedStyle(ballElem);
    let hasStopped = false;
    if (ballPosition.x === ballStyle.left
      && ballPosition.y === ballStyle.top) {
      hasStopped = true;
    } else {
      ballPosition.x = ballStyle.left;
      ballPosition.y = ballStyle.top;
    }
    return hasStopped;
  }

  // X 方向の速さを計算
  function calcVelocityX() {
    // 90° の場合は、誤差が発生して 0 にならないため、強制的に 0 に
    return angle === 90 ? 0 : velocity * Math.cos(angle / 180 * Math.PI);
  }

  // Y 方向の速さを計算
  function calcVelocityY() {
    return velocity * Math.sin(angle / 180 * Math.PI);
  }

  // 対角線方向の速さを計算
  function calcDiagonalVelocity() {
    return velocity;
  }

  // x 方向の変位を計算
  function calcDistanceX() {
    return calcVelocityX() * (milliSecond / 1000);
  }

  // y 方向の変位を計算
  function calcDistanceY() {
    return calcVelocityY() * (milliSecond / 1000);
  }

  // 対角線方向の変位を計算
  function calcDiagonalDistance() {
    return calcDiagonalVelocity() * (milliSecond / 1000);
  }

  // x-t グラフ用データを追加
  function pushXtData() {
    horizontalXs.push(calcDistanceX());
    verticalYs.push(calcDistanceY());
    diagonalDistances.push(calcDiagonalDistance());
  }

  // v-t グラフ用データを追加
  function pushVtData() {
    horizontalVelocities.push(calcVelocityX());
    verticalVelocities.push(calcVelocityY());
    diagonalVelocities.push(calcDiagonalVelocity());
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