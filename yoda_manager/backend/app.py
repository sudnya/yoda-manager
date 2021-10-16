import os
from flask import Flask, render_template, request, redirect
from flask_cors import CORS #comment this on deployment
import yoda_manager

import logging

logger = logging.getLogger(__name__)

MODE = os.getenv('FLASK_ENV')

app = Flask(__name__)
CORS(app) #comment this on deployment


@app.route('/yoda-manager/data-upload', methods=['GET', 'POST'])
def dataUpload():
    if request.method == "POST":
        logger.debug('Upload called')
        yoda_manager.upload_from_file(request.json)
    return {"response": "200"}

@app.route('/yoda-manager/get-data-view', methods=['GET'])
def getView():
    logger.debug("Get View of data" + str(request.args))
    return {"response" : yoda_manager.get_selected_view_rows(request.args)}

@app.route('/yoda-manager/update-labels', methods=['GET', 'POST'])
def updateLabels():
    logger.debug("Update labels in data")
    # get a list of [filename, is_baby_yoda=1/0]
    yoda_manager.update_labels((request.json).get('data'))
    return {"response": "200"}

@app.route('/yoda-manager/export-view', methods=['GET', 'POST'])
def snapshotView():
    logger.debug("Export view of data")
    yoda_manager.export(request.json["view"], request.json["data"])
    return {"response": "200"}

@app.route('/yoda-manager/train', methods=['GET', 'POST'])
def train():
    logger.debug("Training new model: " + str(request.json))
    model = yoda_manager.train(request.json)
    return { "model" : model}


@app.route('/yoda-manager/get_exported_datasets', methods=['GET', 'POST'])
def get_exported_datasets():
    logger.debug("Getting exported datasets...")
    datasets = yoda_manager.get_exported_datasets()
    return { "datasets" : datasets }

@app.route('/yoda-manager/get_training_jobs', methods=['GET', 'POST'])
def get_training_jobs():
    logger.debug("Getting training jobs...")
    jobs = yoda_manager.get_training_jobs()
    return { "jobs" : jobs }



if __name__ == '__main__':
    yoda_manager.create_config()
    app.run(host='0.0.0.0')

