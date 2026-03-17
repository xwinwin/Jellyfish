"""PromptCategory 枚举接口测试。"""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.api.v1.routes.studio.prompts import _PROMPT_CATEGORY_ZH
from app.models.studio import PromptCategory


def test_list_prompt_categories_returns_value_label_pairs(client: TestClient) -> None:
    response = client.get("/api/v1/studio/prompts/categories")
    assert response.status_code == 200

    body = response.json()
    assert body["code"] == 200
    assert body["message"] == "success"

    items = body["data"]
    assert isinstance(items, list)

    values = {item["value"] for item in items}
    labels = {item["label"] for item in items}

    assert values == {
        "frame_head",
        "frame_tail",
        "frame_key",
        "video",
        "storyboard",
        "bgm",
        "sfx",
        "chapter_front",
        "chapter_back",
        "chapter_side",
        "actor_image",
        "actor_image_back",
        "actor_image_side",
        "prop_front",
        "prop_back",
        "prop_side",
        "scene_front",
        "scene_back",
        "scene_side",
        "costume_front",
        "costume_back",
        "costume_side",
        "combined",
    }
    assert "首帧提示词" in labels
    assert "关键帧提示词" in labels


def test_prompt_category_mapping_is_complete() -> None:
    assert set(_PROMPT_CATEGORY_ZH.keys()) == set(PromptCategory)


