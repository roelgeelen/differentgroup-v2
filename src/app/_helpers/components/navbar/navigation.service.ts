import {Injectable} from '@angular/core';
import {Router, Route} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {
  }

  getNavigationRoutes(): Route[] {
    return this.router.config.filter((route) => this.shouldShowInNavbar(route));
  }

  private shouldShowInNavbar(route: Route): boolean {
    if (route.data && route.data['showInNavbar']) {
      if (route.children) {
        route.children = route.children.filter(childRoute => this.shouldShowInNavbar(childRoute));
      }
      return true;
    }

    return false;
  }
}
