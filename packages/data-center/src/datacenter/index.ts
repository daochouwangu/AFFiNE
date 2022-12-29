import { DataCenter } from './datacenter.js';

const _initializeDataCenter = () => {
  let _dataCenterInstance: Promise<DataCenter>;

  return () => {
    if (!_dataCenterInstance) {
      _dataCenterInstance = DataCenter.init();
    }

    return _dataCenterInstance;
  };
};

export const getDataCenter = _initializeDataCenter();