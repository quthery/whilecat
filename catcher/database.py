from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from models import Base  # Импортируем Base

DATABASE_URL = "sqlite+aiosqlite:///./tracks_orm.db"


engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # echo=True для логирования SQL-запросов
    connect_args={"check_same_thread": False},
)

async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def init_db():
    """Асинхронно создает таблицы в базе данных."""
    async with engine.begin() as conn:
        from models import TrackDB, User, Likes  # pyright: ignore[reportUnusedImport]

        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

async def get_session():
    async with async_session_maker() as session:
        yield session
