const { google } = require('googleapis');

async function addSampleData() {
    try {
        console.log('🔄 Đang thêm dữ liệu mẫu vào Google Sheets...');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: 'qltailieu-nextjs@qltailieu-nextjs.iam.gserviceaccount.com',
                private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDbp4j1pQs5zjY
ggjkjyH4yXF52dLjSr8I1bLU0FllqeQiH/AKj10H4RKX2qei25W0L8Mjrb4Sqjho
b2LSmPGywcxTyYEzDNf8GWDl4guUCmecCILmmObVCps+VdwPkh5at4RvUXo4yP8R
xKZwnc1/829hnj7w0w6ydm9g5ju85PtF0vJRFoqF0OZvQ7clc+cRPuNqs1MwXQK9
4ufNvCeX+w4hhS1wuCyOhDxRTu1pSIx0VWKzrfeHl4+mHNa/6v0+Er6lmg+LJtWL
WTcZxD4g6aVsO+HqSKiQCJz9Rztz1HRAu356KIVl6hTKcX8eVNFqGOXzK//vX73j
9qupUr6nAgMBAAECggEAXQ1b7bt7VQAJQIl1u4HtTnx38+lDsOaDnCzIF+1WS4I/
dgIX9Kc7SAeiJzy8qd38400EkIXm5RM4hX1Xo+ef2ZnN9K0Sv+BjLI1W5k4hbi0g
FRq2XR67df+1WFJgU+eiXVZZD/nPBJ+rV2X3S9LPKJeb1nKXDGqp6k5bDNvC4Naf
CAbX1RDFD/i5uztdX0Aju5rOrbMgkMGLh3Bgs2IQGR8kZgmMh1o0kyWc6/btqxBi
NmGE6Q3zunFEAEeP6yZiToZKInZcAXKBNaIJm/ZyC9F1jzhRfr3mt1xHXg2IxRyK
s0CAHLLk03D2rout4waHigVF3Tqs1qdaqVENudofFQKBgQDrYOhE++ki7Z8g4uk8
CGb3Da+TandfNeOxcISY+rJZodmMF4osEeC7yd3Bi2ysI0U3JAyjBDW8V1wvn7im
z6RRme+KZPMWNz+izfhb2JTNGfJD5vS98JkqQeuMcL6kWLZtVAWiXsx6Lv2nW/jY
mCZlrlCk9ArA+CzAmn+B1z62uwKBgQDUjcmpVYRZWbkeYpDcIvDdIWnkWUPWxfjK
0Kk2f15CnKDDZwalbf8WL34rP1YTwhB/kejkOJmHWLO5LDo48ulApFeBznUdXof/
kyFOhSJQrDwZIr/gUBP4tsvA49lUsZysQqx85w4knpHfDlvu4ZpJKFetG7ELTXyX
tVufU5U3BQKBgDvFNfYeigsmkBwHwvZNo+fkf8tNY9a3loQ+cE1wi82a/eVHLP0X
5RuKnVdCkmv74N2pt9PFg+e5v10QkBE79RwLnPplvBzOFsi+yOx5yP90MULw6QE6
kYpbhvb4wlB1fo2womWi8QWt3ReckUpfCJEVfMEGf5yU6LhYAzzzbad1AoGAPd5X
iJZ/w5I+M/30tF7nRTZooDLrcCSH2mEKH/bK9RCqKrZeVODDky2Xx/bTk0S1kKxj
4aon5iGHjqq098ac5lfvsLTrmfTeGSI2W6ic6GZ5x8c5mo00gvySKj8oD2Lze6Cc
nG6Uy0vsocSINewtAIZhnt2klumjDnWXibTGhhECgYAeN4CTilF6z1+RMyv0skVb
BoH8k/6S5BgeGT6/O56cxYQDJcsSgtkF/7O6Sgvds763+ggY5ouPUFscH48zOiaD
uh6OP8ULZeWgb3ug43c3kcZYZ6t/L2H8fULRmg/C3seyROyrrjcBgqXUyk+6hZct
Y4O9x/7lczTx3gHFmnMHEw==
-----END PRIVATE KEY-----`,
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file'
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '11auJkhP6TtJJUq84BaeIHRa5NpE_8IX9CX_nj_pyjcc';

        // Dữ liệu mẫu cho từng bảng
        const sampleData = {
            tai_lieu: {
                headers: ['id', 'ten_tai_lieu', 'mo_ta', 'loai_tai_lieu', 'trang_thai', 'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 'ngay_cap_nhat', 'phien_ban_hien_tai', 'tieu_chuan_ap_dung'],
                data: [
                    ['1', 'Quy trình kiểm tra chất lượng sản phẩm', 'Tài liệu mô tả quy trình kiểm tra chất lượng cho tất cả sản phẩm', 'quy_trinh', 'hieu_luc', 'Nguyễn Văn A', '2024-01-15', 'Nguyễn Văn A', '2024-03-01', '2.1', 'ISO 9001:2015'],
                    ['2', 'Hướng dẫn sử dụng hệ thống ERP', 'Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống ERP', 'huong_dan', 'hieu_luc', 'Trần Thị B', '2024-02-01', 'Trần Thị B', '2024-02-01', '1.0', 'Nội bộ'],
                    ['3', 'Quy trình xử lý khiếu nại khách hàng', 'Tài liệu mô tả quy trình tiếp nhận và xử lý khiếu nại từ khách hàng', 'quy_trinh', 'hieu_luc', 'Lê Văn C', '2024-01-20', 'Lê Văn C', '2024-02-10', '1.2', 'ISO 9001:2015'],
                    ['4', 'Biểu mẫu đánh giá nhà cung cấp', 'Biểu mẫu đánh giá và lựa chọn nhà cung cấp', 'bieu_mau', 'hieu_luc', 'Phạm Thị D', '2024-02-05', 'Phạm Thị D', '2024-02-05', '1.0', 'Nội bộ'],
                    ['5', 'Hướng dẫn bảo trì thiết bị', 'Tài liệu hướng dẫn bảo trì định kỳ các thiết bị sản xuất', 'tai_lieu_ky_thuat', 'hieu_luc', 'Hoàng Văn E', '2024-01-10', 'Hoàng Văn E', '2024-02-20', '1.1', 'ISO 14001:2015']
                ]
            },
            phien_ban: {
                headers: ['id', 'tai_lieu_id', 'so_phien_ban', 'noi_dung', 'ghi_chu', 'nguoi_tao', 'ngay_tao', 'trang_thai'],
                data: [
                    ['1', '1', '2.1', 'Cập nhật quy trình kiểm tra theo tiêu chuẩn mới', 'Thêm bước kiểm tra bổ sung', 'Nguyễn Văn A', '2024-03-01', 'hieu_luc'],
                    ['2', '1', '2.0', 'Cập nhật quy trình theo yêu cầu khách hàng', 'Điều chỉnh thời gian kiểm tra', 'Nguyễn Văn A', '2024-02-15', 'het_hieu_luc'],
                    ['3', '1', '1.0', 'Phiên bản đầu tiên của quy trình kiểm tra', 'Tài liệu được tạo mới', 'Nguyễn Văn A', '2024-01-15', 'het_hieu_luc'],
                    ['4', '2', '1.0', 'Phiên bản đầu tiên của hướng dẫn ERP', 'Tài liệu được tạo mới', 'Trần Thị B', '2024-02-01', 'hieu_luc'],
                    ['5', '3', '1.2', 'Cập nhật quy trình xử lý khiếu nại', 'Thêm bước theo dõi sau xử lý', 'Lê Văn C', '2024-02-10', 'hieu_luc'],
                    ['6', '3', '1.1', 'Điều chỉnh thời gian xử lý', 'Rút ngắn thời gian phản hồi', 'Lê Văn C', '2024-01-25', 'het_hieu_luc'],
                    ['7', '3', '1.0', 'Phiên bản đầu tiên', 'Tài liệu được tạo mới', 'Lê Văn C', '2024-01-20', 'het_hieu_luc'],
                    ['8', '4', '1.0', 'Phiên bản đầu tiên của biểu mẫu', 'Tài liệu được tạo mới', 'Phạm Thị D', '2024-02-05', 'hieu_luc'],
                    ['9', '5', '1.1', 'Cập nhật hướng dẫn bảo trì', 'Thêm thiết bị mới', 'Hoàng Văn E', '2024-02-20', 'hieu_luc'],
                    ['10', '5', '1.0', 'Phiên bản đầu tiên', 'Tài liệu được tạo mới', 'Hoàng Văn E', '2024-01-10', 'het_hieu_luc']
                ]
            },
            lich_su: {
                headers: ['id', 'tai_lieu_id', 'phien_ban_id', 'hanh_dong', 'mo_ta', 'nguoi_thuc_hien', 'ngay_thuc_hien'],
                data: [
                    ['1', '1', '1', 'cap_nhat_phien_ban', 'Tạo phiên bản 2.1: Cập nhật quy trình kiểm tra theo tiêu chuẩn mới', 'Nguyễn Văn A', '2024-03-01'],
                    ['2', '1', '2', 'cap_nhat_phien_ban', 'Tạo phiên bản 2.0: Cập nhật quy trình theo yêu cầu khách hàng', 'Nguyễn Văn A', '2024-02-15'],
                    ['3', '1', '3', 'tao_moi', 'Tạo tài liệu mới: Quy trình kiểm tra chất lượng sản phẩm', 'Nguyễn Văn A', '2024-01-15'],
                    ['4', '2', '4', 'tao_moi', 'Tạo tài liệu mới: Hướng dẫn sử dụng hệ thống ERP', 'Trần Thị B', '2024-02-01'],
                    ['5', '3', '5', 'cap_nhat_phien_ban', 'Tạo phiên bản 1.2: Cập nhật quy trình xử lý khiếu nại', 'Lê Văn C', '2024-02-10'],
                    ['6', '3', '6', 'cap_nhat_phien_ban', 'Tạo phiên bản 1.1: Điều chỉnh thời gian xử lý', 'Lê Văn C', '2024-01-25'],
                    ['7', '3', '7', 'tao_moi', 'Tạo tài liệu mới: Quy trình xử lý khiếu nại khách hàng', 'Lê Văn C', '2024-01-20'],
                    ['8', '4', '8', 'tao_moi', 'Tạo tài liệu mới: Biểu mẫu đánh giá nhà cung cấp', 'Phạm Thị D', '2024-02-05'],
                    ['9', '5', '9', 'cap_nhat_phien_ban', 'Tạo phiên bản 1.1: Cập nhật hướng dẫn bảo trì', 'Hoàng Văn E', '2024-02-20'],
                    ['10', '5', '10', 'tao_moi', 'Tạo tài liệu mới: Hướng dẫn bảo trì thiết bị', 'Hoàng Văn E', '2024-01-10']
                ]
            },
            tieu_chuan: {
                headers: ['id', 'ten_tieu_chuan', 'ma_tieu_chuan', 'mo_ta', 'phien_ban', 'ngay_ban_hanh', 'trang_thai'],
                data: [
                    ['1', 'ISO 9001:2015', 'ISO9001-2015', 'Hệ thống quản lý chất lượng - Yêu cầu', '2015', '2015-09-15', 'hieu_luc'],
                    ['2', 'ISO 14001:2015', 'ISO14001-2015', 'Hệ thống quản lý môi trường - Yêu cầu', '2015', '2015-09-15', 'hieu_luc'],
                    ['3', 'ISO 45001:2018', 'ISO45001-2018', 'Hệ thống quản lý an toàn và sức khỏe nghề nghiệp', '2018', '2018-03-12', 'hieu_luc'],
                    ['4', 'Tiêu chuẩn nội bộ', 'NOI-BO-001', 'Tiêu chuẩn quy trình nội bộ công ty', '1.0', '2024-01-01', 'hieu_luc'],
                    ['5', 'TCVN 5687:2010', 'TCVN5687-2010', 'Tiêu chuẩn Việt Nam về chất lượng sản phẩm', '2010', '2010-12-01', 'hieu_luc']
                ]
            },
            file_dinh_kem: {
                headers: ['id', 'tai_lieu_id', 'phien_ban_id', 'ten_file', 'duong_dan', 'kich_thuoc', 'loai_file', 'ngay_tai_len'],
                data: [
                    ['1', '1', '1', 'quy-trinh-kiem-tra-v2.1.pdf', '/files/quy-trinh-kiem-tra-v2.1.pdf', '2.5MB', 'pdf', '2024-03-01'],
                    ['2', '1', '1', 'bieu-mau-kiem-tra.xlsx', '/files/bieu-mau-kiem-tra.xlsx', '1.2MB', 'xlsx', '2024-03-01'],
                    ['3', '2', '4', 'huong-dan-erp.pdf', '/files/huong-dan-erp.pdf', '5.8MB', 'pdf', '2024-02-01'],
                    ['4', '2', '4', 'video-huong-dan.mp4', '/files/video-huong-dan.mp4', '125MB', 'mp4', '2024-02-01'],
                    ['5', '3', '5', 'quy-trinh-khieu-nai-v1.2.docx', '/files/quy-trinh-khieu-nai-v1.2.docx', '850KB', 'docx', '2024-02-10'],
                    ['6', '4', '8', 'bieu-mau-danh-gia-ncc.xlsx', '/files/bieu-mau-danh-gia-ncc.xlsx', '450KB', 'xlsx', '2024-02-05'],
                    ['7', '5', '9', 'huong-dan-bao-tri-v1.1.pdf', '/files/huong-dan-bao-tri-v1.1.pdf', '3.2MB', 'pdf', '2024-02-20'],
                    ['8', '5', '9', 'lich-bao-tri.xlsx', '/files/lich-bao-tri.xlsx', '680KB', 'xlsx', '2024-02-20']
                ]
            },
            loai_tai_lieu: {
                headers: ['id', 'ma_loai', 'ten_loai', 'mo_ta', 'mau_sac', 'thu_tu'],
                data: [
                    ['1', 'quy_trinh', 'Quy Trình', 'Tài liệu quy trình làm việc', 'blue', '1'],
                    ['2', 'huong_dan', 'Hướng Dẫn', 'Tài liệu hướng dẫn sử dụng', 'green', '2'],
                    ['3', 'tai_lieu_ky_thuat', 'Tài Liệu Kỹ Thuật', 'Tài liệu kỹ thuật chuyên môn', 'purple', '3'],
                    ['4', 'bieu_mau', 'Biểu Mẫu', 'Các biểu mẫu, form', 'orange', '4'],
                    ['5', 'chinh_sach', 'Chính Sách', 'Tài liệu chính sách công ty', 'red', '5']
                ]
            },
            trang_thai: {
                headers: ['id', 'ma_trang_thai', 'ten_trang_thai', 'mo_ta', 'mau_sac', 'thu_tu'],
                data: [
                    ['1', 'hieu_luc', 'Hiệu Lực', 'Tài liệu đang có hiệu lực', 'green', '1'],
                    ['2', 'het_hieu_luc', 'Hết Hiệu Lực', 'Tài liệu đã hết hiệu lực', 'red', '2'],
                    ['3', 'ban_nhap', 'Bản Nháp', 'Tài liệu đang soạn thảo', 'yellow', '3'],
                    ['4', 'cho_duyet', 'Chờ Duyệt', 'Tài liệu chờ phê duyệt', 'blue', '4'],
                    ['5', 'tam_ngung', 'Tạm Ngưng', 'Tài liệu tạm thời ngưng sử dụng', 'orange', '5']
                ]
            }
        };

        // Xóa dữ liệu cũ và thêm headers + dữ liệu mới cho từng sheet
        for (const [sheetName, sheetData] of Object.entries(sampleData)) {
            console.log(`📝 Đang xử lý sheet: ${sheetName}`);

            try {
                // Xóa dữ liệu cũ (giữ lại headers)
                await sheets.spreadsheets.values.clear({
                    spreadsheetId,
                    range: `${sheetName}!A:Z`,
                });

                // Thêm headers
                await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `${sheetName}!A1:${String.fromCharCode(65 + sheetData.headers.length - 1)}1`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [sheetData.headers],
                    },
                });

                // Thêm dữ liệu
                if (sheetData.data.length > 0) {
                    await sheets.spreadsheets.values.append({
                        spreadsheetId,
                        range: `${sheetName}!A:Z`,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: {
                            values: sheetData.data,
                        },
                    });
                }

                console.log(`✅ Đã thêm ${sheetData.data.length} dòng dữ liệu vào sheet ${sheetName}`);
            } catch (error) {
                console.error(`❌ Lỗi khi xử lý sheet ${sheetName}:`, error.message);
            }
        }

        console.log('\n🎉 Hoàn thành thêm dữ liệu mẫu!');
        console.log('📊 Tổng kết:');
        console.log(`- ${sampleData.tai_lieu.data.length} tài liệu`);
        console.log(`- ${sampleData.phien_ban.data.length} phiên bản`);
        console.log(`- ${sampleData.lich_su.data.length} lịch sử thay đổi`);
        console.log(`- ${sampleData.tieu_chuan.data.length} tiêu chuẩn`);
        console.log(`- ${sampleData.file_dinh_kem.data.length} file đính kèm`);
        console.log(`- ${sampleData.loai_tai_lieu.data.length} loại tài liệu`);
        console.log(`- ${sampleData.trang_thai.data.length} trạng thái`);
        console.log(`\n🔗 Truy cập: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

        return true;
    } catch (error) {
        console.error('❌ Lỗi khi thêm dữ liệu mẫu:', error);
        return false;
    }
}

// Chạy script
if (require.main === module) {
    addSampleData()
        .then((success) => {
            console.log(success ? '\n✅ Thêm dữ liệu mẫu thành công!' : '\n💥 Thêm dữ liệu mẫu thất bại!');
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error('💥 Lỗi không mong đợi:', error);
            process.exit(1);
        });
}

module.exports = { addSampleData };