from smart_open import open
import csv

from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

def upload_from_file(payload):
    database = Database(get_config())
    
    with open(payload['path'], newline='') as csvfile:
        inputFile = csv.DictReader(csvfile, delimiter=',', quotechar='|')
        for row in inputFile:
            database.insert(row)
    #print("Finished data upload")
