import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateFn
} from '@angular/router';


export const redirectGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const path = route.pathFromRoot
    .map(v => v.url.map(segment => segment.toString()).join('/'))
    .join('/');
  window.open('https://differentgroup.azurewebsites.net/'+path, '_blank');
  return false;
};
