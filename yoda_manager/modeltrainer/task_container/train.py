import tensorflow as tf

import argparse
import os
import yaml
import json
import time
from smart_open import open

from resnet50trainer import get_dataset, get_unlabeled_dataset, dataset_unlabeled_file_generator, dataset_unlabeled_uid_file_generator
from resnet50trainer import get_model
from resnet50trainer import get_config


import logging

logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description=
        "Train a deep net on a dataset, producing a saved model.")
    parser.add_argument("config_path", default="",
                        help="The model training config file to read from", nargs='?')

    args = vars(parser.parse_args())

    logger.debug("Arguments: " + str(args))

    training_config = {}

    try:
        with open(args["config_path"]) as config_file:
            training_config = yaml.safe_load(config_file)

    except Exception as e:
        logger.error("Failed to load config file, using defaults.")
        logger.error(args["config_path"])
        logger.error(str(e))


    config = get_config(training_config)
    logger.debug("Loaded config: " + str(config))

    logger.debug("Loading training dataset...")
    train_dataset = get_dataset(config, "train")
    logger.debug("Training dataset: " + str(train_dataset))

    logger.debug("Loading test dataset...")
    test_dataset = get_dataset(config, "test")
    logger.debug("Test dataset: " + str(test_dataset))


    logger.debug("Loading unlabeled dataset...")
    unlabeled_dataset = get_unlabeled_dataset(config)
    logger.debug("unlabeled dataset: " + str(unlabeled_dataset))

    logger.debug("Creating model...")
    model = get_model(config, train_dataset)

    model.summary()

    logger.debug("Training model...")
    history = model.fit(x=train_dataset,
        validation_data=test_dataset,
        verbose=2,
        epochs=config["model"]["epochs"],
        callbacks=tf.keras.callbacks.EarlyStopping(verbose=1, patience=2))

    logger.debug("Saving model...")
    model.save(config["model"]["save_path"])

    predictions = model.predict(unlabeled_dataset, batch_size=None, verbose=2, steps=None, callbacks=None, max_queue_size=10,
    workers=1, use_multiprocessing=False)

    logger.info("Predictions are:")
    logger.info(str(tf.nn.softmax(predictions)))
    confusion_scores = tf.math.abs(tf.nn.softmax(predictions)[:,1] - 0.5).numpy().tolist()

    logger.debug("Saving results to: " + config["model"]["results_path"])

    label_confidence = []
    unlabeled_files = list(dataset_unlabeled_uid_file_generator(config))
    for i in range(0, len(unlabeled_files)):
        label_confidence.append([unlabeled_files[i][0], confusion_scores[i]])

    with open(config["model"]["results_path"], "w") as results_file:
        json.dump({"accuracy" : history.history['val_accuracy'][-1], "label_confidence": label_confidence}, results_file)

if __name__ == "__main__":
    main()



