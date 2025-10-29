from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import yt_dlp
import aiohttp

from database import get_session
from schemas import GetTrack, Track, AddTrack
from track_crud import TrackRepository


router = APIRouter(prefix="/tracks", tags=["tracks"])


def get_track_data(track_url: str) -> Track:
    ydl_opts: dict[str, str | bool] = {
        "format": "best[ext=mp3]/ba/bestaudio",
        "noplaylist": True,
        "quiet": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # pyright: ignore[reportArgumentType]
        info = ydl.extract_info(
            track_url,
            download=False,
        )
        if not info:
            raise HTTPException(status_code=400, detail="Could not extract track info")

        stream_url = info.get("url")
        if not stream_url:
            raise HTTPException(status_code=400, detail="Could not extract stream URL")

        duration = None
        if "duration" in info and info["duration"] is not None:
            duration = round(info["duration"])

        serialized = Track(
            stream_url=stream_url,
            title=info.get("title"),
            artwork_url=info.get("thumbnail"),
            duration=duration,
            description=info.get("description"),
            source_url=track_url,
            artist=info.get("artist") or info.get("uploader"),
        )

        return serialized


@router.post("/catch", response_model=Track)
async def catch_track(track: GetTrack, session: AsyncSession = Depends(get_session)):
    """Catch and store track information from URL."""
    if not track.url:
        raise HTTPException(status_code=400, detail="URL is required")

    track_from_db = await TrackRepository.get_track_by_source_url(session, track.url)

    if track_from_db is None:
        track_new = get_track_data(track.url)
        return await TrackRepository.add_track(session, track_new)

    async with aiohttp.ClientSession() as client:
        async with client.get(track.url) as response:
            if response.status != 200:
                track_updated = get_track_data(track.url)
                track_from_db.stream_url = track_updated.stream_url
                return await TrackRepository.update_track_by_source_url(
                    session, track.url, track_from_db
                )
            return track_from_db


@router.post("/", response_model=Track)
async def create_track(track: AddTrack, session: AsyncSession = Depends(get_session)):
    """Create a new track manually (for testing)."""
    return await TrackRepository.add_track_simple(session, track)
