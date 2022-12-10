import { EventModel } from '../graphql-data/models';

export class LocalCache {
  private _cache: EventModel[] = [];

  public get() {
    return this._cache;
  }

  public set(events: EventModel[]) {
    this._cache = [...events];
  }

  public clear() {
    this._cache = [];
  }
}
