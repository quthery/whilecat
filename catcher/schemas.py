from pydantic import BaseModel, ConfigDict

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
    password: str
    avatar_url: str | None = None


class AddUser(BaseModel):
    username: str
    password: str
    avatar_url: str | None = None


class AddTrack(BaseModel):
    title: str
    artist: str | None = None
    duration: int | None = None
    stream_url: str
    source_url: str
    artwork_url: str | None = None
    description: str | None = None


class UserLikesResponse(BaseModel):
    """Schema for user likes response."""

    likes: int
    tracks: list[TrackBase] = []
