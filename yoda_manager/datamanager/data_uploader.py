from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

from smart_open import open
import csv
import hashlib

from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

def upload_from_file(payload):
    database = Database(get_config(), get_config()['data_manager']['default_table_name'])
    
    with open(payload['path'], newline='') as csvfile:
        inputFile = csv.DictReader(csvfile, delimiter=',', quotechar='|')
        for row in inputFile:
            print(row)
            row['uid'] = get_uid(row.get('filepath'))
            database.insert(row)

def get_uid(path):
    hash_md5 = hashlib.md5()
    hash_md5.update(path.encode("utf-8"))
    return hash_md5.hexdigest()