"""Simple in-memory product recommendation logic.

Kept dependency-free at runtime (pure Python) so it is trivial to unit
test in CI. The FastAPI layer in ``main.py`` wraps these functions.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Product:
    id: str
    title: str
    category: str
    price: float
    rating: float


# A tiny catalogue mirroring the Node server's seed data.
CATALOG: list[Product] = [
    Product("p1", "Aurora Headphones", "audio", 129.0, 4.6),
    Product("p2", "Nimbus Speaker", "audio", 89.0, 4.2),
    Product("p3", "Terra Backpack", "bags", 59.0, 4.8),
    Product("p4", "Lumen Desk Lamp", "home", 39.0, 4.1),
    Product("p5", "Pulse Smartwatch", "wearables", 199.0, 4.4),
    Product("p6", "Vega Keyboard", "accessories", 74.0, 4.7),
]


def _by_id(product_id: str) -> Product | None:
    return next((p for p in CATALOG if p.id == product_id), None)


def recommend(product_id: str, limit: int = 3) -> list[Product]:
    """Recommend up to ``limit`` products related to ``product_id``.

    Strategy: prefer items in the same category, then fill remaining
    slots with the highest-rated products, always excluding the seed
    product itself. Ties are broken by rating (descending).
    """
    if limit <= 0:
        return []

    seed = _by_id(product_id)
    others = [p for p in CATALOG if p.id != product_id]

    def sort_key(p: Product) -> tuple[int, float]:
        same_category = 1 if seed and p.category == seed.category else 0
        return (same_category, p.rating)

    ranked = sorted(others, key=sort_key, reverse=True)
    return ranked[:limit]


def top_rated(limit: int = 3) -> list[Product]:
    """Return the ``limit`` highest-rated products overall."""
    if limit <= 0:
        return []
    return sorted(CATALOG, key=lambda p: p.rating, reverse=True)[:limit]
