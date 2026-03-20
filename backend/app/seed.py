
# docker exec -it superheroes_api python -m app.seed

from app.db.mongo import superhero_collection
import re
import unicodedata


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text or "")
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", ascii_text).strip("_").lower()
    return slug or "hero"


def seed_data():
    superhero_collection.delete_many({})

    heroes = [

        # =========================
        # MARVEL (20)
        # =========================

        {"name": "Iron Man", "real_name": "Tony Stark", "year": 1963, "house": "Marvel",
         "biography": "Genius billionaire industrialist who builds a powered armor suit to become Iron Man and founding member of the Avengers.",
         "equipment": ["Armor Suit", "Arc Reactor"], "images": ["ironman.jpg"]},

        {"name": "Captain America", "real_name": "Steve Rogers", "year": 1941, "house": "Marvel",
         "biography": "Super soldier enhanced during World War II who becomes a symbol of freedom and leader of the Avengers.",
         "equipment": ["Vibranium Shield"], "images": ["captainamerica.jpg"]},

        {"name": "Thor", "real_name": "Thor Odinson", "year": 1962, "house": "Marvel",
         "biography": "Asgardian God of Thunder wielding Mjolnir and protector of Earth as a founding Avenger.",
         "equipment": ["Mjolnir"], "images": ["thor.jpg"]},

        {"name": "Hulk", "real_name": "Bruce Banner", "year": 1962, "house": "Marvel",
         "biography": "Scientist exposed to gamma radiation who transforms into a powerful green-skinned being driven by rage.",
         "equipment": [], "images": ["hulk.jpg"]},

        {"name": "Black Widow", "real_name": "Natasha Romanoff", "year": 1964, "house": "Marvel",
         "biography": "Highly trained Russian spy and expert combatant who becomes a key member of the Avengers.",
         "equipment": ["Widow's Bite"], "images": ["blackwidow.jpg"]},

        {"name": "Spider-Man", "real_name": "Peter Parker", "year": 1962, "house": "Marvel",
         "biography": "Teenager bitten by a radioactive spider gaining superhuman abilities and becoming New York's friendly neighborhood hero.",
         "equipment": ["Web Shooters"], "images": ["spiderman.jpg"]},

        {"name": "Doctor Strange", "real_name": "Stephen Strange", "year": 1963, "house": "Marvel",
         "biography": "Former neurosurgeon who becomes the Sorcerer Supreme protecting Earth from mystical threats.",
         "equipment": ["Cloak of Levitation"], "images": ["doctorstrange.jpg"]},

        {"name": "Black Panther", "real_name": "T'Challa", "year": 1966, "house": "Marvel",
         "biography": "King of Wakanda enhanced by the Heart-Shaped Herb and protector of his technologically advanced nation.",
         "equipment": ["Vibranium Suit"], "images": ["blackpanther.jpg"]},

        {"name": "Scarlet Witch", "real_name": "Wanda Maximoff", "year": 1964, "house": "Marvel",
         "biography": "Mutant with chaos magic powers capable of altering reality itself.",
         "equipment": [], "images": ["scarletwitch.jpg"]},

        {"name": "Vision", "real_name": "Vision", "year": 1968, "house": "Marvel",
         "biography": "Android created by Ultron who joins the Avengers possessing super strength and density manipulation.",
         "equipment": [], "images": ["vision.jpg"]},

        {"name": "Wolverine", "real_name": "Logan", "year": 1974, "house": "Marvel",
         "biography": "Mutant with regenerative healing factor and adamantium claws who is a key member of the X-Men.",
         "equipment": ["Adamantium Claws"], "images": ["wolverine.jpg"]},

        {"name": "Deadpool", "real_name": "Wade Wilson", "year": 1991, "house": "Marvel",
         "biography": "Mercenary with accelerated healing factor known for breaking the fourth wall and dark humor.",
         "equipment": ["Katanas"], "images": ["deadpool.jpg"]},

        {"name": "Storm", "real_name": "Ororo Munroe", "year": 1975, "house": "Marvel",
         "biography": "Mutant able to control the weather and leader within the X-Men.",
         "equipment": [], "images": ["storm.jpg"]},

        {"name": "Hawkeye", "real_name": "Clint Barton", "year": 1964, "house": "Marvel",
         "biography": "Master archer and skilled marksman who fights alongside the Avengers.",
         "equipment": ["Bow and Arrows"], "images": ["hawkeye.jpg"]},

        {"name": "Captain Marvel", "real_name": "Carol Danvers", "year": 1968, "house": "Marvel",
         "biography": "Former Air Force pilot empowered by alien Kree technology becoming one of the universe's strongest heroes.",
         "equipment": [], "images": ["captainmarvel.jpg"]},

        {"name": "Ant-Man", "real_name": "Scott Lang", "year": 1979, "house": "Marvel",
         "biography": "Hero who uses Pym Particles to shrink or grow in size while retaining super strength.",
         "equipment": ["Ant Suit"], "images": ["antman.jpg"]},

        {"name": "Falcon", "real_name": "Sam Wilson", "year": 1969, "house": "Marvel",
         "biography": "Aerial combat specialist using advanced wing technology and later successor to Captain America.",
         "equipment": ["Wings"], "images": ["falcon.jpg"]},

        {"name": "Winter Soldier", "real_name": "Bucky Barnes", "year": 1941, "house": "Marvel",
         "biography": "Former sidekick of Captain America turned brainwashed assassin before redemption.",
         "equipment": ["Cybernetic Arm"], "images": ["wintersoldier.jpg"]},

        {"name": "Loki", "real_name": "Loki Laufeyson", "year": 1962, "house": "Marvel",
         "biography": "Asgardian God of Mischief known for his intelligence, magic abilities and rivalry with Thor.",
         "equipment": [], "images": ["loki.jpg"]},

        {"name": "Daredevil", "real_name": "Matt Murdock", "year": 1964, "house": "Marvel",
         "biography": "Blind lawyer with heightened senses who protects Hell's Kitchen as a vigilante.",
         "equipment": ["Billy Club"], "images": ["daredevil.jpg"]},

        # =========================
        # DC (20)
        # =========================

        {"name": "Batman", "real_name": "Bruce Wayne", "year": 1939, "house": "DC",
         "biography": "Wealthy philanthropist who trains himself to peak human condition to fight crime in Gotham City.",
         "equipment": ["Batarangs"], "images": ["batman.jpg"]},

        {"name": "Superman", "real_name": "Clark Kent", "year": 1938, "house": "DC",
         "biography": "Kryptonian survivor sent to Earth as a child who becomes its greatest protector with immense powers.",
         "equipment": [], "images": ["superman.jpg"]},

        {"name": "Wonder Woman", "real_name": "Diana Prince", "year": 1941, "house": "DC",
         "biography": "Amazonian princess gifted with divine powers who fights for peace and justice.",
         "equipment": ["Lasso of Truth"], "images": ["wonderwoman.jpg"]},

        {"name": "Flash", "real_name": "Barry Allen", "year": 1956, "house": "DC",
         "biography": "Forensic scientist struck by lightning gaining super speed as the Fastest Man Alive.",
         "equipment": [], "images": ["flash.jpg"]},

        {"name": "Green Lantern", "real_name": "Hal Jordan", "year": 1959, "house": "DC",
         "biography": "Test pilot chosen by a power ring granting him the ability to create constructs from willpower.",
         "equipment": ["Power Ring"], "images": ["greenlantern.jpg"]},

        {"name": "Aquaman", "real_name": "Arthur Curry", "year": 1941, "house": "DC",
         "biography": "Half-human, half-Atlantean king who commands the seas and protects the oceans.",
         "equipment": ["Trident"], "images": ["aquaman.jpg"]},

        {"name": "Cyborg", "real_name": "Victor Stone", "year": 1980, "house": "DC",
         "biography": "Young athlete rebuilt with advanced cybernetic technology becoming a member of the Justice League.",
         "equipment": [], "images": ["cyborg.jpg"]},

        {"name": "Green Arrow", "real_name": "Oliver Queen", "year": 1941, "house": "DC",
         "biography": "Billionaire turned vigilante archer who defends Star City.",
         "equipment": ["Bow and Arrows"], "images": ["greenarrow.jpg"]},

        {"name": "Shazam", "real_name": "Billy Batson", "year": 1940, "house": "DC",
         "biography": "Teenager who transforms into an adult superhero by speaking the word Shazam.",
         "equipment": [], "images": ["shazam.jpg"]},

        {"name": "Robin", "real_name": "Dick Grayson", "year": 1940, "house": "DC",
         "biography": "Original sidekick of Batman who later becomes Nightwing.",
         "equipment": [], "images": ["robin.jpg"]},

        {"name": "Nightwing", "real_name": "Dick Grayson", "year": 1984, "house": "DC",
         "biography": "Former Robin who establishes himself as an independent hero in Bludhaven.",
         "equipment": [], "images": ["nightwing.jpg"]},

        {"name": "Batgirl", "real_name": "Barbara Gordon", "year": 1967, "house": "DC",
         "biography": "Daughter of Commissioner Gordon who becomes a skilled vigilante and later Oracle.",
         "equipment": [], "images": ["batgirl.jpg"]},

        {"name": "Supergirl", "real_name": "Kara Zor-El", "year": 1959, "house": "DC",
         "biography": "Cousin of Superman who shares his Kryptonian powers and protects Earth.",
         "equipment": [], "images": ["supergirl.jpg"]},

        {"name": "Martian Manhunter", "real_name": "J'onn J'onzz", "year": 1955, "house": "DC",
         "biography": "Alien telepath from Mars with shapeshifting abilities and founding member of the Justice League.",
         "equipment": [], "images": ["martianmanhunter.jpg"]},

        {"name": "Blue Beetle", "real_name": "Jaime Reyes", "year": 2006, "house": "DC",
         "biography": "Teenager bonded with an alien scarab granting him advanced armor and weaponry.",
         "equipment": [], "images": ["bluebeetle.jpg"]},

        {"name": "Hawkman", "real_name": "Carter Hall", "year": 1940, "house": "DC",
         "biography": "Reincarnated warrior with ancient weapons and large artificial wings.",
         "equipment": ["Mace"], "images": ["hawkman.jpg"]},

        {"name": "Raven", "real_name": "Raven", "year": 1980, "house": "DC",
         "biography": "Daughter of the demon Trigon with empathic and mystical powers.",
         "equipment": [], "images": ["raven.jpg"]},

        {"name": "Starfire", "real_name": "Koriand'r", "year": 1980, "house": "DC",
         "biography": "Alien princess from Tamaran with energy projection abilities and member of the Teen Titans.",
         "equipment": [], "images": ["starfire.jpg"]},

        {"name": "Zatanna", "real_name": "Zatanna Zatara", "year": 1964, "house": "DC",
         "biography": "Stage magician who casts real spells by speaking backwards.",
         "equipment": [], "images": ["zatanna.jpg"]},

        {"name": "Constantine", "real_name": "John Constantine", "year": 1985, "house": "DC",
         "biography": "Occult detective and antihero dealing with supernatural threats.",
         "equipment": [], "images": ["constantine.jpg"]},
    ]

    for hero in heroes:
        hero["images"] = [f"{slugify(hero.get('name'))}_1"]

    superhero_collection.insert_many(heroes)
    print("Superhéroes insertados correctamente (40).")


if __name__ == "__main__":
    seed_data()
