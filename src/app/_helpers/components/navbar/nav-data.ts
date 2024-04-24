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
    path: '/verkoop',
    title: 'Verkoop',
    icon: 'dashboard',
    roles: [
      EnumRoles.AFSPRAKEN,
      EnumRoles.INMETEN,
      EnumRoles.FORMULIEREN
    ],
    children: [
      {
        path: '/verkoop/afspraken',
        title: 'Afspraken',
        icon: 'map',
        roles: [
          EnumRoles.AFSPRAKEN,
        ]
      },
      {
        path: '/verkoop/inmeten',
        title: 'Inmeten',
        icon: 'table_chart',
        roles: [
          EnumRoles.INMETEN,
        ]
      },
      {
        path: '/customers',
        title: 'Formulieren',
        icon: 'description',
        roles: [
          EnumRoles.FORMULIEREN,
          EnumRoles.FORMULIEREN_KLANT,
        ]
      },
      // {
      //   extern: true,
      //   path: 'https://wonderful-ground-054d07e03.4.azurestaticapps.net/customers',
      //   title: 'Formulieren (V2)',
      //   icon: 'description',
      //   roles: [
      //     EnumRoles.FORMULIEREN_BEHEREN,
      //   ]
      // },
      {
        path: '/verkoop/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.INMETEN,
        ]
      }
    ],
  },
  {
    path: '/planning',
    title: 'Planning',
    icon: 'insert_chart_outlined',
    roles: [
      EnumRoles.TRACKING,
      EnumRoles.AFSPRAKEN,
      EnumRoles.PRODUCTIE,
      EnumRoles.GEPRODUCEERD,
    ],
    children: [
      {
        path: '/planning/tracking',
        title: 'Tracking',
        icon: 'maps',
        roles: [
          EnumRoles.TRACKING,
          EnumRoles.AFSPRAKEN,
        ]
      },
      {
        path: '/planning/productie',
        title: 'Productie',
        icon: 'bar_chart',
        roles: [
          EnumRoles.PRODUCTIE,
        ]
      },
      {
        path: '/planning/geproduceerd',
        title: 'Geproduceerd',
        icon: 'bar_chart',
        roles: [
          EnumRoles.GEPRODUCEERD,
        ]
      },
    ],
  },
  {
    path: '/magazijn',
    title: 'Magazijn',
    icon: 'supervised_user_circle',
    roles: [
      EnumRoles.LOGISTIEK,
      EnumRoles.CONTROLE,
      EnumRoles.VOORRAAD,
      EnumRoles.BESTELLINGEN_BEHEREN
    ],
    children: [
      {
        path: '/magazijn/logistiek',
        title: 'Logistiek',
        icon: 'calendar_today',
        roles: [
          EnumRoles.LOGISTIEK,
        ]
      },
      {
        path: '/magazijn/controle',
        title: 'Controle',
        icon: 'playlist_add_check',
        roles: [
          EnumRoles.CONTROLE,
        ]
      },
      {
        path: '/magazijn/voorraad',
        title: 'Voorraad',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VOORRAAD,
        ]
      },
      {
        path: '/magazijn/bestellingen',
        title: 'Bestellingen',
        icon: 'storage',
        roles: [
          EnumRoles.BESTELLINGEN_BEHEREN,
        ]
      }
    ],
  },
  {
    path: '/rapportage',
    title: 'Rapportage',
    icon: 'attach_money',
    roles: [
      EnumRoles.RAPPORTAGE,
      EnumRoles.FINANCIEEL
    ],
    children: [
      {
        path: '/rapportage/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.RAPPORTAGE
        ]
      },
      {
        path: '/rapportage/financieel',
        title: 'Financieel',
        icon: 'attach_money',
        roles: [
          EnumRoles.FINANCIEEL
        ]
      },
    ],
  },
  {
    path: '/hrm',
    title: 'HRM',
    icon: 'supervised_user_circle',
    roles: [
      EnumRoles.ONTWIKKELINGEN_BEHEREN
    ],
    children: [
      {
        path: '/hrm/medewerkers',
        title: 'Medewerkers',
        icon: 'group',
        roles: [
          EnumRoles.ONTWIKKELINGEN_BEHEREN
        ]
      },
    ],
  },
  {
    path: '/admin',
    title: 'Beheer',
    icon: 'supervised_user_circle',
    roles: [
      EnumRoles.FORMULIEREN_BEHEREN,
      EnumRoles.BERICHTEN_BEHEREN,
      EnumRoles.ROLLEN_BEHEREN
    ],
    children: [
      {
        path: '/admin/forms',
        title: 'Formulieren beheren',
        icon: 'edit_document',
        roles: [
          EnumRoles.FORMULIEREN_BEHEREN
        ]
      },
      {
        path: '/admin/nieuws',
        title: 'Berichten',
        icon: 'message',
        roles: [
          EnumRoles.BERICHTEN_BEHEREN
        ]
      },
      {
        path: '/admin/roles',
        title: 'Rollen',
        icon: 'supervisor_account',
        roles: [
          EnumRoles.ROLLEN_BEHEREN,
        ]
      }
    ],
  }
]
