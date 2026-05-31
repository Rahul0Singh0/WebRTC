import { ADD_PEER, REMOVE_PEER } from "../Actions/peerAction";

export const RESET = "RESET" as const;

export type PeerState = Record<string, { stream: MediaStream }>;

type PeerAction = {
    type: typeof ADD_PEER,
    payload: { peerId: string, stream: MediaStream }
} | {
    type: typeof REMOVE_PEER,
    payload: { peerId: string }
} | {
    type: typeof RESET
}

export const peerReducer = (state: PeerState, action: PeerAction) => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream
                }
            }
        case REMOVE_PEER: {
            // removing a peer
            const copy = { ...state };
            delete copy[action.payload.peerId];
            return copy;
        }
        case RESET:
            return {};
        default:
            return { ...state };
    }
}