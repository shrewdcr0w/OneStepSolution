import os
import shutil
import time
from flask import Flask, render_template, request, send_file

# Importing your specific tools
from tools.pdf_converter import master_process
from tools.pprotecter import apply_password

app = Flask(__name__)

# Directory Setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, "temp_files")

def safe_cleanup():
    """Cleans files without deleting the folder to prevent WinError 32."""
    if os.path.exists(TEMP_DIR):
        for filename in os.listdir(TEMP_DIR):
            file_path = os.path.join(TEMP_DIR, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Cleanup skip: {filename} is busy.")
    else:
        os.makedirs(TEMP_DIR, exist_ok=True)

# Run cleanup once on startup
safe_cleanup()

# --- ROUTES ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pdf')
def pdf_page():
    return render_template('pdf.html')

@app.route('/pprotecter')
def pprotecter_page():
    return render_template('pprotecter.html')

@app.route('/qr_generator')
def qr_page():
    return render_template('qr_generator.html')

@app.route('/unit_converter')
def unit_page():
    return render_template('unit_converter.html')

# --- PROCESSING ROUTES ---

@app.route('/convert_files', methods=['POST'])
def handle_conversion():
    try:
        files = request.files.getlist('files')
        mode = request.form.get('mode', 'single') 
        target_format = request.form.get('format', 'pdf')

        # Basic Validation
        if not files or files[0].filename == '':
            return "No files selected", 400

        # Run Logic
        output_path = master_process(files, mode, target_format)
        
        if not output_path or not os.path.exists(output_path):
             return "Conversion generated no output", 500

        # Generate a clean filename for download
        download_name = f"converted_result.{target_format}"
        
        return send_file(output_path, as_attachment=True, download_name=download_name)

    except Exception as e:
        print(f"App Error: {e}")
        return str(e), 500

@app.route('/protect_pdf', methods=['POST']) 
def handle_protection():
    try:
        file = request.files.get('file')
        password = request.form.get('password')

        if not file or not password:
            return "File and password required", 400

        ext = os.path.splitext(file.filename)[1].lower()
        temp_input = os.path.join(TEMP_DIR, f"input_{int(time.time())}{ext}")
        file.save(temp_input)

        protected_path = apply_password(temp_input, password, TEMP_DIR)

        return send_file(protected_path, as_attachment=True, download_name=f"protected_{file.filename}")
    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)