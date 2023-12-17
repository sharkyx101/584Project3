from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:example@localhost:13313/assign'
db = SQLAlchemy(app)
CORS(app)

class Business(db.Model):
    business_id = db.Column(db.String(1024), primary_key=True)
    name = db.Column(db.String(1024, collation='utf8_general_ci'), nullable=False)
    address = db.Column(db.String(1024), nullable=False)
    city = db.Column(db.String(1024), nullable=False)
    state = db.Column(db.String(1024), nullable=False)
    postal_code = db.Column(db.String(1024), nullable=False)
    stars = db.Column(db.Float, nullable=False)
    review_count = db.Column(db.Integer, nullable=False)
    is_open = db.Column(db.Integer, nullable=False)
    categories = db.Column(db.String(1024), nullable=False)

    def serialize(self):
        return {
            'business_id': self.business_id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'stars': float(self.stars),
            'review_count': self.review_count,
            'is_open': bool(self.is_open),
            'categories': self.categories.split(', ')
        }

@app.route('/api/business', methods=['GET'])
def get_business():
    filters = {
        'categories': request.args.get('categories', ''),
        'city': request.args.get('city', ''),
        'state': request.args.get('state', ''),
    }

    page = int(request.args.get('page', 1))
    items_per_page = int(request.args.get('limit', 25))

    query = Business.query
    for column, value in filters.items():
        if value and column in Business.__table__.columns:
            value = value.lower().strip()
            query = query.filter(getattr(Business, column).ilike(f'%{value}%'))


    total_count = query.count()
    total_pages = -(-total_count // items_per_page)

    page = min(page, total_pages)
    offset = (page - 1) * items_per_page
    query = query.offset(offset).limit(items_per_page)

    businesses = query.all()
    return jsonify({
        'businesses': [business.serialize() for business in businesses],
        'total_pages': total_pages,
    })

@app.route('/api/testdb', methods=['GET'])
def test_db_connection():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({'message': 'Database connection successful!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
