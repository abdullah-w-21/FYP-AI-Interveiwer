import {
  addDoc,
  auth,
  collection,
  db,
  query,
  where,
  getDocs,
  updateDoc,
} from "../../Firebase/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../../Firebase/FirebaseConfig";
import {
  signUpSuccess,
  signUpError,
  startLoading,
  signInSuccess,
  signInError,
  resetError,
  resetSuccess,
} from "../Reducers/AuthReducers";
import { setStorageItem } from "../../utils/Index";

export const signUp = (username, email, password, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      addDoc(collection(db, "users"), {
        user_id: user.uid,
        email,
        username,
        totalQuizAttempts: 0,
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      dispatch(signUpSuccess(user));
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(signUpError(error.code));
      return error;
    }
  };
};

export const signIn = (email, password, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const isRegistered = await isEmailAlreadyRegistered(email);
      if (isRegistered) {
        const usersQuery = query(
          collection(db, "users"),
          where("user_id", "==", user.uid)
        );
        const [usersSnapshot] = await Promise.all([getDocs(usersQuery)]);
        const usernames = [];
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const username = userData.username;
          if (username) {
            usernames.push(username);
          }
        });
        dispatch(signInSuccess({ ...user, username: usernames }));
        setStorageItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        dispatch(signInError("Email is not registered."));
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        console.log(error.code);
        dispatch(signInError("Incorrect email or password."));
      } else {
        console.error("Login error:", error);
      }
    }
  };
};

export const passwordReset = (email) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());

      const isRegistered = await isEmailAlreadyRegistered(email);

      if (isRegistered) {
        await sendPasswordResetEmail(auth, email);
        dispatch(resetSuccess());
        console.log("Password reset email sent successfully.");
      } else {
        dispatch(resetError("Email is not registered."));
      }
    } catch (error) {
      dispatch(resetError(error.message));
    }
  };
};

export async function isEmailAlreadyRegistered(email) {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.size > 0;
  } catch (error) {
    console.error("Error checking email registration:", error.message);
    return false;
  }
}

export const startQuiz = async (userId) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log("User Document Data:", userData);

      const currentAttempts = userData.totalQuizAttempts || 0;

      const newAttempts = currentAttempts + 1;

      await updateDoc(userDoc.ref, {
        totalQuizAttempts: newAttempts,
      });
    } else {
      console.log("No such user document with the specified user_id!");
    }
  } catch (error) {
    console.error("Error updating total quiz attempts:", error);
  }
};

export const getQuizAttemptsCount = async (userId) => {
  try {
    const usersCollection = collection(db, "users");

    const userQuery = query(usersCollection, where("user_id", "==", userId));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data();

      return userDoc.totalQuizAttempts;
    } else {
      console.error("No user document found for the given userId.");
      return 0;
    }
  } catch (error) {
    console.error("Error retrieving quiz attempts count:", error);
    return 0;
  }
};
