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

import {
    pickerButton,
    pickerContainer,
    rangeDirectionButton,
} from './style/style.module.scss';

import './style/pickerStyle.scss';

/**
 * Component to render the date time range picker for the Data page.
 *
 * Renders react-bootstrap-daterangepicker component as well as the backwards and forwards buttons.
 *
 * On a new date time range selection this component dispatches a redux action to update
 * the range in the redux store.
 */
class Picker extends Component {
    /**
     * Method to handle a new selection in the react-bootstrap-daterangepicker. Dispatches a
     * redux action to update the date-time-range in the redux store.
     *
     * @param {Object} picker - react-bootstrap-daterangepicker object.
     */
    handleApplyEvent(picker) {
        this.props.setRange(picker.startDate, picker.endDate);
    }

    /**
     * Method to handle when the forwards/backwards buttons are clicked. Increments the range
     * backwards or forwards a number of days based on the currently selected range. Then
     * dispatches a redux action to update the date-time-range in the redux store.
     *
     * @param {String} direction - Direction to increment the date-time-range.
     */
    handleRangeDirectionButton(direction) {
        const { startDateTime, endDateTime } = this.props;

        const duration = moment.duration(endDateTime.diff(startDateTime));
        const durationAsDays = Math.floor(duration.asDays()) + 1;

        switch (direction) {
            case 'backward': {
                const newEnd = moment(endDateTime.subtract(durationAsDays, 'days'));
                const newStart = moment(startDateTime.subtract(durationAsDays, 'days'));

                this.props.setRange(newStart, newEnd);

                break;
            }

            case 'forward': {
                const newEnd = moment(endDateTime.add(durationAsDays, 'days'));
                const newStart = moment(startDateTime.add(durationAsDays, 'days'));

                this.props.setRange(newStart, newEnd);
                break;
            }

            default:
                break;
        }
    }

    render() {
        const { startDateTime, endDateTime } = this.props;

        const buttonText = `${startDateTime.format('M/D/YY')} ${endDateTime.format('M/D/YY')}`;
        const ranges = {
            Today: [moment(), moment()],
            Yesterday: [
                moment().subtract(1, 'days')
                    .second(0)
                    .minute(0)
                    .hour(0),
                moment().subtract(1, 'days')
                    .second(59)
                    .minute(59)
                    .hour(23),
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days')
                    .second(0)
                    .minute(0)
                    .hour(0),
                moment().second(59)
                    .minute(59)
                    .hour(23),
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days')
                    .second(0)
                    .minute(0)
                    .hour(0),
                moment().second(59)
                    .minute(59)
                    .hour(23),
            ],
            'This Month': [
                moment().startOf('month')
                    .second(0)
                    .minute(0)
                    .hour(0),
                moment().endOf('month')
                    .second(59)
                    .minute(59)
                    .hour(23),
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month')
                    .second(0)
                    .minute(0)
                    .hour(0),
                moment().subtract(1, 'month').endOf('month')
                    .second(59)
                    .minute(59)
                    .hour(23),
            ],
        };
        const locale = {
            format: 'M/DD hh:mm A',
        };

        return (
            <div className={pickerContainer}>
                <button
                    onClick={() => this.handleRangeDirectionButton('backward')}
                    className={rangeDirectionButton}>
                    {'<'}
                </button>

                <DateRangePicker
                    startDate={startDateTime}
                    endDate={endDateTime}
                    ranges={ranges}
                    timePicker={true}
                    locale={locale}
                    onApply={(event, picker) => this.handleApplyEvent(picker)}
                    alwaysShowCalendars={true}
                >
                    <button className={pickerButton}>{buttonText}</button>
                </DateRangePicker>

                <button
                    onClick={() => this.handleRangeDirectionButton('forward')}
                    className={rangeDirectionButton}>
                    {'>'}
                </button>
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
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setRange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Picker);
