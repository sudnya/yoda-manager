from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config
from yoda_manager.core.filestorage.s3 import get_presigned_url

def get_selected_view_rows(queryString):
    database = Database(get_config(), get_config()['data_manager']['default_table_name'])
    print('Looking for query: ')
    print(queryString)
    rows_selected = []
    if queryString is None:
        rows_selected = database.all()
    rows_selected = database.search(queryString)
    retVal = [(get_presigned_url(entry['filepath']), entry.get('uid')) for entry in sorted(rows_selected, key=lambda x : float(x['label_confidence']))]
    return retVal

'''
def get_row(queryString):
    database = Database(get_config(), get_config()['data_manager']['default_table_name'])
    print('Looking for query: ')
    print(queryString)
    retVal = []
    if queryString is None:
        print("Need a query to find a row")
        assert True
    retVal = database.search(queryString)
    return retVal[0]
'''