import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./_pages/home/feature/home.component";
import {AuthGuard} from "./_auth/auth.guard";
import {EnumRoles} from './_auth/models/enumRoles';
import {redirectGuard} from "./_helpers/guards/redirect.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'sales',
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.AFSPRAKEN,
        EnumRoles.INMETEN,
        EnumRoles.FORMULIEREN
      ]
    },
    children: [
      {
        path: "afspraken",
        canActivate: [AuthGuard, redirectGuard],
        component: HomeComponent,
        data: {
          externalUrl: "verkoop/afspraken",
          roles: [
            EnumRoles.AFSPRAKEN,
          ]
        }
      },
      // {
      //   path: "inmeten",
      //   canActivate: [AuthGuard, redirectGuard],
      //   component: HomeComponent,
      //   data: {
      //     externalUrl: "verkoop/inmeten",
      //     roles: [
      //       EnumRoles.INMETEN,
      //     ]
      //   }
      // },
      {
        path: "formulier",
        canActivate: [AuthGuard, redirectGuard],
        component: HomeComponent,
        data: {
          externalUrl: "verkoop/formulier",
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
      //     roles: [
      //       EnumRoles.INMETEN,
      //     ]
      //   }
      // },
    ]
  },
  {
    path: 'planning',
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
        EnumRoles.PRODUCTIE,
        EnumRoles.GEPRODUCEERD,
      ]
    },
    children: [
      // {
      //   path: 'tracking',
      //   canActivate: [AuthGuard, redirectGuard],
      //   component: HomeComponent,
      //   data: {
      //     externalUrl: "planning/tracking",
      //     roles: [
      //       EnumRoles.TRACKING,
      //       EnumRoles.AFSPRAKEN,
      //     ]
      //   },
      // },
      // {
      //   path: 'productie',
      //   component: HomeComponent,
      //   canActivate: [AuthGuard, redirectGuard],
      //   data: {
      //     externalUrl: "planning/productie",
      //     roles: [
      //       EnumRoles.PRODUCTIE,
      //     ]
      //   },
      // },
      // {
      //   path: 'geproduceerd',
      //   component: HomeComponent,
      //   canActivate: [AuthGuard, redirectGuard],
      //   data: {
      //     externalUrl: "planning/geproduceerd",
      //     roles: [
      //       EnumRoles.GEPRODUCEERD,
      //     ]
      //   },
      // }
    ]
  },
  {
    path: 'magazijn',
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.LOGISTIEK,
        EnumRoles.CONTROLE,
        EnumRoles.VOORRAAD,
        EnumRoles.BESTELLINGEN_BEHEREN
      ]
    },
    children: [
      {
        path: 'logistiek',
        canActivate: [AuthGuard, redirectGuard],
        component: HomeComponent,
        data: {
          externalUrl: "magazijn/logistiek",
          roles: [
            EnumRoles.LOGISTIEK,
          ]
        },
      },
      {
        path: 'controle',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "magazijn/controle",
          roles: [
            EnumRoles.CONTROLE,
          ]
        },
      },
      {
        path: 'voorraad',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "magazijn/voorraad",
          roles: [
            EnumRoles.VOORRAAD,
          ]
        },
      },
      {
        path: 'bestellingen',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "magazijn/bestellingen",
          roles: [
            EnumRoles.BESTELLINGEN_BEHEREN,
          ]
        },
      }
    ]
  },
  // {
  //   path: 'reports',
  //   canActivate: [AuthGuard],
  //   data: {
  //     roles: [
  //       EnumRoles.RAPPORTAGE,
  //       EnumRoles.FINANCIEEL
  //     ]
  //   },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       canActivate: [AuthGuard, redirectGuard],
  //       component: HomeComponent,
  //       data: {
  //         externalUrl: "reports/dashboard",
  //         roles: [
  //           EnumRoles.RAPPORTAGE,
  //         ]
  //       },
  //     },
  //     {
  //       path: 'financieel',
  //       component: HomeComponent,
  //       canActivate: [AuthGuard, redirectGuard],
  //       data: {
  //         externalUrl: "reports/financieel",
  //         roles: [
  //           EnumRoles.FINANCIEEL,
  //         ]
  //       },
  //     },
  //   ]
  // },
  {
    path: 'hrm',
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    },
    children: [
      {
        path: 'medewerkers',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "hrm/medewerkers",
          roles: [
            EnumRoles.ONTWIKKELINGEN_BEHEREN,
          ]
        },
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {
      title: 'Admin',
      icon: 'dashboard',
      showInNavbar: true,
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    },
    children: [
      {
        path: 'nieuws',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "admin/nieuws",
          roles: [
            EnumRoles.BERICHTEN_BEHEREN,
          ]
        },
      },
      {
        path: 'roles',
        component: HomeComponent,
        canActivate: [AuthGuard, redirectGuard],
        data: {
          externalUrl: "admin/roles",
          roles: [
            EnumRoles.ROLLEN_BEHEREN,
          ]
        },
      }
    ]
  },
  {
    path: 'sales',
    loadChildren: () => import('./_pages/sales/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.AFSPRAKEN,
        EnumRoles.INMETEN,
        EnumRoles.FORMULIEREN
      ]
    }
  },
  {
    path: 'planning',
    loadChildren: () => import('./_pages/planning/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.PRODUCTIE,
        EnumRoles.GEPRODUCEERD,
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('./_pages/reports/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.RAPPORTAGE,
        EnumRoles.FINANCIEEL,
      ]
    }
  },
  {
    path: 'customers',
    loadChildren: () => import('./_pages/configurations/routes').then(mod => mod.routes),
    // children: CONFIGURATIONS_ROUTES,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
        EnumRoles.FORMULIEREN_BEKIJKEN,
      ]
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./_pages/templates/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
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
