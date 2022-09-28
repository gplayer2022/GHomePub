(function() {
  'use strict';
  // フォームタグ
  const tabFormIElem = document.getElementById('tab-form');
  const tabRadioIElem = tabFormIElem.tab;
  const numberBaseIElem = document.getElementById('number-base');
  const numberReverseIElem = document.getElementById('number-reverse');
  const calcButtonIElem = document.getElementById('calc-button');
  // 出力蘭
  const contentBaseElem = document.getElementById('content-base');
  const contentReverseElem = document.getElementById('content-reverse');
  // ラジオボタン value の種類
  const tabs = {
    base: 'tab-base',
    reverse: 'tab-reverse',
  };
  // 最大値と最小値
  const baseRange = {
    max : 9999.9,
    min : 0.0,
  };
  const reverseRange = {
    max : 9999.9,
    min : 0.0,
  };
  // 入力値
  let numberBase;
  let numberReverse;

  // 「計算」ボタンクリック
  calcButtonIElem.addEventListener('click', function() {
    if (tabRadioIElem.value === tabs.base) {
      if (validateBase()) {
        calcBase();
      }
    } else {
      if (validateReverse()) {
        calcReverse();
      }
    }
  }, false);

  // ユーザ入力値をチェックする
  function validateBase() {
    const alertBaseElem = document.getElementById('alert-base');
    const tempNumberBase = parseFloat(numberBaseIElem.value);
    let isValid = false;
    if (baseRange.min <= tempNumberBase && tempNumberBase <= baseRange.max) {
      isValid = true;
      alertBaseElem.textContent = '';
      numberBase = tempNumberBase;
    } else {
      alertBaseElem.textContent = '入力値が不適切です。';
      contentBaseElem.textContent = '';
    }
    return isValid;
  }

  // ユーザ入力値をチェックする
  function validateReverse() {
    const alertReverseElem = document.getElementById('alert-reverse');
    const tempNumberReverse = parseFloat(numberReverseIElem.value);
    let isValid = false;
    if (reverseRange.min <= tempNumberReverse && tempNumberReverse <= reverseRange.max) {
      isValid = true;
      alertReverseElem.textContent = '';
      numberReverse = tempNumberReverse;
    } else {
      alertReverseElem.textContent = '入力値が不適切です。';
      contentReverseElem.textContent = '';
    }
    return isValid;
  }

  // base タブ側を計算する
  function calcBase() {
    const result = numberBase * (1 / 1000) / ((1 / 60) * (1 / 60));
    contentBaseElem.textContent = result + ' km/h';
  }

  // reverse タブ側を計算する
  function calcReverse() {
    const result = numberReverse * 1000 / (60 * 60);
    contentReverseElem.textContent = result + ' m/s';
  }
})();