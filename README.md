# kowalski-analytics-storage-mongoose
Mongoose Storage for Kowalski

## Usage
```javascript
const express = require('express')
const Kowalski = require('kowalski-analytics')
const mongoStorage = require('kowalski-analytics-storage-mongoose')

const app = express()

app.use(new Kowalski({
  informationToCollect: [ ... ],
  storage: mongoStorage('mongodb://mongdb_url_here/db_name')
}))

...

app.get('/getInformation/:informationName', (req, res, next) => {
  // req.kowalski.storage yields the mongoose instance
  req.kowalski.storage
    // model names are lower case
    .model(req.params.informationName.toLowerCase())
    .find()
    // result.information yields a Kowalski.Information instance
    .then(results => results.map(result => result.getInformation())) 
    .then(results => res.json(results))
    .catch(error => next(error))
})
```
