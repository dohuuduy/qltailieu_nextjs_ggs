# Requirements Document

## Introduction

Hệ thống quản lý tài liệu hiện tại thiếu các trường ngày tháng quan trọng để kiểm soát vòng đời và hiệu lực của tài liệu. Tính năng này sẽ bổ sung các trường ngày để đảm bảo tuân thủ quy định và quản lý hiệu lực tài liệu một cách chính xác.

## Requirements

### Requirement 1: Quản lý ngày ban hành tài liệu

**User Story:** Là một quản lý tài liệu, tôi muốn ghi nhận ngày ban hành chính thức của tài liệu, để có thể theo dõi thời điểm tài liệu được phê duyệt và công bố.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép nhập ngày ban hành
2. WHEN ngày ban hành được nhập THEN hệ thống SHALL validate ngày không được trong tương lai
3. WHEN ngày ban hành không được nhập THEN hệ thống SHALL sử dụng ngày hiện tại làm mặc định
4. WHEN hiển thị danh sách tài liệu THEN hệ thống SHALL hiển thị ngày ban hành trong bảng
5. WHEN sửa tài liệu THEN hệ thống SHALL cho phép cập nhật ngày ban hành với ghi chú lý do

### Requirement 2: Quản lý ngày bắt đầu hiệu lực

**User Story:** Là một quản lý tài liệu, tôi muốn thiết lập ngày bắt đầu hiệu lực của tài liệu, để đảm bảo tài liệu chỉ được áp dụng từ thời điểm phù hợp.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép nhập ngày bắt đầu hiệu lực
2. WHEN ngày bắt đầu hiệu lực được nhập THEN hệ thống SHALL validate ngày không được trước ngày ban hành
3. WHEN ngày bắt đầu hiệu lực không được nhập THEN hệ thống SHALL sử dụng ngày ban hành làm mặc định
4. WHEN ngày hiện tại chưa đến ngày bắt đầu hiệu lực THEN hệ thống SHALL hiển thị trạng thái "Chưa hiệu lực"
5. WHEN ngày hiện tại >= ngày bắt đầu hiệu lực AND < ngày kết thúc hiệu lực THEN hệ thống SHALL hiển thị trạng thái "Đang hiệu lực"

### Requirement 3: Quản lý ngày kết thúc hiệu lực

**User Story:** Là một quản lý tài liệu, tôi muốn thiết lập ngày kết thúc hiệu lực của tài liệu, để đảm bảo tài liệu không được sử dụng sau thời hạn quy định.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép nhập ngày kết thúc hiệu lực (tùy chọn)
2. WHEN ngày kết thúc hiệu lực được nhập THEN hệ thống SHALL validate ngày phải sau ngày bắt đầu hiệu lực
3. WHEN ngày hiện tại > ngày kết thúc hiệu lực THEN hệ thống SHALL tự động chuyển trạng thái thành "Hết hiệu lực"
4. WHEN tài liệu sắp hết hiệu lực (còn 30 ngày) THEN hệ thống SHALL gửi cảnh báo cho người quản lý
5. WHEN tài liệu hết hiệu lực THEN hệ thống SHALL hiển thị cảnh báo rõ ràng trong danh sách

### Requirement 4: Quản lý ngày soát xét định kỳ

**User Story:** Là một quản lý chất lượng, tôi muốn thiết lập lịch soát xét định kỳ cho tài liệu, để đảm bảo tài liệu được cập nhật và duy trì tính chính xác.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép thiết lập chu kỳ soát xét (6 tháng, 1 năm, 2 năm, 3 năm)
2. WHEN chu kỳ soát xét được thiết lập THEN hệ thống SHALL tự động tính ngày soát xét tiếp theo
3. WHEN đến ngày soát xét THEN hệ thống SHALL gửi thông báo cho người phụ trách
4. WHEN soát xét được hoàn thành THEN hệ thống SHALL cập nhật ngày soát xét gần nhất và tính ngày soát xét tiếp theo
5. WHEN tài liệu quá hạn soát xét (quá 30 ngày) THEN hệ thống SHALL hiển thị cảnh báo nghiêm trọng

### Requirement 5: Dashboard và báo cáo ngày tháng

**User Story:** Là một quản lý hệ thống, tôi muốn có dashboard tổng quan về tình trạng hiệu lực của tài liệu, để có thể theo dõi và đưa ra quyết định kịp thời.

#### Acceptance Criteria

1. WHEN truy cập dashboard THEN hệ thống SHALL hiển thị số lượng tài liệu theo trạng thái hiệu lực
2. WHEN xem dashboard THEN hệ thống SHALL hiển thị danh sách tài liệu sắp hết hiệu lực (30 ngày tới)
3. WHEN xem dashboard THEN hệ thống SHALL hiển thị danh sách tài liệu cần soát xét (30 ngày tới)
4. WHEN xuất báo cáo THEN hệ thống SHALL cho phép lọc theo khoảng thời gian và trạng thái hiệu lực
5. WHEN có tài liệu hết hiệu lực hoặc cần soát xét THEN hệ thống SHALL hiển thị badge thông báo trên menu

