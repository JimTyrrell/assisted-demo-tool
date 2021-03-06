import { includes, map, get, find, first, filter } from 'lodash';
import {
  _selectDemo,
  _applyDemoSettings,
  _startDemoSettings,
  _gotoStep
} from './actions.js';
import { selectPersona } from '../personas/actions.js';
import { pushPersonaUrl } from '../urlHistory/actions.js';

import {
  getCurrentDemo,
  getSortedIncludedDemos,
  getStepsCount,
  getCurrentStepIndex,
  getCurrentStepPersonaId,
  getCurrentStepUrlOverrides,
  getNextDemoId,
  getDemosConfig,
  getDemosTempConfig
} from './selectors.js';

import { getCurrentPersonaId } from '../personas/selectors.js';
import { getUrlHistoryPersonaUrlMap } from '../urlHistory/selectors.js';

export const gotoStep = stepIndex => (dispatch, getState) => {
  let state = getState(),
    stepsCount = getStepsCount(state),
    currentStepIndex = getCurrentStepIndex(state),
    currentPersonaId = getCurrentPersonaId(state);
  if (stepIndex >= 0 && stepIndex < stepsCount) {
    dispatch(_gotoStep(stepIndex));

    // update persona if necessary
    const nextPersonaId = getCurrentStepPersonaId(getState());
    if (nextPersonaId !== currentPersonaId) {
      dispatch(selectPersona(nextPersonaId));
    }

    // push new URLs if necessary
    const urlOverrides = getCurrentStepUrlOverrides(getState());
    const urlHistory = getUrlHistoryPersonaUrlMap(getState());
    if (urlOverrides) {
      urlOverrides.forEach(override => {
        if (override.url !== urlHistory[override.personaId]) {
          dispatch(pushPersonaUrl(override.personaId, override.url));
        }
      });
    }
  } else {
    console.warn('[gotoStep] attempting to go to step with index ' + stepIndex);
    dispatch(_gotoStep(currentStepIndex)); // to update url
  }
};

export const nextStep = () => (dispatch, getState) => {
  let currentStepIndex = getCurrentStepIndex(getState());
  gotoStep(currentStepIndex + 1)(dispatch, getState);
};

export const prevStep = () => (dispatch, getState) => {
  let currentStepIndex = getCurrentStepIndex(getState());
  gotoStep(currentStepIndex - 1)(dispatch, getState);
};

export const selectDemo = demoId => (dispatch, getState) => {
  var demos = getSortedIncludedDemos(getState());
  if (includes(map(demos, 'id'), demoId)) {
    dispatch(_selectDemo(demoId));
    gotoStep(0)(dispatch, getState);
  } else {
    console.error(
      '[selectDemo] : demo with id ' + demoId + ' not found, or not included'
    );
    dispatch(_selectDemo(get(demos, '0.id')));
    gotoStep(0)(dispatch, getState);
  }
};

export const applyDemoSettings = () => (dispatch, getState) => {
  var tempDemoConfig = getDemosTempConfig(getState());
  if (!find(tempDemoConfig.data, 'included')) {
    console.error('[applyDemoSettings] : trying to exclude all demos');
    return;
  }
  dispatch(_applyDemoSettings(tempDemoConfig));
  if (!getCurrentDemo(getState()).included) {
    const includedDemoId = first(
      filter(tempDemoConfig.order, id => tempDemoConfig.data[id].included)
    );
    dispatch(_selectDemo(includedDemoId));
  }
};

export const startDemoSettings = () => (dispatch, getState) => {
  const demosConfig = getDemosConfig(getState());
  dispatch(_startDemoSettings(demosConfig));
};

export const nextDemo = () => (dispatch, getState) => {
  const nextDemoId = getNextDemoId(getState());
  selectDemo(nextDemoId)(dispatch, getState);
};
