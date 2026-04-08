import threading
import time
import requests
import os

def register_consul():
    consul_host = os.environ.get('CONSUL_HOST', 'consul')
    consul_port = os.environ.get('CONSUL_PORT', '8500')
    service_id = 'orders-service-1'
    service_name = 'orders-service'
    service_port = 3003

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
    
    while True:
        try:
            url = f"http://{consul_host}:{consul_port}/v1/agent/service/register"
            response = requests.put(url, json=payload)
            if response.status_code == 200:
                print("Registered orders_service in Consul")
                break
        except requests.exceptions.RequestException:
            pass
        print("Waiting for Consul...")
        time.sleep(5)

from orders.views import app

if __name__ == '__main__':
    threading.Thread(target=register_consul, daemon=True).start()
    app.run(host='0.0.0.0', port=3003)
