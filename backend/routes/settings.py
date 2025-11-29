from fastapi import APIRouter, HTTPException
from typing import Dict
import json
import os

from models.settings_model import ThemeRequest, ThemeResponse

router = APIRouter(prefix="/settings", tags=["settings"])

# In-memory store for themes (in production, use database)
# File-based storage as fallback
THEME_STORAGE_FILE = "theme_storage.json"

def _load_themes() -> Dict[str, str]:
    """Load themes from file, return default if file doesn't exist"""
    if os.path.exists(THEME_STORAGE_FILE):
        try:
            with open(THEME_STORAGE_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading themes: {e}")
            return {}
    return {}


def _save_themes(themes: Dict[str, str]):
    """Save themes to file"""
    try:
        with open(THEME_STORAGE_FILE, "w") as f:
            json.dump(themes, f)
    except Exception as e:
        print(f"Error saving themes: {e}")


@router.get("/theme", response_model=ThemeResponse)
async def get_theme():
    """
    Get the user's saved theme preference.
    Returns 'dark' as default if no theme is saved.
    """
    try:
        themes = _load_themes()
        # For now, use a default user_id or get from auth context
        # Using 'default' as placeholder until user auth is implemented
        theme = themes.get("default", "dark")
        return ThemeResponse(theme=theme)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching theme: {str(e)}")


@router.post("/theme", response_model=ThemeResponse)
async def set_theme(request: ThemeRequest):
    """
    Save the user's theme preference.
    Accepts JSON: { "theme": "dark" } or { "theme": "light" }
    """
    try:
        themes = _load_themes()
        # For now, use a default user_id or get from auth context
        # Using 'default' as placeholder until user auth is implemented
        themes["default"] = request.theme
        _save_themes(themes)
        return ThemeResponse(theme=request.theme)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving theme: {str(e)}")

