import { Exceptions, Repo, RepoResponse } from "../models/model";


export class RepoClass<T extends { id: string }> implements Repo<T> {
  protected store: T[]
  constructor(store: T[]) {
    this.store = store
  }

  Save(payload: T) {
    this.store.map((val,index) => {
      if (val.id === payload.id){
        this.store[index] = payload
      }
    })
  }

  Create(payload: T): T {
    this.store.push(payload)
    return payload
  }

  Update(payload: T): RepoResponse<T> {
    const index = this.store.findIndex(prev => prev.id === payload.id)
    if (index !== -1) {
      this.store[index] = payload
      return payload
    } else {
      return Exceptions.NOT_FOUND
    }
  }

  Delete(id: string): RepoResponse<T> {
    const res = this.Find(id)
    if (res !== Exceptions.NOT_FOUND) {
      this.store.filter(prev => prev.id !== id)
    }
    return res
  };

  Find(id: string): RepoResponse<T> {
    const index = this.store.findIndex(prev => prev.id === id)
    if (index !== -1) {
      return this.store[index]
    } else {
      return Exceptions.NOT_FOUND
    }
  };

  FindAll() : T[] {
    return this.store
  }
}