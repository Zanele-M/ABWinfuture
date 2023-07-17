from dotenv import load_dotenv
from pathlib import Path

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

from run import app

if __name__ == "__main__":
    app.run()
