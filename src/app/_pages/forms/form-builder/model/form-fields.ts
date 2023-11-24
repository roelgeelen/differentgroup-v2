import {ValidatorFn} from "@angular/forms";

export interface FormControlBase {
  id?: string;
  name: string;
  type: 'text' | 'checkbox' | 'dropdown' | 'radio' | 'textarea';
  icon: string,
  element: {
    image?: string;
    label?: string;
    title?: string;
    placeholder?: string;
    options?: {
      value: string
    }[]
  };
}


export const formFields: FormControlBase[] = [
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
        {value:'Optie 1'}
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
        {value:'Optie 1'}
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
      placeholder: ''
    }
  }
]
