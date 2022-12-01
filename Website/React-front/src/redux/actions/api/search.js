import { API_URL, errorMessage, createNotification, Client } from "./api";
import { history } from "../../../history";

export function listNFT() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/nft`);
      dispatch({
        type: "FETCH_LIST_SEARCH",
        searches: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createNFT(newTitle, newDescription, newAuthor, newWebUrl, uploadFile) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDescription);
      formData.append("author", newAuthor); // Replace the preset name with your own
      formData.append("web_url", newWebUrl); // Replace API key with your own Cloudinary key
      formData.append("upload_file", uploadFile);
      await client.post(`${API_URL}/nft`, formData);
      createNotification("success", "NFT is successfully minted!");
    } catch (err) {
      createNotification("error", errorMessage(err));
    }
  };
}

export function getNFT(id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const res = await client.get(`${API_URL}/nft/${id}`);
      return res.data
    } catch (err) {
      createNotification("error", errorMessage(err));
    }
  };
}

export function updateSearch(search) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.put(`${API_URL}/nft`, search);
    } catch (err) {
      createNotification("error", errorMessage(err));
    }
  };
}

export function deleteSearch(id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.delete(`${API_URL}/nft/${id}`);
      history.push("/")
    } catch (err) {
      createNotification("error", errorMessage(err));
    }
  };
}