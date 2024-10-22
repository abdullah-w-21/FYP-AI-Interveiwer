export const getStorageItem = async (key) => {
    // console.log("getStorage", key);
    try {
      let item = await localStorage.getItem(key);
      return item ? JSON.parse(item) : item;
    } catch (e) {
      console.log("Error in getting key -->", e);
      return null;
    }
  };

  export const setStorageItem = async (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.log("Error in setting key -->", e);
      return null;
    }
  };
  