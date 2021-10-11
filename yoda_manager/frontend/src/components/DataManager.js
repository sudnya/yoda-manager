import React from 'react';
import { Button, TextField, Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';

export default class DataManager extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            csvPath : "s3://yoda-tiny-set/versions/snapshot1.csv",
            images: [],
            viewFilter: {
                is_baby_yoda: "1",
                sample_set_type: "train"
            },
            updatedBabyYodaLabel: '1',
            updateLabelsBody: []
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this)
        this.handleViewUpdate = this.handleViewUpdate.bind(this)
        this.handleTrainUpdate = this.handleTrainUpdate.bind(this);
        this.handleIsConceptUpdate = this.handleIsConceptUpdate.bind(this);
        this.handleUpdateLabels = this.handleUpdateLabels.bind(this);
        this.handleImageClick= this.handleImageClick.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
    }

    handlePathUpdate(path) {
        console.log("updated path: " + path.target.value)
        this.setState({csvPath: path.target.value});
    }


    handleViewUpdate(presignedpaths) {
        console.log(presignedpaths.response)
        var tempList = []
        presignedpaths.response.forEach(element => tempList.push({img: element[0], uid: element[1], selected: 0, title: "test"}))
        console.log(tempList)
        this.setState({images: tempList});
    }


    handleTrainUpdate() {
        console.log("Added train to filter. ");
        var viewFilter = {...this.state.viewFilter};
        if (viewFilter.sample_set_type === "dev")
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

    handleLabelUpdate() {
        console.log("Updated label.");
        var labelBool = this.state.updatedBabyYodaLabel;

        if (labelBool === '0')
            labelBool = '1';
        else
            labelBool = '0';
        
        this.setState({updatedBabyYodaLabel: labelBool});
    }

    handleUpdateLabels() {
        console.log("Got selected images to be updated for labels.");
        var temp = this.state.images.filter(key => key.selected === 1)
        var updateLabelsBody = []
        temp.forEach(entry => updateLabelsBody.push({uid: entry.uid, is_baby_yoda: this.state.updatedBabyYodaLabel}))
        
        console.log(updateLabelsBody)
        return updateLabelsBody;
        //this.setState({updateLabelsBody});
        //this.getView(view);
    }

    handleImageClick(item) {
        if (item.selected === 1)
            item.selected = 0;
        else
            item.selected = 1;
        this.setState({images: this.state.images});
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

    updateSelected(images) {
        var url = new URL('http://localhost:5000/yoda-manager/update-labels');
        var updateLabelsBody = this.handleUpdateLabels();
        fetch(url,
            {
                method: 'POST', 
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data : updateLabelsBody})    
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

        <br />
        <br />

        <Grid container justifyContent = "center">
        <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onClick={this.handleTrainUpdate} />}  label="Train" />
                <FormControlLabel control={<Checkbox defaultChecked onClick={this.handleIsConceptUpdate} />}  label="IsBabyYoda" />
            </FormGroup>
            <Button id="getView" variant="contained" onClick={() =>
                {
                    this.getView(this.state.viewFilter);
                }
            }>
            Get Data View
            </Button>       
        </Grid>

            <br />
            <Grid container justifyContent = "center">
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onClick={this.handleLabelUpdate} />}  label="IsBabyYoda" />
            </FormGroup>
            <Button id="updateSelected" variant="contained" onClick={() =>
                {
                    this.updateSelected(this.state.images);
                }
            }>
            Update labels of selected
            </Button>       
        </Grid>
            <Grid container justifyContent = "center">
                <ImageList sx={{ width: 1000, height: 450 }} cols={5} rowHeight={164}>
                    {this.state.images.map((item) => (
                    
                    <ImageListItem key={item.img} sx={{ border: item.selected, borderColor: "red" }} onClick={() => this.handleImageClick(item)}>    
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