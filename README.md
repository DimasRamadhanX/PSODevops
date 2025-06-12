# DevOps Project Description 

This will be the base app for developinig the DevOps Final Project, as the main goal of Pengembangan Sistem dan Operasi (System Development and Operations) course. This course is a part of the Information Systems department of Institut Teknologi Sepuluh Nopember (ITS) Surabaya.

## Course Description
DevOps merupakan gabungan dari dua kata Development dan Operations dimana mata kuliah ini akan mengajarkan development/pengembangan dari sebuah sistem/aplikasi dengan operation/operasional. Devops memiliki prinsip developer untuk mengkoordinasikan antar tim yaitu tim development dengan tim operations dengan efektif dan efisien. Hal yang akan dipelajari adalah Operating System, Pengelolaan server, Cloud computing, Workflow management system, process automation, dan lain sebagainya.

![image](https://github.com/user-attachments/assets/8ce61850-9223-4646-8918-c1b328cafb9e)


## Members
We are working as Group 12 (Student ID - Name): 
* 5026221139 - Dimas Fajar Ramadhan 
* 5026221144 - Alfa Renaldo Aluska 
* 5026221156 - Muhammad Ali Husain 
* 5026221159 - Candleline Audrina Firsta 

## Schedule
You can find the project schedule here: (https://intip.in/plandevops11).

## Cloud Live Link
You can check the live link here: (https://pso-kelompok12-441660509509.asia-southeast2.run.app/).

# Documentation
The documentation of this project is here: (https://its.id/m/pso12doc).

## MyNotes - Simple and Modern Day-to-Day Tasks Notes App

Welcome to **MyNotes** 📓, your solution for effortless day-to-day task management. This intuitive notes app, created with React.js and adorned with Tailwind CSS, offers a clean, modern, and user-friendly interface to help you stay organized and productive.

<div>
  <img src="src/screenshots/notesapp.jpg" alt="MyNotes App" width="100%"/>
</div>

🔗 [Visit Here](https://react-notes-app-three.vercel.app/) to experience MyNotes in action!

### Features

📝 **Create and Edit Notes:** Capture your thoughts quickly by adding new notes. Need to make changes? No worries! Edit your notes seamlessly.

🗑️ **Delete Notes:** Completed a task? Simply delete the note associated with it.

📱 **Responsive Design:** Whether you're on your desktop, tablet, or smartphone, MyNotes provides a smooth and consistent user experience.

🌈 **Modern Styling:** Enjoy a visually appealing design with carefully chosen colors, fonts, and layout.

🎨 **Custom Icons:** Intuitive icons guide you through app actions, making your interaction enjoyable.

### 🚀 Getting Started

To start using MyNotes on your local machine, follow these steps:

1. **Clone the Repository:** Clone the MyNotes repository to your local system.

2. **Install Dependencies:** Install the necessary dependencies using your preferred package manager.

3. **Launch the App:** Start the app using the appropriate command.

4. **Access the App:** Open your web browser and navigate to the provided local URL to experience MyNotes.

### 🌐 Technologies & Styling

MyNotes showcases the perfect blend of technology and style:

- **React.js:** Leverage the power of React.js for dynamic and responsive user interfaces.

- **Tailwind CSS:** Style your app effortlessly using Tailwind CSS's utility-first approach.

- **Icons:** Thoughtfully chosen icons from reputable sources enhance the visual appeal and user-friendliness.

### 🗄️ Storage

MyNotes utilizes the browser's local storage to ensure your notes persist even after closing the app.

### 📬 Source

This MyNotes project was forked from Sahil Makadia's repository (https://github.com/SahilM2063/React_Notes_App). 📅

## Flow
![image](https://github.com/user-attachments/assets/f0c489ce-92e8-4015-b8f3-2c4b138ab8e2)
### 🔄 CI

Proyek ini menggunakan **GitHub Actions** untuk otomatisasi proses *linting*, *testing*, *build*, dan *push* Docker image ke DockerHub setiap kali ada perubahan di branch `dev`.

#### 📁 File CI: `.github/workflows/ci.yml`

Workflow ini dijalankan secara otomatis pada:

- Push ke branch `dev`
- Pull request ke branch `dev`

#### ⚙️ Rangkaian Proses CI

1. **Checkout Repository**  
   Mengambil kode dari repository agar bisa diakses oleh langkah-langkah selanjutnya.

2. **Setup Node.js**  
   Mengatur environment Node.js versi 20.

3. **Install Dependencies**  
   Menjalankan `npm install` untuk menginstal semua dependensi proyek.

4. **Lint Code**  
   Menjalankan `npm run lint` untuk memastikan bahwa kode mematuhi standar penulisan.

5. **Run Tests**  
   Menjalankan `npm test` untuk menjalankan seluruh pengujian.

6. **Login ke DockerHub**  
   Autentikasi ke DockerHub menggunakan _secrets_ `DOCKER_USERNAME` dan `DOCKER_PASSWORD`.

7. **Build Docker Image**  
   Membangun Docker image dengan nama:  `${{ secrets.DOCKER_USERNAME }}/pso-kelompok12:latest`.

8. **Push Docker Image**  
Mengunggah Docker image ke DockerHub.

### 🚀 Continuous Deployment (CD)

Workflow ini secara otomatis melakukan deploy aplikasi ke **Google Cloud Run** setiap kali ada perubahan pada branch `main`.

#### 📁 File CD: `.github/workflows/deploy.yml`

Workflow ini dijalankan secara otomatis pada:

- Push ke branch `main`

#### ⚙️ Rangkaian Proses CD

1. **Checkout Repository**  
   Mengambil source code dari repository.

2. **Set up Google Cloud SDK**  
   Menyediakan `gcloud` CLI untuk menjalankan perintah deployment.

3. **Authenticate ke Google Cloud**  
   Menggunakan kunci service account dari secret `GCP_SA_KEY`.

4. **Check Active Account**  
   Mengecek akun Google Cloud yang aktif untuk konfirmasi autentikasi berhasil.

5. **Pull Docker Image**  
   Menarik image Docker terbaru dari DockerHub: `docker.io/dimdimbul/pso-kelompok12:latest`.

6. **Deploy ke Cloud Run**  
Melakukan deploy image ke layanan **Cloud Run** dengan konfigurasi berikut:
- Service: `pso-kelompok12`
- Region: `asia-southeast2`
- Platform: `managed`
- Akses: Terbuka untuk publik (`--allow-unauthenticated`)

### 🏗️ Infrastructure Provisioning (IaC)

Workflow ini digunakan untuk provisioning infrastruktur menggunakan **Terraform** secara otomatis ketika ada perubahan pada branch `infra` atau ketika dijalankan secara manual melalui GitHub Actions.

#### 📁 File Infra: `.github/workflows/infra.yml`

Workflow ini dijalankan secara otomatis pada:

- Push ke branch `infra`
- Manual trigger melalui tab **Actions** di GitHub (via `workflow_dispatch`)

#### ⚙️ Rangkaian Proses Provisioning

1. **Checkout Repository**  
   Mengambil kode repository agar file konfigurasi Terraform bisa diakses.

2. **Setup Terraform**  
   Mengatur environment dengan menginstal Terraform CLI.

3. **Buat credentials.json**  
   Membuat file kredensial dari secret `GCP_SA_KEY` agar bisa digunakan oleh Terraform.

4. **Terraform Init**  
   Menginisialisasi direktori kerja Terraform.

5. **Terraform Plan**  
   Menampilkan rencana perubahan infrastruktur berdasarkan konfigurasi dan variabel berikut:
   - `credentials`: file JSON yang berisi kredensial service account
   - `project`: ID project Google Cloud
   - `create_bucket`: boolean flag untuk menentukan apakah bucket dibuat

6. **Terraform Apply**  
   Menerapkan rencana provisioning infrastruktur secara otomatis menggunakan opsi `-auto-approve`.

### 🧩 Alur Kerja CI/CD & Provisioning

#### 1. 🔨 Infrastruktur (Infra Provisioning)

Semua resource (seperti Cloud Run, bucket, dsb.) didefinisikan menggunakan Terraform dan diprovisikan lewat branch `infra`.

- Lakukan push ke branch `infra`
- Workflow `infra.yml` akan berjalan otomatis
- Anda juga bisa menjalankan provisioning secara manual melalui tab **Actions** → **Infra Provisioning** → **Run workflow**

#### 2. 🧪 Continuous Integration (CI) – Branch `dev`

Branch `dev` digunakan sebagai tempat pengembangan aktif:

- Setiap push atau pull request ke `dev` akan memicu workflow `ci.yml`
- CI akan:
  - Install dependensi
  - Lakukan linting
  - Jalankan test
  - Build Docker image
  - Push Docker image ke DockerHub

#### 3. 🚀 Continuous Deployment (CD) – Branch `main`

Branch `main` adalah branch produksi.

- Setelah CI berhasil di `dev`, lakukan merge ke `main`
- Setiap push ke `main` akan memicu workflow `cd.yml`
- CD akan:
  - Menarik image dari DockerHub
  - Deploy image tersebut ke **Google Cloud Run**

#### Contoh
##### 1. Pindah ke `main` dan tarik versi terbaru
`git checkout main
git pull origin main`

#### 2. Pindah ke `dev` dan tarik versi terbaru
`git checkout dev
git pull origin dev`

#### 3. Lakukan perubahan ke branch `dev`

#### 4. Commit dan push ke `dev`
`git add .
git commit -m "contoh message"
git push origin dev`

Jika sudah OK, lanjutkan:

#### 5. Merge dari dev ke main
`git merge dev`

#### 6. Push hasil merge ke remote
`git push origin main`

#### 🔄 Rangkuman Alur
```mermaid
graph TD;
  A[Developer Push to infra] --> B[Run Terraform Provisioning]
  C[Developer Push to dev] --> D[Run CI: Lint, Test, Build, Push Docker Image]
  D --> E[Merge dev into main]
  E --> F[Run CD: Deploy to Cloud Run]

   
