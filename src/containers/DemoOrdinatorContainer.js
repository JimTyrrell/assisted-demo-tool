import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { mapValues } from 'lodash'

import DemoOrdinator from '../components/DemoOrdinator/DemoOrdinator.js'

import { getTempDemos } from '../state/demos/localSelectors.js'

import { closeAllPopups } from '../actions'
import { excludeDemo, includeDemo, moveDemo, applyDemoSettings } from '../state/demos/actions.js'



const selectorMap = {
  demos: getTempDemos
};


const actionsMap = {
  closeAllPopups,
  excludeDemo,
  includeDemo,
  moveDemo,
  applyDemoSettings
};


const mapStateToProps = state => mapValues(selectorMap, func => func(state) );
const mapDispatchToProps = dispatch => bindActionCreators(actionsMap, dispatch);
const DemoOrdinatorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DemoOrdinator);

export default DemoOrdinatorContainer