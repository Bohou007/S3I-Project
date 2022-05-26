/* eslint-disable import/no-named-as-default-member */
import { ROUTER_BASE_URL } from '../config';

if (!window.location.pathname.includes(ROUTER_BASE_URL)) {
  window.history.replaceState('', '', ROUTER_BASE_URL + window.location.pathname);
}
