def superhero_helper(superhero) -> dict:
    return {
        "id": str(superhero["_id"]),
        "name": superhero["name"],
        "alias": superhero.get("alias"),
        "house": superhero["house"],
        "year": superhero["year"],
        "biography": superhero["biography"],
        "equipment": superhero["equipment"],
        "images": superhero["images"],
        "power_level": superhero["power_level"],
        "is_active": superhero["is_active"],
    }
