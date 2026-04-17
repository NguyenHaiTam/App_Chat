# Vai trò: TruongSinh — Backend Core & Auth

## Phạm vi phụ trách

### Backend (Server / Database / Auth)

- `backend/src/server.js`
- `backend/src/libs/db.js`
- `backend/src/models/User.js`
- `backend/src/routes/authRoute.js`
- `backend/src/controllers/authController.js`

Ghi chú:
- Project hiện tại không tách riêng `utils/generateToken.js`; logic tạo JWT đang nằm trong `authController.js`.

### Frontend (Auth)

Thư mục:
- `frontend/src/components/auth/` (các form/signin/signup + route protection + logout)

Ghi chú:
- Project hiện tại không có `frontend/src/context/AuthContext.tsx` (auth state được xử lý theo kiến trúc hiện có của app).

