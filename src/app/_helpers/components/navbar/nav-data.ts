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
      EnumRoles.AFSPRAKEN,
      EnumRoles.INMETEN,
      EnumRoles.FORMULIEREN
    ],
    children: [
      {
        path: '/sales/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.INMETEN,
        ]
      },
      {
        path: '/sales/inmeten',
        title: 'Inmeten',
        icon: 'table_chart',
        roles: [
          EnumRoles.INMETEN,
        ]
      },
      {
        path: '/customers',
        title: 'Formulieren (V2)',
        icon: 'description',
        roles: [
          EnumRoles.FORMULIEREN,
          EnumRoles.FORMULIEREN_KLANT,
        ]
      },
      {
        path: '/verkoop/formulier',
        title: 'Formulieren',
        icon: 'description',
        roles: [
          EnumRoles.FORMULIEREN,
          EnumRoles.FORMULIEREN_KLANT,
        ]
      },
      {
        path: '/verkoop/afspraken',
        title: 'Afspraken',
        icon: 'map',
        roles: [
          EnumRoles.AFSPRAKEN,
        ]
      },
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
        path: '/planning/production',
        title: 'Productie',
        icon: 'bar_chart',
        roles: [
          EnumRoles.PRODUCTIE,
        ]
      },
      {
        path: '/planning/produced',
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
    ],
    children: [
      {
        path: '/warehouse/logistic',
        title: 'Logistiek',
        icon: 'calendar_today',
        roles: [
          EnumRoles.LOGISTIEK,
        ]
      },
      {
        path: '/warehouse/checklist',
        title: 'Controle',
        icon: 'playlist_add_check',
        roles: [
          EnumRoles.CONTROLE,
        ]
      },
      {
        path: '/warehouse/stock',
        title: 'Voorraad',
        icon: 'bar_chart',
        roles: [
          EnumRoles.VOORRAAD,
        ]
      },
    ],
  },
  {
    path: '/reports',
    title: 'Rapportage',
    icon: 'attach_money',
    roles: [
      EnumRoles.RAPPORTAGE,
      EnumRoles.FINANCIEEL
    ],
    children: [
      {
        path: '/reports/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        roles: [
          EnumRoles.RAPPORTAGE
        ]
      },
      {
        path: '/reports/financieel',
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
        title: 'Formulieren',
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
