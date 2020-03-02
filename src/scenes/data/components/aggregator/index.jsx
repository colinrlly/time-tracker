import { connect } from 'react-redux';
import {
    setAggTotals,
} from '../../../../redux/actions/actions';
import {
    totalsAggregator,
    listFilter,
} from './helpers';

function Aggregator(props) {
    const list = listFilter(props.list, props.names);

    const totals = totalsAggregator(list);

    props.setAggTotals(totals);

    return null;
}

const mapStateToProps = (state) => ({
    list: state.list,
    names: state.names,
});

const mapDispatchToProps = {
    setAggTotals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Aggregator);
