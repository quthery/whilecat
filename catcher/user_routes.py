from fastapi import APIRouter, Depends, HTTPException

from database import get_session
from schemas import UserBase, AddUser, UserLikesResponse, TrackBase
from user_crud import UserRepository
from track_crud import TrackRepository


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserBase)
async def create_user(user: AddUser, session=Depends(get_session)):
    existing_user = await UserRepository.get_user_by_username(session, user.username)
    if existing_user is not None:
        raise HTTPException(status_code=400, detail="Username already exists")

    return await UserRepository.add_user(session, user)


@router.get("/{user_id}", response_model=UserBase)
async def get_user(user_id: int, session=Depends(get_session)):
    user = await UserRepository.get_user(session, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/username/{username}", response_model=UserBase)
async def get_user_by_username(username: str, session=Depends(get_session)):
    user = await UserRepository.get_user_by_username(session, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=list[UserBase])
async def get_users(skip: int = 0, limit: int = 100, session=Depends(get_session)):
    return await UserRepository.get_users(session, skip, limit)


@router.put("/{user_id}", response_model=UserBase)
async def update_user(user_id: int, user_data: UserBase, session=Depends(get_session)):
    updated_user = await UserRepository.update_user(session, user_id, user_data)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.put("/username/{username}", response_model=UserBase)
async def update_user_by_username(
    username: str, user_data: UserBase, session=Depends(get_session)
):
    updated_user = await UserRepository.update_user_by_username(
        session, username, user_data
    )
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/{user_id}")
async def delete_user(user_id: int, session=Depends(get_session)):
    """Delete a user by ID."""
    deleted = await UserRepository.delete_user(session, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.post("/{user_id}/like/{track_id}")
async def like_track(user_id: int, track_id: int, session=Depends(get_session)):
    user = await UserRepository.get_user(session, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    track = await TrackRepository.get_track(session, track_id)
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    success = await UserRepository.like_track(session, track_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Could not like track")

    return {"message": "Track liked successfully"}


@router.delete("/{user_id}/like/{track_id}")
async def unlike_track(user_id: int, track_id: int, session=Depends(get_session)):
    success = await UserRepository.unlike_track(session, track_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Like not found")

    return {"message": "Track unliked successfully"}


@router.get("/user/{user_id}/likes", response_model=UserLikesResponse)
async def get_user_likes(user_id: int, session=Depends(get_session)):
    user = await UserRepository.get_user(session, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    liked_tracks = await UserRepository.get_user_liked_tracks(session, user_id)
    tracks = [TrackBase.model_validate(t) for t in liked_tracks]

    return UserLikesResponse(likes=len(tracks), tracks=tracks)
