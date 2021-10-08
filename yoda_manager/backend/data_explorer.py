from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config
from yoda_manager.core.filestorage.s3 import get_presigned_url

def get_selected_view_rows(queryString):
    database = Database(get_config())
    print('Looking for query: ')
    print(queryString)
    retVal = []
    if queryString is None:
        retVal = database.all()
    retVal = database.search(queryString)
    return [get_presigned_url(s3path['filepath']) for s3path in retVal]

def get_row(queryString):
    database = Database(get_config())
    print('Looking for query: ')
    print(queryString)
    retVal = []
    if queryString is None:
        print("Need a query to find a row")
        assert True
    retVal = database.search(queryString)
    return retVal[0]