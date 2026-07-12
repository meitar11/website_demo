"""Short demo tests for the recommender — enough to prove the Python
suite runs in CI, not exhaustive coverage."""

from app.recommender import CATALOG, recommend, top_rated


def test_recommend_excludes_seed_product():
    recs = recommend("p1", limit=3)
    assert all(p.id != "p1" for p in recs)


def test_recommend_respects_limit():
    assert len(recommend("p1", limit=2)) == 2
    assert recommend("p1", limit=0) == []


def test_recommend_prefers_same_category():
    # p1 and p2 are both "audio"; p2 should be the top recommendation for p1.
    top = recommend("p1", limit=1)
    assert top[0].id == "p2"


def test_top_rated_is_sorted_desc():
    ratings = [p.rating for p in top_rated(limit=len(CATALOG))]
    assert ratings == sorted(ratings, reverse=True)