### Requirement 6: Lịch sử thay đổi ngày tháng

**User Story:** Là một auditor, tôi muốn theo dõi lịch sử thay đổi các ngày quan trọng của tài liệu, để đảm bảo tính minh bạch và truy xuất nguồn gốc.

#### Acceptance Criteria

1. WHEN thay đổi ngày ban hành THEN hệ thống SHALL ghi lại lịch sử với người thực hiện và lý do
2. WHEN thay đổi ngày hiệu lực THEN hệ thống SHALL ghi lại lịch sử với người thực hiện và lý do
3. WHEN hoàn thành soát xét THEN hệ thống SHALL ghi lại lịch sử với kết quả soát xét
4. WHEN xem lịch sử tài liệu THEN hệ thống SHALL hiển thị timeline các thay đổi ngày tháng
5. WHEN xuất audit trail THEN hệ thống SHALL bao gồm tất cả thay đổi ngày tháng với timestamp chính xác

### Requirement 7: Tích hợp với tài liệu con

**User Story:** Là một người dùng, tôi muốn tài liệu con kế thừa thông tin ngày tháng từ tài liệu cha, để đảm bảo tính nhất quán trong hệ thống phân cấp.

#### Acceptance Criteria

1. WHEN tạo tài liệu con THEN hệ thống SHALL mặc định sử dụng ngày hiệu lực của tài liệu cha
2. WHEN tài liệu cha hết hiệu lực THEN hệ thống SHALL cảnh báo về tình trạng của tài liệu con
3. WHEN tài liệu cha được gia hạn hiệu lực THEN hệ thống SHALL đề xuất cập nhật tài liệu con
4. WHEN xem tài liệu con THEN hệ thống SHALL hiển thị thông tin hiệu lực của cả tài liệu cha và con
5. WHEN tài liệu con có ngày hiệu lực khác tài liệu cha THEN hệ thống SHALL hiển thị cảnh báo không nhất quán

### Requirement 8: Quản lý người soạn thảo và phê duyệt

**User Story:** Là một quản lý tài liệu, tôi muốn ghi nhận thông tin người soạn thảo và người phê duyệt tài liệu, để đảm bảo trách nhiệm và quyền hạn trong quy trình tài liệu.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép chọn người soạn thảo từ danh sách nhân viên
2. WHEN tài liệu được hoàn thành soạn thảo THEN hệ thống SHALL yêu cầu chọn người phê duyệt
3. WHEN người phê duyệt được chỉ định THEN hệ thống SHALL gửi thông báo yêu cầu phê duyệt
4. WHEN tài liệu được phê duyệt THEN hệ thống SHALL ghi nhận ngày phê duyệt và chữ ký số
5. WHEN tài liệu bị từ chối THEN hệ thống SHALL gửi lại cho người soạn thảo với ghi chú

### Requirement 9: Quản lý phòng ban liên quan

**User Story:** Là một quản lý hệ thống, tôi muốn xác định các phòng ban có liên quan đến tài liệu, để đảm bảo thông tin được phân phối đúng đối tượng và phạm vi áp dụng.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL cho phép chọn phòng ban chủ quản
2. WHEN tạo tài liệu THEN hệ thống SHALL cho phép chọn nhiều phòng ban liên quan
3. WHEN tài liệu có hiệu lực THEN hệ thống SHALL thông báo đến tất cả phòng ban liên quan
4. WHEN tài liệu thay đổi THEN hệ thống SHALL thông báo đến phòng ban chủ quản và liên quan
5. WHEN xem tài liệu THEN hệ thống SHALL hiển thị danh sách phòng ban có quyền truy cập

### Requirement 10: Workflow phê duyệt và ký số

**User Story:** Là một người phê duyệt, tôi muốn có quy trình phê duyệt rõ ràng với chữ ký số, để đảm bảo tính pháp lý và truy xuất nguồn gốc của tài liệu.

#### Acceptance Criteria

1. WHEN tài liệu được gửi phê duyệt THEN hệ thống SHALL tạo workflow với các bước phê duyệt
2. WHEN người phê duyệt nhận yêu cầu THEN hệ thống SHALL hiển thị tài liệu với các tùy chọn: Phê duyệt, Từ chối, Yêu cầu sửa đổi
3. WHEN phê duyệt tài liệu THEN hệ thống SHALL yêu cầu chữ ký số hoặc mật khẩu xác thực
4. WHEN tài liệu được phê duyệt THEN hệ thống SHALL tự động cập nhật trạng thái và ngày ban hành
5. WHEN có nhiều cấp phê duyệt THEN hệ thống SHALL thực hiện tuần tự theo thứ tự được định nghĩa

### Requirement 11: Quản lý lần phát hành (Release/Revision)

**User Story:** Là một quản lý tài liệu, tôi muốn theo dõi các lần phát hành của tài liệu với số hiệu rõ ràng, để có thể quản lý phiên bản và truy xuất lịch sử phát hành một cách chính xác.

