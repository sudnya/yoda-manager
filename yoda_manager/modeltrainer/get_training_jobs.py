from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

def get_training_jobs():

    config = get_config()

    database = Database(config, config["model_trainer"]["job_table_name"])

    return database.all()


