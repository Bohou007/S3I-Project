import { matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

export { default as NavSectionVertical } from './vertical';
export { default as NavSectionHorizontal } from './horizontal';

export function isExternalLink(path) {
  return path.includes('http');
}

export function getActive(path, pathname) {
  return path ? !!matchPath({ path, end: false }, pathname) : false;
}

export function reallyPath(data) {
  const domain = data.substr(0, data.lastIndexOf('/') + 1);
  return domain;
}
export function getActivePersonnal(path, pathname) {
  const pathUrl = reallyPath(path);
  const pathnameUrl = reallyPath(pathname);
  return path ? !!matchPath({ pathUrl, end: false }, pathnameUrl) : false;
}
