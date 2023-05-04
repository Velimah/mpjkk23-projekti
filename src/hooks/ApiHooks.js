import {useState, useEffect, useContext} from 'react';
import {baseUrl} from '../utils/variables';
import {appId} from '../utils/variables';
import {MediaContext} from '../contexts/MediaContext';

const doFetch = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const message = json.error
      ? `${json.message}: ${json.error}`
      : json.message;
    throw new Error(message || response.statusText);
  }
  return json;
};

const useMedia = (
  myFilesOnly = false,
  targetUserFilesOnly = false,
  myFavouritesOnly = false,
  searchOnly = false,
  searchQuery
) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {user, setUser, targetUser, setTargetUser} = useContext(MediaContext);

  // checks for user and if null gets user information from localstorage
  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  // when userData changes, saves userData to localstorage and updates userData
  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, [setData]);

  // checks for targetUser and if null gets targetUser information from localstorage
  const [targetUserData, setTargetUserData] = useState(() => {
    return targetUser ?? JSON.parse(window.localStorage.getItem('targetUser'));
  });

  // when targetUserData changes, saves targetUserData to localstorage and updates targetUserData
  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(targetUserData));
    setTargetUser(targetUserData);
  }, [setTargetUserData]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getMedia = async () => {
    try {
      let files = await useTag().getTag(appId);

      // booleans for choosing wanted media files
      if (myFilesOnly) {
        files = files.filter((file) => file.user_id === userData.user_id);
      }
      if (targetUserFilesOnly) {
        files = files.filter((file) => file.user_id === targetUserData.user_id);
      }
      if (myFavouritesOnly) {
        const token = localStorage.getItem('token');
        const likedFiles = await useFavourite().getUsersFavouritesByToken(
          token
        );
        files = files.filter((file) => {
          return likedFiles.some((likedFile) => {
            return likedFile.file_id === file.file_id;
          });
        });
      }
      if (searchOnly) {
        files = await useTag().getTag(appId + '_' + searchQuery);
      }

      const filesWithThumbnail = await Promise.all(
        files.map(async (file) => {
          return await doFetch(baseUrl + 'media/' + file.file_id);
        })
      );

      // placeholder for likes, ratings and comments to prevent errors when rendering without waiting for all fetches to finish
      for (const file of filesWithThumbnail) {
        file.likes = [];
        file.ratings = [];
        file.comments = [];
        file.averageRating = 0;
      }
      setMediaArray(filesWithThumbnail);
      addLikesRatingsCommentsToGetMedia(filesWithThumbnail);
    } catch (error) {
      console.error(error.message);
    }
  };

  // fetches and adds likes, ratings and comments for all wanted media files
  const addLikesRatingsCommentsToGetMedia = async (filesWithThumbnail) => {
    try {
      // likes
      for (const file of filesWithThumbnail) {
        await sleep(5);
        const likes = await doFetch(
          baseUrl + 'favourites/file/' + file.file_id
        );
        file.likes = likes;
      }
      // ratings
      for (const file of filesWithThumbnail) {
        await sleep(5);
        const fetchOptions = {
          method: 'GET',
        };
        const ratings = await doFetch(
          baseUrl + 'ratings/file/' + file.file_id,
          fetchOptions
        );
        // sums the ratings and count average rating
        let sum = 0;
        ratings.forEach((r) => {
          sum += r.rating;
        });
        let averageRating = sum / ratings.length;
        // sets average rating to 0 if there are no ratings
        if (isNaN(averageRating)) {
          averageRating = 0;
        }
        file.ratings = ratings;
        file.averageRating = averageRating;
      }
      // comments
      for (const file of filesWithThumbnail) {
        await sleep(5);
        const fetchOptions = {
          method: 'GET',
        };
        const comments = await doFetch(
          baseUrl + 'comments/file/' + file.file_id,
          fetchOptions
        );
        file.comments = comments;
      }
      // updates(remakes) mediaArray with likes, ratings and comments
      setMediaArray([...filesWithThumbnail]);
      console.log('getMediaFetch', filesWithThumbnail);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllMediaByCurrentUser = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'media/user', fetchOptions);
  };

  const getAllMediaById = async (id, token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'media/user/' + id, fetchOptions);
  };

  const postMedia = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
      },
      body: data,
    };
    return await doFetch(baseUrl + 'media', fetchOptions);
  };

  const deleteMedia = async (id, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'media/' + id, fetchOptions);
  };

  const putMedia = async (id, data, token) => {
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'media/' + id, fetchOptions);
  };

  const getMediaById = async (id) => {
    const fetchOptions = {
      method: 'GET',
    };
    return await doFetch(baseUrl + 'media/' + id, fetchOptions);
  };

  return {
    mediaArray,
    getMedia,
    postMedia,
    deleteMedia,
    putMedia,
    getMediaById,
    getAllMediaByCurrentUser,
    getAllMediaById,
  };
};

