from tinydb import TinyDB, Query

class TinyDBWrapper:
    def __init__(self, config):
        self.config = config
        self.db = TinyDB(self.config["support"]["database"]["path"])
        self.table = self.db.table('_default', cache_size=30)


    def insert(self, entry):
        self.table.insert(entry)
    
    def all(self):
        print("No filter, printing all entries")
        return self.table.all()

    def search(self, queryString):
        query = Query()
        queryFilter = query 
        isset = False
        for k, v in queryString.items():
            if isset:
                queryFilter = queryFilter & (query[k] == v)
            else:
                queryFilter = query[k] == v
                isset = True
        print(queryFilter)
        return self.table.search(queryFilter)[:self.config["support"]["frontend"]["tiles"]]

    def update(self, queryString, updatedLabels):
        query = Query()
        queryFilter = query 
        isset = False
        for k, v in queryString.items():
            if isset:
                queryFilter = queryFilter & (query[k] == v)
            else:
                queryFilter = query[k] == v
                isset = True
        print("Query to update" + str(queryFilter) + " with updated labels" + str(updatedLabels))
        self.table.update(updatedLabels, queryFilter)

    def close():
        self.db.close()