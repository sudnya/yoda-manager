import os
from flask import Flask, render_template, request, redirect
from flask_cors import CORS #comment this on deployment
from yoda_manager.util.config import create_config

from data_uploader import upload_from_file
from data_explorer import get_selected_view_rows
from data_label_updater import update_labels
from data_exporter import export

MODE = os.getenv('FLASK_ENV')

app = Flask(__name__)
CORS(app) #comment this on deployment


@app.route('/yoda-manager/data-upload', methods=['GET', 'POST'])
def dataUpload():
    if request.method == "POST":
        print('Upload called')
        upload_from_file(request.json)
    return {"response": "200"}

@app.route('/yoda-manager/get-data-view', methods=['GET'])
def getView():
    print("Get View of data" + str(request.args))
    return {"response" : get_selected_view_rows(request.args)}

@app.route('/yoda-manager/update-labels', methods=['GET', 'POST'])
def updateLabels():
    print("Update labels in data")
    # get a list of [filename, is_baby_yoda=1/0]
    update_labels((request.json).get('data'))
    return {"response": "200"}

@app.route('/yoda-manager/export-view', methods=['GET', 'POST'])
def snapshotView():
    print("Export view of data")
    export(request.json["view"], request.json["data"])
    return {"response": "200"}

if __name__ == '__main__':
    create_config()
    app.run(host='0.0.0.0')

