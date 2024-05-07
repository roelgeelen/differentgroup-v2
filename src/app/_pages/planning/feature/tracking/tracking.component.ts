import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker, MapTrafficLayer} from "@angular/google-maps";
import {AsyncPipe, DatePipe} from "@angular/common";
import {EnumRoles} from "../../../../_auth/models/enumRoles";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {User} from "../../../../_auth/models/User";
import {PlanningService} from "../../data-access/planning.service";
import {forkJoin, map, Observable} from "rxjs";
import {IVehicle} from "../../utils/vehicle.interface";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker,
    MapInfoWindow,
    MapTrafficLayer,
    AsyncPipe,
    DatePipe,
    MatIcon
  ],
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  @ViewChildren('somemarker') components!: QueryList<MapMarker>;
  @ViewChild(MapInfoWindow) info!: MapInfoWindow
  markers$: Observable<any>;
  infoContent: IVehicle | null = null;
  currentUser: User | undefined;
  height = window.innerHeight - 200;
  center: google.maps.LatLngLiteral = {
    lat: 52.040450,
    lng: 5.413727,
  }
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    maxZoom: 20,
    minZoom: 6
  }

  constructor(private authService: AuthenticationService, private planningService: PlanningService) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
    const observables = [];

    if (this.canViewBusses) {
      observables.push(this.planningService.getTracking("6f15c4e6071b574e8604dca070c98843"));
    }

    if (this.canViewCars) {
      observables.push(this.planningService.getTracking("2096391f65c25addbe6c2a5a8170353c"));
    }
    this.markers$ = forkJoin(observables).pipe(
      map((vehicles: any) => {
        return vehicles.flat().map((v: any) => {
          console.log(v)
          if (v.location) {
            return {
              position: {
                lat: +v.location.latitude,
                lng: +v.location.longitude,
              },
              vehicle: v,
              options: {
                icon: {
                  url: this.encodeSVG(
                    v.organization.id === '2096391f65c25addbe6c2a5a8170353c' ?
                      this.generateCarMarker(v.alias, v.location.course, v.location.in_movement) :
                      this.generateBusMarker(v.alias, v.location.course, v.location.in_movement)
                  ),
                  anchor: new google.maps.Point(25, 15),
                },
                anchorPoint: new google.maps.Point(0, -15)
              },
            }
          } else {
            return null; // Om ongedefinieerde waarden te voorkomen, retourneer null als er geen locatie is
          }
        }).filter((v: any) => v !== null); // Filter null-waarden uit de resulterende array
      })
    )
  }

  get canViewCars() {
    return this.currentUser && (this.currentUser.roles.indexOf(EnumRoles.AFSPRAKEN) !== -1);
  }

  get canViewBusses() {
    return this.currentUser && (this.currentUser.roles.indexOf(EnumRoles.TRACKING) !== -1);
  }

  openInfo(marker: MapMarker | undefined, content: IVehicle) {
    this.infoContent = content;
    this.info.open(marker)
  }

  encodeSVG(rawSvgString: string): string {
    const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

    // Use single quotes instead of double to avoid URI encoding
    rawSvgString = rawSvgString
      .replace(/'/g, '"')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ');

    return (
      'data:image/svg+xml;utf-8,' +
      rawSvgString.replace(symbols, encodeURIComponent)
    );
  }

  generateBusMarker(name: string, rotation: number, in_movement: boolean) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="45"  viewBox="40 0 71 45" fill="none">
      <style type="text/css">
      .car{transform:rotate(${rotation}deg);transform-box: fill-box;transform-origin: center;}
      .st0{fill:#EDEDED;stroke:#000000;stroke-miterlimit:10;}
      .st1{fill:${in_movement ? '#06b085' : '#d3d3d3'};stroke:#000000;stroke-miterlimit:10;}
      .st2{fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10;}
      </style>
      <g class="car">
        <path class="st0" d="M2.63,12.08c-0.6,0.09-1.12,0.16-1.63,0.26c-0.31,0.06-0.43-0.05-0.47-0.35c-0.09-0.69,0.07-0.96,0.73-1.2
        c0.35-0.13,0.7-0.28,1.06-0.39c0.26-0.08,0.33-0.22,0.33-0.48C2.62,8.74,2.64,7.57,2.63,6.41C2.6,3.97,3.76,2.3,5.94,1.34
        c2.61-1.15,5.25-1.12,7.83,0.09c2.04,0.96,3.13,2.59,3.12,4.89c-0.01,1.17,0.02,2.34-0.01,3.51c-0.01,0.36,0.12,0.52,0.45,0.62
        c0.36,0.1,0.71,0.24,1.06,0.38c0.59,0.23,0.85,0.8,0.57,1.35c-0.05,0.1-0.3,0.16-0.44,0.15c-0.52-0.05-1.04-0.15-1.62-0.24
        c0,0.23,0,0.4,0,0.58c0,5.49,0,10.98,0,16.48c0,1.11-0.56,1.67-1.66,1.67c-3.6,0-7.21-0.03-10.81,0.02c-1.29,0.02-1.84-0.8-1.79-1.9
        c0.04-0.82,0-1.64,0-2.46c0-4.63,0-9.27,0-13.9C2.63,12.42,2.63,12.28,2.63,12.08z"/>
        <path class="st1" d="M9.81,9.7c3.69,0,5.82,1.31,5.82,1.52c0,0,0,11.87,0,17.01c0,0.1-0.2,0.31-0.3,0.31c-3.69,0-7.39,0-11.08,0
        c-0.1,0-0.31-0.2-0.31-0.31c0-5.17,0-17,0-17C3.94,10.91,6.11,9.7,9.81,9.7z"/>
        <path class="st2" d="M5.28,10.38c3-0.91,5.95-0.91,8.96,0c0.35-0.77,0.73-1.58,1.08-2.41c0.04-0.09-0.08-0.32-0.18-0.36
        c-0.59-0.26-1.18-0.57-1.81-0.72c-2.12-0.52-4.27-0.55-6.41-0.15C6.05,6.9,5.21,7.3,4.35,7.62C4.26,7.66,4.15,7.9,4.19,7.98
        C4.54,8.81,4.93,9.62,5.28,10.38z"/>
        <path class="st2" d="M6.65,2.73C6.59,2.29,6.39,2.12,6.02,2.27c-0.63,0.27-1.13,0.7-1.44,1.32C4.42,3.93,4.56,4.28,4.9,4.48
        c0.33,0.2,0.79,0.2,0.95-0.09C6.15,3.86,6.39,3.28,6.65,2.73z"/>
        <path class="st2" d="M12.96,2.67c-0.04,0.02,0.43,1.22,0.77,1.77c0.16,0.27,0.65,0.25,0.95,0.01c0.27-0.21,0.43-0.49,0.26-0.84
        c-0.3-0.63-0.8-1.06-1.43-1.33C13.14,2.12,12.95,2.27,12.96,2.67z"/>
      </g>
      <rect width="${15 + (name.length * 6)}" height="22" rx="10" x="25" y="5" fill="#cb372b"/>
      <text x="30" y="20"
            text-anchor="start" fill="#FFF"
            font-size="12px" font-family="sans-serif" font-weight="bold">
            ${name}
      </text>
    </svg>`;
  }

  generateCarMarker(name: string, rotation: number, in_movement: boolean) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="45"  viewBox="40 0 71 45" fill="none">
      <style type="text/css">
        .car{transform:rotate(${rotation}deg);transform-box: fill-box;transform-origin: center;}
        .st0{fill:#EDEDED;stroke:#000000;stroke-width:0.7;stroke-miterlimit:10;}
        .st1{fill:#F6F6F6;stroke:#000000;stroke-width:0.7;stroke-miterlimit:10;}
        .st2{fill:${in_movement ? '#06b085' : '#d3d3d3'};stroke:#000000;stroke-width:0.7;stroke-miterlimit:10;}
      </style>
      <g class="car">
      <path class="st0" d="M17.13,12.24c0,0.2,0,0.37,0,0.53c0,4.92-0.02,9.83,0.01,14.75c0.01,1.4-0.62,2.31-1.79,2.95
        c-1.5,0.81-3.13,1.1-4.81,1.17c-1.92,0.08-3.82-0.1-5.61-0.86c-0.98-0.42-1.89-0.96-2.26-2.06c-0.09-0.28-0.14-0.58-0.14-0.87
        C2.53,22.83,2.53,17.82,2.53,12.8c0-0.18,0-0.36,0-0.59c-0.59,0.09-1.13,0.15-1.65,0.26c-0.33,0.07-0.46-0.02-0.51-0.36
        c-0.09-0.68,0.06-0.96,0.71-1.21c0.28-0.11,0.55-0.26,0.84-0.31c0.54-0.09,0.64-0.39,0.62-0.89c-0.04-1.11,0-2.22-0.01-3.33
        C2.51,3.94,3.66,2.24,5.81,1.26C8.58,0,11.4,0.04,14.13,1.4c1.66,0.83,2.77,2.15,2.9,4.07c0.1,1.44,0.09,2.9,0.09,4.35
        c0,0.4,0.09,0.62,0.5,0.72c0.36,0.09,0.7,0.23,1.04,0.37c0.59,0.23,0.83,0.79,0.58,1.36c-0.05,0.1-0.27,0.2-0.4,0.19
        c-0.49-0.05-0.98-0.14-1.48-0.22C17.32,12.24,17.26,12.24,17.13,12.24z"/>
      <path class="st1" d="M13.95,13.63c0.53-1.12,1.04-2.21,1.57-3.3c0.11-0.22,0.1-0.37-0.15-0.47c-0.66-0.26-1.3-0.6-1.98-0.76
        c-2.37-0.57-4.76-0.55-7.14,0c-0.78,0.18-1.56,0.41-2.21,0.96c0.28,0.61,0.55,1.2,0.83,1.79c0.28,0.6,0.57,1.19,0.85,1.79
        C7.68,12.67,11.87,12.64,13.95,13.63z"/>
      <path class="st1" d="M13.58,25.16c-2.53,0.73-4.99,0.72-7.5,0.01c-0.42,0.66-0.87,1.34-1.28,2.03c-0.04,0.07,0.06,0.33,0.15,0.38
        c0.38,0.19,0.77,0.38,1.17,0.5c2.32,0.65,4.66,0.65,7,0.11c0.65-0.15,1.27-0.36,1.84-0.8C14.5,26.62,14.04,25.89,13.58,25.16z"/>
      <path class="st1" d="M15.76,13.24c-0.04,0-0.07-0.01-0.11-0.01c-0.35,0.54-0.75,1.06-1.03,1.62c-0.22,0.43-0.4,0.9-0.41,1.35
        c-0.04,1.91,0.04,3.82-0.04,5.73c-0.04,1.05,0.98,1.66,1.58,2.45C15.76,20.66,15.76,16.95,15.76,13.24z"/>
      <path class="st1" d="M3.9,24.38c0.03,0.01,0.06,0.02,0.09,0.02c0.35-0.46,0.75-0.9,1.04-1.38c0.19-0.3,0.33-0.66,0.33-1
        c0.05-1.61-0.05-3.22,0.08-4.82c0.12-1.5-0.61-2.74-1.55-4.08C3.9,16.95,3.9,20.66,3.9,24.38z"/>
      <path class="st1" d="M6.9,2.68c0-0.42-0.15-0.51-0.55-0.37C5.3,2.67,4.56,3.37,4.1,4.37C3.93,4.75,4.04,5.11,4.4,5.32
        c0.39,0.23,0.83,0.17,1.06-0.17c0.38-0.58,0.75-1.17,1.11-1.76C6.72,3.13,6.82,2.85,6.9,2.68z"/>
      <path class="st1" d="M13.18,2.23c-0.52,0.08-0.46,0.38-0.34,0.59c0.47,0.83,0.96,1.64,1.47,2.44c0.06,0.1,0.24,0.15,0.37,0.18
        c0.37,0.07,0.73-0.08,0.86-0.4c0.1-0.23,0.07-0.62-0.07-0.83c-0.35-0.51-0.75-1-1.21-1.4C13.94,2.52,13.49,2.38,13.18,2.23z"/>
      <path class="st2" d="M13.84,24.97c-1.73,0.65-3.24,0.73-4,0.73c-0.68,0-2.28-0.05-4.13-0.75c-0.03-0.01-0.07-0.13-0.07-0.13
        c0-3.66,0-7.31,0-10.97c0,0,0.03-0.1,0.06-0.11c0,0,0.63-0.32,1.31-0.52c1.01-0.3,2.73-0.31,2.87-0.31c2.73,0,3.65,0.57,4.02,0.84
        c0.03,0.02,0.07,0.15,0.07,0.15c0,0.64,0,7.21,0,10.9C13.97,24.79,13.9,24.95,13.84,24.97z"/></g>
      <rect width="${20 + (name.length * 6)}" height="22" rx="10" x="25" y="5" fill="#cb372b"/>
      <text x="30" y="20"
            text-anchor="start" fill="#FFF"
            font-size="12px" font-family="sans-serif" font-weight="bold">
            ${name}
      </text>
    </svg>`;
  }
}
