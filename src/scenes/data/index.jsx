import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    setRange,
    addActivityRecord
} from '../../redux/actions/actions';

class Data extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setRange('2020-01-10T16:09:00.070Z', '2020-01-17T16:09:00.070Z');
        // this.props.setRangeStart('snoop dog');
        // this.props.setRangeEnd('2020-01-17T16:09:00.070Z');
    }

    render() {
        console.log(this.props);

        // axios.post('/api/list_events', {
        //     startOfRange: '2020-01-10T16:09:00.070Z',
        //     endOfRange: '2020-01-17T16:09:00.070Z'
        // }).then(function (response) {
        //     console.log(response);
        // }).catch(function (error) {
        //     console.log(error);
        // });

        return (
            <h1>Hello World!</h1>
        )
    }
}

const mapStateToProps = state => {
    return {
        range: state.range,
        list: state.list
    }
}

const mapDispatchToProps = {
    setRange: setRange,
    addActivityRecord: addActivityRecord
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);
