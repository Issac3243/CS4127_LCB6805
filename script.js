const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

function setMusicLabel(isOn) {
  if (musicBtn) musicBtn.textContent = isOn ? "🔊 Music on" : "🔇 Music off";
}

if (music && musicBtn) {
  music.volume = 0.3;
    let wasOn = false;
  try {
    wasOn = localStorage.getItem("music") === "on";
    music.currentTime = parseFloat(localStorage.getItem("musicTime")) || 0;
  } catch (e) {}

  if (wasOn) {
    music.play().then(() => setMusicLabel(true)).catch(() => setMusicLabel(false));
  }

  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => {
        setMusicLabel(true);
        try { localStorage.setItem("music", "on"); } catch (e) {}
      }).catch(() => {});
    } else {
      music.pause();
      setMusicLabel(false);
      try { localStorage.setItem("music", "off"); } catch (e) {}
    }
  });

  window.addEventListener("pagehide", () => {
    try { localStorage.setItem("musicTime", music.currentTime); } catch (e) {}
  });
}


const form = document.getElementById("inquiry-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("message").value.trim();
    const success = document.getElementById("form-success");

    const errors = {
      name: name.length < 2 ? "Please enter your name." : "",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email address.",
      topic: topic === "" ? "Please choose a topic." : "",
      message: message.length < 10 ? "Please write at least 10 characters." : ""
    };

    let allGood = true;
    for (const field in errors) {
      document.getElementById(field + "-error").textContent = errors[field];
      if (errors[field]) allGood = false;
    }

    if (allGood) {
      success.textContent = "Thank you, " + name + "! We received your inquiry about “" + topic + "” and will reply to " + email + ".";
      success.hidden = false;
      form.reset();
    } else {
      success.hidden = true;
    }
  });
}


const slidesBox = document.querySelector(".slides");

if (slidesBox) {
  const total = slidesBox.children.length;
  const dotsBox = document.getElementById("dots");
  let index = 0;
  let timer;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => { showSlide(i); restartTimer(); });
    dotsBox.appendChild(dot);
  }

  function showSlide(i) {
    index = (i + total) % total;
    slidesBox.style.transform = "translateX(-" + index * 100 + "%)";
    document.querySelectorAll(".dot").forEach((d, n) => {
      d.classList.toggle("active", n === index);
    });
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(index + 1), 5000);
  }

  document.querySelector(".slider-btn.next").addEventListener("click", () => { showSlide(index + 1); restartTimer(); });
  document.querySelector(".slider-btn.prev").addEventListener("click", () => { showSlide(index - 1); restartTimer(); });

  const slider = document.querySelector(".slider");
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restartTimer);

  showSlide(0);
  restartTimer();
}