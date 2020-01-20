import React, { Component } from 'react';
import Ranger from 'nanocal-ranger';

class RangePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: {
                year: 2017,
                month: 11,
                day: 1,
            },
            end: {
                year: 2017,
                month: 11,
                day: 10,
            },
        };
    }

    componentDidMount() {
        const el = document.getElementById('nanocal');

        const ranger = new Ranger({
            target: el,
            data: {
                rangeStartDay: this.state.start,
                rangeEndDay: this.state.end,
            },
        });

        ranger.on('selectedRange', ([start, end]) => {
            this.setState({ start, end });
        });
    }

    render() {
        const { start, end } = this.state;

        return (
            <div>
                <link rel="stylesheet" href="https://unpkg.com/nanocal-ranger/dist/ranger.min.css"></link>
                <h2>Selected range: {start.year} / {start.month} / {start.day} - {end.year} / {end.month} / {end.day}</h2>
                <div id='nanocal'></div>
            </div>
        );
    }
}

export default RangePicker;
