# models.py
from typing import Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer

# --- SQLAlchemy ORM Model (для базы данных) ---


class Base(DeclarativeBase):
    pass


class TrackDB(Base):
    """SQLAlchemy ORM модель, использующая mapped_column."""

    __tablename__ = "tracks"

    # Использование mapped_column для явного маппинга
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stream_url: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_url: Mapped[str] = mapped_column(String, nullable=True, unique=True)
    artwork_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    artist: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)

    # Репрезентация для отладки
    def __repr__(self) -> str:
        return f"TrackDB(id={self.id}, title={self.title}, artist={self.artist})"


# --- Pydantic Models (для ввода/вывода данных) ---


