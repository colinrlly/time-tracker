import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setActivityNames,
} from '../../../../../redux/actions';
import {
    generateActivityNames,
} from './helpers';

function ListAggregator(props) {
    useEffect(() => {
        const activityNames = generateActivityNames(props.totals);

        props.setActivityNames(activityNames);
    }, [props.totals]);

    return null;
}

const mapStateToProps = (state) => ({
    totals: state.aggregations.totals,
});

const mapDispatchToProps = {
    setActivityNames,
};

ListAggregator.propTypes = {
    totals: PropTypes.array.isRequired,
    setActivityNames: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAggregator);
