import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setActivityNames,
} from '../../../../redux/actions/actions';
import { generateActivityNames } from './helpers';

const ActivityListGenerator = (props) => {
    const { list } = props;

    const activityNames = generateActivityNames(list);

    props.setActivityNames(activityNames);

    return (null);
};

const mapStateToProps = (state) => ({
    list: state.list,
});

const mapDispatchToProps = {
    setActivityNames,
};

ActivityListGenerator.propTypes = {
    setActivityNames: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListGenerator);
