from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('like_predictor.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array([
        data['word_count'],
        data['char_count'],
        data['has_media'],
        data['hour'],
        data['sentiment'],
        data['company_encoded'],
        data['emoji_count'],
        data['has_url'],
        data['has_hashtag'],
        data['tfidf_mean'],
        data['company_avg_likes'],
        data['sentiment_encoded']
    ]).reshape(1, -1)

    prediction = model.predict(features)[0]
    if request.form:
        return f"<p>predicted_likes {int(prediction)}</p>"
    else:    
         return jsonify({'predicted_likes': int(prediction)})
    


if __name__ == '__main__':
    app.run(debug=True, port=3000)