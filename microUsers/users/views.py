from flask import Flask, render_template, jsonify
from users.controllers.user_controller import user_controller
from db.db import db
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
app.secret_key = 'secret123'
app.config.from_object('config.Config')
db.init_app(app)

# Registrando el blueprint del controlador de usuarios
# Registrando el blueprint del controlador de usuarios
app.register_blueprint(user_controller)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "UP"}), 200

if __name__ == '__main__':
    app.run()
