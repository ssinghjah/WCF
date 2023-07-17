const google_sheets = require('./google_sheets')

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/getdata', async (req, res) => {
    const data = await google_sheets.get_data();
    res.json(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