const useUser = () => {
  const postUser = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await doFetch(baseUrl + 'users', fetchOptions);
  };

  const putUser = async (data, token) => {
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'users', fetchOptions);
  };

  const getUserByToken = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'users/user', fetchOptions);
  };

  const getUser = async (id, token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'users/' + id, fetchOptions);
  };

  const getCheckUser = async (username) => {
    const {available} = await doFetch(baseUrl + 'users/username/' + username);
    return available;
  };

  const deleteUser = async (id, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + '/users/' + id, fetchOptions);
  };

  return {postUser, getUserByToken, getCheckUser, getUser, putUser, deleteUser};
};

const useAuthentication = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await doFetch(baseUrl + 'login', fetchOptions);
  };

  return {postLogin};
};

const useTag = () => {
  const getTag = async (tag) => {
    const tagResult = await doFetch(baseUrl + 'tags/' + tag);
    if (tagResult.length > 0) {
      return tagResult;
    } else {
      throw new Error('Tag not found');
    }
  };

  const getAllTags = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'tags/' + appId, fetchOptions);
  };

  const postTag = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'tags', fetchOptions);
  };

  const deleteTag = async (tagId, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'tags/' + tagId, fetchOptions);
  };

  const getTagsByFileId = async (fileId) => {
    const tagResult = await doFetch(baseUrl + 'tags/file/' + fileId);
    return tagResult;
  };

  return {getTag, postTag, deleteTag, getTagsByFileId, getAllTags};
};

const useFavourite = () => {
  const postFavourite = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'favourites', fetchOptions);
  };

  const getFavourites = async (id) => {
    return await doFetch(baseUrl + 'favourites/file/' + id);
  };

  const getUsersFavouritesByToken = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'favourites', fetchOptions);
  };

  const deleteFavourite = async (id, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'favourites/file/' + id, fetchOptions);
  };

  return {
    postFavourite,
    getFavourites,
    getUsersFavouritesByToken,
    deleteFavourite,
  };
};

const useComment = () => {
  const postComment = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'comments', fetchOptions);
  };

  const deleteComment = async (id, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'comments/' + id, fetchOptions);
  };

  const getCommentsById = async (id) => {
    return await doFetch(baseUrl + 'comments/file/' + id);
  };

  const getCommentsByUser = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'comments/', fetchOptions);
  };

  return {postComment, deleteComment, getCommentsById, getCommentsByUser};
};

const useRating = () => {
  const postRating = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'ratings', fetchOptions);
  };

  const deleteRating = async (id, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'ratings/file/' + id, fetchOptions);
  };

  const getRatingsById = async (id) => {
    const fetchOptions = {
      method: 'GET',
    };
    return await doFetch(baseUrl + 'ratings/file/' + id, fetchOptions);
  };

  const getAllRatings = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'ratings', fetchOptions);
  };

  return {postRating, deleteRating, getRatingsById, getAllRatings};
};

export {
  useMedia,
  useUser,
  useAuthentication,
  useTag,
  useFavourite,
  useComment,
  useRating,
};
