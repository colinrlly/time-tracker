import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    changeRangeStart,
    changeRangeEnd,
    addActivityRecord
} from '../../redux/actions/actions';

class Data extends Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     this.props.addNote('One', 'One content');
    // }

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

const mapDispatchToProps = {
    changeRangeStart: changeRangeStart,
    changeRangeEnd: changeRangeEnd,
    addActivityRecord: addActivityRecord
}

const mapStateToProps = state => {
    return {
        range: state.range,
        list: state.list
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);
