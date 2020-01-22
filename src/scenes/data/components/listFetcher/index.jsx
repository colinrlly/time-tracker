import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import {
    setActivityRecords,
} from '../../../../redux/actions/actions';
import { TimeRangeFilter } from './helpers';

function ListFetcher(props) {
    const {
        startDateTime,
        endDateTime,
    } = props;

    // Fetch the user's list of activity records from the server.
    axios.post('/api/list_events', {
        startDateTime: startDateTime.format(),
        endDateTime: endDateTime.format(),
    }).then((response) => {
        const filteredEvents = TimeRangeFilter(startDateTime, endDateTime, response.data.list);

        props.setActivityRecords(filteredEvents);
        // filteredEvents.forEach((record) => {
        //     props.addActivityRecord(record);
        // });
    }).catch((error) => {
        console.log(error);
    });

    return (null);
}

const mapStateToProps = (state) => ({
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    setActivityRecords,
};

ListFetcher.propTypes = {
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setActivityRecord: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListFetcher);
