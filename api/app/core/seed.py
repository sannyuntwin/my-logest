from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
import random

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.models import Provider, ProviderRate, Shipment, ShipmentStatusHistory

TARGET_SHIPMENT_COUNT = 100
ROUTE_CITIES = [
    {"name": "Bangkok", "zone": "BKK"},
    {"name": "Chonburi", "zone": "EAST"},
    {"name": "Surat Thani", "zone": "SOUTH"},
    {"name": "Phuket", "zone": "SOUTH"},
    {"name": "Lampang", "zone": "NORTH"},
    {"name": "Chiang Mai", "zone": "NORTH"},
    {"name": "Chiang Rai", "zone": "NORTH"},
    {"name": "Khon Kaen", "zone": "NORTHEAST"},
    {"name": "Udon Thani", "zone": "NORTHEAST"},
]

STATUS_FLOW = {
    "pending": ["pending"],
    "pickup": ["pending", "pickup"],
    "in_transit": ["pending", "pickup", "in_transit"],
    "delivered": ["pending", "pickup", "in_transit", "delivered"],
    "failed": ["pending", "pickup", "in_transit", "failed"],
}


def build_tracking_number(index: int) -> str:
    return f"SHP2026-{index:04d}"


def pick_city_pair(rng: random.Random) -> tuple[dict, dict, dict]:
    origin = rng.choice(ROUTE_CITIES)
    destination = rng.choice([city for city in ROUTE_CITIES if city["name"] != origin["name"]])
    current_location = rng.choice(
        [
            city
            for city in ROUTE_CITIES
            if city["name"] not in {origin["name"], destination["name"]}
        ]
    )
    return origin, destination, current_location


def build_history_steps(status: str, origin: str, current_location: str, destination: str):
    locations = {
        "pending": origin,
        "pickup": origin,
        "in_transit": current_location,
        "delivered": destination,
        "failed": current_location,
    }

    descriptions = {
        "pending": "Shipment created and queued for pickup",
        "pickup": "Picked up from sender",
        "in_transit": "Moved into the transport network",
        "delivered": "Delivered to recipient",
        "failed": "Delivery attempt failed",
    }

    return [
        {
            "status": step_status,
            "location": locations[step_status],
            "description": descriptions[step_status],
        }
        for step_status in STATUS_FLOW[status]
    ]


def create_shipment_record(
    db: Session,
    *,
    tracking_number: str,
    provider: Provider,
    current_status: str,
    origin: str,
    destination: str,
    destination_zone: str,
    weight_kg: Decimal,
    current_location: str,
    estimated_delivery: date,
    sla_deadline: datetime,
    created_at: datetime,
):
    shipment = Shipment(
        tracking_number=tracking_number,
        provider_id=provider.id,
        current_status=current_status,
        origin=origin,
        destination=destination,
        destination_zone=destination_zone,
        weight_kg=weight_kg,
        current_location=current_location,
        estimated_delivery=estimated_delivery,
        sla_deadline=sla_deadline,
        created_at=created_at,
        updated_at=created_at + timedelta(hours=1),
    )
    db.add(shipment)
    db.flush()

    history_steps = build_history_steps(current_status, origin, current_location, destination)
    if history_steps:
        total_steps = len(history_steps)
        for index, step in enumerate(history_steps):
            db.add(
                ShipmentStatusHistory(
                    shipment_id=shipment.id,
                    provider_id=provider.id,
                    status=step["status"],
                    location=step["location"],
                    description=step["description"],
                    timestamp=created_at - timedelta(hours=12 * (total_steps - index - 1)),
                )
            )

    return shipment

