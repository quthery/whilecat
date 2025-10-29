from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class GetTrack(BaseModel):
    social: str | None = "soundcloud"
    url: str | None = None


class Track(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    stream_url: str
    title: str | None = None
    duration: int | None = None
    likes: int = 0
    description: str | None = None
    source_url: str
    artwork_url: str | None = None
    artist: str | None = None


class TrackBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    stream_url: str
    likes: int = 0
    title: str | None = None
    duration: int | None = None
    description: str | None = None
    source_url: str
    artwork_url: str | None = None
    artist: str | None = None


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar_url: str | None = None


class AddUser(BaseModel):
    username: str
    password: str
    avatar_url: str | None = None


class AddTrack(BaseModel):
    """Schema for creating a new track."""

    title: str
    artist: str | None = None
    duration: int | None = None
    stream_url: str = "https://example.com/stream.mp3"
    source_url: str = "https://example.com/source"
    artwork_url: str | None = None
    description: str | None = None


class UserLikesResponse(BaseModel):
    """Schema for user likes response."""

    likes: int
    tracks: list[TrackBase] = []
