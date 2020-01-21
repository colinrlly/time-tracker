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
import moment from 'moment';

/**
 * Component to fetch the initial list of activity records form the server,
 * then save those records to the redux store.
 */
class Data extends Component {
    fetchList() {
        const {
            startDateTime,
            endDateTime,
        } = this.props;

        // Fetch the user's list of activity records from the server.
        axios.post('/api/list_events', {
            startDateTime: startDateTime.format(),
            endDateTime: endDateTime.format(),
        }).then((response) => {
            // Submit each activity record to the redux store.
            response.data.list.forEach((record) => {
                this.props.addActivityRecord(record);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.fetchList();
    }

    componentDidUpdate() {
        this.fetchList();
    }

    render() {
        return (
            <div>
                {/* <PropsDisplay /> */}
                <Picker />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    addActivityRecord,
};

Data.propTypes = {
    startDateTime: PropTypes.object,
    endDateTime: PropTypes.object,
    addActivityRecord: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Data);
