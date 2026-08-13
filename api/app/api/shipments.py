import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.models.models import Shipment, ShipmentStatusHistory
from app.schemas.shipment import ShipmentOut, PaginatedShipments, ShipmentListItem

router = APIRouter(prefix="/api", tags=["Shipments"])

ALLOWED_STATUSES = {"pending", "pickup", "in_transit", "delivered", "failed"}
TRACKING_NUMBER_PATTERN = re.compile(r"^[A-Z0-9][A-Z0-9-]{5,49}$")


def normalize_tracking_number(tracking_number: str) -> str:
    value = tracking_number.strip().upper()
    if not TRACKING_NUMBER_PATTERN.fullmatch(value):
        raise HTTPException(
            status_code=400,
            detail="Invalid tracking number format",
        )
    return value


def normalize_status(status: str) -> str:
    value = status.strip().lower()
    if value not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {', '.join(sorted(ALLOWED_STATUSES))}",
        )
    return value

@router.get("/tracking/{tracking_number}", response_model=ShipmentOut)
def get_tracking(tracking_number: str, db: Session = Depends(get_db)):
    tracking_number = normalize_tracking_number(tracking_number)

    shipment = (
        db.query(Shipment)
        .options(
            joinedload(Shipment.provider),
            joinedload(Shipment.status_history).joinedload(ShipmentStatusHistory.provider)
        )
        .filter(Shipment.tracking_number == tracking_number)
        .first()
    )

    if not shipment:
        raise HTTPException(status_code=404, detail="Tracking number not found")

    return shipment

@router.get("/shipments", response_model=PaginatedShipments)
def list_shipments(
    status: Optional[str] = Query(None, description="Filter by status"),
    date: Optional[str] = Query(None, description="Filter by created date (YYYY-MM-DD)"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Shipment).options(joinedload(Shipment.provider))

    # Filter by status
    if status:
        query = query.filter(Shipment.current_status == normalize_status(status))

    # Filter by date
    if date:
        try:
            filter_date = datetime.strptime(date.strip(), "%Y-%m-%d").date()
            query = query.filter(func.date(Shipment.created_at) == filter_date)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use YYYY-MM-DD"
            )

    # Total count
    total = query.count()

    # Pagination
    shipments = (
        query
        .order_by(Shipment.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return {
        "data": shipments,
        "total": total,
        "page": page,
        "per_page": per_page
    }
