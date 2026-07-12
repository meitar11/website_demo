"""FastAPI recommendations service.

Runs alongside the Node/Express API. The storefront can call
``/recommendations/{product_id}`` to get related products.
"""

from __future__ import annotations

from dataclasses import asdict

from fastapi import FastAPI, HTTPException

from . import __version__
from .recommender import CATALOG, recommend, top_rated

app = FastAPI(title="ShopDemo Recommendations", version=__version__)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.get("/recommendations/{product_id}")
def get_recommendations(product_id: str, limit: int = 3) -> dict[str, object]:
    if not any(p.id == product_id for p in CATALOG):
        raise HTTPException(status_code=404, detail="Unknown product")
    items = [asdict(p) for p in recommend(product_id, limit)]
    return {"product_id": product_id, "recommendations": items}


@app.get("/top-rated")
def get_top_rated(limit: int = 3) -> dict[str, object]:
    return {"top_rated": [asdict(p) for p in top_rated(limit)]}
