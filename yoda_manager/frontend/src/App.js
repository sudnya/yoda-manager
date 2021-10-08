import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Button, TextField, Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';


class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            csvPath : "s3://yoda-tiny-set/versions/snapshot1.csv",
            images: [
               ],
            viewFilter: {
                is_baby_yoda: "1",
                sample_set_type: "train"
            }
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this)
        this.handleViewUpdate = this.handleViewUpdate.bind(this)
        this.handleTrainUpdate = this.handleTrainUpdate.bind(this);
        this.handleIsConceptUpdate = this.handleIsConceptUpdate.bind(this);

    }

    handlePathUpdate(path) {
        console.log("updated path: " + path.target.value)
        this.setState({csvPath: path.target.value});
    }


    handleViewUpdate(presignedpaths) {
        console.log(presignedpaths.response)
        var tempList = []
        presignedpaths.response.forEach(element => tempList.push({img: element, title: "test"}))
        console.log(tempList)
        this.setState({images: tempList});
        //this.getView(this.state.viewFilter);
    }

    handleTrainUpdate() {
        console.log("Added train to filter. ");
        var viewFilter = {...this.state.viewFilter};
        if(viewFilter.sample_set_type === "dev")
            viewFilter.sample_set_type = "train";
        else
            viewFilter.sample_set_type = "dev";

        this.setState({viewFilter});
        this.getView(viewFilter);
    }


    handleIsConceptUpdate() {
        console.log("Added is_baby_yoda to filter. ");
        var viewFilter = {...this.state.viewFilter};
        if (viewFilter.is_baby_yoda === '0')
            viewFilter.is_baby_yoda = '1';
        else
            viewFilter.is_baby_yoda = '0';

        this.setState({viewFilter});
        this.getView(viewFilter);
    }

    getView(view) {
        var url = new URL('http://localhost:5000/yoda-manager/get-data-view'),
        params = view
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url,
            {
                method: 'GET', 
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json'
                }
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.handleViewUpdate(data);
        })
        .catch(console.log)
    }

    upload(csvPath) {
        fetch('http://localhost:5000/yoda-manager/data-upload',
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path : csvPath}) // body data type must match "Content-Type" header
        }
    )
    .then(res => res.json())
    .then((data) => {
        console.log("Got response: ", data);
    })
    .catch(console.log)
    }


    render() {
        return <div>
        <Grid container justifyContent = "center">
            <TextField id="csv-path" label="Dataset CSV path" variant="outlined" value={this.state.csvPath} onChange={this.handlePathUpdate} />
            <Button variant="contained" onClick={() =>
                {
                    this.upload(this.state.csvPath); 
                }
            }>
                Upload
            </Button>
        </Grid>


        <Grid container justifyContent = "center">
            <Button id="autosplit" variant="contained" onClick={() =>
                {
                    this.getView(this.state.viewFilter);
                }
            }>
                Get Data View
            </Button>
                    
        </Grid>
        <Grid container justifyContent = "center">
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked />} onClick={this.handleTrainUpdate} label="Train" />
                <FormControlLabel control={<Checkbox defaultChecked />} onClick={this.handleIsConceptUpdate} label="IsBabyYoda" />
            </FormGroup>
        </Grid>
            <br />
            <Grid container justifyContent = "center">
                <ImageList sx={{ width: 1000, height: 450 }} cols={5} rowHeight={164}>
                    {this.state.images.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                        src={`${item.img}`}
                        srcSet={`${item.img}`}
                        alt={item.title}
                        loading="lazy"
                        />
                    </ImageListItem>
                    ))}
                </ImageList>
            </Grid>
        </div>;
    }
}

export default App;