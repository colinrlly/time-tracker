import React, { Component } from 'react';
import { addNote, removeNote } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';

class Data extends Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     this.props.addNote('One', 'One content');
    // }

    render() {
        const notes = this.props.notes;

        console.log(notes);

        axios.post('/api/list_events', {
            startOfRange: '2019-10-16T18:48:32Z',
            endOfRange: '2019-10-16T18:48:32Z'
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });

        return (
            <h1>Hello World!</h1>
        )
    }
}

const mapStateToProps = state => {
    return {
        notes: state.notes
    };
};

const mapDispatchToProps = {
    addNote: addNote,
    removeNote: removeNote
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);
