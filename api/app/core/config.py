from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://logistics:logistics123@db:5432/logistics"

    class Config:
        env_file = ".env"

settings = Settings()