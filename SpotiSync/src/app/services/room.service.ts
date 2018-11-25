import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomId;
  
  constructor() { }

  public setRoomId(roomId: string) {
    this.roomId = roomId;
  }

  public getRoomId() {
    return this.roomId;
  }
}
