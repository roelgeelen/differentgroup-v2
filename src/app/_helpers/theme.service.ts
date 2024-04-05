import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface ITheme {
  name: string;
  displayName: string;
  imageDark?: string;
  imageLight?: string;
  accent?: string;
  primary?: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme$ = new BehaviorSubject<ITheme>(ThemeService.defaultTheme); // stores the current theme

  static defaultTheme: ITheme = {
    displayName: 'Different Doors',
    name: 'different-doors-theme',
    imageDark: 'assets/images/logo_zwart.png',
    imageLight: 'assets/images/logo.png',
  };
  themes: ITheme[] = [
    ThemeService.defaultTheme,
    {
      displayName: 'Ambassa',
      name: 'ambassa-theme',
      imageDark: 'assets/images/ambassa_zwart.svg',
      imageLight: 'assets/images/ambassa.svg',
    }
  ];

  constructor() {
  }

  updateTheme(theme: ITheme): void {
    this.theme$.next(theme);
  }

  findTheme(themeName: string): ITheme | undefined {
    return this.themes.find(currentTheme => currentTheme.name === themeName);
  }
}
