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
        entry = database.search(query)[0]
        print(label)
        print('Returned entry:')
        print(entry)
        entry['is_baby_yoda'] = label.get('is_baby_yoda')
        database.update(query, entry)
        print('updated entry in db')
        print(database.search(query)[0])
        #TODO: write to a new label file and update path in dataversion
        label_path = entry.get('labelpath')
        write_to_path(label_path, entry['is_baby_yoda'])
        
