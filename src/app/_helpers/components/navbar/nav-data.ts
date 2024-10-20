import {EnumRoles} from "../../../_auth/models/enumRoles";

export interface NavItem {
  title: string;
  path: string;
  icon: string;
  menu?: string;
  children?: any;
  roles: string[];
}

export const NAV_CONFIG: NavItem[] = [
  {
    path: '/sales',
    title: 'Verkoop',
    icon: 'dashboard',
    roles: [
      EnumRoles.READ_APPOINTMENTS,
      EnumRoles.VIEW_SALES,
      EnumRoles.READ_CONFIGURATIONS,
      EnumRoles.SUPER_CONFIGURATIONS
    ],
    children: [
      {
        path: '/sales/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.VIEW_SALES,
        ]
      },
      {
        path: '/customers',
        title: 'Formulieren',
        icon: 'description',
        roles: [
          EnumRoles.READ_CONFIGURATIONS,
          EnumRoles.SUPER_CONFIGURATIONS,
        ]
      },
      {
        path: '/sales/afspraken',
        title: 'Afspraken',
        icon: 'map',
        roles: [
          EnumRoles.READ_APPOINTMENTS,
        ]
      },
    ],
  },
  {
    path: '/planning',
    title: 'Planning',
    icon: 'insert_chart_outlined',
    roles: [
      EnumRoles.VIEW_PRODUCTION,
      EnumRoles.VIEW_PRODUCED,
      EnumRoles.VIEW_TRACKING,
      EnumRoles.VIEW_INVENTORY
    ],
    children: [
      {
        path: '/planning/tracking',
        title: 'Tracking',
        icon: 'maps',
        roles: [
          EnumRoles.VIEW_TRACKING,
          // EnumRoles.AFSPRAKEN,
        ]
      },
      {
        path: '/planning/production',
        title: 'Productie',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VIEW_PRODUCTION,
        ]
      },
      {
        path: '/planning/produced',
        title: 'Geproduceerd',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VIEW_PRODUCED,
        ]
      },
      {
        path: '/planning/stock',
        title: 'Voorraad',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VIEW_INVENTORY,
        ]
      },
    ],
  },
  {
    path: '/magazijn',
    title: 'Magazijn',
    icon: 'supervised_user_circle',
    roles: [
      EnumRoles.VIEW_LOGISTICS,
      EnumRoles.READ_CHECKLIST,
      EnumRoles.VIEW_INVENTORY,
    ],
    children: [
      {
        path: '/warehouse/logistic',
        title: 'Logistiek',
        icon: 'calendar_today',
        roles: [
          EnumRoles.VIEW_LOGISTICS,
        ]
      },
      {
        path: '/warehouse/checklist',
        title: 'Controle',
        icon: 'playlist_add_check',
        roles: [
          EnumRoles.READ_CHECKLIST,
        ]
      },
      {
        path: '/warehouse/stock',
        title: 'Voorraad',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VIEW_INVENTORY,
        ]
      },
    ],
  },
  {
    path: '/reports',
    title: 'Rapportage',
    icon: 'attach_money',
    roles: [
      EnumRoles.VIEW_REPORTS,
      EnumRoles.VIEW_FINANCIAL,
    ],
    children: [
      {
        path: '/reports/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.VIEW_REPORTS
        ]
      },
      {
        path: '/reports/financieel',
        title: 'Financieel',
        icon: 'attach_money',
        roles: [
          EnumRoles.VIEW_FINANCIAL
        ]
      },
    ],
  },
  // {
  //   path: '/hrm',
  //   title: 'HRM',
  //   icon: 'supervised_user_circle',
  //   roles: [
  //     EnumRoles.ONTWIKKELINGEN_BEHEREN
  //   ],
  //   children: [
  //     {
  //       path: '/hrm/medewerkers',
  //       title: 'Medewerkers',
  //       icon: 'group',
  //       roles: [
  //         EnumRoles.ONTWIKKELINGEN_BEHEREN
  //       ]
  //     },
  //   ],
  // },
  {
    path: '/admin',
    title: 'Beheer',
    icon: 'supervised_user_circle',
    roles: [
      EnumRoles.MANAGE_FORMS,
      EnumRoles.MANAGE_NEWS,
      EnumRoles.READ_EMPLOYEES
    ],
    children: [
      {
        path: '/admin/forms',
        title: 'Formulieren',
        icon: 'edit_document',
        roles: [
          EnumRoles.MANAGE_FORMS
        ]
      },
      {
        path: '/admin/news',
        title: 'Berichten',
        icon: 'message',
        roles: [
          EnumRoles.MANAGE_NEWS
        ]
      },
      // {
      //   path: '/admin/roles',
      //   title: 'Rollen',
      //   icon: 'supervisor_account',
      //   roles: [
      //     EnumRoles.ROLLEN_BEHEREN,
      //   ]
      // },
      {
        path: '/admin/employees',
        title: 'Medewerkers',
        icon: 'group',
        roles: [
          EnumRoles.READ_EMPLOYEES,
        ]
      }
    ],
  }
]
