
//Privacy policy popup
window.addEventListener("load", function () {
  setTimeout(
      function open(event) {
          document.querySelector(".popupPrivacy").style.display = "block";
      },
      1000
  )
})

function allowPrivacyPolicy() {
  if (event.target.id != "popupPrivacy") {
    document.getElementById("popupPrivacy").style.display = "none";
  }
}

//Help popup
function openPopUp() {
  document.querySelector(".popup").style.display = "block";
  document.querySelector(".main").style.filter = "blur(3px)";
  document.querySelector(".right").style.filter = "blur(3px)";
  document.querySelector(".scrollableDiv").style.filter = "blur(3px)";

  if (event.target.id != "popup") {
    document.getElementById("popup").style.display = "none";
  }
}

function closePopUp() {
  document.querySelector(".popup").style.display = "none";
  document.querySelector(".main").style.filter = "none";
  document.querySelector(".right").style.filter = "none";
  document.querySelector(".scrollableDiv").style.filter = "none";
  if (event.target.id != "popup") {
    document.getElementById("popup").style.display = "none";
  }
}


