import BaseModule from './structures/BaseModule.js'
import { CleanupInternval, ReactionType } from './util/Constants.js'
import ReactionListener from './structures/ReactionListener.js'

export default class ReactionInterface extends BaseModule {
    _cache = new Map();

    /**
     * @param {Main} main
     */
    constructor(main) {
        super(main);

        this.register(ReactionInterface, {
            name: 'reactionInterface',
            requires: [
                'eventExtender'
            ],
            events: [
                {
                    name: 'reactionToggle',
                    call: '_onReactionToggle'
                },
                {
                    name: 'reactionAdd',
                    call: '_onReactionAdd'
                },
                {
                    name: 'reactionRemove',
                    call: '_onReactionRemove'
                }
            ]
        });
    }

    /**
     * @private
     */
    _cleanupInterval() {
        setTimeout(() =>  this._cleanupInterval, CleanupInternval);

        const currentTime = Date.now();

        for (const reactionListener of this._cache) {
            if (reactionListener.cleanupDate <= currentTime) {
                reactionListener.cleanup(true);
            }
        }
    }

    _onReaction(reactionType, messageReaction, user) {
        if (user.id == this._m.user.id) return;

        const messageId = messageReaction.message.id;

        if (!this._cache.has(messageId)) return;

        const reactionListener = this._cache.get(messageId);
        const emoji = messageReaction.emoji.name;

        reactionListener.reaction(reactionType, emoji, user);
    }

    /**
     * @private
     * @param {MessageReaction} messageReaction
     * @param {User} user
     */
    _onReactionToggle(messageReaction, user) {
        this._onReaction(ReactionType['TOGGLE'],  messageReaction, user);
    }

    /**
     * @private
     * @param {MessageReaction} messageReaction
     * @param {User} user
     */
    _onReactionAdd(messageReaction, user) {
        this._onReaction(ReactionType['ADD'],  messageReaction, user);
    }

    /**
     * @private
     * @param {MessageReaction} messageReaction
     * @param {User} user
     */
    _onReactionRemove(messageReaction, user) {
        this._onReaction(ReactionType['REMOVE'],  messageReaction, user);
    }

    /**
     * @param {Message} message
     * @param {Array|string} emojiResolvable
     */
    async _react(message, emojiResolvable) {
        if (!emojiResolvable instanceof Array) emojiResolvable = [emojiResolvable];

        for (const emoji of emojiResolvable) {
            try {
                await message.react(emoji);
            } catch (e) {
                if (e.message == 'Unknown Message') break;
            }
        }
    }

    /**
     * @param {Message} message The discord message to listen on
     * @param {Array|string} emojiResolvable This param should be an array emoji strings or a single emoji.
     * @param {string} reactionType The type of reaction to listen on
     * @param {*} data Any data that should be available in the event handlers
     * @param {number} [timeout=30e3] The timeout to delete the message by give "-1" for infinite, in this you should manually remove the listener when you're done
     * @returns {ReactionListener}
     */
    createReactionListener(message, emojiResolvable, reactionType='TOGGLE', data = null, timeout = 30e3) {
        this._react(message, emojiResolvable);

        const messageId = message.id;
        const reactionListener = new ReactionListener(this, messageId, emojiResolvable, reactionType, data, timeout);

        this._cache.set(messageId, reactionListener)

        return reactionListener;
    }

    /**
     * @param {string} id Identifier of the Reactionlistener to remove from the cache
     * @returns {boolean} True if an existing ReactionListener was removed, false if none were found.
     */
    remove(id) {
        return this._cache.delete(id);
    }

    setup() {
        this._cleanupInterval();

        return true;
    }
}
