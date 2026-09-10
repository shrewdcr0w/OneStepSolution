# One-Step_solution

#### Video Demo: <https://youtu.be/iFu6vjkUCqE>

#### Description: This project is a homage to the developers who create small, essential tools. I have encapsulated those ideas and bundled them into a single platform for fast, secure, and easy access. By making this a purposely offline tool, it ensures total privacy and convenience—and the best part is,It is designed to grow with more tools over time.

#### I chose Flask because it is a framework that is familiar and approachable to learn, but it also provides the perfect foundation to grow.It let me focus on the actual utility of the tools rather than the complexity of the framework, ensuring the project is both stable and easy to expand.

## Features

> Pdf_Converter

### The Pdf_Converter here can convert from a variety of file into PDF , PDF to DOCX and TXT, it can also merge multiple files into a single pdf . With maximum size limit being 100MB , Although less size is recommended.

### A max of 26 files can be converted in to PDF which include [".pdf, .jpg, .jpeg, .png, .bmp, .tiff, .gif, .webp, .txt, .md, .rtf, .html, .htm, .epub, .xls, .xlsx, .ppt, .pptx, .odt, .ods, .odp, .odg, .otg, .fodg, .fods, .docx"]

### For file which include docx, Microsoft Office (.xls, .xlsx, .ppt, .pptx) OpenDocument / LibreOffice (.odt, .ods, .odp, .odg, .otg, .fodg, .fods) ,A open source software LibreOffice is required on the machine.

### The source location of libre office should be on common paths like:

### For windows

- r"C:\Program Files\LibreOffice\program\soffice.exe",
- r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"

### For mac

- "/Applications/LibreOffice.app/Contents/MacOS/soffice"

### For Linux

- "/usr/bin/libreoffice",
- "/usr/bin/soffice",
- "/snap/bin/libreoffice"

### If not there then either you should manually put location of your s.office.exe in pdf_converter.py or set it via envirnmental variables.

> QR_Generator

### My original thought was to make QR converter as seen in the home page which has crossed QR_Converter witten on the shelf, but upon trying to implement it, I came to an understanding that i would have to connect to a online server(Imugur, Imbb) for it to operate or for offline i would have to operate a server myself . So keeping that in mind i ditched the idea , also it was not something that would come in handy and the below mentioned tool is even better than it.

### The QR_Generator is a phenomenal handy tool which solves the lengthy problem of downloading software and connecting with blutooth, wifi for transferring small texts from PC to smartphone.

### This solves the problem , as you can paste the texts, email, small paragraphs, passwords etc in the input area , when you click on the Generate QR Code it generates QR which can be scanned by camera and the barcode decodes into the text which can be further used, all done within seconds.

> Password_Protection

### As the name suggests , The PDF's can now be password protected with Bank-Grade Encryption. It uses industry-standard AES-256 bit encryption to ensure your documents (PDF, Word, Excel, PPT) are unreadable without the correct "key.

### It does not support the "Legacy" or "Raw" List

### It is one step security .It reruires no complex menues , simply drop your files write your password on the "board," and get your protected file instantly.

### universal shield for most important files, supporting PDFs and Microsoft Office documents.

> Unit_converter

### It contains basic conversion for Length, Pressure, Temperature, Weight, distance joined with a Computer Science Zone which contain conversion for Binary powers, and Data conversion from Mb to MB

### it has special dedicated area for writing down you'r values which remain permanent and will not be removed even if the page is refreshed or closed.

### Also contains some quick CS refrences along with atorage reality check.

> Add_Note_functionality

### It contain's a "Add Note" feature which which can be used to write you immediate thoughts and paste on the Sticky wall, also work as a reminder.

#### These Stick notes are again permanent cannot be gone by refreshing or closing the site unless manually done.

> Other tools

### I have left palces like "Under_Construction" in this project as this project is something that i would like to use everyday and grow upon.

### On one instance i wanted to add a summarizer tool but that was either online or i would have to download a offline tools like DistilBART, BART Large which would use internal RAM,CPU and make size of this tool large. Since i also want to share this project with everyone i know ,I did not encorporate this tool in this project

## Tech Stack Used

> HTML:

### This is the skeleton of the toolkit. It’s what defines our chalkboard area, the input zones for the files, and the structure of the notes. It’s the "paper" everything else is written on.

> CSS:

### This brings the "chalkboard" aesthetic to life. I used it to create the dark, dusty textures, broken and fixed shelves , Sticky wall and the responsive grid that makes the toolkit look great.

> JavaScript:

### The "brain" on the front end. It handles all the interactive bits—like selecting the files , showing the loading spinner, and making sure the notes stay pinned to the board without a page refresh.

> Python:

### The powerhouse behind the scenes. Using Flask, Python takes the heavy files which are uploaded and runs the complex logic to convert, or encrypt them, before handing a secure version back to you

### Python along with JavaScript were the main difficult parts which were difficult and AI based software helped me the most.

## Techinal Details

> File Management:

### To keep the toolkit fast and secure, the project handles data in two distinct ways:

#### The Volatile "Temp" System: All heavy processing (PDF conversions, QR generation) happens within the temp_files/ directory.

- It has Auto-Cleanup to prevent the application from consuming disk space, the project uses a "Clean Slate" protocol. Every time the Flask server starts, it wipes the temp_files directory and recreates it fresh.

- Because files are stored locally and cleared regularly, The documents never stay on the system longer than necessary.

#### The Persistent Notes Engine: Unlike the temporary files, The Chalkboard Notes are saved using Browser LocalStorage.

- The permanent Access of Notes are saved instantly and will survive a page refresh, a browser crash, or even a full server restart.

- Data only leaves the system when we explicitly hit the "Delete" button or clear the browser cashe, giving us full control over your workspace.

> Master Process & Security Architecture

#### The application is governed by a central Master Process (app.py) that orchestrates the following logic:

- Automatically purges the temp_files directory upon launch to ensure zero data bloat and high privacy.

- A specialized security layer within the Master Process that handles PDF encryption. It utilizes the pypdf backend to inject user-defined passwords into documents before they are served for download.

- The Master Process ensures that files are created, encrypted, and delivered without ever being permanently stored, maintaining a "memory-safe" environment.

## Setup Instructions

1. Open your terminal in the project folder.
2. Create a virtual environment:
   - Windows: `python -m venv venv`
   - Mac/Linux: `python3 -m venv venv`
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install the required libraries:
   `pip install -r requirement.txt`