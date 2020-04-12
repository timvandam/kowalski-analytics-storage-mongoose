const mongoose = require('mongoose')
const Kowalski = require('kowalski-analytics')

/**
 * Kowalski mongoose storage
 * @extends Kowalski.Storage
 */
class MongooseStorage extends Kowalski.Storage {
  /**
   * Constructs a MongooseStorage instance
   * @param {String} url - mongodb database url
   * @param {Map.<String, Kowalski.Information>} informationTypes - Information classes provided by Kowalski
   */
  constructor (url, informationTypes) {
    super(informationTypes)
    this.mongoose = mongoose.createConnection(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    // Create models for each Information class
    for (const Information of this.informationTypes.values()) {
      const schema = new mongoose.Schema({}, { strict: false })
      // Allow using `doc.information` to convert a document into an Information instance
      schema.loadClass(class {
        get information () {
          return Information.fromObject(this.toObject())
        }
      })
      this.mongoose.model(Information.name.toLowerCase(), schema)
    }
  }

  /**
   * Make the mongoose instance accesible with `req.kowalski.storage`
   */
  get export () {
    return this.mongoose
  }

  /**
   * Save incoming Information instances to the database
   * @param {Information} information - Information object to write to the db
   * @param {String} encoding - Not used
   * @param {Function} done - called when done writing
   */
  _write (information, encoding, done) {
    const Model = this.mongoose.model(information.constructor.name.toLowerCase())
    Model.create(information.data, error => done(error))
  }
}

/**
 * Creates a MongooseStorage constructor with the url filled in
 * @param {String} url - the url of the mongodb db
 * @returns {MongooseStorage} MongooseStorage class with the url filled in
 */
function mongooseStorage (url) {
  return MongooseStorage.bind(null, url)
}

module.exports = mongooseStorage
