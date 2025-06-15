document.getElementById('update').addEventListener('click', function () {
  const promise = fetchGists();
  promise.then(function (files) {
    // <div id="source"> を取得
    const sourceElem = document.getElementById('source');
    sourceElem.innerHTML = '';
    files.forEach(function (file) {
      // <section class="card">
      const sectionElem = document.createElement('section');
      sectionElem.classList.add('card');
      // <h2 class="card-title">
      const h2Elem = document.createElement('h2');
      h2Elem.classList.add('card-title');
      // タイトルは「フォルダ名/ファイル名」にする
      h2Elem.textContent = file.filename.split('.').slice(0, -1).join('.').replace(/\-/g, '/');
      // レイアウト
      sourceElem.appendChild(sectionElem);
      sectionElem.appendChild(h2Elem);
      // <script src="https://gist.github.com/gplayer2022/<gistId>.js"></script>
      appendGistIframe(file, sectionElem);
    });
  });
});

// IFrame として Gist 用スクリプトを埋め込む
function appendGistIframe(file, parentElem) {
  const iframeElem = document.createElement('iframe');
  iframeElem.width = '100%';
  iframeElem.height = '300px';
  iframeElem.frameBorder = '0';
  iframeElem.addEventListener('load', function () {
    const iframeDocument = iframeElem.contentDocument || iframeElem.contentWindow.document;
    const iframeInnerHTML = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head><body><script type="text/javascript" src="https://gist.github.com/gplayer2022/${file.id}.js"></script></body></html>`
    iframeDocument.open();
    iframeDocument.write(iframeInnerHTML);
    iframeDocument.close();
  });
  parentElem.appendChild(iframeElem);
  adjustIframeHeight(iframeElem);
}

// iframe の高さを調整する
function adjustIframeHeight(iframeElem) {
  const intervalId = setInterval(function () {
    const iframeDocument = iframeElem.contentDocument || iframeElem.contentWindow.document;
    if (iframeDocument && iframeDocument.body && 0 < iframeDocument.body.scrollHeight) {
      iframeElem.style.height = iframeDocument.body.scrollHeight + 'px';
      clearInterval(intervalId);
    }
  }, 100);
}

// 公開 Gist の一覧を取得する
function fetchGists() {
  const url = 'https://api.github.com/users/gplayer2022/gists';
  const descriptionPattern = /^\[GistSyncer\] /;
  return fetch(url).then(function (response) {
    return response.json();
  }).catch(function (reason) {
    console.log(reason);
  }).then(function (gists) {
    const files = [];
    gists.forEach(function (gist) {
      if (descriptionPattern.test(gist.description)) {
        files.push({
          id: gist.id,
          filename: Object.keys(gist.files)[Object.keys(gist.files).length - 1],
        });
      }
    });
    return Promise.resolve(files);
  });
}

