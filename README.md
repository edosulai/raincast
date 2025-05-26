
# Optimalisasi Deep Learning Method dengan Long Short-Term Memory dalam Memproyeksi Curah Hujan

## Deskripsi Proyek
Proyek ini merupakan implementasi dari metode *Deep Learning* dengan arsitektur Long Short-Term Memory (LSTM) untuk memproyeksi atau memprediksi curah hujan, khususnya di wilayah Padang Pariaman. Penelitian ini dilakukan sebagai bagian dari tugas akhir untuk memperoleh gelar Sarjana Komputer pada Program Studi Teknik Informatika, Universitas Putra Indonesia “YPTK” Padang.

## Latar Belakang
Prediksi curah hujan merupakan komponen penting dalam mendukung pengambilan keputusan, terutama untuk sektor pertanian dan kebencanaan. Pendekatan tradisional menggunakan metode matematis sering kali tidak optimal karena kompleksitas data cuaca. Oleh karena itu, pendekatan *Deep Learning* dengan LSTM dipilih karena kemampuannya dalam menangani data deret waktu (*time series*) dan menyimpan informasi jangka panjang.

## Tujuan Penelitian
- Menerapkan metode LSTM untuk memprediksi curah hujan secara lebih akurat dan efisien.
- Menguji dan mengevaluasi performa model dalam sistem berbasis Python.
- Menyediakan sistem prediksi curah hujan yang dapat digunakan untuk mendukung pengambilan keputusan.

## Dataset
Data yang digunakan adalah data curah hujan dari Stasiun Klimatologi Kelas II Sicincin Padang Pariaman dari tahun 1985 hingga 2021. Fitur yang digunakan adalah `curah hujan (rr)` dan data dibagi dalam rasio 90% training dan 10% testing.

## Teknologi yang Digunakan
- Python
- TensorFlow / Keras (untuk implementasi LSTM)
- MySQL (basis data)
- Django (untuk interface sistem)

## Arsitektur Model
- Model LSTM dengan 1 layer dan 50 epoch.
- Fungsi aktivasi: Sigmoid dan Tanh.
- Evaluasi performa menggunakan Mean Squared Error (MSE).

## Hasil Penelitian
Model yang dilatih menghasilkan nilai MSE sebesar **0.03** untuk prediksi 4 hari ke depan. Sistem ini mampu melakukan prediksi lebih cepat dan efisien dibandingkan metode manual konvensional.

## Instalasi
1. Install Python dan library dependensi:
   ```bash
   pip install numpy pandas tensorflow scikit-learn matplotlib mysqlclient
   ```
2. Setup database MySQL dan migrasi skema.
3. Jalankan aplikasi Django:
   ```bash
   python manage.py runserver
   ```

## Struktur Direktori
```
├── dataset/
├── models/
├── rainfall_predictor/
│   ├── views.py
│   ├── models.py
│   └── templates/
├── manage.py
├── README.md
```

## Pengembang
**Edo Sulaiman**  
NIM: 18101152630092  
Program Studi Teknik Informatika  
Universitas Putra Indonesia “YPTK” Padang

## Lisensi
Proyek ini disusun untuk keperluan akademik dan tidak dimaksudkan untuk distribusi komersial.

---

Untuk informasi lebih lanjut, silakan lihat laporan skripsi lengkap atau hubungi penulis.
