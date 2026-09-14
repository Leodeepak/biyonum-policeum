import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Player, RoomState } from '../types/game';

const roomsCollection = collection(db, 'rooms');

export async function createFirestoreRoom(
  room: RoomState
): Promise<void> {
  const roomRef = doc(roomsCollection, room.code);

  await setDoc(roomRef, {
    ...room,
    secretRoles: {},
    policeId: null,
    thiefId: null,
  });
}

export async function getFirestoreRoom(
  roomCode: string
): Promise<RoomState | null> {
  const roomRef = doc(roomsCollection, roomCode);
  const snapshot = await getDoc(roomRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as RoomState;
}

export async function joinFirestoreRoom(
  roomCode: string,
  player: Player
): Promise<RoomState> {
  const room = await getFirestoreRoom(roomCode);

  if (!room) {
    throw new Error('Room not found');
  }

  if (room.players.length >= room.settings.playerCount) {
    throw new Error('Room is full');
  }

  if (room.screenPhase !== 'LOBBY') {
    throw new Error('Game has already started');
  }

  const updatedPlayers = [...room.players, player];

  await updateDoc(doc(roomsCollection, roomCode), {
    players: updatedPlayers,
  });

  return {
    ...room,
    players: updatedPlayers,
  };
}

export function subscribeToFirestoreRoom(
  roomCode: string,
  onRoomUpdate: (room: RoomState) => void
): () => void {
  const roomRef = doc(roomsCollection, roomCode);

  return onSnapshot(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    onRoomUpdate(snapshot.data() as RoomState);
  });
}