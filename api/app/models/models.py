from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date,
    ForeignKey, Numeric, Text, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)                  # Kerry, Flash, J&T
    code = Column(String(20), unique=True, nullable=False)      # KERRY, FLASH, JT
    max_weight_kg = Column(Numeric(8, 2), default=50)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    shipments = relationship("Shipment", back_populates="provider")
    status_history = relationship("ShipmentStatusHistory", back_populates="provider")
    rates = relationship("ProviderRate", back_populates="provider")

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String(50), unique=True, nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False, index=True)
    
    current_status = Column(String(30), nullable=False, default="pending", index=True)  
    # pending → pickup → in_transit → delivered / failed

    origin = Column(String(255))
    destination = Column(String(255))
    destination_zone = Column(String(50))                       # Important for pricing
    weight_kg = Column(Numeric(8, 2), nullable=False)
    current_location = Column(String(255))
    estimated_delivery = Column(Date)
    sla_deadline = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    provider = relationship("Provider", back_populates="shipments")
    status_history = relationship(
        "ShipmentStatusHistory",
        back_populates="shipment",
        cascade="all, delete-orphan",
        order_by="ShipmentStatusHistory.timestamp",
    )

    __table_args__ = (
        Index("ix_shipments_status_created_at", "current_status", "created_at"),
        Index("ix_shipments_provider_created_at", "provider_id", "created_at"),
    )

class ShipmentStatusHistory(Base):
    __tablename__ = "shipment_status_history"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=True, index=True)
    
    status = Column(String(30), nullable=False)
    location = Column(String(255))
    description = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    shipment = relationship("Shipment", back_populates="status_history")
    provider = relationship("Provider", back_populates="status_history")

    __table_args__ = (
        Index("ix_status_history_shipment_timestamp", "shipment_id", "timestamp"),
        Index("ix_status_history_provider_timestamp", "provider_id", "timestamp"),
    )

class ProviderRate(Base):
    __tablename__ = "provider_rates"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False, index=True)
    zone = Column(String(50), nullable=False, index=True)                   # BKK, CENTRAL, NORTH, etc.
    weight_from = Column(Numeric(8, 2), nullable=False)
    weight_to = Column(Numeric(8, 2), nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    price_per_kg = Column(Numeric(10, 2), default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    provider = relationship("Provider", back_populates="rates")

    __table_args__ = (
        UniqueConstraint("provider_id", "zone", "weight_from", "weight_to", name="uq_provider_zone_weight"),
        Index("ix_provider_rates_lookup", "provider_id", "zone", "weight_from", "weight_to"),
    )
