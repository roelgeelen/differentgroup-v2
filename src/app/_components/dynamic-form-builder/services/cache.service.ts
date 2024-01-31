import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {FormService} from "./form.service";

@Injectable({providedIn: 'root'})
export class CacheService {
  private destroy$ = new Subject<void>();
  originalForm?: any;
  hasChanges$ = new BehaviorSubject<boolean>(false);

  constructor(private formService: FormService) {
  }

  onInit() {
    this.formService.formGroup$.pipe(takeUntil(this.destroy$)).subscribe(f => {
      this.hasChanges$.next(false);
      this.originalForm = f.getRawValue();
      f.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
        this.hasChanges$.next(JSON.stringify(this.originalForm) !== JSON.stringify(v))
      });
    });
  }

  clearCache() {
    this.hasChanges$.next(false);
  }

  onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
