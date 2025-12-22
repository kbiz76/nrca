from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Mode: "stub" or "live"
    NRCA_MODE: str = Field(default="stub")

    # ServiceNow (optional for live)
    SN_INSTANCE: str | None = None  # e.g. "https://yourinstance.service-now.com"
    SN_USER: str | None = None
    SN_PASS: str | None = None

    # Splunk (optional for live)
    SPLUNK_BASE_URL: str | None = None # e.g. "https://splunk.company.mil:8089"
    SPLUNK_TOKEN: str | None = None

    # SolarWinds (optional for live)
    SW_BASE_URL: str | None = None
    SW_USER: str | None = None
    SW_PASS: str | None = None

    # Cisco ISE (optional for live)
    ISE_BASE_URL: str | None = None
    ISE_USER: str | None = None
    ISE_PASS: str | None = None

settings = Settings()

