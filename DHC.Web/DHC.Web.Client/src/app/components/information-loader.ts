/** Defines a component that requires some period of time to load resources. */
export interface InformationLoader {
  /** Indicates if the object is currently loading resources. */
  loading: boolean;
}
