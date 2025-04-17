import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Audio settings
    SAMPLE_RATE = 44100
    CHANNELS = 2
    BUFFER_SIZE = 1024
    
    # Genre settings
    BASE_GENRES = [
        "rock", "jazz", "classical", "electronic", 
        "ambient", "folk", "pop", "hip_hop"
    ]
    
    # Model settings
    EMOTION_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
    
    # Audio output settings
    OUTPUT_DIR = "generated_music"
    
    @staticmethod
    def ensure_directories():
        if not os.path.exists(Config.OUTPUT_DIR):
            os.makedirs(Config.OUTPUT_DIR)
