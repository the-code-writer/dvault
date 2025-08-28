/* eslint-disable */
interface IEventBus {
  on: (e: any, cb: any) => void;
  dispatch: (e: any, d: any) => void;
  remove: (e: any, cb: any) => void;
}

export const CustomEventBus: IEventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};
