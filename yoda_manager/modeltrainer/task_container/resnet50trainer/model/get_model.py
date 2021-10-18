import tensorflow as tf

import logging

logger = logging.getLogger(__name__)

def get_model(config, dataset):
    if config["model"]["type"] == "keyword":
        return get_keyword_model(config, dataset)

    assert False

def get_keyword_model(config, dataset):

    t_model = tf.keras.applications.MobileNetV3Small(
        include_top=False, weights="imagenet", input_tensor=None,
        input_shape=(224, 224, 3), pooling=None, classes=1000
    )

    #Flatten output layer
    flattened = tf.keras.layers.Flatten()(t_model.output)

    #Fully connected layer 1
    fc1 = tf.keras.layers.Dense(2, name="AddedDense1")(flattened)

    model = tf.keras.models.Model(inputs=t_model.input, outputs=fc1)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['accuracy']
    )

    return model
