import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, FormControl, InputLabel, Select, Box, MenuItem } from '@material-ui/core';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper, TableContainer } from '@material-ui/core';


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

export default class ModelManager extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          all_datasets : [],
          selected_dataset: {},
          model : {},
          jobs: []
      }
      this.handleModelTraining = this.handleModelTraining.bind(this);
      this.handleAllDatasetsUpdate = this.handleAllDatasetsUpdate.bind(this);
      this.handleSelectedDatasetUpdate = this.handleSelectedDatasetUpdate.bind(this);
      this.handleJobUpdate = this.handleJobUpdate.bind(this);
  }

  handleAllDatasetsUpdate(all_datasets) {
    console.log("updated datasets: " + all_datasets);
    this.setState({all_datasets: all_datasets["datasets"]});
    if (all_datasets.length > 0) {
        this.setState({all_datasets: all_datasets[0]});
    }
  }

  handleSelectedDatasetUpdate(selected_dataset) {
    console.log("updated dataset: " + selected_dataset.target.value);
    this.setState({selected_dataset: selected_dataset.target.value});
  }

  handleModelTraining() {
    console.log("Model is being trained.")
  }
  
  handleJobUpdate(jobs) {
    console.log("updated jobs: " + jobs);
    this.setState({jobs: jobs["jobs"]});
  }

  refresh() {
    fetch('http://localhost:5000/yoda-manager/get_exported_datasets',
        {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            }
        }
    )
    .then(res => res.json())
    .then((data) => {
        console.log("Got response: ", data);
        this.handleAllDatasetsUpdate(data);
    })
    .catch(console.log)
    fetch('http://localhost:5000/yoda-manager/get_training_jobs',
            {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.handleJobUpdate(data);
        })
        .catch(console.log)
}

  render() {
    return <div>
            <Grid container justifyContent = "center">
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="dataset">Selected Dataset</InputLabel>
                            <Select
                              labelId="dataset"
                              id="dataset"
                              value={this.state.selected_dataset}
                              label="dataset"
                              onChange={this.handleSelectedDatasetUpdate}
                            >
                                {this.state.all_datasets.map((dataset) => (
                                  <MenuItem id={dataset.id} value={dataset}>{dataset.id}</MenuItem>
                                ))}

                            </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid container justifyContent = "center">
                <Box m={1}>
                    <Button id="train" variant="contained" onClick={ () =>
                        {
                            fetch('http://localhost:5000/yoda-manager/train',
                                {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ model : this.state.model, dataset: this.state.selected_dataset }) // body data type must match "Content-Type" header
                                }
                            )
                            .then(res => res.json())
                            .then((data) => {
                                console.log("Got response: ", data);
                                this.refresh();
                            })
                            .catch(console.log)
                        }}>
                        Train
                    </Button>
                </Box>
                <Box m={1}>
                    <Button id="refresh" variant="contained" onClick={ () =>
                        {
                            this.refresh();
                        }}>
                        Refresh
                    </Button>
                </Box>
            </Grid>

            <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Model Name</TableCell>
                                <TableCell align="right">Accuracy</TableCell>
                                <TableCell align="right">Start Time</TableCell>
                                <TableCell align="right">End Time</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.jobs.map((row) => (
                              <TableRow
                                key={row.train_config_path}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">{accuracyToFixed(row.accuracy)}</TableCell>
                                <TableCell align="right">{timestampToString(row.start_time)}</TableCell>
                                <TableCell align="right">{timestampToString(row.end_time)}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>;
  }
              
  }

  function accuracyToFixed(accuracy) {
    if (isNaN(accuracy)) {
        return accuracy;
    }
    return accuracy.toFixed(2)
}

function timestampToString(timestamp) {
    if (isNaN(timestamp)) {
        return timestamp;
    }
    var date = new Date(timestamp);
    return date.toLocaleTimeString("en-US");
}
