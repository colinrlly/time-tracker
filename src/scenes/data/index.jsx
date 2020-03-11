import React, { Component } from 'react';
import Slideout from 'slideout';
import Picker from './components/picker';
import ListFetcher from './components/listFetcher';
import ActivityListGenerator from './components/activityListGenerator';
import ActivityList from './components/activityList';
import BarChart from './components/barChart';
import Aggregator from './components/aggregator';
import './style/slideout.css';

/**
 * Data page entry point.
 */
class Data extends Component {
    constructor(props) {
        super(props);

        this.toggleButtonHandler = this.toggleButtonHandler.bind(this);
    }

    componentDidMount() {
        this.slideout = new Slideout({
            panel: document.getElementById('panel'),
            menu: document.getElementById('menu'),
            padding: 256,
            tolerance: 70,
        });
    }

    toggleButtonHandler() {
        this.slideout.toggle();
    }

    render() {
        this;

        return (
            <div>
                <ListFetcher />
                <ActivityListGenerator />
                <Aggregator />
                <nav id='menu'>
                    <header>
                        <Picker />
                        <ActivityList />
                    </header>
                </nav>
                <main id='panel'>
                    <button onClick={this.toggleButtonHandler}>menu</button>
                    <BarChart />
                    <header>
                        <h2>Panel</h2>
                    </header>
                </main>
            </div>
        );
    }
}

export default Data;
