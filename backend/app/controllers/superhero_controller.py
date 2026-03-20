from fastapi import APIRouter, Query, HTTPException, status
from app.services.superhero_service import SuperheroService
from app.seed import seed_data

router = APIRouter(prefix="/api/superheroes", tags=["Superheroes"])
service = SuperheroService()


# SEED
@router.post("/seed", status_code=status.HTTP_200_OK)
def seed_superheroes():
    """
    Elimina todos los superhéroes y vuelve a insertar los 40 datos por defecto.
    """
    seed_data()
    return {
        "success": True,
        "message": "Base de datos restaurada con los 40 superhéroes por defecto."
    }


# GET ALL + FILTERS + PAGINATION + SORT
@router.get("")
def get_superheroes(page: int = Query(1, ge=1),limit: int = Query(10, ge=1, le=100),
    name: str | None = None,power: str | None = None,house: str | None = None,sort: str | None = None,):
    """
    Obtiene listado de superheroes.

    Permite:
    - paginación
    - filtros
    - ordenamiento
    """

    filters = {
        "name": name,
        "power": power,
        "house": house,
    }

    items, total = service.list_superheroes(filters, page, limit, sort)

    return {
        "success": True,
        "message": "Listado de superheroes obtenido correctamente",
        "data": {
            "page": page,
            "limit": limit,
            "total": total,
            "items": items
        }
    }


@router.get("/house/{house_name}")
def get_by_house(
    house_name: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """ Obtiene superheroes por casa (Marvel, DC)."""

    normalized_house = house_name.strip().lower()

    filters = {"house": normalized_house}

    items, total = service.list_superheroes(filters, page, limit, None)

    return {
        "success": True,
        "message": f"Listado de superheroes {normalized_house.upper()} obtenido correctamente",
        "data": {
            "page": page,
            "limit": limit,
            "total": total,
            "items": items
        }
    }


# GET ONE
@router.get("/{hero_id}")
def get_superhero(hero_id: str):
    """
    Obtiene un superhéroe por ID.
    """

    hero = service.get_superhero(hero_id)

    if not hero:
        raise HTTPException(
            status_code=404,
            detail="Superhéroe no encontrado"
        )

    return {
        "success": True,
        "message": "Superhéroe obtenido correctamente",
        "data": hero
    }


# CREATE
@router.post("", status_code=status.HTTP_201_CREATED)
def create_superhero(data: dict):
    """
    Crea un nuevo superhéroe.
    """

    hero = service.create_superhero(data)

    return {
        "success": True,
        "message": "Superhéroe creado correctamente",
        "data": hero
    }


# UPDATE
@router.put("/{hero_id}")
def update_superhero(hero_id: str, data: dict):
    """
    Actualiza un superhéroe y devuelve el objeto actualizado.
    """

    hero = service.update_superhero(hero_id, data)

    if not hero:
        raise HTTPException(
            status_code=404,
            detail="Superhéroe no encontrado para actualizar"
        )

    return {
        "success": True,
        "message": "Superhéroe actualizado correctamente",
        "data": hero
    }


# DELETE
@router.delete("/{hero_id}")
def delete_superhero(hero_id: str):
    """Elimina un superhéroe por ID."""
    hero_name = service.delete_superhero(hero_id)

    if not hero_name:
        raise HTTPException(
            status_code=404,
            detail="Personaje con el id ingresado no existe"
        )

    return {
        "success": True,
        "message": f"Personaje {hero_name} ha sido eliminado correctamente"
    }
