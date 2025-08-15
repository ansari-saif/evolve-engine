from typing import List, Optional
from sqlmodel import Session, select

from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, StatusEnum


def create_goal(session: Session, goal_data: GoalCreate) -> Goal:
    goal = Goal.model_validate(goal_data)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def list_goals(session: Session, skip: int = 0, limit: int = 100, user_id: Optional[str] = None) -> List[Goal]:
    statement = select(Goal)
    if user_id:
        statement = statement.where(Goal.user_id == user_id)
    statement = statement.offset(skip).limit(limit)
    return session.exec(statement).all()


def get_goal(session: Session, goal_id: int) -> Optional[Goal]:
    return session.get(Goal, goal_id)


def update_goal(session: Session, goal_id: int, update: GoalUpdate) -> Goal:
    goal = session.get(Goal, goal_id)
    if not goal:
        raise LookupError("Goal not found")
    data = update.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(goal, field, value)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def delete_goal(session: Session, goal_id: int) -> None:
    goal = session.get(Goal, goal_id)
    if not goal:
        raise LookupError("Goal not found")
    session.delete(goal)
    session.commit()


def list_user_pending_goals(session: Session, user_id: str) -> List[Goal]:
    statement = select(Goal).where(Goal.user_id == user_id, Goal.status == StatusEnum.ACTIVE)
    return session.exec(statement).all()



@router.get("/user/{user_id}/type/{goal_type}", response_model=List[GoalResponse])
def get_user_goals_by_type(user_id: str, goal_type: GoalTypeEnum, session: Session = Depends(get_session)):
    """Get all goals of a specific type for a user."""
    # Verify user exists
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    goals = goal_service.list_goals_by_type(session, user_id, goal_type)
    return goals

@router.get("/{goal_id}/children", response_model=List[GoalResponse])
def get_child_goals(goal_id: int, session: Session = Depends(get_session)):
    """Get all child goals of a parent goal."""
    # Verify parent goal exists
    parent_goal = session.get(Goal, goal_id)
    if not parent_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent goal not found"
        )
    
    child_goals = goal_service.get_child_goals(session, goal_id)
    return child_goals

@router.get("/{goal_id}/parent", response_model=GoalResponse)
def get_parent_goal(goal_id: int, session: Session = Depends(get_session)):
    """Get the parent goal of a child goal."""
    # Verify child goal exists
    child_goal = session.get(Goal, goal_id)
    if not child_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    parent_goal = goal_service.get_parent_goal(session, goal_id)
    if not parent_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No parent goal found"
        )
    
    return parent_goal
