let video;
/** @type {ml5.HandPose} */
let handPose;
/** @type {ml5.Hand[]} */
let hands = [];

function preload() {
  handPose = ml5.handPose({ flipped: true }); // 加载手势识别模型，镜像处理
}

function setup() {
  const scale = 2;
  createCanvas(640 * scale, 480 * scale); // 创建画布

  video = createCapture(VIDEO, { flipped: true }); // 摄像头输入
  video.size(width, height);
  video.hide();

  // 开始识别手势
  handPose.detectStart(video, function (results) {
    hands = results;
  });
}

function draw() {
  image(video, 0, 0, width, height); // 显示视频图像

  const mano_1 = hands[0];
  const mano_2 = hands[1];

  if (mano_1 && mano_2) {
    // 提取关键点
    const keypoints_1 = mano_1.keypoints;
    const keypoints_2 = mano_2.keypoints;

    // 显示文字
    const distanza_mano_1 = dist(
      keypoints_1[4].x,
      keypoints_1[4].y,
      keypoints_1[8].x,
      keypoints_1[8].y
    );
    const distanza_mano_2 = dist(
      keypoints_2[4].x,
      keypoints_2[4].y,
      keypoints_2[8].x,
      keypoints_2[8].y
    );

    textAlign(CENTER);
    textSize(distanza_mano_1);
    fill(0, 0, distanza_mano_2); // 改为蓝色分量控制
    text("UNDEFINE", width / 2, height); // 改为 UNDEFINE

    // 绘制波浪线：连接每对相同手指（例如：拇指-拇指、食指-食指）
    for (let i = 0; i < keypoints_1.length; i++) {
      const pt1 = keypoints_1[i];
      const pt2 = keypoints_2[i];

      drawWavyLine(pt1.x, pt1.y, pt2.x, pt2.y, i); // 第i对手指
    }
  }
}

// 使用正弦波绘制两点之间的波浪线
function drawWavyLine(x1, y1, x2, y2, index) {
  const steps = 100; // 插值点数
  const amplitude = 10; // 波浪幅度
  const frequency = 10; // 波浪频率

  noFill();
  strokeWeight(2);

  // 每对手指使用不同颜色
  stroke((index * 40) % 255, (index * 85) % 255, (index * 130) % 255);

  beginShape();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x1, x2, t);
    const y = lerp(y1, y2, t) + sin(t * frequency * TWO_PI) * amplitude;
    curveVertex(x, y); // 使用平滑曲线
  }
  endShape();
}
