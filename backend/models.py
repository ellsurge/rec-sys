# models.py

import json
from pymongo import MongoClient
from bson import ObjectId, json_util
from dotenv import dotenv_values
from bson import json_util, ObjectId
config = dotenv_values(".env")


class Item:
    def __init__(self, item_id, name, category, image, embedding):
        self.item_id = item_id
        self.name = name
        self.category = category
        self.image = image
        self.embedding = embedding

class MongoDB:
    def __init__(self):
        self.client = MongoClient(config["ATLAS_URI"])
        self.db = self.client[config["DB_NAME"]]
        self.items_collection = self.db['items']
        self.cart_collection = self.db['cart']
        self.user_collection = self.db['user']
        print("connected to database")

    def add_user(self, payload):
        user_dict = {
            'user':payload['user'] ,
            'password':payload['password'] ,

        }
        self.user_collection.insert_one(user_dict)

    def add_item(self, item):
        item_dict = {
            'name': item['name'],
            'category': item['category'],
            'image': item['image'],
            'embedding': item['embedding']
        }
        self.items_collection.insert_one(item_dict)

    def add_to_cart(self, item):
        try:
            # Ensure item and user IDs are converted to ObjectId
            user_id = ObjectId(item['user'])
            item_id = ObjectId(item['item'])

            # Check if both user and item exist in their respective collections
            user_exists = self.user_collection.find_one({'_id': user_id})
            item_exists = self.items_collection.find_one({'_id': item_id})

            if user_exists and item_exists:
                # Create cart document with references to user and item
                cart_dict = {
                    'user': user_id,
                    'item': item_id
                }

                # Insert the cart document into the cart_collection
                self.cart_collection.insert_one(cart_dict)
                return True
            else:
                print("User or item not found.")
                return False

        except Exception as e:
            print(f"Error adding item to cart: {e}")
            return False
        
    def validate_user(self, user, password):
        try:

            # Retrieve item document by _id using find_one
            print(user, password)
            user_dict = self.user_collection.find_one(  {'user': user, 'password':password} )

            if user_dict:
                # Convert user_dict to Python dictio    nary
                user_dict['_id'] = str(user_dict['_id'])  # Convert ObjectId to string
                return user_dict
            else:
                return None

        except Exception as e:
            print(f"Error retrieving item: {e}")
            return None
    def get_item_by_id(self, item_id):
        try:
            item_id = ObjectId(item_id)

            # Retrieve item document by _id using find_one
            item_dict = self.items_collection.find_one(
                {'_id': item_id},
                {
                    '_id': 0,           # Exclude _id field
                    'item_id': { '$toString': '$_id' },  # Convert ObjectId to string
                    'name': 1,
                    'category': 1,
                    'image': 1,
                    'embedding': {
                        '$cond': {
                            'if': { '$isArray': '$embedding' },
                            'then': { '$map': { 'input': '$embedding', 'in': { '$toDouble': '$$this' } } },
                            'else': '$embedding'
                        }
                    }
                }
            )

            if item_dict:
                # Convert item_dict to Python dictionary
                item_dict['item_id'] = str(item_dict['item_id'])  # Convert ObjectId to string
                return item_dict
            else:
                return None

        except Exception as e:
            print(f"Error retrieving item: {e}")
            return None
        
    def get_cart(self, user_id):
        try:
            user_id = ObjectId(user_id)

            # Perform aggregation to lookup items for the specified user
            pipeline = [
                {'$match': {'user': user_id}},
                {'$lookup': {
                    'from': 'items',  # Replace with your actual items collection name
                    'localField': 'item',          # Field in cart collection to match
                    'foreignField': '_id',             # Field in items collection to match
                    'as': 'items'                      # Name of the field to populate with matched items
                }},
                {'$unwind': '$items'},  # Unwind the 'items' array created by $lookup

                # Optionally project or add more stages to reshape or filter the result
                {'$project': {

                        '_id': 0,
                        'item_id': { '$toString': '$items._id' },  # Convert ObjectId to string
                        'name': '$items.name',
                        'category': '$items.category',
                        'image': '$items.image'

                }}
            ]

            # Execute aggregation pipeline
            result = list(self.cart_collection.aggregate(pipeline))
            return result

        except Exception as e:
            print(f"Error retrieving cart items for user {user_id}: {e}")
            return None
               
    def update_item(self, item_id, updated_item):
        filter_query = {'item_id': item_id}
        update_query = {'$set': {
            'name': updated_item.name,
            'category': updated_item.category,
            'image': updated_item.image
        }}
        self.items_collection.update_one(filter_query, update_query)

    def delete_item(self, item_id):
        self.items_collection.delete_one({'item_id': item_id})

        
    def get_all_items(self):
            try:
                # Define MongoDB aggregation pipeline to reshape documents
                pipeline = [
                    {
                        '$project': {
                            '_id': 0,
                            'item_id': { '$toString': '$_id' },  # Convert ObjectId to string
                            'name': 1,
                            'category': 1,
                            'image': 1,
                            'embedding': {
                                '$cond': {
                                    'if': { '$isArray': '$embedding' },
                                    'then': { '$map': { 'input': '$embedding', 'in': { '$toDouble': '$$this' } } },
                                    'else': '$embedding'
                                }
                            }
                        }
                    }
                ]

                # Execute aggregation pipeline to retrieve documents
                items_cursor = self.items_collection.aggregate(pipeline)

                # Serialize cursor to JSON using bson.json_util
                items_json = json_util.dumps(items_cursor)

                # Parse JSON back to Python objects (if needed)
                items = json_util.loads(items_json)
                # print(items)
                return items

            except Exception as e:
                print(f"Error retrieving items: {e}")
                return []


