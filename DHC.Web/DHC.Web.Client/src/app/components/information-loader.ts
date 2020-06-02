import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

/** Defines a component that requires some period of time to load resources. */
export abstract class InformationLoaderComponent implements OnDestroy {
  /** Indicates if the object is currently loading resources. */
  public loading: boolean;

  /** Subject that let's other subjects know that the component is being destroyed */
  public unsubscribe$: Subject<void>;

  constructor() {
    this.loading = true;
    this.unsubscribe$ = new Subject<void>();
  }

  /** Simple fix for possible angular memory leaks. */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
