from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

def get_exported_datasets():
    config = get_config()

    database = Database(config, config["data_manager"]["export"]["table_name"])

    return database.all()