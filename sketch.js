let video; // 用于存储摄像头视频流

/** @type {ml5.HandPose} */
let handPose; // 手部识别模型对象（ml5.js）

/** @type {ml5.Hand[]} */
let hands = []; // 存储识别出的手部数据数组

function preload() {
  // 预加载阶段：加载手部识别模型，设置为左右镜像
  handPose = ml5.handPose({
    flipped: true,
  });
}

function setup() {
  const scale = 2; // 缩放比例
  createCanvas(640 * scale, 480 * scale); // 创建画布，分辨率为 1280x960

  // 创建摄像头视频并隐藏（不直接显示）
  video = createCapture(VIDEO, { flipped: true }); // 同样设置镜像
  video.size(width, height); // 设置视频大小与画布一致
  video.hide(); // 隐藏默认视频显示

  // 开始从摄像头视频中检测手部
  handPose.detectStart(video, function (results) {
    hands = results; // 每帧更新识别到的手部数据
  });
}

function draw() {
  // 每一帧绘制摄像头图像
  image(video, 0, 0, width, height);

  // 获取前两只识别到的手
  const mano_1 = hands[0];
  const mano_2 = hands[1];

  if (mano_1 && mano_2) {
    // 如果两只手都检测到了，提取每只手的大拇指（点4）和食指（点8）坐标
    const pollice_1 = mano_1.keypoints[4];
    const indice_1 = mano_1.keypoints[8];

    // 计算第一只手的大拇指与食指之间的距离
    const distanza_mano_1 = dist(
      pollice_1.x,
      pollice_1.y,
      indice_1.x,
      indice_1.y
    );

    const pollice_2 = mano_2.keypoints[4];
    const indice_2 = mano_2.keypoints[8];

    // 计算第二只手的大拇指与食指之间的距离
    const distanza_mano_2 = dist(
      pollice_2.x,
      pollice_2.y,
      indice_2.x,
      indice_2.y
    );

    // 使用第一只手的手指距离作为字体大小，第二只手的距离控制文字颜色的红色分量
    textAlign("center"); // 文字居中对齐
    textSize(distanza_mano_1); // 设置文字大小
    fill(distanza_mano_2, 100, 0); // 设置文字颜色（红色根据距离变化）
    text("UNDEFINE", width / 2, height); // 显示文字“Ciao”在画布底部居中

    // 绘制两只手的大拇指与食指之间的线
    line(pollice_1.x, pollice_1.y, indice_1.x, indice_1.y);
    line(pollice_2.x, pollice_2.y, indice_2.x, indice_2.y);
  }

  // 测试绘图代码，绘制手指之间的连线
  // strokeWeight(6); // 设置线条粗细

  const mano_1 = hands[0];
  if (!mano_1) return;
  const mano_1_pollice = mano_1.keypoints[4];
  const mano_1_indice = mano_1.keypoints[8];
  stroke(255, 0, 0); // 红色线条
  line(mano_1_pollice.x, mano_1_pollice.y, mano_1_indice.x, mano_1_indice.y);

  const mano_2 = hands[1];
  if (!mano_2) return;
  const mano_2_pollice = mano_2.keypoints[4];
  const mano_2_indice = mano_2.keypoints[8];
  stroke(0, 0, 255); // 蓝色线条
  line(mano_2_pollice.x, mano_2_pollice.y, mano_2_indice.x, mano_2_indice.y);

  stroke(255, 255, 0); // 黄色线条
  line(mano_1_pollice.x, mano_1_pollice.y, mano_2_pollice.x, mano_2_pollice.y);

  stroke(0, 255, 0); // 绿色线条
  line(mano_1_indice.x, mano_1_indice.y, mano_2_indice.x, mano_2_indice.y);
}
