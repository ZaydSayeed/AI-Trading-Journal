from pydantic import BaseModel, Field, field_validator
from typing import Optional


class UserSettings(BaseModel):
    theme: str = Field(..., description="dark or light")

    @field_validator('theme')
    @classmethod
    def validate_theme(cls, v):
        if v.lower() not in ["dark", "light"]:
            raise ValueError("theme must be either 'dark' or 'light'")
        return v.lower()


class ThemeRequest(BaseModel):
    theme: str = Field(..., description="dark or light")

    @field_validator('theme')
    @classmethod
    def validate_theme(cls, v):
        if v.lower() not in ["dark", "light"]:
            raise ValueError("theme must be either 'dark' or 'light'")
        return v.lower()


class ThemeResponse(BaseModel):
    theme: str

