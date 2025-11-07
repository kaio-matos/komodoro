export function createAudioController(audioElement: HTMLAudioElement) {
  const ctx = new AudioContext();
  const globalGainNode = new GainNode(ctx, { gain: 1 });
  const gainNode = new GainNode(ctx, { gain: 1 });
  const stereoPanner = new StereoPannerNode(ctx, { pan: 0 });
  const track = new MediaElementAudioSourceNode(ctx, {
    mediaElement: audioElement,
  });

  track
    .connect(globalGainNode)
    .connect(gainNode)
    .connect(stereoPanner)
    .connect(ctx.destination);

  function setGlobalGain(gain: number) {
    globalGainNode.gain.value = gain;
  }

  function getGlobalGain() {
    return globalGainNode.gain.value;
  }

  function setGain(gain: number) {
    gainNode.gain.value = gain;
  }

  function getGain() {
    return gainNode.gain.value;
  }

  function play() {
    return track.mediaElement.play();
  }

  function pause() {
    return track.mediaElement.pause();
  }

  function reset() {
    track.mediaElement.currentTime = 0;
  }

  function stop() {
    pause();
    reset();
  }

  return {
    ctx,
    stereoPanner,
    track,
    gainNode,
    setGlobalGain,
    getGlobalGain,
    setGain,
    getGain,
    play,
    pause,
    reset,
    stop,
  };
}
export type AudioController = ReturnType<typeof createAudioController>;
