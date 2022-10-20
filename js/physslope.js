window.addEventListener('DOMContentLoaded', function() {
  // キャンバス
  const labBoardCanvasElem = document.getElementById('lab-canvas');
  const context = labBoardCanvasElem.getContext('2d');
  const canvasSize = {
    width: labBoardCanvasElem.width,
    height: labBoardCanvasElem.height,
  };
  const cellLength = canvasSize.width / 12;
  // 角度
  const angleIElem = document.getElementById('angle');
  const anglePanelElem = document.getElementById('angle-panel');
  let angle = angleIElem.value;
  // 描画範囲（ origin を基準に）
  const drawingScale = 3 / 4;
  const drawingSize = {
    width: Math.floor(canvasSize.width * drawingScale),
    height: Math.floor(canvasSize.height * drawingScale),
    leftWidth: Math.floor(canvasSize.width * (1 - drawingScale)),
    bottomHeight: Math.floor(canvasSize.height * (1 - drawingScale)),
  };
  // 図形と各点
  const origin = setOrigin();
  const slopePoints = {
    left: {
      x: 0,
      y: 0,
    },
    right: {
      x: drawingSize.width,
      y: 0,
    },
    top: {
      x: drawingSize.width,
      y: drawingSize.width * Math.tan(angle * Math.PI / 180),
    },
  };
  const pedestalPoints = {
    leftBottom: {
      x: 0,
      y: 0,
    },
    size: {
      width: drawingSize.width,
      height: drawingSize.bottomHeight,
    },
  };
  const boxPoints = {
    center: {
      x: 0,
      y: 0,
    },
    centerBottom: {
      x: 0,
      y: 0,
    },
    leftTop: {
      x: 0,
      y: 0,
    },
    leftBottom: {
      x: 0,
      y: 0,
    },
    rightTop: {
      x: 0,
      y: 0,
    },
    rightBottom: {
      x: 0,
      y: 0,
    },
  };
  const gravity = 3 * cellLength;
  const gravityPoints = {
    from: {
      x: 0,
      y: 0,
    },
    to: {
      x: 0,
      y: 0,
    },
  };
  const reactionPoints = {
    from: {
      x: 0,
      y: 0,
    },
    to: {
      friction: {
        x: 0,
        y: 0,
      },
      normalForce: {
        x: 0,
        y: 0,
      },
    },
  };
  const colors = {
    slope: '#bcb5b5',
    pedestal: '#ae9890',
    box: '#a8dba8',
    gravity: 'rgba(' + [235, 70, 84, 0.7] + ')',
    // gravity: 'rgba(' + [255, 69, 0, 0.7] + ')',
    // friction: 'rgba(' + [119, 175, 156, 0.7] + ')',
    friction: 'rgba(' + [0, 100, 0, 0.7] + ')',
    normalForce: 'rgba(' + [72, 55, 252, 0.7] + ')',
  };

  angleIElem.addEventListener('change', function(event) {
    angle = event.target.value;
    anglePanelElem.textContent = angle;
    drawAllFigure();
  }, false);

  // 原点を定める
  function setOrigin() {
    return {
      x: Math.floor(canvasSize.width * (1 - drawingScale)),
      y: Math.floor(canvasSize.height * drawingScale),
    };
  }

  // 全ての図形を描く
  function drawAllFigure() {
    clearCanvas();
    setAllPoint();
    drawPedestal();
    drawSlope();
    drawBox();
    drawGravity();
    drawReaction();
  }

  // キャンバスをクリアする
  function clearCanvas() {
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  // 座標をセット
  function setAllPoint() {
    slopePoints.top.y = drawingSize.width * Math.tan(angle * Math.PI / 180);
    setBoxCenters();
    setBoxCorners();
    setGravity();
    setReaction();
  }

  // 箱の中央を計算する
  function setBoxCenters() {
    if (angle < 45) {
      boxPoints.centerBottom.x = Math.floor((slopePoints.left.x + slopePoints.top.x) / 2);
      boxPoints.centerBottom.y = Math.floor((slopePoints.left.y + slopePoints.top.y) / 2);
    } else {
      boxPoints.centerBottom.x
        = Math.floor(drawingSize.height / Math.tan(angle * Math.PI / 180) / 2);
      boxPoints.centerBottom.y
        = Math.floor(drawingSize.height / 2);
    }
    boxPoints.center.x
      = boxPoints.centerBottom.x - Math.floor(cellLength * Math.sin(angle * Math.PI / 180));
    boxPoints.center.y
      = boxPoints.centerBottom.y + Math.floor(cellLength * Math.cos(angle * Math.PI / 180));
  }

  // 箱の四隅を計算する
  function setBoxCorners() {
    boxPoints.leftBottom.x
      = boxPoints.centerBottom.x - Math.floor(2 * cellLength * Math.cos(angle * Math.PI / 180));
    boxPoints.leftBottom.y
      = boxPoints.centerBottom.y - Math.floor(2 * cellLength * Math.sin(angle * Math.PI / 180));
    boxPoints.rightBottom.x
      = boxPoints.centerBottom.x + Math.floor(2 * cellLength * Math.cos(angle * Math.PI / 180));
    boxPoints.rightBottom.y
      = boxPoints.centerBottom.y + Math.floor(2 * cellLength * Math.sin(angle * Math.PI / 180));
    boxPoints.leftTop.x
      = boxPoints.leftBottom.x - Math.floor(2 * cellLength * Math.sin(angle * Math.PI / 180));
    boxPoints.leftTop.y
      = boxPoints.leftBottom.y + Math.floor(2 * cellLength * Math.cos(angle * Math.PI / 180));
    boxPoints.rightTop.x
      = boxPoints.rightBottom.x - Math.floor(2 * cellLength * Math.sin(angle * Math.PI / 180));
    boxPoints.rightTop.y
      = boxPoints.rightBottom.y + Math.floor(2 * cellLength * Math.cos(angle * Math.PI / 180));
  }

  // 重力の始点と終点を計算する
  function setGravity() {
    gravityPoints.from.x = boxPoints.center.x;
    gravityPoints.from.y = boxPoints.center.y;
    gravityPoints.to.x = boxPoints.center.x;
    gravityPoints.to.y = boxPoints.center.y - gravity;
  }

  // 抗力の始点と終点を計算する
  function setReaction() {
    reactionPoints.from.x = boxPoints.center.x;
    reactionPoints.from.y
      = boxPoints.centerBottom.y - Math.floor(
      cellLength * Math.pow(Math.sin(angle * Math.PI / 180), 2) 
      / Math.cos(angle * Math.PI / 180));
    const friction = gravity * Math.sin(angle * Math.PI / 180);
    const normalForce = gravity * Math.cos(angle * Math.PI / 180);
    reactionPoints.to.friction.x
      = reactionPoints.from.x + Math.floor(friction * Math.cos(angle * Math.PI / 180));
    reactionPoints.to.friction.y
      = reactionPoints.from.y + Math.floor(friction * Math.sin(angle * Math.PI / 180));
    reactionPoints.to.normalForce.x
      = reactionPoints.from.x - Math.floor(normalForce * Math.sin(angle * Math.PI / 180));
    reactionPoints.to.normalForce.y
      = reactionPoints.from.y + Math.floor(normalForce * Math.cos(angle * Math.PI / 180));
  }

  // 坂を描く
  function drawSlope() {
    context.fillStyle = colors.slope;
    context.beginPath();
    context.moveTo(
      translateX4display(slopePoints.left.x),
      translateY4display(slopePoints.left.y));
    context.lineTo(
      translateX4display(slopePoints.right.x),
      translateY4display(slopePoints.right.y));
    context.lineTo(
      translateX4display(slopePoints.top.x),
      translateY4display(slopePoints.top.y));
    context.closePath();
    context.fill();
  }

  // 台座を描く
  function drawPedestal() {
    context.fillStyle = colors.pedestal;
    context.fillRect(
      translateX4display(pedestalPoints.leftBottom.x),
      translateY4display(pedestalPoints.leftBottom.y),
      pedestalPoints.size.width,
      pedestalPoints.size.height,
    );
  }

  // ボックスを描く
  function drawBox() {
    context.fillStyle = colors.box;
    context.beginPath();
    context.moveTo(
      translateX4display(boxPoints.leftBottom.x),
      translateY4display(boxPoints.leftBottom.y));
    context.lineTo(
      translateX4display(boxPoints.rightBottom.x),
      translateY4display(boxPoints.rightBottom.y));
    context.lineTo(
      translateX4display(boxPoints.rightTop.x),
      translateY4display(boxPoints.rightTop.y));
    context.lineTo(
      translateX4display(boxPoints.leftTop.x),
      translateY4display(boxPoints.leftTop.y));
    context.closePath();
    context.fill();
  }

  // 重力を描く
  function drawGravity() {
    drawArrow(
      translateX4display(gravityPoints.from.x),
      translateY4display(gravityPoints.from.y),
      translateX4display(gravityPoints.to.x),
      translateY4display(gravityPoints.to.y),
      colors.gravity
    );
  }

  // 抗力を描く
  function drawReaction() {
    drawArrow(
      translateX4display(reactionPoints.from.x),
      translateY4display(reactionPoints.from.y),
      translateX4display(reactionPoints.to.friction.x),
      translateY4display(reactionPoints.to.friction.y),
      colors.friction
    );
    drawArrow(
      translateX4display(reactionPoints.from.x),
      translateY4display(reactionPoints.from.y),
      translateX4display(reactionPoints.to.normalForce.x),
      translateY4display(reactionPoints.to.normalForce.y),
      colors.normalForce
    );
  }

  // 矢印を描く
  function drawArrow(fromX, fromY, toX, toY, color) {
    let distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    if (0 < distance) {
      let arrowAngle = Math.atan2(toY - fromY, fromX - toX);
      // shaft
      const shaft = {
        to: {
          x: distance < 62 ? toX + 6 * Math.cos(arrowAngle) : toX + 32 * Math.cos(arrowAngle),
          y: distance < 62 ? toY - 6 * Math.sin(arrowAngle) : toY - 32 * Math.sin(arrowAngle),
        },
      };
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = Math.min(12, Math.ceil(distance / 4));
      context.lineCap = "round";
      context.moveTo(fromX, fromY);
      context.lineTo(shaft.to.x, shaft.to.y);
      context.stroke();
      // arrow head
      const arrowHeadLength = Math.min(38, distance / 2);
      const arrowHead = {
        top: {
          x: toX,
          y: toY,
        },
        right: {
          x: toX + arrowHeadLength * Math.cos(arrowAngle + (Math.PI / 8)),
          y: toY - arrowHeadLength * Math.sin(arrowAngle + (Math.PI / 8)),
        },
        left: {
          x: toX + arrowHeadLength * Math.cos(arrowAngle - (Math.PI / 8)),
          y: toY - arrowHeadLength * Math.sin(arrowAngle - (Math.PI / 8)),
        },
      };
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(arrowHead.top.x, arrowHead.top.y);
      context.lineTo(arrowHead.right.x, arrowHead.right.y);
      context.lineTo(arrowHead.left.x, arrowHead.left.y);
      context.closePath();
      context.fill();
    }

  }

  // 表示用に X 座標を翻訳する
  function translateX4display(x) {
    return origin.x + x;
  }

  // 表示用に Y 座標を翻訳する
  function translateY4display(y) {
    return origin.y - y;
  }

  // 全図形を描く（初期化）
  drawAllFigure();
});