import React from 'react';
import { Button, TextField, Grid, ImageList, ImageListItem, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';

export default class DataManager extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            csvPath : "s3://yoda-tiny-set/versions/snapshot1.csv",
            images: [],
            viewFilter: {
                split: {
                    train : false,
                    test : false
                },
                labels: {
                    is_labeled : false
                },
                is_baby_yoda : false,
                needs_help: false
            },
            updatedBabyYodaLabel: '1',
            updateLabelsBody: []
        }
        this.handlePathUpdate = this.handlePathUpdate.bind(this)
        this.handleViewUpdate = this.handleViewUpdate.bind(this)
        this.handleTrainUpdate = this.handleTrainUpdate.bind(this);
        this.handleTestUpdate = this.handleTestUpdate.bind(this);
        this.handleIsConceptUpdate = this.handleIsConceptUpdate.bind(this);
        this.handleUpdateLabels = this.handleUpdateLabels.bind(this);
        this.handleImageClick= this.handleImageClick.bind(this);
        this.handleLabelUpdate = this.handleLabelUpdate.bind(this);
        this.handleLabeledUpdate = this.handleLabeledUpdate.bind(this);
        this.handleNeedsHelpUpdate = this.handleNeedsHelpUpdate.bind(this);
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
        console.log("updated train: ");
        var view = {...this.state.viewFilter};
        view.split.train = !view.split.train;
        this.setState({view});
        this.getView(view);
    }

    handleTestUpdate() {
        console.log("updated test: ");
        var view = {...this.state.viewFilter};
        view.split.test = !view.split.test;
        this.setState({view});
        this.getView(view);
    }

    handleLabeledUpdate() {
        console.log("updated labeled: ");
        var view = {...this.state.viewFilter};
        view.labels.is_labeled = !view.labels.is_labeled;
        this.setState({view});
        this.getView(view);
    }

    handleIsConceptUpdate() {
        console.log("Added is_baby_yoda to filter. ");
        var viewFilter = {...this.state.viewFilter};
        viewFilter.is_baby_yoda = !viewFilter.is_baby_yoda;

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
    }

    handleNeedsHelpUpdate() {
        console.log("The following images need most label help.");
        var viewFilter = {...this.state.viewFilter};
        viewFilter.needs_help = !viewFilter.needs_help;

        this.setState({viewFilter});
        this.getView(viewFilter);
    }

    handleImageClick(item) {
        if (item.selected === 1)
            item.selected = 0;
        else
            item.selected = 1;
        this.setState({images: this.state.images});
    }

    upload(csvPath) {
        fetch(process.env.REACT_APP_API_URL + '/yoda-manager/data-upload',
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
        var url = new URL(process.env.REACT_APP_API_URL + '/yoda-manager/get-data-view');
        fetch(url,
            {
                method: 'POST', 
                cache: 'no-cache',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(transformView(view))
            }
        )
        .then(res => res.json())
        .then((data) => {
            console.log("Got response: ", data);
            this.handleViewUpdate(data);
        })
        .catch(console.log)
    }

    updateSelected() {
        var url = new URL(process.env.REACT_APP_API_URL + '/yoda-manager/update-labels');
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

    export() {
        fetch(process.env.REACT_APP_API_URL + '/yoda-manager/export-view',
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ view : transformView(this.state.viewFilter), data : this.state.images}) // body data type must match "Content-Type" header
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
            <FormControlLabel control={<Checkbox onClick={this.handleTrainUpdate} />} label="Train" />
            <FormControlLabel control={<Checkbox onClick={this.handleTestUpdate} />} label="Test" />
            <FormControlLabel control={<Checkbox onClick={this.handleLabeledUpdate}  />} label="Labeled" />
            <FormControlLabel control={<Checkbox onClick={this.handleIsConceptUpdate}  />} label="IsBabyYoda" />
            <FormControlLabel control={<Checkbox onClick={this.handleNeedsHelpUpdate}  />} label="ActiveLearningSuggestion" />
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
            <Grid container justifyContent = "center">
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onClick={this.handleLabelUpdate} />}  label="IsBabyYoda" />
            </FormGroup>
            <Button id="updateSelected" variant="contained" onClick={() =>
                {
                    this.updateSelected();
                }
            }>
                
            Update labels of selected
            </Button>       
        </Grid>
            <br />
            <br />

            <Grid container justifyContent = "center">
            <Button id="exportSelected" variant="contained" onClick={() =>
                {
                    this.export();
                }
            }>
            Export selected view
            </Button>    
        </Grid>


        </div>;
    }
}

function transformView(view) {
    var sample_set_types = [];
    if (view.split.train) {
        sample_set_types.push("train");
    }
    if (view.split.test) {
        sample_set_types.push("test");
    }
    var transformedView = {};
    if (sample_set_types.length > 0) {
        transformedView["split"] = {
            sample_set_type : sample_set_types
        };
    }
    if (view.labels.is_labeled) {
        transformedView["labels"] = { is_labeled : "1" };
    }
    if (view.is_baby_yoda) {
        transformedView["is_baby_yoda"] = { is_baby_yoda: "1"};
    }
    if (view.needs_help) {
        transformedView["labels"] = { is_labeled : "0" };
    }
    return transformedView;
}

