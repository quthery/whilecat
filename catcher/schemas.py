from pydantic import BaseModel
from typing import Optional


class GetTrack(BaseModel):
    social: str | None = "soundcloud"
    url: str | None = None


class Track(BaseModel):
    stream_url: str
    title: str | None = None
    duration: int | None = None
    description: str | None = None
    source_url: str
    artwork_url: str | None = None
    artist: str | None = None

class TrackBase(BaseModel):
    id: int
    stream_url: str
    title: str | None = None
    duration: int | None = None
    description: str | None = None
    source_url: str
    artwork_url: str | None = None
    artist: str | None = None




