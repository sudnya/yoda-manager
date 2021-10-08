from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config
from yoda_manager.core.filestorage.s3 import get_presigned_url, write_to_path


# 1. read row from dataversion_db for filename
# 2. update is_baby_yoda column
# 3. update labelfile contents to include label = baby_yoda?

#TODO: check if we need to extract json payload?
def update_labels(updated_labels):
    database = Database(get_config())
    for label in updated_labels:
        query = { 'filepath' : label.get('filepath')}
        new_label = {'is_baby_yoda' : label.get('is_baby_yoda')}
        database.update(query, new_label)
        updated_row = database.search(query)
        #write json blob to labelpath in s3
        label_path = updated_row[0].get('labelpath')
        write_to_path(label_path, new_label)
        