#### Acceptance Criteria

1. WHEN tạo tài liệu mới THEN hệ thống SHALL tự động gán số lần phát hành đầu tiên (Rev. 0 hoặc Rev. 1)
2. WHEN có thay đổi lớn THEN hệ thống SHALL tăng số lần phát hành chính (Rev. 1 → Rev. 2)
3. WHEN có thay đổi nhỏ THEN hệ thống SHALL tăng số lần phát hành phụ (Rev. 1.0 → Rev. 1.1)
4. WHEN phát hành tài liệu THEN hệ thống SHALL ghi nhận ngày phát hành và lý do phát hành
5. WHEN xem tài liệu THEN hệ thống SHALL hiển thị rõ ràng số lần phát hành hiện tại và lịch sử các lần phát hành

### Requirement 12: Kiểm soát nội dung theo trang và vị trí

**User Story:** Là một người soạn thảo tài liệu, tôi muốn theo dõi chính xác vị trí thay đổi trong tài liệu (trang nào, đoạn nào), để có thể quản lý và truyền đạt thay đổi một cách chi tiết và chính xác.

#### Acceptance Criteria

1. WHEN cập nhật tài liệu THEN hệ thống SHALL ghi nhận số trang và vị trí cụ thể của thay đổi
2. WHEN thay đổi nội dung THEN hệ thống SHALL cho phép đánh dấu: Trang số X, Đoạn Y, Mục Z
3. WHEN so sánh phiên bản THEN hệ thống SHALL hiển thị danh sách thay đổi theo từng trang với số trang cụ thể
4. WHEN xuất báo cáo thay đổi THEN hệ thống SHALL bao gồm bản đồ thay đổi (change map) theo trang
5. WHEN thông báo thay đổi THEN hệ thống SHALL liệt kê cụ thể "Trang X có thay đổi tại mục Y"

### Requirement 12: Quản lý nội dung thay đổi và cập nhật

**User Story:** Là một người soạn thảo tài liệu, tôi muốn ghi nhận và theo dõi các thay đổi nội dung của tài liệu, để đảm bảo tính minh bạch và truy xuất nguồn gốc các cập nhật.

#### Acceptance Criteria

1. WHEN tạo phiên bản mới THEN hệ thống SHALL yêu cầu mô tả chi tiết nội dung thay đổi
2. WHEN cập nhật tài liệu THEN hệ thống SHALL cho phép phân loại thay đổi: Sửa lỗi, Cập nhật quy định, Bổ sung nội dung, Thay đổi quy trình
3. WHEN có thay đổi quan trọng THEN hệ thống SHALL yêu cầu đánh dấu "Thay đổi lớn" và lý do chi tiết
4. WHEN thay đổi ảnh hưởng đến quy trình THEN hệ thống SHALL yêu cầu đánh giá tác động và kế hoạch triển khai
5. WHEN hoàn thành cập nhật THEN hệ thống SHALL tạo bản so sánh (diff) giữa phiên bản cũ và mới

### Requirement 13: Theo dõi và thông báo thay đổi

**User Story:** Là một người sử dụng tài liệu, tôi muốn được thông báo về các thay đổi quan trọng trong tài liệu, để có thể cập nhật quy trình làm việc phù hợp.

#### Acceptance Criteria

1. WHEN tài liệu có thay đổi lớn THEN hệ thống SHALL gửi thông báo đến tất cả phòng ban liên quan
2. WHEN có thay đổi ảnh hưởng quy trình THEN hệ thống SHALL yêu cầu xác nhận đã đọc từ người dùng
3. WHEN xem tài liệu THEN hệ thống SHALL hiển thị badge "Có cập nhật mới" nếu chưa xem phiên bản mới nhất
4. WHEN so sánh phiên bản THEN hệ thống SHALL highlight các thay đổi với màu sắc khác nhau (thêm/sửa/xóa)
5. WHEN xuất báo cáo thay đổi THEN hệ thống SHALL tạo summary các thay đổi trong khoảng thời gian

### Requirement 14: Notification và reminder system

**User Story:** Là một người quản lý tài liệu, tôi muốn nhận thông báo tự động về các sự kiện quan trọng liên quan đến ngày tháng, để không bỏ lỡ các hành động cần thiết.

#### Acceptance Criteria

1. WHEN tài liệu sắp hết hiệu lực (30, 15, 7 ngày) THEN hệ thống SHALL gửi email thông báo đến người soạn thảo và phòng ban liên quan
2. WHEN tài liệu cần soát xét (30, 15, 7 ngày) THEN hệ thống SHALL gửi email nhắc nhở đến người phê duyệt
3. WHEN tài liệu hết hiệu lực THEN hệ thống SHALL gửi thông báo khẩn cấp đến phòng ban chủ quản
4. WHEN đăng nhập hệ thống THEN hệ thống SHALL hiển thị popup các thông báo quan trọng theo vai trò
5. WHEN có nhiều thông báo THEN hệ thống SHALL nhóm theo phòng ban và ưu tiên theo mức độ nghiêm trọng