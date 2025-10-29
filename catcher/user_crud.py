from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas import TrackBase, UserBase, AddUser
from models import Likes, TrackDB, User


class UserRepository:
    @staticmethod
    async def add_user(db: AsyncSession, user: AddUser) -> UserBase:
        """Create a new track in the database."""
        db_user = User(**user.model_dump())
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return UserBase.model_validate(db_user)

    @staticmethod
    async def get_user(db: AsyncSession, user_id: int) -> UserBase | None:
        """Get a user by ID."""
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        db_user = result.scalar_one_or_none()
        if db_user is None:
            return None
        return UserBase.model_validate(db_user)

    @staticmethod
    async def get_users(
        db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[UserBase]:
        """Get a list of users with pagination."""
        query = select(User).offset(skip).limit(limit)
        result = await db.execute(query)
        db_users = result.scalars().all()
        return [UserBase.model_validate(user) for user in db_users]

    @staticmethod
    async def get_user_by_username(db: AsyncSession, username: str) -> UserBase | None:
        """Get users by username."""
        query = select(User).where(User.username == username)
        result = await db.execute(query)
        db_user = result.scalar_one_or_none()
        if db_user is None:
            return None
        return UserBase.model_validate(db_user)

    @staticmethod
    async def update_user(
        db: AsyncSession, user_id: int, user_data: UserBase
    ) -> UserBase | None:
        """Update a user by ID."""
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        db_user = result.scalar_one_or_none()

        if db_user is None:
            return None

        for key, value in user_data.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)

        await db.commit()
        await db.refresh(db_user)
        return UserBase.model_validate(db_user)

    @staticmethod
    async def update_user_by_username(
        db: AsyncSession, username: str, user_data: UserBase
    ) -> UserBase | None:
        """Update a user by username."""
        query = select(User).where(User.username == username)
        result = await db.execute(query)
        db_user = result.scalar_one_or_none()

        if db_user is None:
            return None

        for key, value in user_data.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)

        await db.commit()
        await db.refresh(db_user)
        return UserBase.model_validate(db_user)

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """Delete a user by ID."""
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        db_user = result.scalar_one_or_none()

        if db_user is None:
            return False

        await db.delete(db_user)
        await db.commit()
        return True

    @staticmethod
    async def like_track(db: AsyncSession, track_id: int, user_id: int) -> bool:
        """Like a track by ID."""
        query = select(TrackDB).where(TrackDB.id == track_id)
        result = await db.execute(query)
        db_track = result.scalar_one_or_none()

        if db_track is None:
            return False

        query = select(Likes).where(
            Likes.track_id == track_id, Likes.user_id == user_id
        )
        result = await db.execute(query)
        db_like = result.scalar_one_or_none()
        if db_like is not None:
            return True

        like = Likes(track_id=track_id, user_id=user_id)
        db.add(like)
        await db.commit()
        return True

    @staticmethod
    async def unlike_track(db: AsyncSession, track_id: int, user_id: int) -> bool:
        """Unlike a track by ID."""
        query = select(Likes).where(
            Likes.track_id == track_id, Likes.user_id == user_id
        )
        result = await db.execute(query)
        db_like = result.scalar_one_or_none()

        if db_like is None:
            return False

        await db.delete(db_like)
        await db.commit()
        return True

    @staticmethod
    async def get_user_liked_tracks(db: AsyncSession, user_id: int) -> list[TrackBase]:
        """Get all tracks liked by user."""
        query = (
            select(TrackDB)
            .join(Likes, Likes.track_id == TrackDB.id)
            .where(Likes.user_id == user_id)
        )
        result = await db.execute(query)
        db_tracks = result.scalars().all()
        return [TrackBase.model_validate(track) for track in db_tracks]
