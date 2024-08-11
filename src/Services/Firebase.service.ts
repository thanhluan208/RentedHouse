import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  Firestore,
  arrayUnion,
  writeBatch,
  arrayRemove,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { HouseInitValues } from "../Components/DefaultLayout/Components/CreateHouseButton";
import {
  GuestInit,
  RoomInitValues,
} from "../Pages/HouseDetail/components/AddRoomButton";
import { RoomDetail } from "../Hooks/useGetRoomDetail";
import { v4 as uuid } from "uuid";
import { GuestInitValue } from "../Pages/Guest/components/AddGuestButton";

export type FailureCallback = (error: any) => void;

class FirebaseService {
  auth: Auth;
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCunGRfUah_E9fsLoJ4guSvui4j01UE7FA",
      authDomain: "rentedhouse-ea645.firebaseapp.com",
      projectId: "rentedhouse-ea645",
      storageBucket: "rentedhouse-ea645.appspot.com",
      messagingSenderId: "63947314812",
      appId: "1:63947314812:web:d9f9a633b516d851e81bf9",
    };

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  getHouses = async (onFailed?: FailureCallback) => {
    try {
      let q = query(collection(this.db, "houses"));

      const querySnapShot = await getDocs(q);

      const data = [];

      for (const doc of querySnapShot.docs) {
        const docData = doc.data();
        data.push({
          ...docData,
          id: doc.id,
        });
      }

      return data;
    } catch (error) {
      console.log("err", error);
      onFailed && onFailed(error);
    }
  };

  createHouse = async (
    payload: HouseInitValues,
    onFailed?: FailureCallback
  ) => {
    try {
      const response = await addDoc(collection(this.db, "houses"), {
        ...payload,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return response;
    } catch (error) {
      console.log("Create house err:", error);
      onFailed && onFailed(error);
    }
  };

  deleteHouse = async (id: string, onFailed?: FailureCallback) => {
    try {
      const houseRef = doc(this.db, "houses", id);
      if (houseRef) {
        return await deleteDoc(houseRef);
      }
    } catch (error) {
      console.log("Delete house err:", error);
      onFailed && onFailed(error);
    }
  };

  updateHouse = async (
    payload: HouseInitValues,
    onFailed?: FailureCallback
  ) => {
    try {
      if (!payload?.id) return;
      const houseRef = doc(this.db, "houses", payload.id);
      if (houseRef) {
        return await updateDoc(houseRef, {
          ...payload,
          updatedAt: Timestamp.now(),
        } as any);
      }
    } catch (error) {
      console.log("Update house err:", error);
      onFailed && onFailed(error);
    }
  };

  getHouseDetail = async (id: string) => {
    try {
      const houseRef = doc(this.db, "houses", id);
      if (!houseRef) return;
      const querySnapShot = await getDoc(houseRef);

      const data = querySnapShot.data();
      return {
        ...data,
        id: querySnapShot.id,
      };
    } catch (error) {
      console.log("err", error);
    }
  };

  getRoomDetail = async (id: string) => {
    try {
      const roomRef = doc(this.db, "rooms", id);
      if (!roomRef) return;
      const querySnapShot = await getDoc(roomRef);

      const data = querySnapShot.data();
      return {
        ...data,
        id: querySnapShot.id,
      };
    } catch (error) {
      console.log("err", error);
    }
  };

  getRoomByHouse = async (houseId: string) => {
    try {
      console.log('houseId', houseId)
      let q = query(
        collection(this.db, "rooms"),
        where("house_id", "==", houseId)
      );

      const querySnapShot = await getDocs(q);

      const data = [];

      for (const doc of querySnapShot.docs) {
        const docData = doc.data();
        data.push({
          ...docData,
          id: doc.id,
        });
      }

      return data;
    } catch (error) {
      console.log("err", error);
    }
  };

  getGuests = async (onFailed?: FailureCallback) => {
    try {
      let q = query(collection(this.db, "guest"));

      const querySnapShot = await getDocs(q);

      const data = [];

      for (const doc of querySnapShot.docs) {
        const docData = doc.data();
        data.push({
          ...docData,
          id: doc.id,
        });
      }

      return data;
    } catch (error) {
      console.log("err", error);
      onFailed && onFailed(error);
    }
  };

  addRoom = async (payload: RoomInitValues, onFailed?: FailureCallback) => {
    try {
      const response = await addDoc(collection(this.db, "rooms"), {
        ...payload,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const houseRef = doc(this.db, "houses", payload.house_id);
      if (houseRef) {
        await updateDoc(houseRef, {
          rooms: arrayUnion(response.id),
          updatedAt: Timestamp.now(),
        });
      }

      return response;
    } catch (error) {
      console.log("Add room err: ", error);
      onFailed && onFailed(error);
    }
  };

  updateRoom = async (payload: any, onFailed?: FailureCallback) => {
    try {
      const roomRef = doc(this.db, "rooms", payload.id);
      if (roomRef) {
        await updateDoc(roomRef, payload);
      }
    } catch (error) {
      console.log("Update room err: ", error);
      onFailed && onFailed(error);
    }
  };

  deleteRoom = async (
    id: string,
    houseId: string,
    onFailed?: FailureCallback
  ) => {
    try {
      const roomRef = doc(this.db, "rooms", id);
      const houseRef = doc(this.db, "houses", houseId);

      if (!roomRef || !houseRef) return;
      await deleteDoc(roomRef);
      await updateDoc(houseRef, {
        rooms: arrayRemove(id),
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.log("Delete room err: ", error);
      onFailed && onFailed(error);
    }
  };

  addGuest = async (guests: GuestInitValue, onFailed?: FailureCallback) => {
    try {
      const guestRef = collection(this.db, "guests");
      return await addDoc(guestRef, {
        ...guests,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.log("Add guest err: ", error);
      onFailed && onFailed(error);
    }
  };

  addGuests = async (guests: GuestInit[]) => {
    try {
      const batch = writeBatch(this.db);

      const guestRef = collection(this.db, "guests");

      guests.forEach((guest) => {
        const docRef = doc(guestRef, guest.id);
        batch.set(docRef, {
          name: guest.name,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.log("Add guests err: ", error);
    }
  };

  getGuestDetail = async (id: string) => {
    try {
      const guestRef = doc(this.db, "guests", id);
      if (!guestRef) return;
      const querySnapShot = await getDoc(guestRef);

      const data = querySnapShot.data();
      return {
        ...data,
        id: querySnapShot.id,
      };
    } catch (error) {
      console.log("err", error);
    }
  };

  removeGuestFromRoom = async (
    guestId: string,
    roomData: RoomDetail,
    onFailed?: FailureCallback
  ) => {
    try {
      if (!roomData?.id) return;
      const roomRef = doc(this.db, "rooms", roomData.id);

      if (!roomRef) return;

      const newRoom = {
        ...roomData,
        guests: roomData.guests.filter((elm) => elm.id !== guestId),
        updatedAt: Timestamp.now(),
      };

      await updateDoc(roomRef, newRoom);
    } catch (error: any) {
      console.log("Remove guest from room err: ", error);
      onFailed && onFailed(error);
    }
  };

  deleteGuest = async (
    id: string,
    roomData: RoomDetail,
    onFailed?: FailureCallback
  ) => {
    try {
      const guestRef = doc(this.db, "guests", id);
      if (!guestRef) return;
      await deleteDoc(guestRef);

      if (roomData?.id) {
        const roomRef = doc(this.db, "rooms", roomData.id);

        const newRoom = {
          ...roomData,
          guests: roomData.guests.filter((elm) => elm.id !== id),
          updatedAt: Timestamp.now(),
          status: {
            value: "available",
            label: "Available",
          },
        };

        await updateDoc(roomRef, newRoom);
      }
    } catch (error: any) {
      console.log("Delete guest err: ", error);
      onFailed && onFailed(error);
    }
  };
  uploadImage = (
    file: File,
    metadata: any,
    onFailed?: FailureCallback,
    onDownloadFinish?: (url: string) => void,
    onUploadProgress?: (progress: number) => void,
    folder = "citizenId"
  ) => {
    try {
      const storageRef = ref(
        this.storage,
        `${folder}/${uuid()}.${file.type.replace("image/", "")}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          onUploadProgress && onUploadProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log("Upload image err: ", error);
          onFailed && onFailed(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onDownloadFinish && onDownloadFinish(downloadURL);
          });
        }
      );
    } catch (error) {
      console.log("Upload image err: ", error);
      onFailed && onFailed(error);
    }
  };
}

const FirebaseServices = new FirebaseService();
export default FirebaseServices;
