import pytest
from beanie import PydanticObjectId


# Import the internal helper to validate casting of ids
from app.routes.shopping_list import _cast_and_validate_ids


def test_cast_and_validate_ids_filters_invalid_and_keeps_valid() -> None:
    valid = str(PydanticObjectId())
    invalid_values = ["", "not_an_oid", "123", "zzzzzzzzzzzzzzzzzzzzzzzz"]
    result = _cast_and_validate_ids([valid, *invalid_values])
    # Only the valid OID should remain
    assert result == [PydanticObjectId(valid)]


@pytest.mark.parametrize(
    "values",
    [
        None,
        [],
        [""],
        ["not-an-oid", "also-not"],
    ],
)
def test_cast_and_validate_ids_empty_or_all_invalid(values):
    assert _cast_and_validate_ids(values) == []
