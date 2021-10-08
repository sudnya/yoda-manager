from yoda_manager.core.database.tiny_db_wrapper import TinyDBWrapper

class DatabaseFactory:
    def __init__(self, config):
        self.config = config

    def create(self):
        if self.config["support"]["database"]["type"] == "tinydb":
            return TinyDBWrapper(self.config)

        assert False

