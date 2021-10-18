from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config
from yoda_manager.core.filestorage.s3 import get_presigned_url, write_to_path


# 1. read row from dataversion_db for filename
# 2. update is_baby_yoda column
# 3. update labelfile contents to include label = baby_yoda?

#TODO: check if we need to extract json payload?
def update_labels(updated_labels):
    print('Updating labels!!')
    database = Database(get_config(), get_config()['data_manager']['default_table_name'])
    for label in updated_labels:
        query = { 'uid' : label.get('uid')}
        entry = database.search({"uid" : query})[0]
        entry['is_baby_yoda'] = label.get('is_baby_yoda')
        entry['is_labeled'] = 1
        database.update(query, entry)
        #TODO: write to a new label file and update path in dataversion
        label_path = entry.get('labelpath')
        write_to_path(label_path, {'is_baby_yoda' : entry['is_baby_yoda']})
        
