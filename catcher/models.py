from typing import Optional
from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String, nullable=True)
    password: Mapped[str] = mapped_column(nullable=False)
    likes: Mapped[list["TrackDB"]] = relationship(secondary="likes", lazy="select")


class Likes(Base):
    __tablename__ = "likes"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), primary_key=True)


class TrackDB(Base):
    """SQLAlchemy ORM модель, использующая mapped_column."""

    __tablename__ = "tracks"

    # Использование mapped_column для явного маппинга
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stream_url: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    likes: Mapped[int] = mapped_column(default=0)
    source_url: Mapped[str] = mapped_column(String, nullable=True, unique=True)
    artwork_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    artist: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)

    def __repr__(self) -> str:
        return f"TrackDB(id={self.id}, title={self.title}, artist={self.artist})"
