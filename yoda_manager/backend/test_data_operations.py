import json
from yoda_manager.backend.data_label_updater import update_labels
from yoda_manager.backend.data_uploader import upload_from_file
from yoda_manager.backend.data_explorer import get_selected_view_rows
from yoda_manager.backend.data_label_updater import update_labels

from yoda_manager.util.config import create_config

create_config()
fakeRequest = {"path": "s3://yoda-tiny-set/versions/snapshot1.csv"}
query = {"is_baby_yoda":1, "sample_set_type" : "train"}
updatedQuery = {"is_baby_yoda":0}

updated_labels = [
        {"filepath": "s3://yoda-tiny-set/data/1.jpeg", "is_baby_yoda": 0},
        {"filepath": "s3://yoda-tiny-set/data/2.jpeg", "is_baby_yoda": 0}
    ]

upload_from_file(fakeRequest)
#print(get_selected_view_rows(query))

update_labels(updated_labels)
print(get_selected_view_rows(updatedQuery))