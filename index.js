function setState(newState) {
  const listenersLength = this.listeners.length;
  this.state = { ...this.state, ...newState };
  for (let i = 0; i < listenersLength; i++) {
    this.listeners[i](this.state);
  }
}

function useCustom(React) {
  const newListener = React.useState()[1];
  React.useEffect(() => {
    this.listeners.push(newListener);
    return () => {
      let index = this.listeners.length;
      while (index--) {
        if (this.listeners[index] === newListener) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }, []);
  return [this.state, this.actions];
}

function associateActions(store, actions) {
  const associatedActions = {};
  const actionsKeys = Object.keys(actions);
  const actionsKeysLength = actionsKeys.length;
  for (let i = 0; i < actionsKeysLength; i++) {
    const key = actionsKeys[i];
    if (typeof actions[key] === 'function') {
      associatedActions[key] = actions[key].bind(null, store);
    }
    if (typeof actions[key] === 'object') {
      associatedActions[key] = associateActions(store, actions[key]);
    }
  };
  return associatedActions;
}

const useStore = (React, initialState, actions, initializer) => {
  const store = { state: initialState, listeners: [] };
  store.setState = setState.bind(store);
  store.actions = associateActions(store, actions);
  if (initializer) initializer(store);
  return useCustom.bind(store, React);
};

export default useStore;
