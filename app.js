// Create an audio context
const audioContext = new AudioContext();
// Create an oscillator
const oscillator = audioContext.createOscillator();
oscillator.type = "sine"; // Set the waveform type
oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Set the frequency to 220 Hz
// Create a gain node to control the volume
const gainNode = audioContext.createGain({
	gain: 0.5 // Set the initial gain to 0.5
}); 
// Connect the oscillator to the gain node, and the gain node to the audio context
oscillator.connect(gainNode).connect(audioContext.destination);
// Start the oscillator
oscillator.start();
// Stop the oscillator after 2 seconds
setTimeout(() => {
	oscillator.stop();
}, 2000);
const audioContext = new AudioContext();
navigator.mediaDevices.getUserMedia({
	audio: true
}).then(handleSuccess).catch(error => console.error(`getUserMedia error: ${error}`));

function handleSuccess(stream) {
	const inputNode = audioContext.createMediaStreamSource(stream);
	const analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputNode.connect(analyserNode);
	const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
	const ASharpFrequency = 466.164;
	const frequencyThreshold = 100; // Adjust this value to change the sensitivity
	requestAnimationFrame(processAudio);

	function processAudio() {
		analyserNode.getByteFrequencyData(frequencyData);
		const maxFrequency = getMaxFrequency(frequencyData, analyserNode.frequencyBinCount, audioContext.sampleRate);
		const frequencyDifference = Math.abs(maxFrequency - ASharpFrequency);
		const isASharp = frequencyDifference < frequencyThreshold;
		if (isASharp) {
			console.log("A# detected!");
		}
		requestAnimationFrame(processAudio);
	}
}

function getMaxFrequency(frequencyData, frequencyBinCount, sampleRate) {
	const maxIndex = frequencyData.indexOf(Math.max(...frequencyData));
	const frequencyResolution = sampleRate / frequencyBinCount;
	return maxIndex * frequencyResolution;
}
