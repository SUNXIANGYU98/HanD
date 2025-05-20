let video;

/** @type {ml5.HandPose} */
let handPose;

/** @type {ml5.Hand[]} */
let hands = [];

function preload() {
  // Load the handPose model
  handPose = ml5.handPose({
    flipped: true,
  });
}

function setup() {
  const scale = 2;
  createCanvas(640 * scale, 480 * scale);

  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // start detecting hands from the webcam video
  handPose.detectStart(video, function (results) {
    hands = results;
  });
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  //

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

    textAlign("center");
    textSize(distanza_mano_1);
    fill(distanza_mano_2, 0, 0);
    text("Ciao", width / 2, height);

    line(pollice_1.x, pollice_1.y, indice_1.x, indice_1.y);
    line(pollice_2.x, pollice_2.y, indice_2.x, indice_2.y);
  }

  // strokeWeight(4);

  // const mano_1 = hands[0];
  // if (!mano_1) return;

  // const mano_1_pollice = mano_1.keypoints[4];
  // const mano_1_indice = mano_1.keypoints[8];

  // stroke(255, 0, 0);
  // line(mano_1_pollice.x, mano_1_pollice.y, mano_1_indice.x, mano_1_indice.y);

  // const mano_2 = hands[1];
  // if (!mano_2) return;

  // const mano_2_pollice = mano_2.keypoints[4];
  // const mano_2_indice = mano_2.keypoints[8];

  // stroke(0, 0, 255);
  // line(mano_2_pollice.x, mano_2_pollice.y, mano_2_indice.x, mano_2_indice.y);

  // stroke(255, 255, 0);
  // line(mano_1_pollice.x, mano_1_pollice.y, mano_2_pollice.x, mano_2_pollice.y);

  // stroke(0, 255, 0);
  // line(mano_1_indice.x, mano_1_indice.y, mano_2_indice.x, mano_2_indice.y);
}
