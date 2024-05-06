import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateFn
} from '@angular/router';


export const redirectGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  window.open('https://old.differentgroup.nl/'+route.data['externalUrl'], '_blank');
  return false;
};
