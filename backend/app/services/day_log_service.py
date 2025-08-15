from typing import List, Optional, Sequence
from datetime import date
from sqlmodel import Session, select

from app.models.day_log import DayLog
from app.schemas.day_log import DayLogCreate, DayLogUpdate, DayLogBase


def create_day_log(session: Session, data: DayLogCreate) -> DayLog:
    log = DayLog.model_validate(data)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


def get_day_log(session: Session, log_id: int) -> Optional[DayLog]:
    return session.get(DayLog, log_id)


def list_user_day_logs(
    session: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 10,
    location: Optional[str] = None,
    weather: Optional[str] = None,
) -> List[DayLog]:
    query = select(DayLog).where(DayLog.user_id == user_id)
    if location:
        query = query.where(DayLog.location == location)
    if weather:
        query = query.where(DayLog.weather == weather)
    query = query.offset(skip).limit(limit)
    return session.exec(query).all()


def get_user_day_log_by_date(session: Session, user_id: str, on_date: date) -> Optional[DayLog]:
    return session.exec(select(DayLog).where(DayLog.user_id == user_id, DayLog.date == on_date)).first()


def list_user_day_logs_by_range(
    session: Session,
    user_id: str,
    start_date: date,
    end_date: date,
    location: Optional[str] = None,
) -> List[DayLog]:
    query = select(DayLog).where(
        DayLog.user_id == user_id,
        DayLog.date >= start_date,
        DayLog.date <= end_date,
    )
    if location:
        query = query.where(DayLog.location == location)
    return session.exec(query).all()


def update_day_log(session: Session, log_id: int, update: DayLogUpdate) -> DayLog:
    log = session.get(DayLog, log_id)
    if not log:
        raise LookupError("Day log not found")
    data = update.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(log, key, value)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


def delete_day_log(session: Session, log_id: int) -> None:
    log = session.get(DayLog, log_id)
    if not log:
        raise LookupError("Day log not found")
    session.delete(log)
    session.commit()


def create_bulk_day_logs(session: Session, user_id: str, day_logs: Sequence[DayLogBase]) -> List[DayLog]:
    """Create multiple day log entries for a user in a single transaction."""
    db_logs = []
    for log_data in day_logs:
        # Create DayLogCreate instance with user_id
        create_data = DayLogCreate(
            user_id=user_id,
            **log_data.model_dump()
        )
        # Create DayLog model instance
        db_log = DayLog.model_validate(create_data)
        db_logs.append(db_log)
        session.add(db_log)
    
    session.commit()
    for log in db_logs:
        session.refresh(log)
    
    return db_logs

