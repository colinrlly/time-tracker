import React, { Component } from 'react';
import { addNote, removeNote } from '../../redux/actions/actions';
import { connect } from 'react-redux';

class Data extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.addNote('One', 'One content');
    }

    render() {
        const notes = this.props.notes;

        console.log(notes);

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
