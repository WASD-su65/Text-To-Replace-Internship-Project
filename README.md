# Text-To-Replace-Internship-Project
To replace your word text to new text can upload more than 20 file word

# โปรเจคฝึกงานการแทนคำในตัวไฟล์ word
เพื่อแทนคำที่ต้องการสำหรับแทนคำเก่าเพื่อเปลี่ยนเป็นคำใหม่ในไฟล์ word สามารถใช้ได้มากกว่า 20 ไฟล์

# Additional Notes / หมายเหตุเพิ่มเติม

**English**

This project was developed during an internship to demonstrate skills in file processing, text manipulation, and frontend-backend communication. It shows how automation can make text management more efficient.

**ภาษาไทย**

โครงการนี้พัฒนาในช่วงฝึกงานเพื่อแสดงทักษะด้านการประมวลผลไฟล์ การจัดการข้อความ และการเชื่อมต่อระหว่าง frontend และ backend แสดงให้เห็นถึงการนำระบบอัตโนมัติมาใช้เพื่อลดเวลาการทำงานและเพิ่มความแม่นยำในการจัดการข้อความ.

# About / เกี่ยวกับโครงการ

**English**

Text-To-Replace is an internship project that allows a user to upload more than 20 Word documents (.doc / .docx) and replace specified old text with new text across those documents. The goal is to automate bulk find-and-replace operations in Word files, saving time and reducing manual errors.

**ภาษาไทย**

Text-To-Replace คือโครงการฝึกงานที่ให้ผู้ใช้สามารถอัปโหลดไฟล์ Word ได้มากกว่า 20 ไฟล์ (.doc / .docx) และแทนที่ข้อความเก่าด้วยข้อความใหม่ในไฟล์เหล่านั้น โครงการนี้ถูกออกแบบมาเพื่อช่วยทำงานค้นหาและแทนที่ (find & replace) แบบกลุ่มในเอกสาร Word โดยอัตโนมัติ เพื่อลดเวลาและความผิดพลาดจากการทำด้วยมือ

# Features / คุณสมบัติหลัก
- รองรับการอัปโหลดไฟล์ Word ได้สูงสุด 20 ไฟล์
- ระบุคำที่ต้องการ "แทนที่" (old text → new text)
- ดำเนินการแทนที่ข้อความในทุกไฟล์ที่อัปโหลด
- ดาวน์โหลดไฟล์ที่ถูกแก้ไข (พร้อมคำที่ถูกแทน)
- UI ใช้งานง่าย — เลือกไฟล์, ใส่ข้อความเก่า/ใหม่, กด Replace, ดาวน์โหลดผลลัพธ์
- ระบบตรวจสอบข้อผิดพลาด เช่น ตรวจสอบชนิดไฟล์, ค่าที่ว่างเปล่า, การอัปโหลดซ้ำ เป็นต้น

# Tech Stack / เทคโนโลยีที่ใช้
- **Frontend** : HTML, CSS, JavaScript
- **Backend** : Python (Flask) / Node.js / PHP (แล้วแต่การใช้งานจริง)
- **Word Processing Library** : python-docx (ถ้าใช้ Python)
- **Server Framework** : Flask / Express.js
- **File Handling** : ระบบอัปโหลดและดาวน์โหลดไฟล์ Word

# Project Structure / โครงสร้างโปรเจกต์
<pre>
.
├── static/                   # ไฟล์ CSS / JS
│ ├── css/
│ └── js/
├── templates/                # หน้า HTML หลัก
│ └── index.html
├── app.py / index.js         # Backend หลัก
├── uploads/                  # โฟลเดอร์เก็บไฟล์ที่อัปโหลด
├── processed/                # โฟลเดอร์เก็บไฟล์ที่ถูกแก้ไขแล้ว
├── README.md
└── requirements.txt / package.json</pre>

# Getting Started / วิธีเริ่มต้นใช้งาน

**Prerequisites / ข้อกำหนดเบื้องต้น**
- เว็บเบราว์เซอร์ (Chrome / Firefox / Edge)
- (ถ้ามี backend) ติดตั้ง Python 3.9+ หรือ Node.js
- ติดตั้ง dependencies ตาม requirements.txt หรือ package.json

**Installation / การติดตั้ง**
<pre>git clone https://github.com/WASD-su65/Text-To-Replace-Internship-Project.git
cd Text-To-Replace-Internship-Project</pre>

ถ้าใช้ Python:
<pre>pip install -r requirements.txt
python app.py</pre>

ถ้าใช้ Node.js:
<pre>npm install
node index.js</pre>

จากนั้นเปิดเบราว์เซอร์ไปที่ http://localhost:5000 หรือพอร์ตที่ระบุ

# Usage / วิธีการใช้งาน
1. เปิดหน้าเว็บของโปรแกรม
2. อัปโหลดไฟล์ Word (สูงสุด 20 ไฟล์)
3. ระบุข้อความเก่า (Old Text) และข้อความใหม่ (New Text)
4. คลิกปุ่ม Replace เพื่อเริ่มกระบวนการแทนที่
5. ดาวน์โหลดไฟล์ Word ที่ถูกแก้ไขแล้ว

# Example / ตัวอย่างการใช้งาน
  ขั้นตอน	             |               รายละเอียด
Upload Files	       |         อัปโหลดไฟล์ Word หลายไฟล์พร้อมกัน
Specify Replacement	 |         ใส่ข้อความเก่าและข้อความใหม่
Execute Replace	     |         ระบบจะวนทุกไฟล์และแทนข้อความให้อัตโนมัติ
Download Result	     |         ดาวน์โหลดไฟล์ที่แก้ไขแล้ว

# Error Handling / การจัดการข้อผิดพลาด
- ตรวจสอบว่าไฟล์ที่อัปโหลดเป็น .doc หรือ .docx เท่านั้น
- ตรวจสอบว่า old text / new text ไม่เป็นค่าว่าง
- แสดงข้อความแจ้งเตือนหากไม่มีไฟล์หรือข้อมูลที่ต้องการแทน
- กรณีชื่อไฟล์ซ้ำ — ระบบจะเพิ่ม suffix ป้องกันการเขียนทับไฟล์เดิม

# Contribution / การมีส่วนร่วม
ยินดีรับ Pull Requests และ Issues เพื่อพัฒนาโครงการให้ดียิ่งขึ้น
การร่วมพัฒนา:
1. Fork repository
2. สร้าง branch ใหม่ (feature/ชื่อฟีเจอร์)
3. แก้ไขโค้ดและทดสอบการทำงาน
4. ส่ง Pull Request

# License / ใบอนุญาต
English : Use #Creater : Poomipat Jitkrongsit in your code ภาษาไทย : ใช้ #Creater : Poomipat Jitkrongsit ในโค้ดของคุณ

# Contact / ติดต่อ
- GitHub: WASD-su65
- Repository: Text-To-Replace-Internship-Project
- Developer: ภูมิภัทร จิตรครองสิทธิ์ (Poomipat Jitkrongsit)
