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
