import React, { Component } from 'react';
import { connect } from 'react-redux';

class PropsDisplay extends Component {
    render() {
        console.log(this.props);

        return (
            <p>props</p>
        );
    }
}

export default connect(
    (state) => ({
        list: state.list,
        range: state.range,
    }),
    null,
)(PropsDisplay);
