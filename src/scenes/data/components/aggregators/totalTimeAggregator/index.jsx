import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    setAggTotalTime,
} from '../../../../../redux/actions/actions';
import {
    totalTimeAggregator,
} from './helpers';

function TotalTimeAggregator(props) {
    const filteredTotalTime = totalTimeAggregator(props.filteredTotals);

    props.setAggTotalTime(filteredTotalTime);

    return null;
}

const mapStateToProps = (state) => ({
    filteredTotals: state.aggregations.filteredTotals,
});

const mapDispatchToProps = {
    setAggTotalTime,
};

TotalTimeAggregator.propTypes = {
    filteredTotals: PropTypes.array.isRequired,
    setAggTotalTime: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalTimeAggregator);
