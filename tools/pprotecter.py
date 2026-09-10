import os
import time
from pypdf import PdfReader, PdfWriter
import msoffcrypto

def apply_password(file_path, password,  output_dir):
    abs_in = os.path.abspath(file_path)
    ext = os.path.splitext(abs_in)[1].lower()
    
    filename = f"locked_{int(time.time())}{ext}"
    abs_out = os.path.join(os.path.abspath(output_dir), filename)

    try:
        # --- PDF LOGIC ---
        if ext == '.pdf':
            reader = PdfReader(abs_in)
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            writer.encrypt(user_password=password, owner_password=password, algorithm="AES-256")
            with open(abs_out, "wb") as f_out:
                writer.write(f_out)
            return abs_out

        # --- OFFICE (DOCX, XLSX, PPTX) LOGIC ---
        elif ext in ['.docx', '.xlsx', '.pptx']:
            with open(abs_in, "rb") as f_in:
                office_file = msoffcrypto.OfficeFile(f_in)
                # This uses the default "Agile" encryption (Industry standard)
                with open(abs_out, "wb") as f_out:
                    office_file.encrypt(password, f_out)
            return abs_out

        else:
            raise Exception(f"Unsupported file type: {ext}")

    except Exception as e:
        print(f"Protection Error: {e}")
        raise e