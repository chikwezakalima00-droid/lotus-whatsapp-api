const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-whatsapp', async (req, res) => {
  const { to, message, phoneNumberId, token } = req.body;
  
  // Clean Malawi numbers: 0999... -> 265999...
  let cleanTo = to.replace(/[^0-9]/g, '');
  if (cleanTo.startsWith('0')) {
    cleanTo = '265' + cleanTo.substring(1);
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    await axios.post(url, {
      messaging_product: "whatsapp",
      to: cleanTo,
      type: "text",
      text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.response?.data || e.message });
  }
});

app.get('/', (req, res) => {
  res.send('Lotus POS WhatsApp API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on ' + PORT));
