from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from models import Base  # Импортируем Base

DATABASE_URL = "sqlite+aiosqlite:///./tracks_orm.db"

async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # echo=True для логирования SQL-запросов
    connect_args={"check_same_thread": False},
)


async def init_db():
    """Асинхронно создает таблицы в базе данных."""
    async with async_engine.begin() as conn:
        from models import TrackDB, User, Likes  # pyright: ignore[reportUnusedImport]

        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency: Создает и закрывает асинхронную сессию БД."""
    async_session = AsyncSession(async_engine, expire_on_commit=False)
    try:
        yield async_session
    finally:
        await async_session.close()
