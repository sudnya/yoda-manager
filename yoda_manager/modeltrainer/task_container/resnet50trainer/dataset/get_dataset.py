from smart_open import open
import jsonlines
import json

import tensorflow as tf
import tensorflow_io as tfio


def get_dataset(config, key):
    file_dataset = load_dataset_file(config, key)
    image_dataset = file_dataset.map(get_image_and_label)
    
    image_dataset = image_dataset.cache()
    #image_dataset = image_dataset.repeat(10)
    image_dataset = image_dataset.batch(config["model"]["batch_size"])
    
    return image_dataset

def get_unlabeled_dataset(config):
    file_dataset = load_unlabeled_dataset_file(config)
    image_dataset = file_dataset.map(get_image_and_label)
    
    image_dataset = image_dataset.cache()
    image_dataset = image_dataset.batch(config["model"]["batch_size"])
    
    return image_dataset

def load_unlabeled_dataset_file(config):
    tf_generator = lambda: (row for row in dataset_unlabeled_file_generator(config))
    return tf.data.Dataset.from_generator(tf_generator,
        output_signature=(
            tf.TensorSpec(shape=(), dtype=tf.string),
            tf.TensorSpec(shape=(), dtype=tf.int32)))

def dataset_unlabeled_file_generator(config):
    with open(config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if int(line['is_labeled']) == 1:
                    continue

                with open(line["labelpath"]) as label_file:
                    label = json.load(label_file)["is_baby_yoda"]
                yield line["filepath"], label


def dataset_unlabeled_uid_file_generator(config):
    with open(config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if int(line['is_labeled']) == 1:
                    continue

                with open(line["labelpath"]) as label_file:
                    label = json.load(label_file)["is_baby_yoda"]
                yield line["uid"], label

def load_dataset_file(config, key):
    tf_generator = lambda: (row for row in dataset_file_generator(config, key))
    return tf.data.Dataset.from_generator(tf_generator,
        output_signature=(
            tf.TensorSpec(shape=(), dtype=tf.string),
            tf.TensorSpec(shape=(), dtype=tf.int32)))

def dataset_file_generator(config, key):
    with open(config["dataset"]["path"]) as dataset_file:
        with jsonlines.Reader(dataset_file) as dataset_reader:
            for line in dataset_reader:
                if int(line['is_labeled']) != 1 or line['sample_set_type'] != key:
                    continue

                with open(line["labelpath"]) as label_file:
                    label = json.load(label_file)["is_baby_yoda"]
                yield line["filepath"], label


def get_image_and_label(filepath, label):
    image_binary = tf.io.read_file(filepath)
    image = tf.image.decode_image(image_binary)
    image = tf.image.resize_with_crop_or_pad(image, 224, 224)
    tf.print("Image shape: ", image.shape)
    image = tf.reshape(image, (224, 224, 3))
    return image, label

