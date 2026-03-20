from app.repositories.superhero_repository import SuperheroRepository


class SuperheroService:
    """
    Capa de servicio.
    Contiene la lógica de negocio antes de acceder al repositorio.
    """

    def __init__(self):
        self.repo = SuperheroRepository()

    # =========================
    # LIST
    # =========================
    def list_superheroes(self, filters: dict, page: int, limit: int, sort: str):
        """
        Devuelve lista de superheroes aplicando:
        - filtros
        - paginación
        - ordenamiento
        """
        return self.repo.get_all(filters, page, limit, sort)

    # =========================
    # GET ONE
    # =========================
    def get_superhero(self, hero_id: str):
        """Obtiene un superhéroe por id."""
        return self.repo.get_by_id(hero_id)

    # CREATE
    # =========================
    def create_superhero(self, data: dict):
        """Crea un nuevo superhéroe."""
        return self.repo.create(data)

    # UPDATE
    # =========================
    def update_superhero(self, hero_id: str, data: dict):
        """Actualiza un superhéroe."""
        return self.repo.update(hero_id, data)

    # DELETE
    # =========================
    def delete_superhero(self, hero_id: str):
        """
        Elimina un superhéroe por ID.
        Devuelve el nombre del personaje eliminado.
        """

        hero = self.get_superhero(hero_id)

        if not hero:
            return None

        self.repo.delete(hero_id)

        return hero.get("name")

