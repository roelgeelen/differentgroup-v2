// export enum EnumRoles {
//   PRODUCTIE = 'Productie',//
//   INMETEN = 'Inmeten',//
//   FORMULIEREN_KLANT = 'Formulieren_klant',//hjhjk
//   TRACKING = 'Tracking',//
//   GEPRODUCEERD = 'Geproduceerd',
//   FORMULIEREN = 'Formulieren',
//   FORMULIEREN_BEHEREN = 'Formulieren_beheren',
//   FORMULIEREN_BEKIJKEN = 'Formulieren_bekijken',
//   CONTROLE = 'Controle',
//   VOORRAAD = 'Voorraad',
//   BERICHTEN_BEHEREN = 'Berichten_beheren',
//   AFSPRAKEN = 'Afspraken',
//   LOGISTIEK = 'Logistiek',
//   RAPPORTAGE = 'Rapportage',
//   FINANCIEEL = 'Financieel',
//   ROLLEN_BEHEREN = 'Rollen_beheren',
//   WIDGETS = 'Widgets',
//   ONTWIKKELINGEN_BEHEREN = 'Ontwikkelingen_beheren'
// }

export enum EnumRoles {
  //pages
  VIEW_PRODUCTION = 'view:production',
  VIEW_MEASUREMENT = 'view:measurement',
  VIEW_TRACKING = 'view:tracking',
  VIEW_PRODUCED = 'view:produced',
  VIEW_INVENTORY = 'view:inventory',
  VIEW_LOGISTICS = 'view:logistics',
  VIEW_REPORTS = 'view:reports',
  VIEW_FINANCIAL = 'view:financial',

  //forms
  READ_CONFIGURATIONS = 'read:configurations',
  EDIT_CONFIGURATIONS = 'edit:configurations',
  SUPER_CONFIGURATIONS = 'super:configurations',
  MANAGE_FORMS = 'manage:forms',


  MANAGE_NEWS = 'manage:news',
  READ_CHECKLIST = 'read:checklist',
  EDIT_CHECKLIST = 'edit:checklist',
  READ_APPOINTMENTS = 'read:appointments',

  //homepage
  READ_NEWS = 'read:news',
  READ_CALENDAR = 'read:calendar',

  ONTWIKKELINGEN_BEHEREN = 'Ontwikkelingen_beheren'
}
