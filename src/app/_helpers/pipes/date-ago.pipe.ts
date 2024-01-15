import { Pipe, PipeTransform } from '@angular/core';

interface TijdIntervallen {
  jaar: number;
  maand: number;
  week: number;
  dag: number;
  uur: number;
  minuut: number;
  seconde: number;
}

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: true
})
export class DateAgoPipe implements PipeTransform {
  private intervallen: TijdIntervallen = {
    jaar: 31536000,
    maand: 2592000,
    week: 604800,
    dag: 86400,
    uur: 3600,
    minuut: 60,
    seconde: 1
  };

  transform(value: any, showDateAfterWeek?: boolean): any {
    if (value) {
      const seconden = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconden < 30) {
        return 'Zojuist';
      }
      if (showDateAfterWeek && seconden >= this.intervallen.week) {
        const date = new Date(value);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
      const intervalEntries = Object.entries(this.intervallen);
      for (const [eenheid, interval] of intervalEntries) {
        const teller = Math.floor(seconden / interval);
        if (teller > 0) {
          return this.getTijdVerstrekenString(teller, eenheid);
        }
      }
    }
    return value;
  }

  private getTijdVerstrekenString(teller: number, eenheid: string): string {
    const eenheidString = this.getMeervoudsvorm(teller, eenheid);
    return `${teller} ${eenheidString} geleden`;
  }

  private getMeervoudsvorm(teller: number, eenheid: string): string {
    if (teller === 1) {
      return eenheid;
    } else {
      switch (eenheid) {
        case 'jaar':
          return 'jaren';
        case 'maand':
          return 'maanden';
        case 'week':
          return 'weken';
        case 'dag':
          return 'dagen';
        case 'uur':
          return 'uur';
        case 'minuut':
          return 'minuten';
        case 'seconde':
          return 'seconden';
        default:
          return eenheid;
      }
    }
  }
}
