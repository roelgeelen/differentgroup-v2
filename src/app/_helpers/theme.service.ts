import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


export interface Theme {
  name: string;
  displayName: string;
  image?: string;
  accent?: string;
  primary?: string;
  isDark?: boolean;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  static defaultTheme: Theme =   {
    displayName: 'Different Doors',
    name: 'different-doors-theme',
    image: 'assets/images/logo_zwart.png',
    isDark: false,
  };

  themes: Theme[] = [
    ThemeService.defaultTheme,
    {
      displayName: 'Ambassa',
      name: 'ambassa-theme',
      image: 'assets/images/logo.png',
      isDark: true,
    }
  ];

  private themeSUB = new BehaviorSubject(ThemeService.defaultTheme); // stores the current theme
  themeOBS = this.themeSUB.asObservable();

  constructor() {
  }

  updateTheme(theme: Theme): void {
    this.themeSUB.next(theme);
  }

  findTheme(themeName: string): Theme | undefined {
    return this.themes.find(currentTheme => currentTheme.name === themeName);
  }
}
