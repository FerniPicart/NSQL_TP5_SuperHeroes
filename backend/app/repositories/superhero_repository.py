from app.db.mongo import superhero_collection
from bson import ObjectId
import os
import re
import unicodedata

STATIC_PATH = "app/static/heroes"


class SuperheroRepository:
    """
    Se encarga de interactuar con MongoDB.
    """

    def _file_exists(self, filename: str) -> bool:
        return os.path.exists(os.path.join(STATIC_PATH, filename))

    def _normalize_for_match(self, value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value or "")
        ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
        return re.sub(r"[^a-zA-Z0-9]+", "", ascii_text).lower()

    def _slugify(self, value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value or "")
        ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
        slug = re.sub(r"[^a-zA-Z0-9]+", "_", ascii_text).strip("_").lower()
        return slug or "hero"

    def _normalize_image_token(self, image_name: str | None) -> str | None:
        if not image_name or not isinstance(image_name, str):
            return None

        raw_name = image_name.strip()
        if not raw_name:
            return None

        base_name, _ = os.path.splitext(raw_name)
        normalized = unicodedata.normalize("NFKD", base_name)
        ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
        token = re.sub(r"[^a-zA-Z0-9_]+", "", ascii_text).lower()
        token = re.sub(r"_+", "_", token).strip("_")
        return token or None

    def _list_image_files(self) -> list[str]:
        if not os.path.exists(STATIC_PATH):
            return []

        allowed_ext = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
        files = []
        for file_name in os.listdir(STATIC_PATH):
            _, ext = os.path.splitext(file_name)
            if ext.lower() in allowed_ext:
                files.append(file_name)

        return sorted(files)

    def _find_images_by_hero_name(self, hero_name: str | None) -> list[str]:
        hero_key = self._normalize_for_match(hero_name or "")
        if not hero_key:
            return []

        matches = []
        for file_name in self._list_image_files():
            file_base, _ = os.path.splitext(file_name)
            file_key = self._normalize_for_match(file_base)
            if hero_key and hero_key in file_key:
                matches.append(file_name)

        return matches

    def _prepare_image_tokens(self, images: list | None, hero_name: str | None) -> list[str]:
        tokens = []

        for image_name in images or []:
            normalized = self._normalize_image_token(image_name)
            if normalized:
                tokens.append(normalized)

        # elimina duplicados preservando orden
        return list(dict.fromkeys(tokens))

    def _resolve_image_name(self, image_name: str | None) -> str | None:
        if not image_name or not isinstance(image_name, str):
            return None

        token = self._normalize_image_token(image_name)
        if not token:
            return None

        candidates = [
            f"{token}.jpg",
            f"{token}.jpeg",
            f"{token}.png",
            token,
        ]

        for candidate in candidates:
            if self._file_exists(candidate):
                return candidate

        return None

    def _normalize_hero_images(self, hero: dict):
        normalized_images = []

        for image_name in hero.get("images", []):
            resolved = self._resolve_image_name(image_name)
            if resolved:
                normalized_images.append(resolved)

        for by_name in self._find_images_by_hero_name(hero.get("name")):
            normalized_images.append(by_name)

        hero["images"] = normalized_images
        hero["images"] = list(dict.fromkeys(hero["images"]))
        return hero

    # =========================
    # CREATE
    # =========================
    def create(self, data: dict):
        """Inserta un nuevo superhéroe en la base. """
        data["images"] = self._prepare_image_tokens(data.get("images"), data.get("name"))
        result = superhero_collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    # =========================
    # READ ALL + FILTERS + PAGINATION + SORT
    # =========================
    def get_all(self, filters: dict, page: int, limit: int, sort: str | None):
        """ Obtiene todos los superheroes con filtros, paginación y ordenamiento."""
        query = {}

        # Filtros
        if filters:
            if filters.get("name") and isinstance(filters.get("name"), str):
                query["name"] = {
                    "$regex": filters["name"],
                    "$options": "i"
                }

            if filters.get("power") and isinstance(filters.get("power"), str):
                query["biography.description"] = {
                    "$regex": filters["power"],
                    "$options": "i"
                }

            if filters.get("house") and isinstance(filters.get("house"), str):
                query["house"] = {
                    "$regex": f"^{filters['house']}$",
                    "$options": "i"
                }
        
        # Ordenamiento
        # =========================

        sort_query = None

        if sort:
            direction = 1
            if sort.startswith("-"):
                direction = -1
                sort = sort[1:]

            sort_query = [(sort, direction)]

        # Paginación
        # =========================

        skip = (page - 1) * limit

        cursor = superhero_collection.find(query)

        if sort_query:
            cursor = cursor.sort(sort_query)

        total = superhero_collection.count_documents(query)

        heroes = list(cursor.skip(skip).limit(limit))

        for hero in heroes:
            hero["id"] = str(hero["_id"])
            del hero["_id"]
            self._normalize_hero_images(hero)

        return heroes, total


    # =========================
    # OBTENER POR ID
    # =========================
    def get_by_id(self, hero_id: str):
        """ Obtiene un superheroe por ID. """
        try:
            hero = superhero_collection.find_one({"_id": ObjectId(hero_id)})
        except:
            return None

        if not hero:
            return None

        hero["id"] = str(hero["_id"])
        del hero["_id"]

        self._normalize_hero_images(hero)

        return hero


    # =========================
    # UPDATE
    # =========================
    def update(self, hero_id: str, data: dict):
        """ Actualiza un superhéroe. """
        try:
            data["images"] = self._prepare_image_tokens(data.get("images"), data.get("name"))
            superhero_collection.update_one(
                {"_id": ObjectId(hero_id)},
                {"$set": data},
            )

            hero = superhero_collection.find_one({"_id": ObjectId(hero_id)})
            if hero:
                hero["_id"] = str(hero["_id"])
            return hero
        except:
            return None

    # =========================
    # DELETE
    # =========================
    def delete(self, hero_id: str):
        """ Elimina un superhéroe POR ID y devuelve True si fue eliminado. """
        try:
            result = superhero_collection.delete_one({"_id": ObjectId(hero_id)})
            return result.deleted_count > 0
        except:
            return False
