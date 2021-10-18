from tinydb import TinyDB, Query

class TinyDBWrapper:
    def __init__(self, config, table_name):
        self.config = config
        self.db = TinyDB(self.config["support"]["database"]["path"])
        self.table = self.db.table(table_name, cache_size=30)


    def insert(self, entry):
        self.table.insert(entry)
    
    def all(self):
        print("No filter, printing all entries")
        return self.table.all()

    def search(self, view):
        query = view_to_query(view)

        return self.table.search(query)
        '''
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
                return self.table.search(queryFilter)#[:self.config["support"]["frontend"]["tiles"]]
        '''

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

def view_to_query(view_group):
    if len(view_group) == 0:
        return Query().noop()

    query = None

    for k, view in view_group.items():

        local_query = None
        for k, v in view.items():
            if isinstance(v, list):
                for item in v:
                    if local_query is None:
                        local_query = Query()[k] == item
                    else:
                        local_query = local_query | (Query()[k] == item)

            else:
                if local_query is None:
                    local_query = Query()[k] == v
                else:
                    local_query = local_query | (Query()[k] == v)

        if query is None:
            query = local_query
        elif local_query is not None:
            query = query & local_query

    print("Query:", query)

    return query
