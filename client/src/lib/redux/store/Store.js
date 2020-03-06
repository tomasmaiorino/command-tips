import { ADD_USER, LOGOUT, SHOW_LOADING, SHOW_LOADING_TAGS } from "./../actions/ActionTypes";

const initialState = {
    user: { userName: 'initial name' },
    name: 'test',
    showLoadingTags: false,
    tags: []
};

export default function (state = initialState, action) {
    const newState = { ...state };
    switch (action.type) {
        case ADD_USER: {
            const { user } = action;
            let response = {
                user: action.user
            }
            console.log('adding user action %O', response);
            return response;
        }
        case LOGOUT: {
            delete newState.user;
            return newState;
        }
        case SHOW_LOADING:
            return action;
        case SHOW_LOADING_TAGS:
            newState.showLoadingTags = action.showLoadingTags;
            return newState;
        default:
            return newState;
    }
}
