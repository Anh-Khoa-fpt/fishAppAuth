import React from 'react'
import Layout from '../components/layout/Layout'
import '../styles/Contact.css'

const contactCards = [
  {
    title: 'Hotline 24/7',
    info: '1900 222 888',
    desc: 'Tư vấn sản phẩm, nhận đơn gấp và hỗ trợ kỹ thuật bảo quản.',
  },
  {
    title: 'Email hỗ trợ',
    info: 'support@metrohcmc.xyz',
    desc: 'Phản hồi trong 2h làm việc đối với mọi yêu cầu từ khách hàng.',
  },
  {
    title: 'Kho trung tâm',
    info: 'Số 62 Quốc lộ 13, Thủ Đức, TP.HCM',
    desc: 'Đón tiếp khách tham quan quy trình nuôi trồng & kho lạnh.',
  },
]

const Contact = () => {
  return (
    <Layout>
      <div className="contact-page">
        <section className="contact-hero">
          <h1>Liên hệ với Fish App Supporter</h1>
          <p>
            Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn đặt hàng, tư vấn bảo quản cá tươi và
            giải đáp mọi thắc mắc liên quan tới đơn hàng.
          </p>
        </section>

        <section className="contact-grid">
          {contactCards.map((card) => (
            <article key={card.title} className="contact-card">
              <h3>{card.title}</h3>
              <p className="contact-info">{card.info}</p>
              <p>{card.desc}</p>
            </article>
          ))}
        </section>

        <section className="contact-form-section">
          <div className="form-info">
            <h2>Gửi thông tin cho chúng tôi</h2>
            <p>Điền biểu mẫu bên cạnh, chuyên viên sẽ gọi lại trong vòng 30 phút làm việc.</p>
            <ul>
              <li>• Hỗ trợ báo giá số lượng lớn</li>
              <li>• Tư vấn thiết kế bếp hải sản</li>
              <li>• Giải quyết sự cố đơn hàng</li>
            </ul>
          </div>
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Họ và tên" required />
              <input type="tel" placeholder="Số điện thoại" required />
            </div>
            <input type="email" placeholder="Email liên hệ" required />
            <textarea rows="4" placeholder="Nội dung yêu cầu..." required />
            <button type="submit">Gửi yêu cầu</button>
          </form>
        </section>
      </div>
    </Layout>
  )
}

export default Contact


