# Website đăng ký tuyển sinh - Đại học Bạc Liêu

Bộ mã này là **khung chương trình giai đoạn 1** cho đề tài:

- ReactJS (client)
- NodeJS + Express (server)
- MySQL (database)

Phạm vi bám đúng yêu cầu hiện tại:

- Không có tài khoản thí sinh
- Chỉ có đăng nhập admin
- Website chỉ thu thập dữ liệu đầu vào
- Admin xem, sửa, rà soát hồ sơ
- Export dữ liệu ra các mẫu Excel để import sang tool khác

## Những gì đã có trong bộ khung này

### Client
- Form nhập hồ sơ thí sinh
- Nhập nhiều nguyện vọng
- Nhập điểm THPT
- Nhập học bạ 6 học kì
- Nhập điểm ĐGNL
- Nhập điểm V-SAT
- Đăng nhập admin
- Danh sách hồ sơ
- Sửa hồ sơ

### Server
- API tạo hồ sơ
- API đăng nhập admin
- API lấy danh sách hồ sơ
- API lấy chi tiết 1 hồ sơ
- API cập nhật hồ sơ
- API export Excel

## Lưu ý quan trọng

Hiện tại phần export đã được dựng theo hướng:

- Mẫu **điểm THPT**: đã bám theo file `.xlsx` bạn gửi
- Mẫu **nguyện vọng**: đã bám theo file `.xlsm` bạn gửi
- Mẫu **học bạ / ĐGNL / V-SAT**: đã dựng khung header theo dữ liệu đọc được từ file mẫu, nhưng vẫn nên đối chiếu thêm một lượt sau khi bạn chạy thử

Lý do là các file `.xls` cũ khó đọc đầy đủ cấu trúc hơn `.xlsx`.

## Cách chạy

### 1) Database
Tạo database MySQL:

```sql
CREATE DATABASE tuyensinh_baclieu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sau đó chạy file:

```bash
server/sql/schema.sql
```

### 2) Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 3) Client
```bash
cd client
npm install
npm run dev
```

## Tài khoản admin mặc định

Khai báo trong `.env` của server:

```env
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

Server sẽ tự tạo admin mặc định nếu chưa có.

## Hướng phát triển tiếp theo

1. Gắn các bảng từ điển thật từ file Excel bạn đã gửi  
2. Chuẩn hóa mapping export cho từng mẫu `.xls` còn lại  
3. Tách giao diện nhập liệu thành nhiều bước đúng hơn theo màn hình mẫu  
4. Thêm bộ lọc admin và tra cứu hồ sơ theo CCCD / SBD
"# tuyen-sinh-blu" 
