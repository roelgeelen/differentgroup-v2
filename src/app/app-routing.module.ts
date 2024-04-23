import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./_pages/home/home.component";
import {AuthGuard} from "./_auth/auth.guard";
import {EnumRoles} from './_auth/models/enumRoles';
import {ADMIN_ROUTES} from "./_pages/admin/routes";
import {redirectGuard} from "./_helpers/guards/redirect.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'verkoop',
    canActivate: [AuthGuard],
    data: {
      title: 'Verkoop',
      icon: 'dashboard',
      showInNavbar: true,
      roles: [
        EnumRoles.AFSPRAKEN,
        EnumRoles.INMETEN,
        EnumRoles.FORMULIEREN
      ]
    },
    children: [
      // {
      //   path: "inmeten",
      //   canActivate: [AuthGuard, redirectGuard],
      //   component: HomeComponent,
      //   data: {
      //     externalUrl: "verkoop/inmeten",
      //     title: 'Inmeten',
      //     showInNavbar: true,
      //     roles: [
      //       EnumRoles.INMETEN,
      //     ]
      //   }
      // },
      // {
      //   path: "formulier",
      //   canActivate: [AuthGuard, redirectGuard],
      //   component: HomeComponent,
      //   data: {
      //     externalUrl: "verkoop/formulier",
      //     title: 'Formulieren (oud)',
      //     showInNavbar: true,
      //     roles: [
      //       EnumRoles.FORMULIEREN,
      //     ]
      //   }
      // },
      {
        path: "formulierv2",
        redirectTo: '/customers',
        data: {
          title: 'Formulieren (nieuw)',
          showInNavbar: true,
          roles: [
            EnumRoles.FORMULIEREN,
          ]
        }
      },
      // {
      //   path: "dashboard",
      //   canActivate: [AuthGuard, redirectGuard],
      //   component: HomeComponent,
      //   data: {
      //     externalUrl: "verkoop/dashboard",
      //     title: 'Dashboard',
      //     icon: 'dashboard',
      //     showInNavbar: true,
      //     roles: [
      //       EnumRoles.INMETEN,
      //     ]
      //   }
      // },
    ]
  },
  // {
  //   path: 'planning',
  //   canActivate: [AuthGuard],
  //   data: {
  //     title: 'Planning',
  //     icon: 'insert_chart_outlined',
  //     showInNavbar: true,
  //     roles: [
  //       EnumRoles.TRACKING,
  //       EnumRoles.AFSPRAKEN,
  //       EnumRoles.PRODUCTIE,
  //       EnumRoles.GEPRODUCEERD,
  //     ]
  //   },
  //   children: [
  //     {
  //       path: 'tracking',
  //       canActivate: [AuthGuard, redirectGuard],
  //       component: HomeComponent,
  //       data: {
  //         externalUrl: "planning/tracking",
  //         title: 'Tracking',
  //         icon: 'maps',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.TRACKING,
  //           EnumRoles.AFSPRAKEN,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'productie',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "planning/productie",
  //         title: 'Productie',
  //         icon: 'bar_chart',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.PRODUCTIE,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'geproduceerd',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "planning/geproduceerd",
  //         title: 'Geproduceerd',
  //         icon: 'bar_chart',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.GEPRODUCEERD,
  //         ]
  //       },
  //     }
  //   ]
  // },
  // {
  //   path: 'magazijn',
  //   canActivate: [AuthGuard],
  //   data: {
  //     title: 'Magazijn',
  //     icon: 'supervised_user_circle',
  //     showInNavbar: true,
  //     roles: [
  //       EnumRoles.LOGISTIEK,
  //       EnumRoles.CONTROLE,
  //       EnumRoles.VOORRAAD,
  //       EnumRoles.BESTELLINGEN_BEHEREN
  //     ]
  //   },
  //   children: [
  //     {
  //       path: 'logistiek',
  //       canActivate: [AuthGuard, redirectGuard],
  //       component: HomeComponent,
  //       data: {
  //         externalUrl: "magazijn/logistiek",
  //         title: 'Logistiek',
  //         icon: 'calendar_today',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.LOGISTIEK,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'controle',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "magazijn/controle",
  //         title: 'Controle',
  //         icon: 'playlist_add_check',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.CONTROLE,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'voorraad',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "magazijn/voorraad",
  //         title: 'Voorraad',
  //         icon: 'bar_chart',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.VOORRAAD,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'bestellingen',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "magazijn/bestellingen",
  //         title: 'Bestellingen',
  //         icon: 'storage',
  //         showInNavbar: true,
  //         roles: [
  //           EnumRoles.BESTELLINGEN_BEHEREN,
  //         ]
  //       },
  //     }
  //   ]
  // },
  {
    path: 'customers',
    loadChildren: () => import('./_pages/configurations/routes').then(mod => mod.CONFIGURATIONS_ROUTES),
    // children: CONFIGURATIONS_ROUTES,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
      ]
    }
  },
  {
    path: 'admin',
    // loadChildren: () => import('./_pages/admin/routes').then(mod => mod.ADMIN_ROUTES),
    children: ADMIN_ROUTES,
    canActivate: [AuthGuard],
    data: {
      title: 'Admin',
      showInNavbar: true,
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
