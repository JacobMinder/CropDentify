const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/proxy', async (req, res) => {
  const { cid } = req.query;
  try {
    const response = await axios.get(`https://fuchsia-actual-gopher-288.mypinata.cloud/files/${cid}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from Pinata');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