def seed_initial_data(db: Session):
    print("Ensuring seed data exists...")
    rng = random.Random(42)
    now = datetime.now(timezone.utc)

    providers_by_code = {
        provider.code: provider
        for provider in db.query(Provider).all()
    }

    # 1. Providers
    provider_specs = [
        {"name": "Kerry Express", "code": "KERRY", "max_weight_kg": 50},
        {"name": "Flash Express", "code": "FLASH", "max_weight_kg": 50},
        {"name": "J&T Express", "code": "JT", "max_weight_kg": 40},
    ]

    for spec in provider_specs:
        if spec["code"] not in providers_by_code:
            provider = Provider(**spec)
            db.add(provider)
            db.flush()
            providers_by_code[provider.code] = provider

    db.commit()

    providers_by_code = {
        provider.code: provider
        for provider in db.query(Provider).all()
    }

    # 2. Sample Rates
    rate_specs = [
        # Kerry
        {"provider": "KERRY", "zone": "BKK", "weight_from": 0, "weight_to": 1, "base_price": 30, "price_per_kg": 5},
        {"provider": "KERRY", "zone": "BKK", "weight_from": 1, "weight_to": 5, "base_price": 40, "price_per_kg": 8},
        {"provider": "KERRY", "zone": "CENTRAL", "weight_from": 0, "weight_to": 1, "base_price": 45, "price_per_kg": 7},
        {"provider": "KERRY", "zone": "CENTRAL", "weight_from": 1, "weight_to": 5, "base_price": 55, "price_per_kg": 10},

        # Flash
        {"provider": "FLASH", "zone": "BKK", "weight_from": 0, "weight_to": 1, "base_price": 25, "price_per_kg": 4},
        {"provider": "FLASH", "zone": "BKK", "weight_from": 1, "weight_to": 5, "base_price": 35, "price_per_kg": 7},
        {"provider": "FLASH", "zone": "CENTRAL", "weight_from": 0, "weight_to": 1, "base_price": 40, "price_per_kg": 6},

        # J&T
        {"provider": "JT", "zone": "BKK", "weight_from": 0, "weight_to": 1, "base_price": 28, "price_per_kg": 5},
        {"provider": "JT", "zone": "CENTRAL", "weight_from": 0, "weight_to": 1, "base_price": 42, "price_per_kg": 8},
    ]

    existing_rates = {
        (rate.provider_id, rate.zone, rate.weight_from, rate.weight_to)
        for rate in db.query(ProviderRate).all()
    }

    for spec in rate_specs:
        provider = providers_by_code[spec["provider"]]
        key = (provider.id, spec["zone"], spec["weight_from"], spec["weight_to"])
        if key not in existing_rates:
            db.add(
                ProviderRate(
                    provider_id=provider.id,
                    zone=spec["zone"],
                    weight_from=spec["weight_from"],
                    weight_to=spec["weight_to"],
                    base_price=spec["base_price"],
                    price_per_kg=spec["price_per_kg"],
                )
            )

    db.commit()

    existing_tracking_numbers = {
        shipment.tracking_number
        for shipment in db.query(Shipment).all()
    }

    # 3. Sample shipment for testing
    sample_tracking_number = "ABC123456"
    if sample_tracking_number not in existing_tracking_numbers:
        kerry = providers_by_code["KERRY"]
        create_shipment_record(
            db,
            tracking_number=sample_tracking_number,
            provider=kerry,
            current_status="in_transit",
            origin="Bangkok",
            destination="Chiang Mai",
            destination_zone="NORTH",
            weight_kg=Decimal("2.50"),
            current_location="Lampang",
            estimated_delivery=(now + timedelta(days=2)).date(),
            sla_deadline=now + timedelta(days=2, hours=18),
            created_at=now - timedelta(days=1, hours=4),
        )
        db.commit()

    # 4. Demo shipment dataset for the shipments screen
    current_total = db.query(func.count(Shipment.id)).scalar() or 0
    if current_total < TARGET_SHIPMENT_COUNT:
        provider_cycle = [providers_by_code["KERRY"], providers_by_code["FLASH"], providers_by_code["JT"]]
        current_status_cycle = ["pending", "pickup", "in_transit", "delivered", "failed"]
        created_index = 1

        while current_total < TARGET_SHIPMENT_COUNT:
            tracking_number = build_tracking_number(created_index)
            created_index += 1

            if tracking_number in existing_tracking_numbers:
                continue

            provider = provider_cycle[(created_index - 2) % len(provider_cycle)]
            current_status = current_status_cycle[(created_index - 2) % len(current_status_cycle)]
            origin_city, destination_city, current_city = pick_city_pair(rng)

            if current_status == "pending":
                current_location = origin_city["name"]
            elif current_status == "pickup":
                current_location = origin_city["name"]
            elif current_status == "in_transit":
                current_location = current_city["name"]
            elif current_status == "delivered":
                current_location = destination_city["name"]
            else:
                current_location = current_city["name"]

            created_at = now - timedelta(hours=current_total * 2)
            estimated_delivery = (created_at + timedelta(days=2 + (current_total % 4))).date()
            sla_deadline = created_at + timedelta(days=2 + (current_total % 4), hours=18)
            weight_kg = Decimal(f"{rng.uniform(0.4, 18.0):.2f}")

            create_shipment_record(
                db,
                tracking_number=tracking_number,
                provider=provider,
                current_status=current_status,
                origin=origin_city["name"],
                destination=destination_city["name"],
                destination_zone=destination_city["zone"],
                weight_kg=weight_kg,
                current_location=current_location,
                estimated_delivery=estimated_delivery,
                sla_deadline=sla_deadline,
                created_at=created_at,
            )

            existing_tracking_numbers.add(tracking_number)
            current_total += 1

        db.commit()

    print("Seeding completed successfully!")
