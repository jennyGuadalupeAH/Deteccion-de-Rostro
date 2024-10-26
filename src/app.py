from flask import Flask, request, jsonify, render_template
from .services.face_detection import procesar_imagen
import os
from flask_cors import CORS

app = Flask(__name__)

# Permitir todas las solicitudes CORS
CORS(app)

# Configurar la ruta de carga de imágenes
UPLOAD_FOLDER = './src/static/images/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_key_facials', methods=['POST'])
def detectar_Puntos_Faciales():
    # Cargar la imagen
    archivo = request.files.get('archivo')
    
    if not archivo or archivo.filename == '':
        return jsonify({'error': 'No se cargó ninguna imagen'}), 400  # Cambia el código de respuesta a 400

    # Verificar que el archivo sea una imagen
    if not archivo.content_type.startswith('image/'):
        return jsonify({'error': 'El archivo no es una imagen válida'}), 400

    try:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], archivo.filename)
        archivo.save(image_path)

        # Llamar a la función para procesar la imagen
        resultado = procesar_imagen(image_path)

        # Responder con el resultado procesado
        return jsonify({'resultado': resultado, 'image_url': f'/static/images/{archivo.filename}'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Devuelve el error si ocurre algún problema

if __name__ == '__main__':
    # Crear la carpeta de carga si no existe
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
        
    app.run(debug=True, host="0.0.0.0", port=os.getenv("PORT", default=5000))
