import { EventEmitter } from 'events'
import { ReactionType, OuterCleanupDate } from '../util/Constants.js'

export default class ReactionListener extends EventEmitter {
    /**
     * @param {ReactionInterface} reactionInterface The parent module
     * @param {string} messageId
     * @param {ReactionType} reactionType
     * @param {number} timeout
     */
    constructor(reactionInterface, messageId, reactionType, timeout) {
        this._reactionInterface = reactionInterface;
        this._id = messageId;

        this.reactionType = reactionType;

        this._cleanup(timeout);
    }

    get id() {
        return this._id;
    }

    get reactionType() {
        return this._reactionType;
    }

    set reactionType(new_value) {
        this._reactionType = ReactionType[new_value.toUpperCase()];

        this.emit('reactionType', this._reactionType);
    }

    /**
     * @private
     * @param {number} timeout
     */
    _cleanup(timeout) {
        // Have an outer date to cleanup for in the case I would forget to remove the listener on an infinite ReactionListener
        if (timeout == -1) this.cleanupDate = Date.now() + OuterCleanupDate;

        this.cleanupDate = Date.now() + timeout;
    }

    /**
     * @param {boolean} [timeout=true] Did the cleanup get called because of a timeout?
     */
    cleanup(timeout = true) {
        // Removes the listeners on any functions and will remove the lock on nested functions marking them so they can be garbage collected
        this.removeAllListeners();

        // Remove it from the cache so the reaction listener itself can also be garbage collected
        this._reactionInterface.remove(reactionListener.id);

        if (timeout) return this.emit('timeout');
    }

    /**
     * @param {ReactionType} reactionType
     * @param {string} emoji
     * @param {User} user
     */
    reaction(reactionType, emoji, user) {
        if (reactionType != this.reactionType) return;

        switch (reactionType) {
            case ReactionType['TOGGLE']: {
                this.emit('reaction', emoji, user);

                break;
            }
            case ReactionType['ADD']: {
                this.emit('reaction', emoji, user);

                break;
            }
            case ReactionType['REMOVE']: {
                this.emit('reaction', emoji, user);

                break;
            }
        }
    }
}
