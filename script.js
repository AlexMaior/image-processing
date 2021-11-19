let btn = document.getElementById("tryIt");

btn.addEventListener("click", faCeva);

function faCeva() {
  console.log("CUCU BAU");
  let src = cv.imread("canvasOutput");
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
