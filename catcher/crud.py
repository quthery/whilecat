from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas import Track, TrackBase
from models import TrackDB

class TrackCRUD:
    @staticmethod
    async def create_track(db: AsyncSession, track: Track) -> Track:
        """Create a new track in the database."""
        db_track = TrackDB(**track.model_dump())
        db.add(db_track)
        await db.commit()
        await db.refresh(db_track)
        return db_track 



    @staticmethod
    async def get_track(db: AsyncSession, source_url: str) -> Optional[TrackBase]:
        """Get a track by source URL."""
        query = select(TrackDB).where(TrackDB.source_url == source_url)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()
        if db_track is None:
            return None
        return db_track 

    @staticmethod
    async def get_tracks(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Track]:
        """Get a list of tracks with pagination."""
        query = select(TrackDB).offset(skip).limit(limit)
        result = await db.execute(query)
        tracks = result.scalars().all()
        return [Track.model_validate(track) for track in tracks]

    @staticmethod
    async def get_tracks_by_artist(
        db: AsyncSession, 
        artist: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Track]:
        """Get tracks by artist name."""
        query = (
            select(TrackDB)
            .where(TrackDB.artist == artist)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        tracks = result.scalars().all()
        return [Track.model_validate(track) for track in tracks]

    @staticmethod
    async def update_track(
        db: AsyncSession, 
        track_id: int, 
        track_data: Track 
    ) -> Optional[Track]:
        """Update a track by ID."""
        query = select(TrackDB).where(TrackDB.id == track_id)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()
        
        if db_track is None:
            return None
            
        for key, value in track_data.model_dump(exclude_unset=True).items():
            setattr(db_track, key, value)
            
        await db.commit()
        await db.refresh(db_track)
        return Track.model_validate(db_track)

    @staticmethod
    async def delete_track(db: AsyncSession, track_id: int) -> bool:
        """Delete a track by ID."""
        query = select(TrackDB).where(TrackDB.id == track_id)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()
        
        if db_track is None:
            return False
            
        await db.delete(db_track)
        await db.commit()
        return True