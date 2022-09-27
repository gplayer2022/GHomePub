(function() {
  'use strict';
  // 座標
  let x = 0;
  let y = 0;
  // 重力加速度
  const acceleration = 9.8;
  // 初速度
  let velocity = 0;
  // 角度
  let angle = 0;
  // 経過時間
  let milliSecond = 0;
  // フォームタグ
  const velocityIElem = document.getElementById('velocity');
  const angleIElem = document.getElementById('angle');
  const startButtonIElem = document.getElementById('start-button');
  // 実験場とボール
  const labBoardElem = document.getElementById('lab-board');
  const ballElem = document.getElementById('ball');
  // 実験場のサイズ
  const labBoardWidth = parseInt(getComputedStyle(labBoardElem).width);
  const labBoardHeight = parseInt(getComputedStyle(labBoardElem).height);
  // ボールのサイズ
  let ballWidth;
  let ballHeight;
  // 再描画間隔
  const intervalMilliSecond = 50;
  // 1 文字分のフォントサイズ（1 メートルに該当）
  const fontSize = 16;
  // 速さの最大値
  const maxVelocity = 32.0;
  // ボールのスタイル
  const ballStyle = getComputedStyle(ballElem);

  // ボールのサイズを取得
  const intervalId = setInterval(function() {
    if (ballElem.complete) {
      ballWidth = parseInt(ballElem.naturalWidth);
      ballHeight = parseInt(ballElem.naturalHeight);
      clearInterval(intervalId);
    }
  }, 500, false);

  // 「開始」ボタンクリック
  startButtonIElem.addEventListener('click', function() {
    if (validate()) {
      startButtonIElem.disabled = true;
      resetBall();
      const interval = setInterval(function() {
        computeBallPosition();
        moveBall();
        displayBall();
        milliSecond += intervalMilliSecond;
        if (detectCollision()) {
          stopBall()
          displayBall();
          startButtonIElem.disabled = false;
          clearInterval(interval);
        }
      }, intervalMilliSecond);
    }
  }, false);

  // ユーザ入力値をチェックする
  function validate() {
    const alertElem = document.getElementById('alert');
    const tempVelocity = parseFloat(velocityIElem.value);
    const tempAngle = parseFloat(angleIElem.value);
    let isValid = false;
    if (0 < tempVelocity && tempVelocity <= maxVelocity) {
      if (0 < tempAngle && tempAngle <= 90) {
        isValid = true;
        alertElem.textContent = "";
        // ユーザ入力値をセットする
        velocity = tempVelocity;
        angle = tempAngle;
      } else {
        alertElem.textContent = "角度の設定が不適切です。";
      }
    } else {
      alertElem.textContent = "速さの設定が不適切です。";
    }
    return isValid;
  }

  // ボールの位置を取得
  function computeBallPosition() {
    x = parseInt(ballStyle.left);
    y = parseInt(ballStyle.bottom);
  }

  // ボールの状態を初期化
  function resetBall() {
    x = 0;
    y = 0;
    milliSecond = 0;
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

  // ボールを動かす
  function moveBall() {
    x = parseInt((calcVelocityX() * (milliSecond / 1000)) * fontSize);
    y = parseInt((calcVelocityY() * (milliSecond / 1000)
      - (1 / 2) * acceleration * Math.pow((milliSecond / 1000), 2)) * fontSize);
  }

  // ボールを停止する（枠外にはみ出した場合は位置を補正）
  function stopBall() {
    if (labBoardWidth <= x + ballWidth) {
      x = labBoardWidth - ballWidth;
    }
    if (labBoardHeight <= y + ballHeight) {
      y = labBoardHeight - ballHeight;
    }
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
  }

  // ボールを表示
  function displayBall() {
    ballElem.style.left = x + 'px';
    ballElem.style.bottom = y + 'px';
  }

  // 衝突を検知
  function detectCollision() {
    return labBoardWidth <= x + ballWidth || labBoardHeight <= y + ballHeight
    || x < 0 || y < 0;
  }
})();
