from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from schemas import Track, TrackBase, AddTrack
from models import TrackDB, Likes


class TrackRepository:
    @staticmethod
    async def add_track(db: AsyncSession, track: Track) -> Track:
        """Create a new track in the database."""
        db_track = TrackDB(**track.model_dump())
        db.add(db_track)
        await db.commit()
        await db.refresh(db_track)
        return Track.model_validate(db_track)

    @staticmethod
    async def get_track(db: AsyncSession, track_id: int) -> Track | None:
        """Get a track by ID."""
        query = select(TrackDB).where(TrackDB.id == track_id)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()
        if db_track is None:
            return None
        return Track.model_validate(db_track)

    @staticmethod
    async def get_track_by_source_url(
        db: AsyncSession, source_url: str
    ) -> Track | None:
        """Get a track by source URL."""
        query = select(TrackDB).where(TrackDB.source_url == source_url)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()
        if db_track is None:
            return None
        return Track.model_validate(db_track)

    @staticmethod
    async def get_tracks(
        db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[Track]:
        """Get a list of tracks with pagination."""
        query = select(TrackDB).offset(skip).limit(limit)
        result = await db.execute(query)
        db_tracks = result.scalars().all()
        return [Track.model_validate(track) for track in db_tracks]

    @staticmethod
    async def get_tracks_by_artist(
        db: AsyncSession, artist: str, skip: int = 0, limit: int = 100
    ) -> list[Track]:
        """Get tracks by artist name."""
        query = (
            select(TrackDB).where(TrackDB.artist == artist).offset(skip).limit(limit)
        )
        result = await db.execute(query)
        db_tracks = result.scalars().all()
        return [Track.model_validate(track) for track in db_tracks]

    @staticmethod
    async def update_track(
        db: AsyncSession, track_id: int, track_data: Track
    ) -> Track | None:
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
    async def update_track_by_source_url(
        db: AsyncSession, source_url: str, track_data: Track
    ) -> Track | None:
        """Update a track by source URL."""
        query = select(TrackDB).where(TrackDB.source_url == source_url)
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

    @staticmethod
    async def add_track_simple(db: AsyncSession, track: AddTrack) -> Track:
        """Create a new track from AddTrack schema."""
        db_track = TrackDB(**track.model_dump())
        db.add(db_track)
        await db.commit()
        await db.refresh(db_track)
        return Track.model_validate(db_track)

    @staticmethod
    async def get_likes_count(db: AsyncSession, track_id: int) -> int:
        """Get number of likes for a track."""
        query = select(func.count(Likes.user_id)).where(Likes.track_id == track_id)
        result = await db.execute(query)
        count = result.scalar_one()
        return count or 0
