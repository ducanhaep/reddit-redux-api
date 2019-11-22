import fetch from "isomorphic-fetch";

export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const SELECT_SUBREDDIT = "SELECT_SUBREDDIT";
export const INVALIDATE_SUBREDDIT = "INVALIDATE_SUBREDDIT";

export function selectSubreddit(subreddit) {
  console.log('selectSubreddit');
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  };
}

export function invalidateSubreddit(subreddit) {
  console.log('invalidateSubreddit');
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  };
}

function requestPosts(subreddit) {
  console.log("request post");
  return {
    type: REQUEST_POSTS,
    subreddit
  };
}

function receivePosts(subreddit, json) {
  console.log("receivePosts");
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

function fetchPosts(subreddit) {
  console.log("fetchPosts");
  return dispatch => {
    dispatch(requestPosts(subreddit));
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)));
  };
}

function shouldFetchPosts(state, subreddit) {
  console.log("shouldFetchPosts");
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    console.log("shouldFetchPosts 1");
    return true;
  } else if (posts.isFetching) {
    console.log("shouldFetchPosts 2");
    return false;
  } else {
    console.log("shouldFetchPosts 3");
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(subreddit) {
  console.log("fetchPostIfNeeded");
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      console.log("fetchPostIfNeeded ok");
      return dispatch(fetchPosts(subreddit));
    }
  };
}
