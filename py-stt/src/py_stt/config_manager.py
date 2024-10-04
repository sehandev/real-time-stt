from pathlib import Path

import toml


def get_config():
    config_path = Path(__file__).parent / "config.toml"
    with open(config_path, "r") as config_file:
        config = toml.load(config_file)
    return config["constants"]


# Load constants from the config file
constants = get_config()


# Print the constants
print("Loaded config:")
for key, value in constants.items():
    print(f"{key}: {value}")


# Define Constants class using the loaded configuration
class ConfigManager:
    SAMPLE_RATE = constants["SAMPLE_RATE"]
    CHUNK_SIZE = constants["CHUNK_SIZE"]
    SAMPLE_WIDTH = constants["SAMPLE_WIDTH"]
    VAD_THRESHOLD = constants["VAD_THRESHOLD"]
    FREQ_THRESHOLD = constants["FREQ_THRESHOLD"]
    STEP_MS = constants["STEP_MS"]
    LENGTH_MS = constants["LENGTH_MS"]
    VAD_WINDOW_SIZE_MS = constants["VAD_WINDOW_SIZE_MS"]
    MODEL_NAME = constants["MODEL_NAME"]
    BATCH_SIZE = constants["BATCH_SIZE"]
    QUANT: str | None = None if constants["QUANT"] == "None" else constants["QUANT"]
    VAD_WINDOW_SIZE_SAMPLES: int = (
        constants["VAD_WINDOW_SIZE_MS"] * constants["SAMPLE_RATE"]
    ) // 1000
    VAD_LENGTH_SAMPLES: int = (
        constants["LENGTH_MS"] * constants["SAMPLE_RATE"]
    ) // 1000
