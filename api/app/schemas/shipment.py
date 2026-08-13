from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

class ProviderOut(BaseModel):
    id: int
    name: str
    code: str

    class Config:
        from_attributes = True

class StatusHistoryOut(BaseModel):
    status: str
    location: Optional[str] = None
    description: Optional[str] = None
    timestamp: datetime
    provider: Optional[ProviderOut] = None

    class Config:
        from_attributes = True

class ShipmentOut(BaseModel):
    id: int
    tracking_number: str
    current_status: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    destination_zone: Optional[str] = None
    weight_kg: Decimal
    current_location: Optional[str] = None
    estimated_delivery: Optional[date] = None
    provider: ProviderOut
    status_history: List[StatusHistoryOut] = []

    class Config:
        from_attributes = True

class ShipmentListItem(BaseModel):
    id: int
    tracking_number: str
    current_status: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    estimated_delivery: Optional[date] = None
    weight_kg: Decimal
    current_location: Optional[str] = None
    provider: ProviderOut
    created_at: datetime

    class Config:
        from_attributes = True

class PaginatedShipments(BaseModel):
    data: List[ShipmentListItem]
    total: int
    page: int
    per_page: int
