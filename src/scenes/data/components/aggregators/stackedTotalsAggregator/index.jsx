import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    setAggStackedTotals,
} from '../../../../../redux/actions/actions';
import {
    aggregateStackedTotals,
} from './helpers';

function StackedTotalsAggregator(props) {
    if (Object.keys(props.names).length !== 0 && props.names.constructor === Object) {
        const rangeDuration = props.endDateTime.diff(props.startDateTime);
        let interval = '';

        if (rangeDuration < moment.duration(2, 'weeks')) {
            interval = 'day';
        } else if (rangeDuration < moment.duration(4, 'months')) {
            interval = 'week';
        } else if (rangeDuration < moment.duration(2, 'years')) {
            interval = 'month';
        } else {
            interval = 'year';
        }

        const stackedTotals = aggregateStackedTotals(
            props.list,
            props.startDateTime,
            props.endDateTime,
            props.names,
            interval,
            1,
        );

        props.setAggStackedTotals(stackedTotals);
    }

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
    names: state.names,
    startDateTime: state.range.startDateTime,
    endDateTime: state.range.endDateTime,
});

const mapDispatchToProps = {
    setAggStackedTotals,
};

StackedTotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setAggStackedTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedTotalsAggregator);
