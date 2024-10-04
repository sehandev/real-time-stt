import os
import tempfile

import numpy as np
import pyaudio
from lightning_whisper_mlx import LightningWhisperMLX
from scipy.io.wavfile import write
from src.py_stt.config_manager import ConfigManager


def vad_simple(
    pcmf32,
    sample_rate,
    window_size_ms,
    threshold,
    freq_threshold,
    output_probs=False,
):
    """Simple voice activity detection algorithm."""
    window_size = int(sample_rate * window_size_ms / 1000)
    sample_count = len(pcmf32)

    if sample_count < window_size:
        print("Error: sample_count < window_size", sample_count, window_size)
        return False

    pcmf32_mono = pcmf32
    if len(pcmf32_mono.shape) == 2:
        pcmf32_mono = np.mean(pcmf32_mono, axis=1)

    energy = np.mean(pcmf32_mono**2)
    energy_threshold = threshold**2

    if energy < energy_threshold:
        print("Energy below threshold", energy, energy_threshold)
        return False

    fft = np.fft.rfft(pcmf32_mono)
    freq = np.fft.rfftfreq(sample_count, d=1.0 / sample_rate)

    fft_energy = np.abs(fft) ** 2
    cutoff_idx = np.where(freq >= freq_threshold)[0][0]
    fft_low_freq_energy = np.sum(fft_energy[:cutoff_idx])
    fft_total_energy = np.sum(fft_energy)

    low_freq_ratio = fft_low_freq_energy / fft_total_energy

    if output_probs:
        return low_freq_ratio

    print("Low freq ratio", low_freq_ratio)
    return low_freq_ratio > 0.1


def main():
    # Initialize PyAudio
    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=pyaudio.paInt16,
        channels=1,
        rate=ConfigManager.SAMPLE_RATE,
        input=True,
        frames_per_buffer=ConfigManager.CHUNK_SIZE,
    )

    # Initialize Whisper model
    whisper = LightningWhisperMLX(
        model=ConfigManager.MODEL_NAME,
        batch_size=ConfigManager.BATCH_SIZE,
        quant=ConfigManager.QUANT,
    )

    # Initialize variables
    is_running = True
    n_iter = 0
    pcmf32_vad = np.array([], dtype=np.float32)

    print("[Start speaking]")

    # Main loop
    while is_running:
        # Read audio data from the stream
        data = stream.read(ConfigManager.CHUNK_SIZE, exception_on_overflow=False)
        pcm16 = np.frombuffer(data, dtype=np.int16)
        pcmf32_new = pcm16.astype(np.float32) / 32768.0

        # Accumulate audio data for VAD
        pcmf32_vad = np.concatenate((pcmf32_vad, pcmf32_new))

        if len(pcmf32_vad) < ConfigManager.VAD_WINDOW_SIZE_SAMPLES:
            print('VAD_WINDOW_SIZE_SAMPLES')
            continue

        is_voice_activity_detected = vad_simple(
            pcmf32_vad,
            ConfigManager.SAMPLE_RATE,
            ConfigManager.VAD_WINDOW_SIZE_MS,
            ConfigManager.VAD_THRESHOLD,
            ConfigManager.FREQ_THRESHOLD,
            False,
        )
        if not is_voice_activity_detected:
            print("none")
            continue

        # Voice activity detected, accumulate audio data for Whisper
        pcmf32 = pcmf32_vad.copy()
        while len(pcmf32) < ConfigManager.VAD_LENGTH_SAMPLES:
            data = stream.read(ConfigManager.CHUNK_SIZE, exception_on_overflow=False)
            pcm16 = np.frombuffer(data, dtype=np.int16)
            pcmf32_new = pcm16.astype(np.float32) / 32768.0
            pcmf32 = np.concatenate((pcmf32, pcmf32_new))

        # Save audio data to a WAV file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmpfile:
            data = (pcmf32 * 32767).astype(np.int16)
            write(tmpfile.name, ConfigManager.SAMPLE_RATE, data)
            result = whisper.transcribe(audio_path=tmpfile.name)
            print(result["text"])
            os.unlink(tmpfile.name)  # Delete the temporary file after use

        n_iter += 1

        # Reset VAD buffer
        pcmf32_vad = np.array([], dtype=np.float32)

    # Close the stream and terminate PyAudio
    stream.stop_stream()
    stream.close()
    audio.terminate()


if __name__ == "__main__":
    main()
