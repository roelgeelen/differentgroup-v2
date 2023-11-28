import {ValidatorFn} from "@angular/forms";

export interface FormControlBase {
  id?: string;
  name: string;
  type: 'title' |'text' | 'checkbox' | 'dropdown' | 'radio' | 'textarea' | 'column';
  icon: string,
  components?: any[][]
  element: {
    columns?: 2 | 3;
    image?: string;
    label?: string;
    title?: string;
    placeholder?: string;
    options?: {
      value: string;
      image?: string;
    }[],
  };
}


export const formFields: FormControlBase[] = [
  {
    name: "Titel",
    type: "title",
    icon: "title",
    element: {
      title: 'Titel',
    }
  },
  {
    name: "Text veld",
    type: "text",
    icon: "input",
    element: {
      label: 'Label',
      title: 'Titel',
      placeholder: ''
    }
  },
  {
    name: "Enkele keuze",
    type: "radio",
    icon: "radio_button_checked",
    element: {
      label: 'Label',
      options: [
        {value:'Optie 1'},
        {value:'Optie 2'}
      ]
    }
  },
  {
    name: "Meerkeuze",
    type: "checkbox",
    icon: "check_box",
    element: {
      label: 'Label',
      options: [
        {value:'Optie 1'},
        {value:'Optie 2'}
      ]
    }
  },
  {
    name: "Textarea",
    type: "textarea",
    icon: "notes",
    element: {
      label: 'Label',
      title: 'Titel',
      placeholder: 'Type hier je tekst...'
    }
  },
  {
    name: "Dropdown",
    type: "dropdown",
    icon: "arrow_downward",
    element: {
      label: 'Label',
      options: [
        {value:'Optie 1'},
        {value:'Optie 2'}
      ]
    }
  },
  {
    name: "Kolom",
    type: "column",
    icon: "view_column",
    components: [],
    element: {
      columns: 2,
      label: 'Label',
    }
  },
]
