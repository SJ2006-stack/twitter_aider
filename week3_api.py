from flask import Flask, request, jsonify
from flask_cors import CORS 
from tweet_generator import SimpleTweetGenerator
import requests

app = Flask(__name__)
CORS(app) 
generator = SimpleTweetGenerator()

def extract_features(company, tweet, other_fields):
    # Dummy feature extraction; replace with your real logic
    # For example, use len(tweet) for word/char counts, etc.
    return {
        'word_count': len(tweet.split()),
        'char_count': len(tweet),
        'has_media': 0,
        'hour': 12,
        'sentiment': 0.5,
        'company_encoded': 1,
        'emoji_count': tweet.count('😀'), # example
        'has_url': int('http' in tweet),
        'has_hashtag': int('#' in tweet),
        'tfidf_mean': 0.1,
        'company_avg_likes': 100,
        'sentiment_encoded': 1
    }

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json(silent=True)
        if data:
            company = data.get('company', 'Our Company')
            tweet_type = data.get('tweet_type', 'general')
            message = data.get('message', 'Something awesome!')
            topic = data.get('topic', 'innovation')
        else:
            company = request.form.get('company', 'Our Company')
            tweet_type = request.form.get('tweet_type', 'general')
            message = request.form.get('message', 'Something awesome!')
            topic = request.form.get('topic', 'innovation')

        generated_tweet = generator.generate_tweet(company, tweet_type, message, topic)

       
        features = extract_features(company, generated_tweet, {
            'tweet_type': tweet_type,
            'message': message,
            'topic': topic
        })

        
        predicted_likes = None
        try:
            resp = requests.post('http://localhost:3000/predict', json=features)
            if resp.ok:
                predicted_likes = resp.json().get('predicted_likes')
            else:
                predicted_likes = 'Prediction error'
        except Exception as e:
            predicted_likes = f'Predictor error: {str(e)}'

        
        if request.form:
            return (
                f"<p>generated_tweet: {generated_tweet}</p>"
                f"<p>predicted_likes: {predicted_likes}</p>"
            )
        else:
            return jsonify({
                'generated_tweet': generated_tweet,
                'predicted_likes': predicted_likes,
                'success': True
            })

    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Tweet Generator API is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)


# 
