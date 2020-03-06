import { ADD_USER, LOGOUT, SHOW_LOADING, SHOW_LOADING_TAGS, ADD_TAGS } from './ActionTypes'

export const addUserName = (user) => ({ type: ADD_USER, user });
export const logoutAction = () => ({ type: LOGOUT });
export const showLoading = (loading) => ({ type: SHOW_LOADING, showLoading: loading });
export const showLoadingTags = (show) => ({ type: SHOW_LOADING_TAGS, showLoadingTag: show });
export const addTags = (tags) => ({ type: ADD_TAGS, tags });

module.export = { addUserName, logoutAction, showLoading, showLoadingTags };