//Reset Image
let btnReset = document.getElementById("reset");
btnReset.addEventListener("click", reset);

function reset() {
  let mat = cv.imread(imgElement);
  cv.imshow("canvasOutput", mat);
  mat.delete();
}

//Convolution

let btn = document.getElementById("convolution");
btn.addEventListener("click", faCeva);

function faCeva() {
  console.log("CUCU BAU");
  //Am observat ca daca in loc de imageScr bagam imaginea din canvas
  //si dam click pe butonul "Try It" efectul se tot aplica
  //pana cand imaginea devine "arsa"
  let src = cv.imread("imageSrc");
  let dst = new cv.Mat();
  let M = cv.Mat.eye(2, 2, cv.CV_32FC1);
  let anchor = new cv.Point(-1, -1);
  // You can try more different parameters
  cv.filter2D(src, dst, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
  M.delete();
}

//Gaussian Blur

let btnBlurGaussian = document.getElementById("blurringGaussian");
btnBlurGaussian.addEventListener("click", blurringGaussian);

function blurringGaussian() {
  console.log(cv);
  let src = cv.imread("imageSrc");
  let dst = new cv.Mat();
  let ksize = new cv.Size(3, 3);
  // You can try more different parameters
  cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
}

//Median Blur

let btnBlurMedian = document.getElementById("blurringMedian");
btnBlurMedian.addEventListener("click", blurringMedian);

function blurringMedian() {
  let src = cv.imread("imageSrc");
  let dst = new cv.Mat();
  // You can try more different parameters
  cv.medianBlur(src, dst, 5);
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
}

//Bilateral filtering

let btnBilateralFilter = document.getElementById("bilateralFilter");
btnBilateralFilter.addEventListener("click", bilateralFilter);

function bilateralFilter() {
  let src = cv.imread("imageSrc");
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
  // You can try more different parameters
  cv.bilateralFilter(src, dst, 9, 75, 75, cv.BORDER_DEFAULT);
  cv.imshow("canvasOutput", dst);
  src.delete();
  dst.delete();
}

//Video
let videoBtn = document.getElementById("video");
videoBtn.addEventListener("click", videoDetect);

function videoDetect() {
  let video = document.getElementById("videoInput");
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred! " + err);
    });
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);

  const FPS = 30;
  function processVideo() {
    let begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow("canvasOutput2", dst);
    // schedule next one.
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
}
