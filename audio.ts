const audioElement = document.getElementById("audio") as HTMLAudioElement;
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

const source = audioContext.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioContext.destination);

function updateParticles() {
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 2] = (Math.random() * 2 - 1) * (dataArray[i % dataArray.length] / 255);
        positions[i * 2 + 1] = (Math.random() * 2 - 1) * (dataArray[i % dataArray.length] / 255);
    }
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    requestAnimationFrame(updateParticles);
}

audioElement.addEventListener("play", () => {
    audioContext.resume().then(() => {
        updateParticles();
    });
});