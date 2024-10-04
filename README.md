# Real-Time Speech-to-Text Next.js Application

This project is a Next.js application featuring real-time speech-to-text capabilities.

## Getting Started

To run the development server:

```bash
bun dev
```

To run the production server:

```bash
bun build
bun start
```

# Real-Time Speech-to-Text Python Application

## Prerequisites

Before running this application, ensure you have the following installed:

- PortAudio: This is required for audio processing.
- FFmpeg: This is required for audio processing and conversion.
- PDM: Python package manager and runner.

### Installing PortAudio and FFmpeg

- On macOS (using Homebrew):

  ```
  brew install portaudio
  brew install ffmpeg
  ```

- On Ubuntu/Debian:

  ```
  sudo apt-get install portaudio19-dev
  sudo apt-get install ffmpeg
  ```

- On Windows:
  - Download and install PortAudio from the official website: http://www.portaudio.com/download.html
  - Download and install FFmpeg from the official website: https://ffmpeg.org/download.html

Make sure both PortAudio and FFmpeg are properly installed before proceeding with the application setup.

### Installing PDM

For PDM installation instructions, please refer to the official PDM documentation:

[PDM Installation Guide](https://pdm-project.org/en/latest/)

## Getting Started

1. Install Python packages using PDM:

```bash
pdm install
```

2. Run the project using PDM:

```bash
pdm run start
```
