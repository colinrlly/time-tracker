import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    setRange,
    addActivityRecord,
} from '../../redux/actions/actions';
import PropsDisplay from './components/propsDisplay';

class Data extends Component {
    componentDidMount() {
        this.props.setRange('2020-01-10T16:09:00.070Z', '2020-01-17T16:09:00.070Z');

        this.props.addActivityRecord({
            end: '2020-01-17T16:09:00.070Z',
            start: '2020-01-10T16:09:00.070Z',
            summary: 'test',
            colorId: 5,
        });

        this.props.addActivityRecord({
            end: '2020-01-17T16:09:00.070Z',
            start: '2020-01-10T16:09:00.070Z',
            summary: 'test',
            colorId: 5,
        });

        // axios.post('/api/list_events', {
        //     startOfRange: '2020-01-10T16:09:00.070Z',
        //     endOfRange: '2020-01-17T16:09:00.070Z',
        // }).then((response) => {
        //     console.log(response);
        // }).catch((error) => {
        //     console.log(error);
        // });
    }

    render() {
        console.log(this.props);

        return (
            <PropsDisplay />
        );
    }
}

// const mapStateToProps = (state) => ({
//     range: state.range,
//     list: state.list,
// });

const mapDispatchToProps = {
    setRange,
    addActivityRecord,
};

export default connect(null, mapDispatchToProps)(Data);
