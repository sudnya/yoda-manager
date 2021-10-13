from yoda_manager.core.database.tiny_db_wrapper import TinyDBWrapper

class DatabaseFactory:
    def __init__(self, config, table_name):
        self.config = config
        self.table_name = table_name

    def create(self):
        if self.config["support"]["database"]["type"] == "tinydb":
            return TinyDBWrapper(self.config, self.table_name)

        assert False

