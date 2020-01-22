import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    addActivityName,
} from '../../../../redux/actions/actions';
import { generateActivityNames } from './helpers';

const ActivityListGenerator = (props) => {
    const { list } = props;

    generateActivityNames(list);

    return (null);
};

const mapStateToProps = (state) => ({
    list: state.list,
});

const mapDispatchToProps = {
    addActivityName,
};

ActivityListGenerator.propTypes = {
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    addActivityRecord: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListGenerator);
