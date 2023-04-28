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
  myFavouritesOnly = false
) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {user, update, targetUser, setUser, setTargetUser} =
    useContext(MediaContext);

  const [userData, setData] = useState(() => {
    return user ?? JSON.parse(window.localStorage.getItem('user'));
  });

  useEffect(() => {
    window.localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, [setData]);

  const [targetUserData, setTargetUserData] = useState(() => {
    return targetUser ?? JSON.parse(window.localStorage.getItem('targetUser'));
  });

  useEffect(() => {
    window.localStorage.setItem('targetUser', JSON.stringify(targetUserData));
    setTargetUser(targetUserData);
  }, [setTargetUserData]);

  const getMedia = async () => {
    try {
      let files = await useTag().getTag(appId);

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
      const filesWithThumbnail = await Promise.all(
        files.map(async (file) => {
          return await doFetch(baseUrl + 'media/' + file.file_id);
        })
      );

      for (const file of filesWithThumbnail) {
        const likes = await doFetch(
          baseUrl + 'favourites/file/' + file.file_id
        );
        file.likes = likes.length;
      }

      for (const file of filesWithThumbnail) {
        const fetchOptions = {
          method: 'GET',
        };
        const ratingInfo = await doFetch(
          baseUrl + 'ratings/file/' + file.file_id,
          fetchOptions
        );

        let sum = 0;

        ratingInfo.forEach((file) => {
          sum += file.rating;
        });
        let averageRating = sum / ratingInfo.length;

        if (isNaN(averageRating)) {
          averageRating = 0;
        }
        file.rating = averageRating;
      }

      setMediaArray(filesWithThumbnail);
    } catch (error) {
      console.error('getMedia', error.message);
    }
  };

  useEffect(() => {
    try {
      getMedia();
    } catch (error) {
      console.log(error.message);
    }
  }, [update]);

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

  return {postUser, getUserByToken, getCheckUser, getUser, putUser};
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

  return {getTag, postTag, deleteTag, getTagsByFileId};
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

  return {postComment, deleteComment, getCommentsById};
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
