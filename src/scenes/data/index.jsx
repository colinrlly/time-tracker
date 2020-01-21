import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    addActivityRecord,
} from '../../redux/actions/actions';
import Picker from './components/picker';

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
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    addActivityRecord: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Data);
