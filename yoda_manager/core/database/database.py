from yoda_manager.core.database.database_factory import DatabaseFactory

class Database:
    def __init__(self, config, table_name):
        self.config = config
        self.engine = DatabaseFactory(config, table_name).create()

    def all(self):
        return self.engine.all()

    def insert(self, entry):
        self.engine.insert(entry)

    def search(self, query):
        return self.engine.search(query)

    def update(self, query, updatedFields):
        return self.engine.update(query, updatedFields)