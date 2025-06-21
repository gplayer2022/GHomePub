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
  iframeElem.style.border = 'none';
  const iframeInnerHTML = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head><body><script type="text/javascript" src="https://gist.github.com/gplayer2022/${file.id}.js"></script><script>window.addEventListener('load', function () { setTimeout(function () { window.parent.postMessage({id: '${file.id}', height: document.body.scrollHeight }, '*');}, 100);});</script></body></html>`
  const blob = new Blob([iframeInnerHTML], { type: 'text/html' });
  // 仮想的に URL に追加
  const blobURL = URL.createObjectURL(blob);
  iframeElem.src = blobURL;
  // iframe の高さを事後的に調整する
  window.addEventListener('message', function (event) {
    // クロスドメイン対策
    if (event.origin !== 'null' &&
      event.origin !== window.origin &&
      !event.origin.includes('gist.github.com')) {
      return;
    }
    if (!event.data || !event.data.height || !event.data.id) {
      return;
    }
    if (event.data.id === file.id) {
      iframeElem.style.height = event.data.height + 'px';
    }
  });
  parentElem.appendChild(iframeElem);
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
    // アップデート降順で追加
    files = files.sort(function (a, b) {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    return Promise.resolve(files);
  });
}

