import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotals,
} from '../../../../../redux/actions/actions';
import {
    aggregateStackedTotals,
} from './helpers';
import moment from 'moment';

function StackedTotalsAggregator(props) {
    if (Object.keys(props.names).length !== 0 && props.names.constructor === Object) {
        const rangeDuration = props.endDateTime.diff(props.startDateTime);
        let interval = '';

        if (rangeDuration < moment.duration(2, 'weeks')) {
            // 1 day per bar
            console.log('1 day per bar');
            interval = 'day';
        } else if (rangeDuration < moment.duration(4, 'months')) {
            // 1 Week per bar
            console.log('1 week per bar');
            interval = 'week';
        } else if (rangeDuration < moment.duration(2, 'years')) {
            // 1 month per bar
            console.log('1 month per bar');
            interval = 'month';
        } else {
            // 1 year per bar
            console.log('1 year per bar');
            interval = 'year';
        }

        const totals = aggregateStackedTotals(
            props.list,
            props.startDateTime,
            props.endDateTime,
            props.names,
            interval,
            1,
        );

        console.log(totals);
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
    setAggTotals,
};

StackedTotalsAggregator.propTypes = {
    list: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired,
    startDateTime: PropTypes.object.isRequired,
    endDateTime: PropTypes.object.isRequired,
    setAggTotals: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedTotalsAggregator);
