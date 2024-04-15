const express = require('express');
const cors = require('cors');
const path = require('path');

const tf = require('@tensorflow/tfjs-node');
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const modelPath = path.resolve(__dirname, 'tfjs_model/model.json');
const modelUrl = `file://${modelPath}`;

let cachedModel = null;
async function loadModel() {
  if (!cachedModel) {
    cachedModel = await tf.loadLayersModel(modelUrl);
  }
  return cachedModel;
}

app.post('/predict', async (req, res) => {
    const { features } = req.body;
    try {
        const model = await loadModel();
        const inputTensor = tf.tensor2d([features]);

        const predictionTensor = model.predict(inputTensor);
        const prediction = await predictionTensor.array();

        const maxProbabilityIndex = prediction[0].indexOf(Math.max(...prediction[0]));
        const riskLevels = ['low', 'mid', 'high'];
        const riskLevel = riskLevels[maxProbabilityIndex];

        res.json({ riskLevel });
    } catch (error) {
        res.status(500).json({ error: 'Prediction failed' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));