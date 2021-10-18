import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h8">
        A data centric platform using image classification with active learning.

        <ul>
            <li><b>Data Management</b>
              Upload and manage your image data.</li>
            <li><b>Model Training</b>
              Iteratively train and refine your vision models using error analysis.</li>
            <li><b>Deployment Management</b>
              Deploy your trained models to production.</li>
        </ul>
        </Typography>
    </div>
  );
}