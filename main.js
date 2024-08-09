import * as PixiSound from "@pixi/sound";

const sounds = PixiSound.sound.add("sounds", {
  url: "sounds.ogg",
  sprites: {
    "sound-1": {
      start: 0,
      end: 12.36,
    },
    "sound-2": {
      start: 14,
      end: 21.296009070294787,
    },
    "sound-3": {
      start: 23,
      end: 30.23591836734694,
    },
  },
});

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const toggleElapsedFixButton = document.getElementById("toggle-elapsed-fix");
const toggleWorkaroundButton = document.getElementById("toggle-workaround");

const progressOutput = document.getElementById("progress");
const elapsedFixStateOutput = document.getElementById("elapsed-fix-state");
const workaroundStateOutput = document.getElementById("workaround-state");

const testSoundId = "sound-1";

/**
 * @type {import("@pixi/sound").IMediaInstance | null}
 */
let soundInstance = null;

let elapsedFixToggled = false;
let workaroundToggled = false;

/**
 * @param {boolean} toggle
 */
function toggleInstancePause(toggle) {
  if (!soundInstance) {
    return;
  }

  if (workaroundToggled) {
    soundInstance._source.playbackRate.value = toggle ? 0 : 1;
  } else {
    soundInstance.paused = toggle;
  }
}

function setElapsedFixState() {
  elapsedFixStateOutput.innerHTML = `Elapsed fix toggled: <b>${elapsedFixToggled}</b>`;
  elapsedFixStateOutput.dataset.state = elapsedFixToggled
    ? "success"
    : "danger";
}

function setWorkaroundState() {
  workaroundStateOutput.innerHTML = `Workaround toggled: <b>${workaroundToggled}</b>`;
  workaroundStateOutput.dataset.state = workaroundToggled
    ? "success"
    : "danger";
}

async function handlePlay() {
  if (soundInstance) {
    soundInstance.stop();
  }

  soundInstance = await sounds.play({
    sprite: testSoundId,
    loop: true,
    volume: 0.75,
  });

  soundInstance.on("progress", (progress) => {
    progressOutput.innerHTML = `Playback progress: <b>${progress.toFixed(
      2
    )}</b>\nElapsed time: <b>${soundInstance._elapsed.toFixed(2)}</b>`;

    if (elapsedFixToggled && soundInstance._elapsed >= soundInstance._end) {
      soundInstance._elapsed = 0;
    }
  });
}

function handlePause() {
  toggleInstancePause(true);
}

function handleResume() {
  toggleInstancePause(false);
}

function handleToggleElapsedFix() {
  elapsedFixToggled = !elapsedFixToggled;
  setElapsedFixState();
}

function handleToggleWorkaround() {
  workaroundToggled = !workaroundToggled;
  setWorkaroundState();
}

/**
 * @param {string} key
 * @param {() => void | Promise<void>} callback
 */
function addKeyDownListener(key, callback) {
  document.addEventListener("keydown", async (event) => {
    if (event.key === key) {
      await callback();
    }
  });
}

playButton.addEventListener("click", handlePlay);
pauseButton.addEventListener("click", handlePause);
resumeButton.addEventListener("click", handleResume);
toggleElapsedFixButton.addEventListener("click", handleToggleElapsedFix);
toggleWorkaroundButton.addEventListener("click", handleToggleWorkaround);

addKeyDownListener("s", handlePlay);
addKeyDownListener("p", handlePause);
addKeyDownListener("r", handleResume);
addKeyDownListener("f", handleToggleElapsedFix);
addKeyDownListener("w", handleToggleWorkaround);

setElapsedFixState();
setWorkaroundState();
