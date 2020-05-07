import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    getIntervalFromRange,
} from '../../../helpers';
import {
    setAggStackedTotals,
} from '../../../../../redux/actions';
import {
    aggregateStackedTotals,
} from './helpers';

function StackedTotalsAggregator(props) {
    if (Object.keys(props.names).length !== 0 && props.names.constructor === Object) {
        const interval = getIntervalFromRange(props.range);

        const stackedTotals = aggregateStackedTotals(
            props.list,
            props.range.startDateTime,
            props.range.endDateTime,
            props.names,
            interval,
            1,
        );

        props.setAggStackedTotals(stackedTotals);
    }

    return null;
}

const mapStateToProps = (state) => ({
    list: state.activityRecords.list,
    names: state.names,
    range: state.range,
});

const mapDispatchToProps = {
    setAggStackedTotals,
};

StackedTotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    range: PropTypes.object.isRequired,
    setAggStackedTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedTotalsAggregator);
