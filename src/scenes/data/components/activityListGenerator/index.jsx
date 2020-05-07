import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setActivityNames,
} from '../../../../redux/actions';
import { generateActivityNames } from './helpers';

const ActivityListGenerator = (props) => {
    const { list } = props;

    const activityNames = generateActivityNames(list);

    props.setActivityNames(activityNames);

    return (null);
};

const mapStateToProps = (state) => ({
    list: state.activityRecords.list,
});

const mapDispatchToProps = {
    setActivityNames,
};

ActivityListGenerator.propTypes = {
    list: PropTypes.array.isRequired,
    setActivityNames: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListGenerator);
