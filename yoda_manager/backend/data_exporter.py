from yoda_manager.core.database import Database
from yoda_manager.util.config import get_config

from smart_open import open
import jsonlines
import hashlib
import json
import os

import logging

logger = logging.getLogger(__name__)

def export(view, images):
    '''Exports a version of the dataset.'''

    config = get_config()

    results =  get_results(view, images, config)

    logger.debug("Got database results: " + str(results))

    hash_md5 = hashlib.md5()

    for result in results:
        hash_md5.update(json.dumps(result).encode('utf-8'))

    dataset_path = os.path.join(config["data_manager"]["export"]["path"], hash_md5.hexdigest() + ".jsonlines")
    logger.debug("Writing exported dataset to: " + str(dataset_path))

    with open(dataset_path, "w") as dataset_file:
        with jsonlines.Writer(dataset_file) as jsonlines_writer:
            for result in results:
                jsonlines_writer.write(result)

    exported_database = Database(config, config['data_manager']['export_table_name'])

    exported_database.insert({"id" : hash_md5.hexdigest(), "path" : dataset_path})
    return dataset_path

def get_results(view, images, config):

    logger.debug("Searching for view: " + str(view))
    logger.debug(" with images: " + str(images))

    database = Database(config, config["data_manager"]["default_table_name"])

    allResults = database.search(view)
    allResultsUids = { result["uid"] : result for result in allResults }
    results = []
    for img in images:
        if img['uid'] in allResultsUids:
            results.append(allResultsUids[img["uid"]])

    return results
