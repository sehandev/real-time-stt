import json
import struct
import sys
import time

import numpy as np
import pika
import pyaudio
import webrtcvad
from noisereduce import noisereduce as nr


def decode_audio_frame(audio_frame: bytes) -> tuple[int]:
    decoded: tuple[int] = struct.unpack("h" * (len(audio_frame) // 2), audio_frame)
    return decoded


def encode_audio_frame(audio_frame_np: np.ndarray) -> bytes:
    encoded: bytes = struct.pack(
        "h" * len(audio_frame_np), *audio_frame_np.astype(np.int16)
    )
    return encoded


print("Voice Activity Monitoring")
print("1 - Activity Detected")
print("_ - No Activity Detected")
print("X - No Activity Detected for Last IDLE_TIME Seconds")
input("Press Enter to continue...")
print("\nMonitor Voice Activity Below:")

# Parameters
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000  # 8000, 16000, 32000
FRAMES_PER_BUFFER = 320

# Initialize the VAD with a mode (e.g. aggressive, moderate, or gentle)
# 0: Least filtering noise - 3: Aggressive in filtering noise
vad = webrtcvad.Vad(3)

# Open a PyAudio stream to get audio data from the microphone
pa = pyaudio.PyAudio()
stream = pa.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=FRAMES_PER_BUFFER,
)

# Connect to Queue
connection_param = pika.ConnectionParameters("localhost")
connection = pika.BlockingConnection(connection_param)
channel = connection.channel()
channel.confirm_delivery()
channel.queue_declare("transcription_events")
channel.queue_declare("transcription_results_events")

inactive_session = False
inactive_since = time.time()
frames = []  # list to hold audio frames
sample_user_id = "test-user"
sample_session_id = "test-session"

active_frame_count = 0
ACTIVE_FRAME_THRESHOLD = 30

while True:
    # Read audio data from the microphone
    data: bytes = stream.read(FRAMES_PER_BUFFER)
    audio_frame: tuple[int] = decode_audio_frame(data)

    # Reduce noise
    audio_frame_np: np.ndarray = np.array(audio_frame)
    clean_frame_np: np.ndarray = nr.reduce_noise(y=audio_frame_np, sr=RATE)
    clean_data: bytes = encode_audio_frame(clean_frame_np)

    # Check if the audio is active (i.e. contains speech)
    is_active = vad.is_speech(clean_data, sample_rate=RATE)

    idle_time_cut = 0.5
    if is_active:
        inactive_session = False
    else:
        if inactive_session == False:
            inactive_session = True
            inactive_since = time.time()
        else:
            inactive_session = True

    # Stop hearing if no voice activity detected for N Seconds
    if (inactive_session == True) and (time.time() - inactive_since) > idle_time_cut:
        sys.stdout.write("X")

        # Append data chunk of audio to frames - save later
        frames.append(audio_frame)

        # Push to Queue only if active_frame_count is 30 or higher
        if active_frame_count >= ACTIVE_FRAME_THRESHOLD:
            try:
                channel.basic_publish(
                    exchange="",
                    routing_key="transcription_events",
                    body=json.dumps(
                        {
                            "user_id": sample_user_id,
                            "session_id": sample_session_id,
                            "decoded_audio_frames": frames,
                            "language": "ko",
                        }
                    ),
                )
            except pika.exceptions.ConnectionClosed:
                print("Error. Connection closed, and the message was never delivered.")
                continue

        # Clear Frames List
        frames = []

        # Reset active frame count
        print("\npublish", active_frame_count)
        active_frame_count = 0

        # Flagging to Listen Again
        inactive_session = False
    else:
        sys.stdout.write("1" if is_active else "_")
        active_frame_count += 1 if is_active else 0

    # Append data chunk of audio to frames - save later
    frames.append(audio_frame)

    # Flush Terminal
    sys.stdout.flush()

# Close the PyAudio stream
stream.stop_stream()
