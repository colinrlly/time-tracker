import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';

class Picker extends Component {
    render() {
        return (
            <DateRangePicker startDate="1/1/2014" endDate="3/1/2014">
                <button>Click Me To Open Picker!</button>
            </DateRangePicker>
        );
    }
}

export default Picker;
