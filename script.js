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
btn.addEventListener("click", convo);

function convo() {
  //Am observat ca daca in loc de imageScr bagam imaginea din canvas
  //si dam click pe butonul "Try It" efectul se tot aplica de mai multe ori
  let src = cv.imread("imageSrc");
  let dst = new cv.Mat();
  let M = cv.Mat.eye(2, 2, cv.CV_32FC1);
  let anchor = new cv.Point(-1, -1);
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
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
  setTimeout(processVideo, 0);
}

// VIdeo cu face detection
let videoBtnFace = document.getElementById("videoFace");
videoBtnFace.addEventListener("click", videoDetectFace);

function videoDetectFace() {
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
  let gray = new cv.Mat();
  let cap = new cv.VideoCapture(videoInput);
  let faces = new cv.RectVector();
  let classifier = new cv.CascadeClassifier();
  let utils = new Utils("errorMessage");
  let faceCascadeFile = "haarcascade_frontalface_default.xml";
  utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    classifier.load(faceCascadeFile);
  });
  const FPS = 24;

  function screenShot() {
    let canvas = document.getElementById("canvasOutput4");
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL("image/jpeg");

    //Sharpen cu imaginea capturata de la face detection
    let src = cv.imread("canvasOutput4");
    let dst = new cv.Mat();
    let ksize = new cv.Size(3, 3);
    cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.addWeighted(src, 3.5, dst, -2.5, 0, dst);
    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();

    //Sharpen

    console.log(image_data_url);
  }

  function processVideo() {
    let begin = Date.now();
    cap.read(src);
    src.copyTo(dst);
    cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
    try {
      classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
      console.log(faces.size());
      if (faces.size() >= 2) {
        screenShot();
      }
    } catch (err) {
      console.log(err);
    }
    for (let i = 0; i < faces.size(); ++i) {
      let face = faces.get(i);
      let point1 = new cv.Point(face.x, face.y);
      let point2 = new cv.Point(face.x + face.width, face.y + face.height);
      cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
    }

    cv.imshow("canvasOutput3", dst);
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
  setTimeout(processVideo, 0);
}

document.getElementById("downloadButton").onclick = function () {
  this.href = document.getElementById("canvasOutput").toDataURL();
  this.download = "image.png";
};
