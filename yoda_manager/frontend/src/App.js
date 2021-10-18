import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from '@material-ui/core';

import ButtonAppBar from './components/Header'
import MyButton from './components/Footer'
import DataManager from './components/DataManager'
import ModelManager from './components/ModelManager'
import About from './components/About'
import DeploymentManager from './components/DeploymentManager'

class App extends React.Component {
    render() {
        return (
          <div>
            <ButtonAppBar />
            <Router>
                <div>
                      <Link to="/"><Button color="inherit">About</Button></Link>
                      <Link to="/data"><Button color="inherit">Data</Button></Link>
                      <Link to="/model"><Button color="inherit">Model</Button></Link>
                      <Link to="/deploy"><Button color="inherit">Deployment</Button></Link>
    
                  <hr />
    
                  <Route exact path="/" component={About} />
                  <Route path="/data" component={DataManager} />
                  <Route path="/model" component={ModelManager} />
                  <Route path="/deploy" component={DeploymentManager} />
                </div>
              </Router>
            <MyButton/>
          </div>
        );
      }
    
}

export default App;