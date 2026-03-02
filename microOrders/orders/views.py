from flask import Flask, jsonify
from orders.controllers.order_controller import order_controller
from db.db import db
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
app.secret_key = 'secret123'
app.config.from_object('config.Config')
db.init_app(app)

app.register_blueprint(order_controller)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "UP"}), 200

def register_consul():
    consul_host = os.environ.get('CONSUL_HOST', 'consul')
    consul_port = os.environ.get('CONSUL_PORT', '8500')
    service_id = 'orders-service-1'
    service_name = 'orders-service'
    service_port = 5004

    payload = {
        "ID": service_id,
        "Name": service_name,
        "Address": "orders_service",
        "Port": service_port,
        "Check": {
            "HTTP": f"http://orders_service:{service_port}/health",
            "Interval": "10s",
            "Timeout": "5s"
        }
    }
    
    try:
        response = requests.put(f"http://{consul_host}:{consul_port}/v1/agent/service/register", json=payload)
        response.raise_for_status()
        print(f"Successfully registered {service_name} to Consul")
    except Exception as e:
        print(f"Failed to register to Consul: {e}")

if __name__ == '__main__':
    import threading
    threading.Thread(target=register_consul).start()
    app.run(host='0.0.0.0', port=5004)
