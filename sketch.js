let video;
/** @type {ml5.HandPose} */
let handPose;
/** @type {ml5.Hand[]} */
let hands = [];

function preload() {
  // 加载手势识别模型
  handPose = ml5.handPose({
    flipped: true,
  });
}

function setup() {
  const scale = 2;
  createCanvas(640 * scale, 480 * scale);

  // 创建摄像头视频并隐藏
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // 开始检测手势
  handPose.detectStart(video, function (results) {
    hands = results;
  });
}

function draw() {
  // 显示视频画面
  image(video, 0, 0, width, height);

  const mano_1 = hands[0];
  const mano_2 = hands[1];

  if (mano_1 && mano_2) {
    const pollice_1 = mano_1.keypoints[4];
    const indice_1 = mano_1.keypoints[8];

    const distanza_mano_1 = dist(
      pollice_1.x,
      pollice_1.y,
      indice_1.x,
      indice_1.y
    );

    const pollice_2 = mano_2.keypoints[4];
    const indice_2 = mano_2.keypoints[8];

    const distanza_mano_2 = dist(
      pollice_2.x,
      pollice_2.y,
      indice_2.x,
      indice_2.y
    );

    // 显示动态文字
    textAlign("center");
    textSize(distanza_mano_1);
    fill(distanza_mano_2, 0, 0);
    text("UNDEFINE", width / 2, height); // ✅ 替换 Ciao 为 UNDEFINE

    // 画原始两条线：拇指到食指
    line(pollice_1.x, pollice_1.y, indice_1.x, indice_1.y);
    line(pollice_2.x, pollice_2.y, indice_2.x, indice_2.y);

    // ✅ 新增功能：为每对相同手指画动态波浪线
    for (let i = 0; i < mano_1.keypoints.length; i++) {
      const pt1 = mano_1.keypoints[i];
      const pt2 = mano_2.keypoints[i];
      drawWavyLine(pt1.x, pt1.y, pt2.x, pt2.y, i);
    }
  }
}

// ✅ 新增函数：绘制动态波浪线
function drawWavyLine(x1, y1, x2, y2, index) {
  const steps = 60; // 插值精度
  const amp = 10; // 振幅（波高）
  const freq = 6; // 频率（波密度）
  const speed = 0.1; // 动画速度（越大越快）

  strokeWeight(2);
  // 每个手指用不同颜色
  stroke((index * 50) % 255, (index * 80) % 255, (index * 110) % 255);
  noFill();

  beginShape();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x1, x2, t);
    // 加上 frameCount 实现“流动”的波动
    const y =
      lerp(y1, y2, t) + sin(t * freq * TWO_PI + frameCount * speed) * amp;
    curveVertex(x, y);
  }
  endShape();
}
