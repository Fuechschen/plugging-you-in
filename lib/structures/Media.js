let Base = require('./Base');

/**
 * Represents a media object
 * @property {Number} id The unique id used by plug
 * @property {String} cid The id used by the source. This is only unique if used together with 'format'
 * @property {Number} format The format of the media. 1 is YouTube, 2 is SoundCloud
 * @property {String} author The media author
 * @property {String} title The media title
 * @property {Number} duration The media duration
 * @property {String} image A link to a cover image.
 * @property {String} name The concatenated name of the media
 * @property {String} uniqueId An unique id for the media
 */
class Media extends Base {
    constructor(data) {
        super();
        this.id = data.id;
        this.cid = data.cid;
        this.format = data.format;

        this.author = data.author;
        this.title = data.title;

        this.duration = data.duration;

        this.image = data.image;
    }

    get name() {
        return `${this.author} - ${this.title}`;
    }

    get uniqueId() {
        return `${this.format}:${this.cid}`;
    }
}

module.exports = Media;