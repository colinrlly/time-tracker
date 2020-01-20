import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    setRange,
    addActivityRecord,
} from '../../redux/actions/actions';
import PropsDisplay from './components/propsDisplay';
import Picker from './components/picker';

/**
 * Component to fetch the initial list of activity records form the server,
 * then save those records to the redux store.
 */
class Data extends Component {
    componentDidMount() {
        // Fetch the user's list of activity records from the server.
        axios.post('/api/list_events', {
            startOfRange: '2020-01-10T16:09:00.070Z',
            endOfRange: '2020-01-17T16:09:00.070Z',
        }).then((response) => {
            // Submit the range to the redux store.
            this.props.setRange(response.data.start, response.data.end);

            // Submit each activity record to the redux store.
            response.data.list.forEach((record) => {
                this.props.addActivityRecord(record);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Picker />
        );
    }
}

const mapDispatchToProps = {
    setRange,
    addActivityRecord,
};

Data.propTypes = {
    setRange: PropTypes.func,
    addActivityRecord: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(Data);
