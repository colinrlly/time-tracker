import React, { Component } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

class Picker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDateTime: moment().subtract(6, 'days'),
            endDateTime: moment(),
        };
    }

    handleApplyEvent(picker) {
        console.log(picker);

        this.setState({
            startDateTime: picker.startDate,
            endDateTime: picker.endDate,
        });
    }

    handleRangeDirectionButton(direction) {
        const { startDateTime, endDateTime } = this.state;

        const duration = moment.duration(endDateTime.diff(startDateTime));
        const durationAsDays = Math.floor(duration.asDays()) + 1;

        switch (direction) {
            case 'backward': {
                const newEnd = endDateTime.subtract(durationAsDays, 'days');
                const newStart = startDateTime.subtract(durationAsDays, 'days');

                this.setState({
                    startDateTime: newStart,
                    endDateTime: newEnd,
                });

                break;
            }

            case 'forward': {
                const newEnd = endDateTime.add(durationAsDays, 'days');
                const newStart = startDateTime.add(durationAsDays, 'days');

                this.setState({
                    startDateTime: newStart,
                    endDateTime: newEnd,
                });
                break;
            }

            default:
                break;
        }
    }

    render() {
        const { startDateTime, endDateTime } = this.state;
        const buttonText = `${startDateTime.format('M/D/YY hh:mm a')} ${endDateTime.format('M/D/YY hh:mm a')}`;

        return (
            <div>
                <button onClick={() => this.handleRangeDirectionButton('backward')}>{'<'}</button>

                <DateRangePicker
                    startDate={startDateTime}
                    endDate={endDateTime}
                    ranges={{
                        Today: [moment(), moment()],
                        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    }}
                    timePicker={true}
                    locale={{
                        format: 'M/DD hh:mm A',
                    }}
                    onApply={(event, picker) => this.handleApplyEvent(picker)}
                    alwaysShowCalendars={true}
                >
                    <button>{buttonText}</button>
                </DateRangePicker>

                <button onClick={() => this.handleRangeDirectionButton('forward')}>{'>'}</button>
            </div >
        );
    }
}

export default Picker;
