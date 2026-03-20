from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class Biography(BaseModel):
    origin: str
    description: str
    alignment: str


class SuperheroCreate(BaseModel):
    name: str
    alias: Optional[str] = None
    house: str
    year: int
    biography: Biography
    equipment: List[str]
    images: List[str]
    power_level: int = Field(ge=0, le=100)
    is_active: bool = True

    @field_validator("house")
    @classmethod
    def validate_house(cls, v):
        if v.lower() not in ["marvel", "dc"]:
            raise ValueError("house must be 'marvel' or 'dc'")
        return v.lower()

    @field_validator("images")
    @classmethod
    def validate_images(cls, v):
        if len(v) < 1:
            raise ValueError("At least one image is required")
        return v


class SuperheroUpdate(SuperheroCreate):
    pass


class SuperheroResponse(SuperheroCreate):
    id: str
