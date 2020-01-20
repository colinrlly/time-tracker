import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

class Picker extends Component {
    render() {
        this;

        return (
            <div>
                <button class="rangeBackwardBtn">{'<'}</button>
                <DateRangePicker
                    startDate="1/1/2014"
                    endDate="3/1/2014"
                    ranges={{
                        Today: [moment(), moment()],
                        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }}
                    timePicker={true}
                    locale={{
                        format: 'M/DD hh:mm A',
                    }}
                >
                    <button>Click Me To Open Picker!</button>
                </DateRangePicker>
                <button class="rangeBackwardBtn">{'>'}</button>
            </div >
        );
    }
}

export default Picker;
