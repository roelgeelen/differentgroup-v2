import {Component, OnInit} from '@angular/core';
import {NAV_CONFIG, NavItem} from "./_helpers/components/navbar/nav-data";
import {FlatTreeControl} from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener, MatTreeModule
} from "@angular/material/tree";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NavbarComponent} from './_helpers/components/navbar/navbar.component';
import {AuthService} from "@auth0/auth0-angular";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {LoadingComponent} from "./_components/loading/loading.component";
import {AuthenticationService} from "./_auth/authentication.service";

interface FlatNode extends NavItem {
  expandable: boolean;
  // name: string;
  // icon: string;
  // url: string;
  level: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    MatSidenavModule,
    MatListModule,
    MatTreeModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    AsyncPipe,
    MatProgressSpinner,
    LoadingComponent
  ]
})
export class AppComponent implements OnInit {
  userPermissions: string[] = [];

  constructor(private authService: AuthenticationService, protected auth: AuthService) {
    this.dataSource.data = NAV_CONFIG;
  }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log(isAuthenticated)
      if (!isAuthenticated) {
        this.auth.loginWithRedirect();
      } else {
        this.authService.login()
      }
    })
    this.authService.permissions$.subscribe(p => {
      this.userPermissions = p!;
    });
    // this.auth.loginWithRedirect();
  }


  // currentUser: User | null = null;
  private _transformer = (node: NavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      icon: node.icon,
      path: node.path,
      roles: node.roles,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: FlatNode) => node.expandable;

  hasPermission(roles: string[]): boolean {
    if (roles.length === 0) {
      return true;
    }
    return this.userPermissions.filter(role => roles.includes(role)).length !== 0;
  }
}
