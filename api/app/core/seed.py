from datetime import date, datetime, timezone

from sqlalchemy.orm import Session

from app.models.models import Provider, ProviderRate, Shipment, ShipmentStatusHistory

def seed_initial_data(db: Session):
    print("Ensuring seed data exists...")

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

    # 3. Sample shipment for testing
    sample_tracking_number = "ABC123456"
    existing_shipment = db.query(Shipment).filter(Shipment.tracking_number == sample_tracking_number).first()

    if not existing_shipment:
        kerry = providers_by_code["KERRY"]
        shipment = Shipment(
            tracking_number=sample_tracking_number,
            provider_id=kerry.id,
            current_status="in_transit",
            origin="Bangkok",
            destination="Chiang Mai",
            destination_zone="NORTH",
            weight_kg=2.50,
            current_location="Lampang Hub",
            estimated_delivery=date(2026, 8, 15),
            sla_deadline=datetime(2026, 8, 15, 18, 0, tzinfo=timezone.utc),
        )
        db.add(shipment)
        db.flush()

        db.add_all([
            ShipmentStatusHistory(
                shipment_id=shipment.id,
                provider_id=kerry.id,
                status="pickup",
                location="Bangkok",
                description="Picked up from sender",
                timestamp=datetime(2026, 8, 13, 8, 0, tzinfo=timezone.utc),
            ),
            ShipmentStatusHistory(
                shipment_id=shipment.id,
                provider_id=kerry.id,
                status="in_transit",
                location="Lampang Hub",
                description="Transferred to regional hub",
                timestamp=datetime(2026, 8, 13, 12, 30, tzinfo=timezone.utc),
            ),
        ])
        db.commit()

    print("Seeding completed successfully!")
