"""Seed the asset marketplace catalog (housing, vehicles, professional cameras).
Market values are reference estimates labelled as such. Sources noted per asset.
"""
from core.db import db
from models.schemas import new_id, now_iso

# ALL values are illustrative reference estimates as of 2026 — labelled accordingly.
HOUSING = [
    ("Studio Apartment, Inland US",         "entry",   95000,   "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop", "Compact studio in growing secondary markets — affordable entry."),
    ("One-Bedroom Apartment",               "entry",   165000,  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop", "1BR in mid-sized US metro — strong rental yield."),
    ("Two-Bedroom Apartment",               "mid",     285000,  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop", "Family-friendly 2BR — broad market liquidity."),
    ("Suburban Duplex",                     "mid",     420000,  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop", "Cash-flow positive duplex with two rental units."),
    ("Townhouse",                           "mid",     565000,  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1200&auto=format&fit=crop", "Modern townhouse in commuter corridor."),
    ("Suburban Family Home, Texas",         "premium", 750000,  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop", "Classic American craftsman with porch and yard."),
    ("Urban Loft, New York",                "premium", 1200000, "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop", "Industrial-chic loft, exposed brick, factory windows."),
    ("Modern Villa, California",            "luxury",  2500000, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop", "Sleek minimalist villa with floor-to-ceiling glass."),
    ("Waterfront Property, Florida",        "luxury",  3800000, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop", "Direct waterfront with private dock."),
    ("Penthouse, Manhattan",                "luxury",  6500000, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", "Top-floor penthouse with skyline views."),
]

VEHICLES = [
    ("Toyota Corolla",          "economy",  22000,  "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1200&auto=format&fit=crop", "Reliable economy sedan — low total cost of ownership."),
    ("Honda Civic",             "economy",  25000,  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1200&auto=format&fit=crop", "Sporty, efficient and dependable."),
    ("Hyundai Elantra",         "economy",  23000,  "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=1200&auto=format&fit=crop", "Modern compact with bold styling."),
    ("Toyota Camry",            "mid",      29000,  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200&auto=format&fit=crop", "Best-selling family sedan."),
    ("Tesla Model 3",           "mid",      42000,  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop", "All-electric performance with autonomy stack."),
    ("Mercedes-Benz C-Class",   "premium",  58000,  "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop", "Entry-tier German luxury sedan."),
    ("BMW 5 Series",            "premium",  62000,  "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop", "Executive luxury with driver-focused dynamics."),
    ("Lexus RX",                "premium",  56000,  "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1200&auto=format&fit=crop", "Refined luxury SUV with hybrid options."),
    ("Porsche Cayenne",         "luxury",   95000,  "https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=1200&auto=format&fit=crop", "High-performance luxury SUV."),
    ("Range Rover",             "luxury",   125000, "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop", "Iconic full-size luxury SUV with off-road heritage."),
]

CAMERAS = [
    ("Canon EOS R50",            "beginner",      680,  "https://images.unsplash.com/photo-1606980625672-86b40a87cea3?q=80&w=1200&auto=format&fit=crop", "Mirrorless entry — content creator friendly."),
    ("Sony ZV-E10",              "beginner",      750,  "https://images.unsplash.com/photo-1554080353-321e452ccf19?q=80&w=1200&auto=format&fit=crop", "Vlogger-focused mirrorless with flip screen."),
    ("Canon EOS R8",             "creator",       1500, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200&auto=format&fit=crop", "Full-frame creator camera at accessible price."),
    ("Sony A7 IV",               "creator",       2500, "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1200&auto=format&fit=crop", "Hybrid stills + video full-frame workhorse."),
    ("Nikon Z6 III",             "creator",       2700, "https://images.unsplash.com/photo-1599083823322-3f08b6f0e687?q=80&w=1200&auto=format&fit=crop", "Stacked-sensor mirrorless with strong video."),
    ("Canon EOS R6 Mark II",     "professional",  2800, "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1200&auto=format&fit=crop", "Pro-grade hybrid with class-leading AF."),
    ("Sony A7R V",               "professional",  3900, "https://images.unsplash.com/photo-1606983340075-1cbcf18ec0d8?q=80&w=1200&auto=format&fit=crop", "High-resolution flagship for studio + landscape."),
    ("Nikon Z8",                 "professional",  4000, "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=1200&auto=format&fit=crop", "Compact Z9 power for working pros."),
    ("Canon EOS R5 Mark II",     "studio_elite",  4300, "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=1200&auto=format&fit=crop", "Studio-elite hybrid with stacked sensor."),
    ("Sony A1 II",               "studio_elite",  6500, "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1200&auto=format&fit=crop", "Top-of-line professional flagship body."),
]


def _to_doc(category: str, item):
    name, tier, value, image, description = item
    return {
        "id": new_id(),
        "category": category,
        "name": name,
        "tier": tier,
        "market_value": value,
        "currency": "USD",
        "image": image,
        "description": description,
        "value_source": "reference_estimate_2026",
        "is_estimated": True,
        "created_at": now_iso(),
    }


async def seed_assets():
    count = await db.assets.count_documents({})
    if count > 0:
        return 0
    docs = (
        [_to_doc("housing", h) for h in HOUSING]
        + [_to_doc("vehicles", v) for v in VEHICLES]
        + [_to_doc("cameras", c) for c in CAMERAS]
    )
    await db.assets.insert_many(docs)
    return len(docs)
