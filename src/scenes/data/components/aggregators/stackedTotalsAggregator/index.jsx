import { useEffect } from 'react';
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
    useEffect(() => {
        console.log('stackedTotalsAggregator ' + JSON.stringify(props.list).length + ' ' + JSON.stringify(props.names).length + ' ' + JSON.stringify(props.range).length);

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
    }, [props.list, props.names, props.range]);

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
