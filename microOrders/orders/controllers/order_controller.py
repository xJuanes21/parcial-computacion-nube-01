from flask import Blueprint, request, jsonify, session
from orders.models.order_model import Order, OrderItem
from db.db import db
import requests
import os

order_controller = Blueprint('order_controller', __name__)

def get_product_service_url():
    consul_host = os.environ.get('CONSUL_HOST', 'consul')
    consul_port = os.environ.get('CONSUL_PORT', '8500')
    url = f"http://{consul_host}:{consul_port}/v1/catalog/service/products-service"
    try:
        response = requests.get(url)
        response.raise_for_status()
        services = response.json()
        if services:
            # We take the first available instance
            service = services[0]
            address = service.get('ServiceAddress')
            port = service.get('ServicePort')
            return f"http://{address}:{port}"
    except Exception as e:
        print(f"Error fetching product service from consul: {e}")
    return None

@order_controller.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    result = []
    for order in orders:
        items = [{'product_id': item.product_id, 'price': item.price, 'quantity': item.quantity} for item in order.items]
        result.append({
            'id': order.id,
            'user_name': order.user_name,
            'user_email': order.user_email,
            'total': order.total,
            'date': order.date,
            'items': items
        })
    return jsonify(result)

@order_controller.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    items = [{'product_id': item.product_id, 'price': item.price, 'quantity': item.quantity} for item in order.items]
    return jsonify({
        'id': order.id,
        'user_name': order.user_name,
        'user_email': order.user_email,
        'total': order.total,
        'date': order.date,
        'items': items
    })

@order_controller.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    user_data = data.get('user', {})
    user_name = user_data.get('name') or data.get('username')
    user_email = user_data.get('email') or data.get('email')
    
    if not user_name or not user_email:
        return jsonify({'message': 'Información de usuario inválida'}), 400
        
    products = data.get('products')
    if not products or not isinstance(products, list):
        return jsonify({'message': 'Falta o es inválida la información de los productos'}), 400

    products_url = get_product_service_url()
    if not products_url:
        return jsonify({'message': 'Servicio de productos no disponible'}), 500

    total = 0
    order_items = []
    
    # Verify availability and calculate total
    for item in products:
        product_id = item.get('id')
        qty = item.get('quantity')
        if not product_id or not qty:
            return jsonify({'message': 'Información de producto incompleta'}), 400
            
        # Get product via Consul
        product_resp = requests.get(f"{products_url}/api/products/{product_id}")
        if product_resp.status_code == 404:
            return jsonify({'message': f'Producto {product_id} no existe'}), 404
        if product_resp.status_code != 200:
            return jsonify({'message': 'Error comunicando con productos'}), 500
            
        product_data = product_resp.json()
        if product_data['quantity'] < qty:
            return jsonify({'message': f'Inventario insuficiente para producto {product_id}'}), 409
            
        price = product_data['price']
        total += price * qty
        order_items.append({
            'product_id': product_id,
            'price': price,
            'quantity': qty,
            'product_data': product_data
        })

    # Update inventory and create order
    for item in order_items:
        new_qty = item['product_data']['quantity'] - item['quantity']
        update_resp = requests.put(f"{products_url}/api/products/{item['product_id']}", json={'quantity': new_qty})
        if update_resp.status_code != 200:
            return jsonify({'message': 'Error actualizando inventario'}), 500

    new_order = Order(user_name=user_name, user_email=user_email, total=total)
    db.session.add(new_order)
    db.session.flush() # get new_order.id
    
    for item in order_items:
        new_item = OrderItem(order_id=new_order.id, product_id=item['product_id'], price=item['price'], quantity=item['quantity'])
        db.session.add(new_item)
        
    db.session.commit()
    
    return jsonify({'message': 'Orden creada exitosamente', 'order_id': new_order.id}), 201
