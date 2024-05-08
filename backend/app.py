from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Item, MongoDB
from uuid import uuid4
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
import requests
import zipfile
import io 
import urllib.request
import concurrent.futures

app  = Flask(__name__)
CORS(app)
db=  MongoDB()
glove_path = 'model/glove.6B.50d.txt'
glove_zip_path = 'model/glove.6B.50d.txt.zip'
glove_url = 'https://rec-system-images.s3.amazonaws.com/next-s3-uploads/model/glove.6B.50d.txt'
glove_api = 'https://glove-embeddings.github.io/glove.6B.100d'
embedding_cache = {}


# UTILIS ---------


def fetch_embedding(word):
    try:
        if word in embedding_cache:
            return embedding_cache[word]
        
        response = requests.get(f"{glove_api}/{word}")
        if response.status_code == 200:
            # Parse the response text as a list of floats
            embedding_values = response.json()
            
            # Convert to numpy array of float32
            embedding = np.array(embedding_values, dtype=np.float32)
            
            # Cache the embedding for future use
            embedding_cache[word] = embedding
            return embedding
        else:
            print(f"Failed to fetch embedding for {word}. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching embedding for {word}: {e}")
        return None

def array_to_list(arr):
    return arr.tolist()  

# def load_model(model_path):
#     embedding_index= {}
#     print('loading model..')
#     with open(model_path, 'r', encoding='utf-8') as f:
#         for line in f:
#             values = line.split()
#             word = values[0]
#             embedding = np.array(values[1:], dtype='float32')
#             embedding_index[word] = embedding
#     print("model loaded")
#     return embedding_index

# def load_model_from_url(model_url):
#     embedding_index = {}
#     print('Loading model from URL...')
    
#     try:
#         # Open the URL and read the file content
#         with urllib.request.urlopen(model_url) as response:
#             content = response.read().decode('utf-8')
        
#         # Process the file content
#         for line in content.splitlines():
#             values = line.split()
#             word = values[0]
#             embedding = np.array(values[1:], dtype='float32')
#             embedding_index[word] = embedding
            
#         print("Model loaded successfully from URL")
#         return embedding_index
    
#     except Exception as e:
#         print(f"Error loading model from URL: {e}")
#         return None
# def load_glove_model_from_local_zip(zip_file_path):
#     embedding_index = {}
#     print('Loading GloVe model from local ZIP file...')
    
#     try:
#         # Open the local ZIP file in read mode
#         with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
#             # Iterate over each file in the ZIP archive
#             for filename in zip_ref.namelist():
#                 if filename.endswith('.txt'):  # Assuming GloVe data files end with '.txt'
#                     with zip_ref.open(filename) as file:
#                         # Process the file content
#                         for line in file:
#                             values = line.decode('utf-8').split()
#                             word = values[0]
#                             embedding = list(map(float, values[1:]))
#                             embedding_index[word] = embedding
            
#         print("GloVe model loaded successfully from local ZIP file")
#         return embedding_index
    
#     except Exception as e:
#         print(f"Error loading GloVe model from local ZIP file: {e}")
#         return None
    

def embed(name, category):
    word_name = name.lower().split()
    word_category = category.lower().split()
    embeddings = []
    
    # Use a ThreadPoolExecutor for concurrent embedding retrieval
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        # Set of unique words to fetch embeddings for
        words_to_process = set(word_name + word_category)
        
        # Submit tasks to fetch embeddings asynchronously
        future_to_word = {executor.submit(fetch_embedding, word): word for word in words_to_process}
        
        for future in concurrent.futures.as_completed(future_to_word):
            word = future_to_word[future]
            embedding = future.result()
            if embedding is not None:
                embeddings.append(embedding)
    
    if embeddings:
        return np.mean(embeddings, axis=0)
    else:
        return None
    
# def embed(name, category, embedding_index):
#     word_name = name.lower().split()
#     word_category = category.lower().split()
#     embedding=  []
        
#     for words in [word_name, word_category]:

#         word_embedding = [get_embedding(word) for word in words if get_embedding(word) is not None]
#         if word_embedding:
#             embedding.append(np.mean(word_embedding, axis=0))
#         # else:
#         #     embedding.append(np.zeros_like(word_embedding[0]))

#     return np.mean(embedding, axis=0)



# glove_embeddings = load_model(glove_path)
# glove_embeddings = load_model_from_url(glove_url)


# Routes ----------
#
@app.route('/')
def hello_world():
    return 'hellows world'

@app.route('/get_all', methods=['GET'])
def get_all_items():
    try:
        res = db.get_all_items()
        response = jsonify({'result':res})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/get_item', methods=['GET'])
def get_item_by_id():
    id = request.args.get('id')
    try:
        res = db.get_item_by_id(id)
        response = jsonify({'result':res})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    
@app.route('/add_item', methods=['POST'])
def add_item():

    data = request.get_json()

    item_name=  data.get('name')
    item_category = data.get('category')
    item_image = data.get('image')
    if not item_name or not item_category:
        return jsonify({'error': 'item and category are requited'}), 400

    embedding_vector = embed(item_name, item_category)
    if embedding_vector is None:
        return jsonify({'error': 'Failed to compute embedding for the item'}), 500

    payload = {
        "name" : item_name,
        'category': item_category,
        'embedding':embedding_vector.tolist(),
        'image': item_image
    }
    try:
        db.add_item(payload)
        response = jsonify({"message": "Item added successfuly"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201
    except Exception as e:
        return jsonify({'error':str(e)}), 500
    # return res

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    id = request.args.get('id')
    emb = db.get_item_by_id(id)
    embedding = emb['embedding']
    items = db.get_all_items()

    similarities = []
    for item in items:
        item_embedding = np.array(item['embedding'])
        similarity = cosine_similarity([embedding], [item_embedding])[0][0]
        similarities.append((item, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)

    recommendations = [
        {  
            'id': item['item_id'],
            'name': item['name'],
            'category':item['category'],
            'image':item['image'],
            'similarity':similarity
        }
        for item, similarity in similarities[:5]
    ]
    response = jsonify({'result': recommendations})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200

@app.route('/clone_data',  methods=['GET'])
def insert_data():
    api_url = 'https://dummyjson.com/products?limit=0'  # Replace with your API endpoint
    response = requests.get(api_url)
    
    if response.status_code == 200:
        data = response.json()
        products = data['products']  
        for product in products:

            item_name=  product['title']
            item_category = product['description']
            item_image = product['thumbnail']
            embedding_vactor = embed(item_name, item_category)
            payload = {
                "name" : item_name,
                'category': item_category,
                'embedding':embedding_vactor.tolist(),
                'image': item_image
            }
            try:
                # db.add_item(payload)
                print('added item:', product['id'])
            except Exception as e:
                return jsonify({'error':str(e)}), 500
        
        return 'Data inserted successfully!', 201
    else:
        return f'Failed to fetch data from API. Status code: {response.status_code}', 500
       
if __name__ == '__main__':
    app.run(debug=True)

