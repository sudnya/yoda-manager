import React from 'react';
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

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        A data centric platform for images.

        <ul>
            <li><b>Data Management</b>. Upload and manage your image data.</li>
            <li><b>Model Management</b>. Iteratively train, augment, and refine your vision models using error analysis.</li>
            <li><b>Deployment Management</b>. Deploy your vision models to the edge.</li>
        </ul>
    </div>
  );
}