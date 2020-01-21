import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    setRange,
} from '../../../../redux/actions/actions';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

class Picker extends Component {
    handleApplyEvent(picker) {
        this.props.setRange(picker.startDate, picker.endDate);
    }

    handleRangeDirectionButton(direction) {
        const { startDateTime, endDateTime } = this.props;

        const duration = moment.duration(endDateTime.diff(startDateTime));
        const durationAsDays = Math.floor(duration.asDays()) + 1;

        switch (direction) {
            case 'backward': {
                const newEnd = endDateTime.subtract(durationAsDays, 'days');
                const newStart = startDateTime.subtract(durationAsDays, 'days');

                this.props.setRange(newStart, newEnd);

                break;
            }

            case 'forward': {
                const newEnd = endDateTime.add(durationAsDays, 'days');
                const newStart = startDateTime.add(durationAsDays, 'days');

                this.props.setRange(newStart, newEnd);
                break;
            }

            default:
                break;
        }
    }

    render() {
        const { startDateTime, endDateTime } = this.props;

        const buttonText = `${startDateTime.format('M/D/YY hh:mm a')} ${endDateTime.format('M/D/YY hh:mm a')}`;
        const ranges = {
            Today: [moment(), moment()],
            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        };
        const locale = {
            format: 'M/DD hh:mm A',
        };

        return (
            <div>
                <button onClick={() => this.handleRangeDirectionButton('backward')}>{'<'}</button>

                <DateRangePicker
                    startDate={startDateTime}
                    endDate={endDateTime}
                    ranges={ranges}
                    timePicker={true}
                    locale={locale}
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

const mapStateToProps = (state) => ({
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    setRange,
};

Picker.propTypes = {
    startDateTime: PropTypes.object,
    endDateTime: PropTypes.object,
    setRange: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Picker);
