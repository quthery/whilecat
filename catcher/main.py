from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
from database import get_session, init_db
from schemas import GetTrack, Track
from crud import TrackCRUD
import aiohttp

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    yield


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def get_track_data(track: GetTrack):
    ydl_opts = {
        "format": "best[ext=mp3]/ba/bestaudio",
        "noplaylist": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(
            track.url,  # pyright: ignore[reportArgumentType]
            download=False,
        )
        serialized = Track(
            stream_url=info["url"],  # pyright: ignore[reportTypedDictNotRequiredAccess, reportArgumentType]
            title=info["title"],  # pyright: ignore[reportTypedDictNotRequiredAccess]
            artwork_url=info["thumbnail"],  # pyright: ignore[reportTypedDictNotRequiredAccess]
            duration=round(info["duration"]),  # pyright: ignore[reportTypedDictNotRequiredAccess, reportArgumentType]
            description=info["description"], # pyright: ignore[reportGeneralTypeIssues, reportUnknownArgumentType
            source_url=track.url, 
            artist=info.get("artist", info['uploader']),  # pyright: ignore[reportGeneralTypeIssues, reportUnknownArgumentType]
        )

        return serialized


@app.post("/catch")
async def catch_track(track: GetTrack, session = Depends(get_session)):
    track_from_db = await TrackCRUD.get_track(session, track.url)
    
    if track_from_db is None:
        track_new: Track = get_track_data(track)
        print("chzx")
        return await TrackCRUD.create_track(session, track_new)
        

    async with aiohttp.ClientSession() as client:
        async with client.get(track.url) as response:  
            if response.status != 200:
                track_new: Track = get_track_data(track)
                track_from_db.stream_url = track_new.stream_url
                return await TrackCRUD.update_track(session, track_from_db.id, track_from_db)
            return track_from_db 



@app.get("/")
async def root():
    return {"message": "Hello from catcher!"}
