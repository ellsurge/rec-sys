# models.py

import json
from pymongo import MongoClient
from bson import ObjectId
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
        print("connected to database")

    def add_item(self, item):
        item_dict = {
            'name': item['name'],
            'category': item['category'],
            'image': item['image'],
            'embedding': item['embedding']
        }
        self.items_collection.insert_one(item_dict)

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


